import requests
from secrets import token as token

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
        response = requests.request(method, url, params=params, headers=headers, json=data)
        response.raise_for_status()  # Raises HTTPError for bad responses (4xx and 5xx)
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}

url = "https://svgstud.io/generate/"
payload = {
    "token": token,
    "prompt": "bird of prey",
    "n_iterations": 15,
    "n_samples": 1,
    "detail_level": "standard",
    "style": "automatic",
    "seed": 42,
    "width": 768,
    "height": 768,
}

response = call_api(url, params=payload)
print(response)
