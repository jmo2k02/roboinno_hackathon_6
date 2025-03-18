import roboticstoolbox as rtb
import numpy as np 
import matplotlib.pyplot as plt
import spatialmath as sm
import spatialgeometry as sg
from swift import Swift
import qpsolvers as qp
import math
#from src.controller import PI_controller

letter = "T"

def PI_controller(T_ee,T_ee_d,T_ee_d_next,approx_integral,dt, Kp = 5,Ki = 5):

    e = np.empty(6)
    e[:3] = T_ee_d[:3, -1] - T_ee[:3, -1]
    R = T_ee_d[:3, :3] @ T_ee[:3, :3].T
    li = np.array([R[2, 1] - R[1, 2], R[0, 2] - R[2, 0], R[1, 0] - R[0, 1]])

    if sm.base.iszerovec(li):
        # diagonal matrix case
        if np.trace(R) > 0:
            a = np.zeros((3,))
        else:
            a = np.pi / 2 * (np.diag(R) + 1)
    else:
        # non-diagonal matrix case
        ln = sm.base.norm(li)
        a = math.atan2(ln, np.trace(R) - 1) * li / ln

    e[3:] = a


    f = np.empty(6)
    f[:3] = T_ee_d_next[:3, -1] - T_ee_d[:3, -1]
    R = T_ee_d_next[:3, :3] @ T_ee_d[:3, :3].T
    li = np.array([R[2, 1] - R[1, 2], R[0, 2] - R[2, 0], R[1, 0] - R[0, 1]])

    if sm.base.iszerovec(li):
        # diagonal matrix case
        if np.trace(R) > 0:
            a = np.zeros((3,))
        else:
            a = np.pi / 2 * (np.diag(R) + 1)
    else:
        # non-diagonal matrix case
        ln = sm.base.norm(li)
        a = math.atan2(ln, np.trace(R) - 1) * li / ln

    f[3:] = a

    approx_integral += e * dt

    ev = f/dt + Kp*e + Ki*approx_integral*dt

    return ev, approx_integral

# Use swift for visualistion 
backend = Swift()
backend.launch(realtime=True, browser="google-chrome")
dt = 0.025
t = 0

dofs_robot = 6

puma =  rtb.models.DH.Puma560()
panda = rtb.models.Panda()
panda = rtb.models.UR10()

panda.q = panda.qr
ready_position = np.array([0, -np.pi/2, np.pi/2, -np.pi/2, -np.pi/2, np.pi/2])
panda.q = ready_position

T_ee_axes = sg.Axes(0.1)
backend.add(T_ee_axes)

backend.add(panda)


def displayTrj(backend,traj,num_ax):

    axes = [sg.Axes(0.005) for _ in range(num_ax)]

    len_traj = len(traj)
    step_size = int(len_traj/num_ax)

    for i,ax in enumerate(axes):
        backend.add(ax)
        ax.T = traj[step_size * (i)]
        
    return traj

def displayTrj_all(backend,traj,num_ax):

    axes = [sg.Axes(0.005) for _ in range(len(traj))]

    for i,ax in enumerate(axes):
        backend.add(ax)
        ax.T = traj[i]
    
    return traj

font = rtb.rtb_load_jsonfile("data/hershey.json")

B = font[letter]

lift = 0.1

scale = 0.25

via_B = np.empty((0,3))

for stroke in B["strokes"]:
    xyz_B = np.array(stroke) * scale # convert stroke to nx2 array 
    xyz_B = np.pad(xyz_B, ((0, 0), (0, 1))) # add third column, z=0
    via_B = np.vstack((via_B, xyz_B)) # append rows to via_B points
    via_B = np.vstack((via_B, np.hstack([xyz_B[-1,:2], lift]))) # lift

xyz_traj_B = rtb.mstraj(via_B, qdmax=[0.5, 0.5, 0.5], q0=[0, 0, lift], dt=0.02, tacc=0.2).q

T_pen_B = sm.SE3.Trans(0.9, 0.3, 0.45) * sm.SE3.Rz(np.pi) * sm.SE3.Ry(np.pi/2) * sm.SE3.Rz(np.pi/2)  * sm.SE3.Trans(xyz_traj_B) * sm.SE3.OA( [-np.pi/2, 1, 0], [0, 0, -1]) 

T_pen_B_array = np.array(T_pen_B)

displayTrj_all(backend,traj = T_pen_B,num_ax = 100)
backend.step(0)

# Specify the gain for the p_servo method
kt = 2.0
kr = 2.0
gain_servo = np.array([kt, kt, kt, kr, kr, kr])

# Quadratic component of the objective fuction for qp
λv = 1
Q = λv * np.eye(dofs_robot)

# Linear compenent of objective function for qp
c = np.zeros(dofs_robot)

# This loop drives the robot to the start of the welding task
arrived = False
while not arrived:

    # Printer
    J = panda.jacob0(panda.q)
    T_ee = panda.fkine(panda.q)
    T_ee_axes.T =  T_ee.A

    # Calculates required end effector speed
    ev, arrived = rtb.p_servo(T_ee.A, T_pen_B[0], gain=gain_servo, threshold=0.01, method='angle-axis') 

    # The equality constraints
    Aeq = J
    beq = ev.reshape((6,))

    # The inequality constraints
    Ain = None
    bin = None

    # solve for the joint velocities via_B QP solver
    # availible solvers: ['clarabel', 'cvxopt', 'daqp', 'ecos', 'highs', 'osqp', 'piqp', 'proxqp', 'qpalm', 'quadprog', 'scs', 'qpax']
    qd = np.zeros((dofs_robot))
    qd = qp.solve_qp(Q, c, Ain, bin, Aeq, beq, lb=None, ub=None, solver='quadprog') 
    panda.qd = qd

    # simulation parameter 
    t += dt

    # step visualisation
    backend.step(dt)


approx_integral = np.zeros(6)
idx = 0
int_pos = 0
damper_sum = 0

while True:

    T_ee_d = T_pen_B[idx]
    T_ee_d_next = T_pen_B[idx+1]

    J = panda.jacob0(panda.q)
    #J_trans = J[:3,:]

    T_ee = panda.fkine(panda.q)

    # Printer
    ev, approx_integral = PI_controller(T_ee.A,T_ee_d.A,T_ee_d_next.A,approx_integral,dt = dt, Kp = 10,Ki = 3)
    # ev = ev[:3]

    # Calculates required end effector speed
    Aeq = J
    beq = ev.reshape((6,))

    # solve for the joint velocities
    # availible solvers: ['clarabel', 'cvxopt', 'daqp', 'ecos', 'highs', 'osqp', 'piqp', 'proxqp', 'qpalm', 'quadprog', 'scs', 'qpax']
    # qd = np.zeros((8))
    qd = qp.solve_qp(Q, c, Ain, bin, Aeq, beq, lb=None, ub=None, solver='quadprog') 
    panda.qd = qd

    # simulation parameter 
    t += dt

    if idx == int(len(xyz_traj_B)-2):
        break
    else:
        idx += 1

    # step visualisation
    backend.step(dt)