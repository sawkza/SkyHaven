import firebase_admin
from firebase_admin import credentials, messaging

# Initialize the Firebase app with the service account key
cred = credentials.Certificate("firebase-key.json")  # Ensure this file is in the same directory
firebase_admin.initialize_app(cred)

# Function to send a notification
def send_notification():
    # Create a message payload
    message = messaging.Message(
        notification=messaging.Notification(
            title="Test Notification",
            body="This is a test notification from Firebase HTTP v1",
        ),
        topic="airspace-alerts",  # Target the "airspace-alerts" topic
    )

    # Send the message
    response = messaging.send(message)
    print(f"Notification sent successfully! Response: {response}")

# Call the function
if __name__ == "__main__":
    send_notification()
