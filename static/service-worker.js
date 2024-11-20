<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SkyHaven - Airspace Monitor</title>
<link rel="icon" href="favicon.ico" type="image/x-icon">
<link rel="manifest" href="/manifest.json">
<style>
/* Styling */
body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #f4f4f9;
}
.container {
    text-align: center;
    background-color: #ffffff;
    padding: 20px 40px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 500px;
}
h1 {
    color: #4CAF50;
    margin: 0 0 10px;
}
h2 {
    font-size: 1.2em;
    color: #333;
    margin: 10px 0 15px;
}
p {
    color: #777;
    font-size: 0.9em;
    margin: 10px 0;
}
.advice {
    font-size: 0.9em;
    color: #555;
    margin: 15px 0;
}
button {
    background-color: #007bff;
    color: #ffffff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
}
button:hover {
    background-color: #0056b3;
}
#radiusInput {
    margin-top: 10px;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
    width: 100%;
    max-width: 200px;
    font-size: 1em;
}
.success-message {
    color: green;
    font-size: 1em;
    display: none;
    margin-top: 10px;
}
.loading-animation {
    display: none;
    margin-top: 10px;
}
.loading-animation img {
    width: 50px;
    height: 50px;
}
</style>
</head>
<body>
<div class="container">
    <h1>SkyHaven - Airspace Monitor</h1>
    <h2>အန္တရာယ်ရှိသော လေယာဥ်များ အသုံးပြုသူ၏ပိုက်နက် Area ထဲသို့ ဝင်ရောက်လာပါက အသိပေးသော စနစ်</h2>
    <button onclick="getUserLocation()">Share Location</button>

    <div>
        <label for="radiusInput">Set Alert Radius (km):</label>
        <input type="number" id="radiusInput" placeholder="e.g., 100" onchange="updateRadius()" />
    </div>

    <button class="ok-button" id="okButton" onclick="confirmSettings()">OK</button>

    <div class="advice">
        <p>Kmနေရာတွင်15မှ၂၀ကိုရေးရန်အကြံပြုပါသည် (We advise setting the radius to ၁၅-၂၀ km)</p>
        <p>1 mile = 1.60934 km</p>
    </div>

    <p>Developed by Palaung Lay Company Limited</p>
    <div class="loading-animation" id="loadingAnimation">
        <img src="/static/loading.gif" alt="Loading...">
    </div>
    <div class="success-message" id="successMessage">အောင်မြင်ပါသည် - Location Shared Successfully!</div>
</div>

<script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
    import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging.js";
    import { signInWithEmailAndPassword, getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

    const firebaseConfig = {
        apiKey: "AIzaSyCxQD-mgdlGObPULe6SrkRz2pOIlW0e3qk",
        authDomain: "skyhaven-project.firebaseapp.com",
        projectId: "skyhaven-project",
        storageBucket: "skyhaven-project.appspot.com",
        messagingSenderId: "390818384586",
        appId: "1:390818384586:web:6df306bb9062cfd77a0233",
        measurementId: "G-ZYB43QHF3G"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);
    const auth = getAuth(app);

    // Sign in with email and password
    signInWithEmailAndPassword(auth, "testuser@example.com", "testpassword123")
        .then(() => {
            console.log("Signed in successfully.");
            return navigator.serviceWorker.register('/static/service-worker.js');
        })
        .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);

            // Retrieve the FCM token
            return getToken(messaging, {
                vapidKey: "BMlmHQtxNDDZBtOvsgXUfncF92BDk8SKIymFjJwMSEg9ho31b71A3paBzPsBIUII6137I22b5C5sMavVLqGdlsg",
                serviceWorkerRegistration: registration
            });
        })
        .then((currentToken) => {
            if (currentToken) {
                console.log("FCM Registration Token:", currentToken);
            } else {
                console.log("No registration token available.");
            }
        })
        .catch((error) => {
            console.error("Error during authentication or token retrieval:", error);
        });
</script>

<script>
    let alertRadiusKm = 8; // Default recommended radius

    function updateRadius() {
        const radiusInput = document.getElementById("radiusInput").value;
        alertRadiusKm = radiusInput ? parseFloat(radiusInput) : 8;
        document.getElementById("okButton").style.display = "inline-block";
    }

    function getUserLocation() {
        const loadingAnimation = document.getElementById("loadingAnimation");
        loadingAnimation.style.display = "block";

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                sendLocation(position);
                loadingAnimation.style.display = "none";
            }, (error) => {
                handleError(error);
                loadingAnimation.style.display = "none";
            });
        } else {
            alert("Geolocation is not supported by this browser.");
            loadingAnimation.style.display = "none";
        }
    }

    function sendLocation(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        fetch('https://skyhaven.onrender.com/location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latitude, longitude, radius: alertRadiusKm }),
        })
        .then(response => response.json())
        .then(data => {
            displayAircraftAlerts(data.alerts);
            showSuccessMessage();
        })
        .catch((error) => console.error('Error:', error));
    }

    function confirmSettings() {
        alert("Settings confirmed!");
        document.getElementById("okButton").style.display = "none";
    }

    function showSuccessMessage() {
        const successMessage = document.getElementById("successMessage");
        successMessage.style.display = "block";
        setTimeout(() => {
            successMessage.style.display = "none";
        }, 7000);
    }

    function displayAircraftAlerts(alerts) {
        if (alerts.length > 0) {
            alerts.forEach(alert => {
                const message = `ALERT: Aircraft ${alert.icao24} (${alert.callsign}) from ${alert.origin_country} is in the area.\nAltitude: ${alert.altitude} meters, Speed: ${alert.velocity} m/s`;
                alertNotification(message);
            });
        } else {
            console.log("No aircraft in your area.");
        }
    }

    function alertNotification(message) {
        const notificationMessage = "လေယာဥ်တစ်စင်းသည် သင်၏ဧရိယာအတွင်း ဝင်ရောက်လာနေပါသည်!\n" + message;
        const options = {
            icon: '/static/icon-192x192.png',
            badge: '/static/icon-192x192.png',
            vibrate: [200, 100, 200],
            tag: 'aircraft-alert'
        };

        if (Notification.permission === "granted") {
            navigator.serviceWorker.getRegistration().then(registration => {
                if (registration) {
                    registration.showNotification(notificationMessage, options);
                }
            });
        } else {
            alert(notificationMessage);
        }
    }

    function handleError(error) {
        console.error("Geolocation error:", error);
        alert("Failed to retrieve location.");
    }
</script>
</body>
</html>
