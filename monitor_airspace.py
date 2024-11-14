import os
from flask import Flask, request, jsonify, render_template, send_from_directory
from geopy.distance import geodesic

app = Flask(__name__)

# OpenSky API URL
url = "https://opensky-network.org/api/states/all"

def is_in_alert_area(aircraft_location, user_location, radius_km):
    """Check if an aircraft is within the alert radius of the user's location."""
    distance = geodesic(aircraft_location, user_location).kilometers
    return distance <= radius_km

@app.route('/')
def home():
    return render_template('index.html')  # Ensure 'index.html' is in the templates folder

@app.route('/manifest.json')
def manifest():
    return send_from_directory('static', 'manifest.json')  # Serve manifest.json from static folder

@app.route('/location', methods=['POST'])
def check_aircraft():
    try:
        # Retrieve location and radius data from the front end
        data = request.get_json()
        user_location = (data['latitude'], data['longitude'])
        alert_radius_km = data.get('radius', 100)  # Default radius if none provided

        # Fetch aircraft data from OpenSky API
        response = requests.get(url)
        response.raise_for_status()
        aircraft_data = response.json()

        alerts = []
        for aircraft in aircraft_data["states"]:
            icao24 = aircraft[0]
            callsign = aircraft[1].strip()
            origin_country = aircraft[2]
            latitude = aircraft[6]
            longitude = aircraft[5]
            altitude = aircraft[7]
            velocity = aircraft[9]

            if latitude and longitude:  # Ensure location data is present
                aircraft_location = (latitude, longitude)
                # Check if the aircraft is within the alert radius
                if is_in_alert_area(aircraft_location, user_location, alert_radius_km):
                    alerts.append({
                        "icao24": icao24,
                        "callsign": callsign,
                        "origin_country": origin_country,
                        "altitude": altitude,
                        "velocity": velocity
                    })

        return jsonify({"alerts": alerts})

    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Use the PORT environment variable for Render
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
