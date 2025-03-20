import cv2
import numpy as np
from skimage import feature
import svgwrite
from starlette.responses import FileResponse


def generate_from_image(image_path):

    # Read the original image
    img = cv2.imread(image_path)

    if img is None:
        raise FileNotFoundError("Image not found. Check the file path.")

    # Define the fixed height
    fixed_height = 800

    # Get original dimensions
    (h, w) = img.shape[:2]
    aspect_ratio = w / h
    new_width = int(fixed_height * aspect_ratio)
    resized_image = cv2.resize(img, (new_width, fixed_height), interpolation=cv2.INTER_AREA)

    # Convert to grayscale
    img_gray = cv2.cvtColor(resized_image, cv2.COLOR_BGR2GRAY)

    # Apply Canny edge detection using skimage
    edges2 = feature.canny(img_gray, sigma=3)

    # Convert the edge image into contours (binary format)
    contours, _ = cv2.findContours((edges2 * 255).astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Create an SVG file using svgwrite
    dwg = svgwrite.Drawing(image_path + '.svg', profile='tiny')

    # Draw contours in the SVG file with thicker stroke
    for contour in contours:
        path_data = 'M ' + ' '.join([f'{point[0][0]},{point[0][1]}' for point in contour])
        dwg.add(dwg.path(d=path_data, fill='none', stroke='black', stroke_width=5))  # Thicker contours

    # Save the SVG file
    dwg.save()

    print("SVG saved as" + image_path + '.svg')

