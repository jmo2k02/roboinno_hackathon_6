import requests
from .secrets import token_svgio as token_svgio

# Template for the payload to send in the API request
PAYLOAD_SVGSTUDIO_TEMPLATE = {
    "token": token_svgio,
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
        payload["style"] = 'line_art',
        payload["detail_level"] = "minimal",
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
        return response 
    else:
        print("Failed to get SVG from prompt.")  # Print an error if the SVG generation fails
        return response  
    
# Main function to execute the code
if __name__ == "__main__":
    # Example prompt to generate an SVG
    prompt = "robotics in Germany which should take about 5 minutes to read. Germany has long recognised as one of the global leaders in the field of robotics blending cutting edge technology with precision engineering the countries robust industrial sector with its strong emphasis on automation has made it a hub for robotics development and deployment from manufacturing to healthcare robotics has become an integral part of Germany's economic economic infrastructure technology technological landscape one of the primary drivers of robotics Innovations in Germany is its powerful automotive industry German car manufacturers such as Volkswagen B&B and midsea spence have been using robots in their production lines four decades. what does one of the largest users of industrial robots worldwide. these robots are used for tall tasks like welding painting assembling parts and even quality control. please use of robotics has significantly improved efficiency. precision and saved in these processes. what's the reducing labour costs in human error. robotics research in Germany is not limited to manufacturing however the country is also a key player in the deployment of service robots which are designed to interact with humans and performed tasks outside of traditional industrial environments. like Munich and Berlin. search institutes and universities are focusing on developing robots for various sectors such as Healthcare logistics and even entertainment for example robots are being designed to assist elderly people with daily activities like medication reminders and mobility assistance or even providing companionship to combat lonely combat loneliness. in Healthcare Germany is particularly innovative with the integration of robots into. rehabilitation search Rachel robots such as the Da Vinci surgical system are being increasingly utilised the German hospitals these robots allow surgeons to perform minimally invasive procedures with greater precision and control reducing recovery time for patients. additionally I think the. ."    # Attempt to get the SVG from the prompt and save it locally
    print(get_svg_from_prompt(prompt))
    # Uncomment the next line to print the response for debugging
    # print(response)

