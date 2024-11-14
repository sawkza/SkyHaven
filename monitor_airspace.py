from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests
from geopy.distance import geodesic

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

url = "https://opensky-network.org/api/states/all"

def is_in_alert_area(aircraft_location, user_location, radius_km):
distance = geodesic(aircraft_location, user_location).kilometers
return distance <= radius_km

@app.route('/')
def home():
return render_template('index.html')

@app.route('/location', methods=['POST'])
def check_aircraft():
data = request.get_json()
user_location = (data['latitude'], data['longitude'])
alert_radius_km = data.get('radius', 8)

try:
response = requests.get(url)
response.raise_for_status()
aircraft_data = response.json()
alerts = []

for aircraft in aircraft_data["states"]:
if aircraft[5] and aircraft[6]:
aircraft_location = (aircraft[6], aircraft[5])
if is_in_alert_area(aircraft_location, user_location, alert_radius_km):
alerts.append({
"icao24": aircraft[0],
"callsign": aircraft[1].strip(),
"origin_country": aircraft[2],
"altitude": aircraft[7],
"velocity": aircraft[9]
})

return jsonify({"alerts": alerts})
except Exception as e:
print(f"Error: {e}")
return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
app.run(debug=True)