import argparse
import os
import urllib.request
import math
import svgpathtools as spt
from robodk import robolink, robomath, robodialogs
robolink.import_install('svgpathtools')

# The user of this program is responsible for calibrating the robot to the drawing surface defined by "RW_WhtBrd" in RoboDK
# Follow these instructions to calibrate the robot to the drawing surface: TODO


# -------------------------------------------
# Settings with User Input
# IMAGE_FILE = "" # leave empty to be prompted, use this option for testing in the simulator, this option will not work with the real robot

## Specify the SVG file explicitly to run with the real robot.
# Bayern Logo old (1923-1954)
# IMAGE_FILE = "https://upload.wikimedia.org/wikipedia/de/5/56/FC_Bayern_M%C3%BCnchen_Logo_%281923-1954%29.svg"
# Bayern Logo with starts
# IMAGE_FILE = "https://upload.wikimedia.org/wikipedia/de/c/c5/FC_Bayern_Muenchen_Wappen_5_Sterne.svg"

BOARD_WIDTH, BOARD_HEIGHT = 400, 400  # Size of the drawing area
APPROACH = 25.0  # mm, approach distance for each path, 25mm is a good start
MM_X_PIXEL = 5.0  # was 5.0 the smaller this value, the more detail the drawing will have but program takes longer.

# simulator settings
BOARD_BACKGROUND_COLOR = [0, 0, 0, 1]  # Background of the drawing board (R, G, B, A)
DEFAULT_PATH_COLOR = '#FFFFFF'  # Default drawing colors for path with no styling (should contrast with the background!)
USE_STYLE_COLOR = True
PREFER_STROKE_OVER_FILL_COLOR = True  # Prefer using a path stroke color over a path fill color
TCP_KEEP_TANGENCY = False  # Set to True to keep the tangency along the path


def main():
  draw_image("path")


# Flig SVG file paths
def flip_svg_y(paths):
    flipped_paths = []
    for path in paths:
        # Scale X by -1 to flip horizontally
        flipped_path = path.scaled(-1, 1)
        flipped_paths.append(flipped_path)
    return flipped_paths


