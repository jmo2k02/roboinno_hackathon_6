import numpy as np
import roboticstoolbox as rtb
import numpy as np 
from typing import Any
import matplotlib.pyplot as plt
import spatialmath as sm
import spatialgeometry as sg
from swift import Swift
import qpsolvers as qp
import matplotlib.pyplot as plt
from pathlib import Path
from roboticstoolbox.robot.ERobot import ERobot

from utils import displayTrj, load_se3_path, interpolate_waypoints, cal_T,angle_between,decay2, manipulability, choose_robot, perform_task_based_on_robot
from controller import PI_controller


def sim(model: str,teachMe: bool):

    bc_cone = 15

    displayPathPLT = False
    displayPathSwift = True

    debugging = True

    draw = "svg" #implemented -> [svg,T]

    # Use swift for visualistion 
    backend = Swift()

    backend.launch(realtime=True, browser="google-chrome")
        # camera settings
    camara_point = np.array([-1.5,0.9,1.5])
    view_point = np.array([0,0,0])
    backend.set_camera_pose(camara_point,view_point)
    t = 0
    dt = 0.005

    # add robot 
    panda = rtb.models.Panda()
    panda = choose_robot(model)
    perform_task_based_on_robot(panda)
    #panda.q = panda.qr
    backend.add(panda)
    backend.step(0)
    # add end-effector pose 
    T_ee_axes = sg.Arrow(0.1)
    # font
    if draw == "svg":

        # Load file
        file_path = Path(__file__).parent / "data" / "robot_path_.csv"  
        se3_path = load_se3_path(file_path) # in mm

        path_xyz = se3_path[:,:3,3]/1000 # [mm] -> [m] 

        test_path = interpolate_waypoints(path_xyz,delta_d=0.0005)

        # generate path currently not working
        xyz_traj_mstarj = rtb.mstraj(path_xyz, qdmax=[0.5, 0.5, 0.5], q0=path_xyz[0], dt=0.05, tacc=0.2).q

        xyz_mstrarj_rotated = sm.SE3.Rz(np.pi)* sm.SE3.Ry(-np.pi/2) *sm.SE3(xyz_traj_mstarj)* sm.SE3.Trans(0.6,0,0.7)

    if draw == "T":
        font = rtb.rtb_load_jsonfile("data/hershey.json")
        lift = 0.1
        scale = 0.25
        B = font["T"]
        via_B = np.empty((0,3))

        for stroke in B["strokes"]:
            xyz_B = np.array(stroke) * scale # convert stroke to nx2 array 
            xyz_B = np.pad(xyz_B, ((0, 0), (0, 1))) # add third column, z=0
            via_B = np.vstack((via_B, xyz_B)) # append rows to via_B points
            via_B = np.vstack((via_B, np.hstack([xyz_B[-1,:2], lift]))) # lift

        xyz_traj_B = rtb.mstraj(via_B, qdmax=[0.5, 0.5, 0.5], q0=[0, 0, lift], dt=0.02, tacc=0.2).q
        xyz_mstrarj_rotated = sm.SE3.Trans(0.6, 0.3, 0.45) * sm.SE3.Rz(np.pi) * sm.SE3.Ry(np.pi/2) * sm.SE3.Rz(np.pi/2)  * sm.SE3.Trans(xyz_traj_B) * sm.SE3.OA( [-np.pi/2, 1, 0], [0, 0, -1]) 


    # Display path traced by robot
    if displayPathPLT == True:
        fig = plt.figure()
        ax = fig.add_subplot(111, projection="3d")
        if draw == "T":
            plt.plot(xyz_traj_B[:,0], xyz_traj_B[:,1], xyz_traj_B[:,2])
        else:
            plt.plot(se3_path[:,0,3], se3_path[:,1,3], se3_path[:,2,3])
        plt.show()
        
    if displayPathSwift == True:
        #displayTrj(backend,xyz_mstrarj_rotated,diff = 100)
        if debugging == True and draw =="T":
            via_B_rotated = sm.SE3.Trans(1.0, 0.3, 0.45) * sm.SE3.Rz(np.pi) * sm.SE3.Ry(np.pi/2) * sm.SE3.Rz(np.pi/2)  * sm.SE3.Trans(via_B) * sm.SE3.OA( [-np.pi/2, 1, 0], [0, 0, -1]) 
            displayTrj(backend,via_B_rotated,diff = 1)
        if debugging == True and draw =="svg":
            se3_path_rotated = sm.SE3.Rz(np.pi) * sm.SE3.Ry(-np.pi/2) * sm.SE3(test_path) * sm.SE3.Trans(0.8,0.0,0.6)
            xyz_mstrarj_rotated = se3_path_rotated
            #displayTrj(backend,se3_path_rotated,diff = 25)

    # Visualize whiteboard
    whiteboard = sg.Cuboid(scale=[0.6,0.01,0.8],color = "white")
    blackboard = sg.Cuboid(scale=[0.62,0.01,0.82],color = "black")
    whiteboard.T = sm.SE3.Trans(0.62,0,0.7) * sm.SE3.Rz(np.pi/2) 
    blackboard.T = sm.SE3.Trans(0.621,0,0.7) * sm.SE3.Rz(np.pi/2) 
    backend.add(whiteboard)
    backend.add(blackboard)

    # Visualize Optimization
    radius_orientation_set = 0.30 * np.tan(np.radians(bc_cone))
    set_tool_orientation = sg.Arrow(0.3,0.0001,1,radius_orientation_set/0.3, color = [0,0.7569,0.7137,0.4])
    tool_orientation = sg.Arrow(0.4,0.0055,0.01,0.01, color = [0,0.7569,0.7137])
    T_ee = panda.fkine(panda.q)

    tool_orientation.T = cal_T(z = -T_ee.R[:,2],p = T_ee.A[:3,3] - np.array([0,0,0]))
    #set_tool_orientation.T = cal_T(z = [1,0,0], p = T_ee.A[:3,3], offset = np.array([-0.3,0,0.0])) 

    backend.add(tool_orientation)
    backend.step(0)
    # Specify the gain for the p_servo method
    kt = 2.0
    kr = 2.0
    gain_servo = np.array([kt, kt, kt, kr, kr, kr])

    # Quadratic component of the objective fuction for qp
    λv = 1
    Q = λv * np.eye(panda.n)

    # Linear compenent of objective function for qp
    c = np.zeros(panda.n)

    resolution = 20

    spheres = [sg.Sphere(0.003, color = [0,0.7569,0.7137]) for _ in range(int(len(xyz_mstrarj_rotated)/resolution))]
    for _,sphere in enumerate(spheres):
        backend.add(sphere)

    # This loop drives the robot to the start of the welding task
    arrived = False
    while not arrived:

        # Printer
        J = panda.jacob0(panda.q)
        #J_without = np.delete(J,3,axis=0)
        T_ee = panda.fkine(panda.q)
        T_ee_axes.T = T_ee.A

        # Calculates required end effector speed
        ev, arrived = rtb.p_servo(T_ee.A, xyz_mstrarj_rotated[0], gain=gain_servo, threshold=0.005, method='angle-axis') 

        # The equality constraints
        Aeq = J
        beq = ev.reshape((6,))

        # The inequality constraints
        Ain = None
        bin = None

        # solve for the joint velocities via_B QP solver
        # availible solvers: ['clarabel', 'cvxopt', 'daqp', 'ecos', 'highs', 'osqp', 'piqp', 'proxqp', 'qpalm', 'quadprog', 'scs', 'qpax']
        #qd = np.zeros((dofs_robot))
        qd = qp.solve_qp(Q, c, Ain, bin, Aeq, beq, lb=None, ub=None, solver='quadprog') 
        panda.qd = qd

        # simulation parameter 
        t += dt

        # step Visualisation
        tool_orientation.T = cal_T(z = -T_ee.R[:,2],p = T_ee.A[:3,3] - np.array([0,0,0]))

        # step visualisation
        backend.step(dt)

    if teachMe == True:
        backend.add(set_tool_orientation)



    projected_roll_axis_vec = sg.Arrow(radius_orientation_set,0.0025,0.1,0.4, color = "blue")
    constraint_left_line = sg.Arrow(0.18,0.0025,0.1,0.0, color = "red")
    constraint_right_line = sg.Arrow(0.18,0.0025,0.1,0.0, color = "red")

    # offsets
    offset_orientation_set = np.array([-0.3,0,0])
    offset_orientation_set_up = np.array([-0.31,0,0])
    radius_orientation_set = offset_orientation_set[0] * np.tan(bc_cone)

    projected_roll_axis = -T_ee.R[:,2] * np.array([0,1,1])
    projected_roll_axis_normalized = projected_roll_axis/np.linalg.norm(projected_roll_axis)

    constraint_left = sm.SO2(80, unit='deg').A @ projected_roll_axis_normalized[:2] 
    constraint_right = sm.SO2(-80, unit='deg').A @ projected_roll_axis_normalized[:2]

    offset_constraint = offset_orientation_set_up + radius_orientation_set * projected_roll_axis_normalized

    projected_roll_axis_vec.T = cal_T(z = -projected_roll_axis, p = T_ee.A[:3,3], offset = offset_orientation_set_up)
    constraint_left_line.T = cal_T(z = -np.hstack([constraint_left, 0]), p = T_ee.A[:3,3], offset = offset_constraint)
    constraint_right_line.T = cal_T(z = -np.hstack([constraint_right, 0]), p = T_ee.A[:3,3], offset = offset_constraint)


    cs_constraint = sg.Axes(0.1)
    cs_constraint.T = cal_T(p = T_ee.A[:3,3], offset = offset_orientation_set_up)
    if teachMe == True:
        backend.add(cs_constraint)
        backend.add(projected_roll_axis_vec)


    approx_integral = np.zeros(6)
    idx = 0
    int_pos = 0
    damper_sum = 0
    i_sphere = 0

    while True:

        T_ee_d = xyz_mstrarj_rotated[idx]
        T_ee_d_next = xyz_mstrarj_rotated[idx+1]

        J = panda.jacob0(panda.q)
        J_trans = J[:3,:]

        T_ee = panda.fkine(panda.q)

        if idx % resolution == 0:
            if T_ee.A[0,3] > 0.599:
                spheres[i_sphere].T = T_ee.A
                i_sphere += 1

        # Printer
        ev, approx_integral = PI_controller(T_ee.A,T_ee_d.A,T_ee_d_next.A,approx_integral,dt = dt, Kp = 5,Ki = 3)
        ev = ev[:3]

        # the manipulability Jacobian
        λm = 1
        Jm = panda.jacobm(panda.q, axes='all')
        c = λm * -Jm.reshape((panda.n,))

        # Calculates required end effector speed
        Aeq = J_trans
        beq = ev.reshape((3,))

        # inequality constrains 
        plane_normal = np.array([1, 0, 0])
        roll_axis_ee = T_ee.R[:,2]
        theta = angle_between(plane_normal,roll_axis_ee)
        print(np.degrees(theta))

        if True: 

            projected_roll_axis = -T_ee.R[:,2] * np.array([0,1,1])
            
            projected_roll_axis_normalized = projected_roll_axis/np.linalg.norm(projected_roll_axis)

            j_rot_single =  (J[4,:] * projected_roll_axis_normalized[2] - J[5,:] * projected_roll_axis_normalized[1]) 
            
            constraint_left = sm.SO2(80, unit='deg').A @ projected_roll_axis_normalized[1:] 
            constraint_right = sm.SO2(-80, unit='deg').A @ projected_roll_axis_normalized[1:]

            j_rot1 =  (J[4,:] * constraint_right[1] - J[5,:] * constraint_right[0]) 
            j_rot2 =  (J[4,:] *constraint_left[1] - J[5,:] * constraint_left[0]) 

            Ain = np.vstack([j_rot1, j_rot2])
            bin = np.array([decay2(theta, bc_cone), decay2(theta, bc_cone)])
            #bin = np.array([0, 0])

        
        projected_roll_axis_vec.T = cal_T(z = projected_roll_axis, p = T_ee.A[:3,3], offset = offset_orientation_set_up)
        cs_constraint.T = cal_T(p = T_ee.A[:3,3], offset = offset_orientation_set_up)


        #solve for the joint velocities
        #availible solvers: ['clarabel', 'cvxopt', 'daqp', 'ecos', 'highs', 'osqp', 'piqp', 'proxqp', 'qpalm', 'quadprog', 'scs', 'qpax']
        qd = qp.solve_qp(Q, c, Ain, bin, Aeq, beq, lb=None, ub=None, solver='quadprog') 
        panda.qd = qd

        # step Visualisation
        tool_orientation.T = cal_T(z = -T_ee.R[:,2],p = T_ee.A[:3,3] - np.array([0,0,0]))
        set_tool_orientation.T = cal_T(z = [1,0,0], p = T_ee.A[:3,3], offset = np.array([-0.3,0,0.0])) 

        # simulation parameter 
        t += dt

        if idx == int(len(xyz_mstrarj_rotated)-2):
            break
        else:
            idx += 1

        # step visualisation
        backend.step(dt)



if __name__ == "__main__":
    sim("frankie",techMe = False)