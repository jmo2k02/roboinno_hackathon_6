import os
import urllib.request
import math
import svgpathtools as spt
import numpy as np
import matplotlib.pyplot as plt
from robodk import robolink, robomath, robodialogs
robolink.import_install('svgpathtools')

def getPathFromSVG(displayPathPLT = False):

    # The user of this program is responsible for calibrating the robot to the drawing surface defined by "RW_WhtBrd" in RoboDK
    # Follow these instructions to calibrate the robot to the drawing surface: TODO

    path_numpy = []
    #-------------------------------------------
    # Settings with User Input
    # IMAGE_FILE = "" # leave empty to be prompted, use this option for testing in the simulator, this option will not work with the real robot

    ## Specify the SVG file explicitly to run with the real robot. 
    # Bayern Logo old (1923-1954)
    #IMAGE_FILE = "https://upload.wikimedia.org/wikipedia/de/5/56/FC_Bayern_M%C3%BCnchen_Logo_%281923-1954%29.svg"
    # Bayern Logo with starts
    # IMAGE_FILE = "https://upload.wikimedia.org/wikipedia/de/c/c5/FC_Bayern_Muenchen_Wappen_5_Sterne.svg"
    IMAGE_FILE = "svg/flower.svg"

    BOARD_WIDTH, BOARD_HEIGHT = 400, 400  # Size of the drawing area
    APPROACH = 25.0  # mm, approach distance for each path, 25mm is a good start
    MM_X_PIXEL = 5.0 # was 5.0 the smaller this value, the more detail the drawing will have but program takes longer.

    # simulator settings
    BOARD_BACKGROUND_COLOR = [0, 0, 0, 1]  # Background of the drawing board (R, G, B, A)
    DEFAULT_PATH_COLOR = '#FFFFFF'  # Default drawing colors for path with no styling (should contrast with the background!)
    USE_STYLE_COLOR = True
    PREFER_STROKE_OVER_FILL_COLOR = True  # Prefer using a path stroke color over a path fill color
    TCP_KEEP_TANGENCY = False  # Set to True to keep the tangency along the path

    #-------------------------------------------
    # Flig SVG file paths
    def flip_svg_y(paths):
        flipped_paths = []
        for path in paths:
            # Scale X by -1 to flip horizontally
            flipped_path = path.scaled(-1, 1)  
            flipped_paths.append(flipped_path)
        return flipped_paths

    # Load the SVG file
    if IMAGE_FILE.startswith('http') and IMAGE_FILE.endswith('.svg'):
        r = urllib.request.urlretrieve(IMAGE_FILE, "drawing.svg")
        IMAGE_FILE = "drawing.svg"
    elif not IMAGE_FILE or not os.path.exists(os.path.abspath(IMAGE_FILE)):
        IMAGE_FILE = robodialogs.getOpenFileName(strtitle='Open SVG File', defaultextension='.svg', filetypes=[('SVG files', '.svg')])
    if not IMAGE_FILE or not os.path.exists(os.path.abspath(IMAGE_FILE)):
        print("Error: Failed to select SVG File")
        quit()

    paths, path_attribs, svg_attribs = spt.svg2paths2(IMAGE_FILE)
    paths = flip_svg_y(paths)

    # Scale the SVG to fit in the desired drawing area
    # 1. Find the bounding area
    xmin, xmax, ymin, ymax = 9e9, 0, 9e9, 0
    for path in paths:
        _xmin, _xmax, _ymin, _ymax = path.bbox()
        xmin = min(_xmin, xmin)
        xmax = max(_xmax, xmax)
        ymin = min(_ymin, ymin)
        ymax = max(_ymax, ymax)
    bbox_height, bbox_width = ymax - ymin, xmax - xmin

    # 2. Scale the SVG file and recenter it to the drawing board
    SCALE = min(BOARD_HEIGHT / (bbox_height*2) , BOARD_WIDTH / (bbox_width*2))
    svg_height, svg_width = bbox_height * SCALE, bbox_width * SCALE
    svg_height_min, svg_width_min = ymin * SCALE, xmin * SCALE
    #TRANSLATE = complex((BOARD_WIDTH - svg_width) / 2 - svg_width_min, (BOARD_HEIGHT - svg_height) / 2 - svg_height_min)
    TRANSLATE = complex(-svg_width / 2 - svg_width_min, -svg_height / 2 - svg_height_min)


    for path_count, (path, attrib) in enumerate(zip(paths, path_attribs)):
        styles = {}

        if 'style' not in attrib:
            if 'fill' in attrib:
                styles['fill'] = attrib['fill']
            if 'stroke' in attrib:
                styles['stroke'] = attrib['stroke']
        else:
            for style in attrib['style'].split(';'):
                style_pair = style.split(':')
                if len(style_pair) != 2:
                    continue
                styles[style_pair[0].strip()] = style_pair[1].strip()

        if 'fill' in styles and not styles['fill'].startswith('#'):
            styles.pop('fill')
        if 'stroke' in styles and not styles['stroke'].startswith('#'):
            styles.pop('stroke')

        hex_color = DEFAULT_PATH_COLOR
        if USE_STYLE_COLOR:
            if PREFER_STROKE_OVER_FILL_COLOR:
                if 'stroke' in styles:
                    hex_color = styles['stroke']
                elif 'fill' in styles:
                    hex_color = styles['fill']
            else:
                if 'fill' in styles:
                    hex_color = styles['fill']
                elif 'stroke' in styles:
                    hex_color = styles['stroke']

        draw_color = spt.misctools.hex2rgb(hex_color)
        draw_color = [round(x / 255, 4) for x in draw_color]

        approach_done = False
        prev_point = None
        for segment in path.scaled(SCALE).translated(TRANSLATE):
            segment_len = segment.length()
            steps = int(segment_len / MM_X_PIXEL)
            if steps < 1:
                continue

            for i in range(steps + 1):
                t = 1.0
                segment.point(t)
                if i < steps:
                    # We need this check to prevent numerical accuracy going over 1, as t must be bound to [0,1]
                    i_len = segment_len * i / steps
                    t = segment.ilength(i_len)

                point = segment.point(t)
                py, px = point.real, point.imag

                pa = 0
                if prev_point:
                    v = point - prev_point
                    norm_v = robomath.sqrt(v.real * v.real + v.imag * v.imag)
                    v = v / norm_v if norm_v > 1e-6 else complex(1, 0)
                    pa = robomath.atan2(v.real, v.imag)

                if not approach_done and i == 0:
                    # Safe approach to the first target
                    target0 = robomath.transl(px, py, 0) * robomath.rotz(pa)
                    target0_app = target0 * robomath.transl(0, 0, -APPROACH)
                    path_numpy.append(target0_app.toNumpy())
                    approach_done = True
                    continue

                point_pose = robomath.transl(px, py, 0) * robomath.rotz(pa)
                robot_pose = robomath.transl(px, py, 0) if not TCP_KEEP_TANGENCY else point_pose

                path_numpy.append(robot_pose.toNumpy())

                prev_point = point

        # Safe retract from the last target
        if approach_done:
            target_app = robot_pose * robomath.transl(0, 0, -APPROACH)
            path_numpy.append(target_app.toNumpy())

            

    output_file = "robot_path_test.csv"
    with open(output_file, "w") as f:
        for matrix in path_numpy:
            np.savetxt(f, matrix, fmt="%.6f")
            f.write("\n")

    # Display path traced by robot
    if displayPathPLT == True:
        path = np.array(path_numpy)
        fig = plt.figure()
        ax = fig.add_subplot(111, projection="3d")
        plt.plot(path[:,0,3], path[:,1,3], path[:,2,3])
        plt.show()
