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

@app.route('/api/dodgeList', methods = ['GET'])
def get_dodge_list():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            """
            SELECT 
            d.dodgeId,
            d.summonerId,
            d.lpLost,
            d.rank,
            d.dodgeDate,
            d.leaguePoints,
            s.iconId,
            s.gameName,
            s.tagLine
            FROM dodges d
            JOIN summoner s ON d.summonerId = s.summonerId
            ORDER BY d.dodgeId DESC LIMIT 20;
            """
        )
        dodge_list = cursor.fetchall()
        return jsonify({"data": dodge_list})


    except Exception as e:
        return jsonify({"error": str(e)}, 500)
    finally: 
        conn.close()
        cursor.close()
    

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
        dodge_stats = dodgeDataExtractor(dodge_data)
        
        return jsonify({
            "dodge": dodge_stats,
            "summoner": summoner_data
            })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    finally:
        cursor.close()
        conn.close()
  

def dodgeDataExtractor (dodge_data):
    seasonfifteen_cutoff = datetime(2025, 1, 9)
    now = datetime.now()
    seasons = {
        "season15": {
            "dodges": [],
            "small_dodges": 0,
            "total_lp_lost": 0
        },
        "season14": {
            "dodges": [],
            "small_dodges": 0,
            "total_lp_lost": 0
        },
        "all":{
            "dodges": [],
            "small_dodges": 0,
            "total_lp_lost": 0
        }
    }
    dodge_cat = {
        "this_month": [],
        "this_week": [],
        "today": [],
        "older": []
    }


    for data in dodge_data:
        date_diff = now - data["dodgeDate"]
        if(date_diff.days < 1):
            dodge_cat["this_month"].append(data)
            dodge_cat["this_week"].append(data)
            dodge_cat["today"].append(data)
        elif (date_diff.days > 1 and date_diff.days <= 7):
            dodge_cat["this_month"].append(data)
            dodge_cat["this_week"].append(data)
        elif(date_diff.days > 8 and date_diff.days <= 30):
            dodge_cat["this_month"].append(data)
        else:
            dodge_cat["older"].append(data)

        if data["dodgeDate"] < seasonfifteen_cutoff:
            season = "season14"
        else:
            season = "season15"

        seasons[season]["dodges"].append(data)
        seasons[season]["total_lp_lost"] += data["lpLost"]
        if data["lpLost"] <= 5:
            seasons[season]["small_dodges"] += 1
        seasons["all"]["dodges"].append(data)
        seasons["all"]["total_lp_lost"] += data["lpLost"]
        if data["lpLost"] <= 5:
            seasons["all"]["small_dodges"] += 1
        
    
    return {
        "seasons": seasons,
        "time_periods": dodge_cat
    }
    





# Start the application with SocketIO
if __name__ == '__main__':
    socketio.run(app, debug=True)
