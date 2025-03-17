import requests
from secrets import token as token

# Template for the payload to send in the API request
PAYLOAD_SVGSTUDIO_TEMPLATE = {
    "token": token,
    "prompt": None,
    "n_iterations": 15,
    "n_samples": 1,
    "detail_level": "standard",
    "style": "automatic",
    "seed": 42,
    "width": 768,
    "height": 768,
}

# URL for the SVG generation API
URL_SVGSTUDIO = "https://svgstud.io/generate/"

# Maximum number of retries for API requests
NUM_RETRY = 0
# Path to save the downloaded SVG
SVG_PATH = "cache/current.svg"

def get_payload_template():
    """
    Returns a copy of the payload template used to make the API request.

    :return: A dictionary containing the base payload template.
    """
    return PAYLOAD_SVGSTUDIO_TEMPLATE.copy()

def call_api(url, params=None, headers=None, method="GET", data=None):
    """
    Calls an API and returns the response.

    :param url: The API endpoint URL.
    :param params: Dictionary of query parameters (optional).
    :param headers: Dictionary of request headers (optional).
    :param method: HTTP method ("GET", "POST", "PUT", "DELETE").
    :param data: Dictionary of data for POST/PUT requests (optional).
    :return: JSON response or raw text if JSON parsing fails.
    """
    try:
        # Send the HTTP request with the provided method and parameters
        response = requests.request(method, url, params=params, headers=headers, json=data)
        response.raise_for_status()  # Raise an error for bad HTTP responses (4xx, 5xx)
        return response.json()  # Return the JSON response
    except requests.exceptions.RequestException as e:
        # Print error details and return None in case of failure
        print(e)
        return None

def get_svg_url_from_prompt(prompt):
    """
    Requests an SVG URL from the API based on a prompt.

    :param prompt: The prompt to generate an SVG for.
    :return: The API response containing the SVG URL or None if the request fails.
    """
    num_retry = -1  # Retry counter, start from -1 to make sure the first attempt happens
    response = None  # Initialize response as None
    while not response and num_retry < NUM_RETRY:  # Retry if no response and retry count is not exceeded
        payload = get_payload_template()  # Get a copy of the payload template
        payload["prompt"] = prompt  # Set the prompt in the payload
        response = call_api(URL_SVGSTUDIO, params=payload)  # Call the API with the current payload
        num_retry += 1  # Increment retry count
    return response

def download_svg_from_url(url):
    """
    Downloads the SVG file from a given URL and saves it to a local path.

    :param url: The URL to download the SVG from.
    :return: None
    """
    # Send a GET request to fetch the SVG file content
    response = requests.get(url)
    # Open a local file in write-binary mode to save the SVG content
    with open(SVG_PATH, "wb") as f:
        f.write(response.content)  # Write the raw content to the file

def get_svg_from_prompt(prompt):
    """
    Retrieves an SVG based on a prompt by calling the API and downloading the SVG.

    :param prompt: The prompt to generate the SVG for.
    :return: True if the SVG was successfully downloaded, False otherwise.
    """
    # Get the URL for the SVG based on the provided prompt
    response = get_svg_url_from_prompt(prompt)
    if response:
        # If a valid response is returned, download the SVG using the URL
        download_svg_from_url(response[0])
        return True  # Return True if download was successful
    else:
        print("Failed to get SVG from prompt.")  # Print an error if the SVG generation fails
        return False  # Return False if the SVG could not be obtained

# Main function to execute the code
if __name__ == "__main__":
    # Example prompt to generate an SVG
    prompt = "A smiling piece of shit"
    # Attempt to get the SVG from the prompt and save it locally
    get_svg_from_prompt(prompt)
    # Uncomment the next line to print the response for debugging
    # print(response)

