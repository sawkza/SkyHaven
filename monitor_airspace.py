from flask import Flask, request, jsonify, render_template, send_from_directory
import os
import requests
from geopy.distance import geodesic

app = Flask(__name__)

# Serve the main HTML page
@app.route('/')
def home():
    return render_template('index.html')  # Ensure 'index.html' is in the templates folder

# Serve service-worker.js from the root directory
@app.route('/service-worker.js')
def service_worker():
    return send_from_directory(os.path.dirname(__file__), 'service-worker.js')

# Serve manifest.json from the root directory
@app.route('/manifest.json')
def manifest():
    return send_from_directory(os.path.dirname(__file__), 'manifest.json')

# Serve favicon.ico from the static folder
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico')

# Endpoint to handle location requests from the client
@app.route('/location', methods=['POST'])
def check_aircraft():
    try:
        # Retrieve the location and radius from the client's POST request
        data = request.get_json()
        user_location = (data['latitude'], data['longitude'])
        alert_radius_km = data.get('radius', 100)  # Default radius if not provided

        # Fetch aircraft data from the OpenSky API
        response = requests.get("https://opensky-network.org/api/states/all")
        response.raise_for_status()
        aircraft_data = response.json()

        alerts = []
        for aircraft in aircraft_data["states"]:
            if aircraft[6] and aircraft[5]:  # Ensure latitude and longitude are present
                aircraft_location = (aircraft[6], aircraft[5])
                # Check if the aircraft is within the alert radius
                if is_in_alert_area(aircraft_location, user_location, alert_radius_km):
                    alerts.append({
                        "icao24": aircraft[0],
                        "callsign": aircraft[1].strip(),
                        "origin_country": aircraft[2],
                        "altitude": aircraft[7],
                        "velocity": aircraft[9]
                    })

        # Return the list of aircraft within the alert radius
        return jsonify({"alerts": alerts})

    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

# Function to check if an aircraft is within the alert radius of the user's location
def is_in_alert_area(aircraft_location, user_location, radius_km):
    """Check if an aircraft is within the alert radius of the user's location."""
    distance = geodesic(aircraft_location, user_location).kilometers
    return distance <= radius_km

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
