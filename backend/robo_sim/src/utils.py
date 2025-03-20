import spatialgeometry as sg
import numpy as np
from scipy.interpolate import interp1d

def displayTrj(backend,traj,diff = 1):

    axes = [sg.Axes(0.005) for _ in range(int(len(traj)/diff))]

    idx = 0
    for i,ax in enumerate(axes):
        
        backend.add(ax)
        ax.T = traj[idx]
        idx += diff

    return traj

def load_se3_path(file_path):
    with open(file_path, "r") as f:
        raw_data = f.read().strip().split("\n\n")  # Split matrices by blank lines

    path_matrices = [np.loadtxt(matrix.splitlines()) for matrix in raw_data]  # Convert each block to array
    return np.array(path_matrices)


def interpolate_waypoints(waypoints, delta_d):
    """
    Efficiently generate interpolated points with specified distance delta_d between consecutive points.

    Args:
        waypoints (np.ndarray): Array of shape (N, 2) representing N waypoints (x, y).
        delta_d (float): Desired spacing between consecutive points.

    Returns:
        np.ndarray: Interpolated points with distance delta_d between each.
    """
    # Compute cumulative distances along the waypoints
    distances = np.sqrt(np.sum(np.diff(waypoints, axis=0)**2, axis=1))
    cumulative_distances = np.insert(np.cumsum(distances), 0, 0)

    # Generate new distances with delta_d spacing
    new_distances = np.arange(0, cumulative_distances[-1], delta_d)

    # Interpolate x and y coordinates
    interp_x = interp1d(cumulative_distances, waypoints[:, 0], kind='linear')
    interp_y = interp1d(cumulative_distances, waypoints[:, 1], kind='linear')
    interp_z = interp1d(cumulative_distances, waypoints[:, 2], kind='linear')


    # Compute new points
    new_x = interp_x(new_distances)
    new_y = interp_y(new_distances)
    new_z = interp_z(new_distances)

    return np.column_stack((new_x, new_y, new_z))

def cal_T(z = np.array([0,0,1]), p= np.zeros(3), offset=np.zeros(3)):
    """
    Determines a Transformation Matrix given a base vector z and an origin p,
    ensuring that T[:3, 3] = p + offset and T[:3, 2] = z.
    
    Parameters
    ----------
    z : array_like
        Base vector for the z-axis.
    p : array_like
        Origin.
    offset : array_like, optional
        Additional offset added to the origin (default is [0, 0, 0]).
        
    Returns
    -------
    T : ndarray
        The 4x4 homogeneous transformation matrix.
    """
    # Normalize the z-axis
    z_norm = z / np.linalg.norm(z)

    # Choose an arbitrary vector that is not parallel to z_norm.
    # Here we check if z_norm is close to [1, 0, 0]. If so, we use [0, 1, 0] as our base vector.
    a = np.array([1, 0, 0])
    if np.allclose(np.abs(np.dot(z_norm, a)), 1.0, atol=1e-6):
        a = np.array([0, 1, 0])

    # Orthogonalize a relative to z_norm to obtain x-axis candidate
    x_prime = a - np.dot(a, z_norm) * z_norm
    x = x_prime / np.linalg.norm(x_prime)

    # Compute the y-axis using the cross product to ensure a right-handed system
    y = np.cross(z_norm, x)

    # Assemble the rotation matrix
    R = np.column_stack((x, y, z_norm))

    # Build the homogeneous transformation matrix
    T = np.eye(4)
    T[:3, :3] = R
    T[:3, 3] = p + offset

    return T

def decay(theta,bc_cone):
    if theta > bc_cone:
        return 0
    else:
        return np.exp(-10*(theta - bc_cone +0.62))
