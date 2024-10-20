# pretty print
import pprint
#requests for api
import requests
#honestly no clue, i think its the objects for the enviroment
import os
import time
from db_connection import get_db_connection
from flask import Flask, jsonify
import mysql.connector

from flask_cors import CORS
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

@app.route('/api/dodge-items', methods=['GET'])

def get_dodge_items():
    conn = get_db_connection()  # Reconnect every time a request is made
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM dodges ORDER BY dodgeId DESC LIMIT 10")
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(results)
    except Exception as e:
        print(f"Error: '{e}'")
        return jsonify({"error": "Failed to fetch data"}), 500
if __name__ == '__main__':
    app.run(debug=True)