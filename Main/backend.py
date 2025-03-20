# pretty print
import pprint
#requests for api
import requests
#honestly no clue, i think its the objects for the enviroment
import os
import time
from db_connection import get_db_connection
from flask import Flask, request, jsonify, current_app
from flask_socketio import SocketIO
import eventlet
import mysql.connector
from flask_cors import CORS
from datetime import datetime

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
    
    
@app.route('/api/add-dodge', methods=['POST'])
def add_dodge():
    dodge_data = request.json
    print(f"Received dodge event: {dodge_data}")
    # Emit the dodge event to all connected clients
    socketio.emit("new_dodge", dodge_data)
    return jsonify({"message": "Dodge event emitted"}), 200

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:

        page = int(request.args.get('page', 1))
        items_per_page = 25
        offset = (page - 1)

        cursor.execute("SELECT COUNT(DISTINCT d.summonerID) AS total FROM dodges d")
        total_result = cursor.fetchone()
        total_entries = int(total_result['total']) if total_result and total_result['total'] is not None else 0
        total_pages = (total_entries + items_per_page - 1) // items_per_page

        cursor.execute(
            """SELECT 
                s.gameName, 
                s.tagLine, 
                s.iconId, 
                s.leaguePoints, 
                s.rank, 
                COUNT(d.dodgeId) AS totalDodges
            FROM dodges d
            JOIN summoner s ON d.summonerID = s.summonerID
            GROUP BY d.summonerID  
            ORDER BY totalDodges DESC  
            LIMIT %s OFFSET %s;""",
            (items_per_page, offset)
        )

        leaderboard_data = cursor.fetchall()
        # print(leaderboard_data)
        return jsonify({

            "data": leaderboard_data,
            "totalPages": total_pages,
            "currentPage": page})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    finally:
        cursor.close()
        conn.close()


    

@app.route('/api/player/', methods=['GET'])
def get_player_page():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        summonerName = request.args.get('gameName')
        summonerTag = request.args.get('tagLine')

        cursor.execute(
            """
            SELECT summonerId, leaguePoints, gamesPlayed, `rank`, iconId, summonerLevel FROM SUMMONER WHERE gameName = %s AND tagLine = %s
            """,
            (summonerName, summonerTag)
        )

        summoner_data = cursor.fetchone()
        if not summoner_data:
            return jsonify({
                "status": "error",
                "message": "No summoner found with the specified gameName and tagLine.",
                "data": []
            })

        cursor.execute(
            """
            SELECT lpLost, `rank`, dodgeDate, leaguePoints FROM DODGES WHERE summonerId = %s
            """,
            (summoner_data["summonerId"],)
        )
        dodge_data = cursor.fetchall()

        if not dodge_data:
            return jsonify({
                "status": "error",
                "message": "Summoner has no dodge data.",
                "data": []
            })
        dodge_stats = dodgeDataExtractor(dodge_data, summoner_data["gamesPlayed"])
        
        return jsonify({
            "dodge": dodge_stats,
            "summoner": summoner_data
            })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    finally:
        cursor.close()
        conn.close()
  

def dodgeDataExtractor (dodge_data, gamesPlayed):
    seasonfifteen_cutoff = datetime(2025, 1, 9)
    number_of_dodges = len(dodge_data)
    small_dodge = 0
    big_dodge = 0
    dodge_per_game = number_of_dodges / gamesPlayed
    total_lp_lost = 0
    seasons = {
        "season14": [],
        "season15": []
    }

    for data in dodge_data:
        total_lp_lost = total_lp_lost + data["lpLost"]
        if data["lpLost"] <= 5:
            small_dodge += 1
        else:
            big_dodge += 1
        if data["dodgeDate"] < seasonfifteen_cutoff:
            seasons["season14"].append(data)
        else:
            seasons["season15"].append(data)
    
    return {
        "small_dodge": small_dodge,
        "big_dodge": big_dodge,
        "number_of_dodges": number_of_dodges,
        "dodge_per_game": dodge_per_game,
        "total_lp_lost": total_lp_lost,
        "seasons": seasons
    }
    





# Start the application with SocketIO
if __name__ == '__main__':
    socketio.run(app, debug=True)
