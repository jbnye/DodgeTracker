# pretty print
import pprint
#requests for api
import requests
#honestly no clue, i think its the objects for the enviroment
import os
import time
from db_connection import get_db_connection
from flask import Flask, jsonify, current_app
from flask_socketio import SocketIO
import eventlet
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])
socketio = SocketIO(app, async_mode='eventlet', cors_allowed_origins="http://localhost:3000")

@app.route('/api/dodge-items', methods=['GET'])
def get_dodge_items():
    conn = get_db_connection()  # Reconnect every time a request is made
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
        SELECT d.*, s.gameName, s.tagLine, s.summonerLevel, s.iconId 
        FROM dodges d
        JOIN summoner s ON d.summonerID = s.summonerID
        ORDER BY d.dodgeId DESC LIMIT 10
        """)
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(results)
    except Exception as e:
        print(f"Error: '{e}'")
        return jsonify({"error": "Failed to fetch data"}), 500
    


@app.route('/api/test-new-dodge', methods=['POST'])
def test_new_dodge():
    # Create mock dodge data
    mock_dodge_data = {
        "rank": "master",
        "leaguePoints": 100,
        "lpLost": 5,
        "gameName": "TestPlayer",
        "tagLine": "NA1",
        "summonerLevel": 50,
        "iconId": 1234,
        "timeDifference": "just now"
    }
    # Emit the mock data as a new dodge event
    socketio.emit('new_dodge', mock_dodge_data)
    return jsonify({"message": "Test dodge event emitted"}), 200



# Function to emit the new dodge entry to connected clients
def notify_new_dodge(dodge_data):
    dodge_dict = {
        # "rank": str(dodge_data[0]),
        # "leaguePoints": str(dodge_data[1]),
        # "lpLost": str(dodge_data[2]),
        # "gameName": str(dodge_data[3]),
        # "tagLine": str(dodge_data[4]),
        # "summonerLevel": str(dodge_data[5]),
        # "iconId": str(dodge_data[6]),
        # "timeDifference": str(dodge_data[7].isoformat())  # Convert datetime to string in ISO 8601 format
        "rank": "master",
        "leaguePoints": 100,
        "lpLost": 5,
        "gameName": "TestPlayer",
        "tagLine": "NA1",
        "summonerLevel": 50,
        "iconId": 1234,
        "timeDifference": "just now"

    }
    print("About to emit new dodge:", dodge_dict)

    app = current_app._get_current_object()  # Get the current Flask app object
    with app.app_context():  # Ensure we're within the app context
        socketio.emit("new_dodge", dodge_dict)
        print("Finished emitting new dodge")

    # socketio.emit("new_dodge", dodge_dict)
    # print("Finished emitting new dodge")

# Start the application with SocketIO
if __name__ == '__main__':
    socketio.run(app, debug=True)

