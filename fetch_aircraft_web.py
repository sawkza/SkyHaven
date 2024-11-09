import requests
from bs4 import BeautifulSoup

# URL of ADS-B Exchange's live map
URL = "https://globe.adsbexchange.com/"

def fetch_aircraft_data():
    # Send a request to the ADS-B Exchange map page
    try:
        response = requests.get(URL)
        response.raise_for_status()  # Check for HTTP errors

        # Parse the HTML page
        soup = BeautifulSoup(response.text, 'html.parser')

        # For demonstration: print out the title of the page
        print("Page title:", soup.title.string)

        # Here, we would add logic to parse the flight data, if available
        # Since it’s a dynamic site, we may need a more advanced method
        print("Successfully accessed ADS-B Exchange map.")

    except requests.exceptions.RequestException as e:
        print("Error fetching data:", e)

# Run the function to test access
fetch_aircraft_data()