def draw_image(path_or_url: str):
    # -------------------------------------------

    # Load the SVG file
    if path_or_url.startswith('http') and path_or_url.endswith('.svg'):
        r = urllib.request.urlretrieve(path_or_url, "drawing.svg")
        path_or_url = "drawing.svg"
    elif not path_or_url or not os.path.exists(os.path.abspath(path_or_url)):
        path_or_url = robodialogs.getOpenFileName(strtitle='Open SVG File', defaultextension='.svg',
                                                 filetypes=[('SVG files', '.svg')])
    if not path_or_url or not os.path.exists(os.path.abspath(path_or_url)):
        print("Error: Failed to select SVG File")
        quit()

    paths, path_attribs, svg_attribs = spt.svg2paths2(path_or_url)

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
    SCALE = min(BOARD_HEIGHT / (bbox_height * 2), BOARD_WIDTH / (bbox_width * 2))
    svg_height, svg_width = bbox_height * SCALE, bbox_width * SCALE
    svg_height_min, svg_width_min = ymin * SCALE, xmin * SCALE
    # TRANSLATE = complex((BOARD_WIDTH - svg_width) / 2 - svg_width_min, (BOARD_HEIGHT - svg_height) / 2 - svg_height_min)
    TRANSLATE = complex(-svg_width / 2 - svg_width_min, -svg_height / 2 - svg_height_min)

    # --------------------------------------------
    # Get RoboDK Items
    RDK = robolink.Robolink()
    RDK.setSelection([])

    robot = RDK.ItemUserPick(itemtype_or_list=robolink.ITEM_TYPE_ROBOT)
    tool = robot.getLink(robolink.ITEM_TYPE_TOOL)
    if not robot.Valid() or not tool.Valid():
        print("No valid robot or tool selected. Exiting.")
        quit()

    # frames = RDK.ItemList(robolink.ITEM_TYPE_FRAME)
    # frames.remove(robot.Parent())
    # frame = RDK.ItemUserPick(itemtype_or_list=frames)  # Reference frame for the drawing
    frame = RDK.Item('RW_WhtBrd')
    if not frame.Valid():
        print("No valid frame selected. Exiting.")
        quit()

    # -------------------------------------------
    # Setup Drawing Board
    # RDK.Render(False)
    board_draw = RDK.Item('Drawing Board')  # Drawing board
    if board_draw.Valid() and board_draw.Type() == robolink.ITEM_TYPE_OBJECT:
        board_draw.Delete()
    if not board_draw.Valid():
        # Check for a predefined whiteboard template in the RoboDK station
        template_board = RDK.Item('Whiteboard 250mm', itemtype=robolink.ITEM_TYPE_OBJECT)
        if not template_board.Valid():
            print("Error: No valid whiteboard template found in the station.")
            quit()
        # Copy the template board to the clipboard
        template_board.Copy()
        board_draw = frame.Paste()
        if not board_draw.Valid():
            print("Error: Failed to paste the Drawing Board.")
            quit()
    # Configure the board
    board_draw.setVisible(True, False)
    board_draw.setName('Drawing Board')
    board_draw.Scale([BOARD_HEIGHT / 250, BOARD_WIDTH / 250, 1])  # adjust the board size to the image size (scale)
    board_draw.setColor(BOARD_BACKGROUND_COLOR)
    # Apply transformations
    board_pose = board_draw.Pose()
    board_pose = board_pose * robomath.rotx(math.pi)
    board_pose = board_pose * robomath.transl(-BOARD_HEIGHT / 2, -BOARD_WIDTH / 2, 0)  # Shift by -width/2 and -height/2
    board_draw.setPose(board_pose)

    # -------------------------------------------
    # Reference pixel object for "drawing"
    pixel_ref = RDK.Item('pixel')  # Reference object to paint
    if not pixel_ref.Valid():
        print("No pixel reference found. Exiting.")
        quit()
    # RDK.Render(False)

    # -------------------------------------------
    # Initialize the robot
    robot.setPoseFrame(frame)
    robot.setPoseTool(tool)
    # Move to home position
    start_pos = RDK.Item('start_pos')
    robot.MoveJ(start_pos)

    # -------------------------------------------
    RDK.ShowMessage(f"Drawing {path_or_url}..", False)

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

        if 'id' in attrib:
            RDK.ShowMessage(f"Drawing {attrib['id']} with color {hex_color}", False)
        else:
            RDK.ShowMessage(f"Drawing path {path_count} with color {hex_color}", False)

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
                    robot.MoveJ(target0_app)
                    approach_done = True
                    continue

                point_pose = robomath.transl(px, py, 0) * robomath.rotz(pa)
                robot_pose = robomath.transl(px, py, 0) if not TCP_KEEP_TANGENCY else point_pose

                robot.MoveL(robot_pose)

                # add pixel logic only for the actual drawing (exclude the approach point)
                if approach_done:
                    tool_pose = robot.Pose()  # Get the tool's current pose in the robot's frame
                    tool_pose_relative_to_board = robomath.invH(
                        board_pose) * tool_pose  # Transform to board coordinates
                    pixel_ref.Recolor(draw_color)
                    board_draw.AddGeometry(pixel_ref, tool_pose_relative_to_board)

                prev_point = point

        # Safe retract from the last target
        if approach_done:
            target_app = robot_pose * robomath.transl(0, 0, -APPROACH)
            robot.MoveL(target_app)

    robot.MoveJ(start_pos)
    RDK.ShowMessage(f"Done drawing {path_or_url}!", False)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Draw an SVG file using RoboDK.")
    parser.add_argument("svg_path", type=str, help="Path to the SVG file.")
    args = parser.parse_args()
    draw_image(args.svg_path)
