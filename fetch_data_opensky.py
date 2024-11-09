import requests

# Replace with your API key if needed
url = "https://opensky-network.org/api/states/all"

try:
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()
    
    # Print the first aircraft’s data as an example
    print("Sample Aircraft Data:")
    print(data["states"][0])

except requests.exceptions.RequestException as e:
    print(f"Error fetching data: {e}")
