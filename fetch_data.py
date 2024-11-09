import requests

# ADS-B Exchange API endpoint (replace with real API URL and key)
API_URL = "https://adsbexchange.com/api/aircraft"
API_KEY = "YOUR_ADSB_EXCHANGE_API_KEY"  # Replace with your real API key

def fetch_aircraft_data():
    # Make a request to the ADS-B Exchange API
    headers = {
        'Authorization': f'Bearer {API_KEY}'  # The API key for access
    }
    response = requests.get(API_URL, headers=headers)
    
    # Check if the request was successful
    if response.status_code == 200:
        data = response.json()  # Parse the JSON data
        print("Aircraft Data Retrieved Successfully:")
        print(data)  # Print data to see the structure
    else:
        print(f"Failed to fetch data. Status code: {response.status_code}")

# Run the function
fetch_aircraft_data()
