import numpy as np
import spatialmath as sm
import math


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



