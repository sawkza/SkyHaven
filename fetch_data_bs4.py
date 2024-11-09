import requests
from bs4 import BeautifulSoup

# URL of the ADS-B Exchange page
url = "https://globe.adsbexchange.com/"

# Attempt to get the page content
try:
    response = requests.get(url, verify=False)  # `verify=False` disables SSL verification
    response.raise_for_status()  # Raise an error if the request was unsuccessful
    
    # Parse the HTML content
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find elements by class or id (update these selectors based on the actual structure of the page)
    # Example placeholders; you’ll need to replace these with the correct ones.
    altitude_element = soup.find(id="selected_nav_altitude")
    speed_element = soup.find("div", class_="your-speed-class")  # Replace with the actual class

    # Extract and print altitude and speed values
    altitude = altitude_element.text if altitude_element else "Altitude not found"
    speed = speed_element.text if speed_element else "Speed not found"

    print(f"Altitude: {altitude}")
    print(f"Speed: {speed}")

except requests.exceptions.RequestException as e:
    print(f"An error occurred while fetching the page: {e}")
