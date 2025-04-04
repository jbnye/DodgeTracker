# pretty print
import pprint
#requests for api
import requests
#honestly no clue, i think its the objects for the enviroment
import os
import time
from db_connection import get_db_connection
from datetime import datetime, timezone
import signal
import sys

import socketio
#getting the api key from the .env
api_key = os.getenv("Riot_Api_Key")

#checks if the summoner is in the database
def check_summoner_exists(conn, cursor,summoner_id):
    try:
        check_query = "SELECT leaguePoints, gamesPlayed FROM Summoner WHERE summonerId = %s"
        cursor.execute(check_query, (summoner_id,))
        result = cursor.fetchone()
        return result
    except Exception as e:
        print(f"Error checking for summoner: {e}")
    

#this updates the lp after a dodge -5 or -15
def update_account_after_dodge(conn, cursor,summoner_id, league_points, account_data):
    try:
        update_lp_query = """
        UPDATE Summoner
        SET leaguePoints = %s, iconId = %s, summonerLevel = %s, gameName = %s, tagLine = %s
        WHERE summonerId = %s
        """
        cursor.execute(update_lp_query, (league_points, summoner_id, account_data['iconId'], account_data['summonerLevel'], account_data['gameName'], account_data['tagLine']))
        conn.commit()
        print(f"I have just updated summoner {summoner_id} to have league_points = {league_points}")
    except Exception as e:
        conn.rollback()
        print(f"Error updating account after dodge: {e}")

# if a dodge has been detected, insert a new entry in the dodge table. Inserts the summonerId, lp lost, the data, the rank, and the lp they were at.
def insert_dodge_entry(conn, cursor,summoner_id, lpLost, rank, leaguePoints, summoner_info):
    try:
        insert_query = """
            INSERT INTO Dodges (summonerId, lpLost, `rank`, dodgeDate, leaguePoints)
            VALUES (%s, %s, %s, %s, %s)
        """
        dodgeDate = datetime.now(timezone.utc)
        data = (summoner_id, lpLost, rank, dodgeDate, leaguePoints)
        cursor.execute(insert_query, data)
        conn.commit()

        cursor.execute("SELECT LAST_INSERT_ID()")
        dodgeId = cursor.fetchone()[0]

        data2 = (
            rank,
            leaguePoints,
            lpLost,
            summoner_info['gameName'],
            summoner_info['tagLine'],
            summoner_info['summonerLevel'],
            summoner_info['iconId'],
            dodgeDate,
            dodgeId
        )
        notify_new_dodge(data2)
        print(f"A dodge has been recorded: {data2} for {summoner_id}")
    except Exception as e:
        conn.rollback()
        print(f"Error inserting dodge entry: {e}")


# fetch the account and summoner info and return that data
def fetch_summoner_info(summoner_id):
    conn = get_db_connection()
    try:
        getSummoner_path = f"https://na1.api.riotgames.com/lol/summoner/v4/summoners/{summoner_id}?api_key={api_key}"
        summoner_response = requests.get(getSummoner_path)
        summoner_response.raise_for_status()
        summoner = summoner_response.json()

        getAccount_path = f"https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/{summoner['puuid']}?api_key={api_key}"
        account_response = requests.get(getAccount_path)
        account_response.raise_for_status()
        account = account_response.json()

        return {
            "iconId": summoner["profileIconId"],
            "summonerLevel": summoner["summonerLevel"],
            "puuid": summoner["puuid"],
            "gameName": account["gameName"],
            "tagLine": account["tagLine"],
        }
    except requests.exceptions.HTTPError as http_err:
        if http_err.response.status_code == 429:
            print("Rate limit exceeded. Waiting for 1 minute before retrying...")
            time.sleep(60)
            return fetch_summoner_info(summoner_id)
        raise



# if there was no entry in the summoner, put all the info for the summoner in the database.
def insert_summoner_all(conn, cursor,summoner_id, league_points, games_played, rank):
    try:
        account_data = fetch_summoner_info(summoner_id)
        insert_query = """
            INSERT INTO Summoner (summonerId, leaguePoints, gamesPlayed, `rank`, iconId, summonerLevel, puuId, gameName, tagLine)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        data = (
            summoner_id,
            league_points,
            games_played,
            rank,
            account_data['iconId'],
            account_data['summonerLevel'],
            account_data['puuid'],
            account_data['gameName'],
            account_data['tagLine'],
        )
        print(f"Inserting data: {data}")
        cursor.execute(insert_query, data)
        conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"Error inserting summoner: {e}")

# loop that saves their summonerId, league points, games_played, and rank
# main if else statements to branch out logical paths.
def update_or_insert_summoner(conn, cursor,account, tier):

    try:
        summoner_id = account["summonerId"]
        league_points = account["leaguePoints"]
        games_played = account["wins"] + account["losses"]
        rank = tier

        result = check_summoner_exists(summoner_id)
        if not result:
            insert_summoner_all(summoner_id, league_points, games_played, rank)
            print(f"Added {summoner_id} to the database")
        else:
            db_league_points, db_games_played = result
            if db_games_played == games_played:
                if ((db_league_points - league_points) > 0 and (db_league_points - league_points) <= 15):
                    account_data = fetch_summoner_info(summoner_id)
                    lp_lost = db_league_points - league_points
                    print(f"There is a dodge with {summoner_id} DB LP = {db_league_points} API LP =  {league_points}" )
                    update_account_after_dodge(summoner_id, league_points, account_data)
                    insert_dodge_entry(summoner_id, lp_lost, rank, db_league_points, account_data)
            else:
                update_query = """
                UPDATE Summoner
                SET leaguePoints = %s, gamesPlayed = %s, `rank` = %s
                WHERE summonerId = %s
                """
                cursor.execute(update_query, (league_points, games_played, rank, summoner_id))
                conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"Error update or insert: {e}")
       
def fetch_challenger_players(api_key):
    url = f"https://na1.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5?api_key={api_key}"
    response = requests.get(url)
    response.raise_for_status()  # Raise an error for bad status codes
    return response.json()

def fetch_grandmaster_players(api_key):
    url = f"https://na1.api.riotgames.com/lol/league/v4/grandmasterleagues/by-queue/RANKED_SOLO_5x5?api_key={api_key}"
    response = requests.get(url)
    response.raise_for_status()  # Raise an error for bad status codes
    return response.json()

def fetch_master_players(api_key):
    url = f"https://na1.api.riotgames.com/lol/league/v4/masterleagues/by-queue/RANKED_SOLO_5x5?api_key={api_key}"
    response = requests.get(url)
    response.raise_for_status()  # Raise an error for bad status codes
    return response.json()


def notify_new_dodge(dodge_data):
    
    dodge_dict = {
        "rank": str(dodge_data[0]),
        "leaguePoints": str(dodge_data[1]),
        "lpLost": str(dodge_data[2]),
        "gameName": str(dodge_data[3]),
        "tagLine": str(dodge_data[4]),
        "summonerLevel": str(dodge_data[5]),
        "iconId": str(dodge_data[6]),
        "dodgeDate": str(dodge_data[7].isoformat()),  # Convert datetime to string in ISO 8601 format
        "dodgeId": str(dodge_data[8])
    }

    response = requests.post("http://localhost:5000/api/add-dodge", json = dodge_dict)
    if response.status_code == 200:
        print("Dodge event successfully emitted!") 
    else: 
        print(f"Failed to emit dodge event. Status code: {response.status_code}, Response: {response.text}")

def graceful_exit(signal, frame):
    print("\n[INFO] Exiting gracefully. Closing DB connections...")
    sys.exit(0)

def main_loop(api_key):
    conn = get_db_connection()
    cursor = conn.cursor()
    while True:
        try:
            # Fetch and process challenger players
            challenger_players = fetch_challenger_players(api_key)
            for account in challenger_players['entries']:
                update_or_insert_summoner(conn, cursor, account, "challenger")

            # Fetch and process grandmaster players
            grandmaster_players = fetch_grandmaster_players(api_key)
            for account in grandmaster_players['entries']:
                update_or_insert_summoner(conn, cursor,account, "grandmaster")

            # Fetch and process master players
            master_players = fetch_master_players(api_key)
            for account in master_players['entries']:
                update_or_insert_summoner(conn, cursor,account, "master")

        except requests.exceptions.HTTPError as http_err:
            print(f"HTTP error occurred: {http_err}")
            conn.rollback()

        except Exception as err:
            print(f"Other error occurred in main loops: {err}")
            conn.rollback()

        # Wait before the next iteration
        time.sleep(10)
main_loop(api_key)
signal.signal(signal.SIGINT, graceful_exit)
sio.disconnect()

















# # function to get all masters players
# def parseMasters():

#     getMasters_path = f"https://na1.api.riotgames.com/lol/league/v4/masterleagues/by-queue/RANKED_SOLO_5x5?api_key={api_key}"
#     masters_players_response = requests.get(getMasters_path)
#     masters_players = masters_players_response.json()
#     for account in masters_players['entries']:

#         check_query = "SELECT 1 FROM Summoner WHERE summonerId = %s"
#         cursor.execute(check_query, (account['summonerId'],))
#         # Fetch one result
#         result = cursor.fetchone()

#         if result:


#         else:
#             insert_query = "INSERT INTO SUMMONER (summonerId, leaguePoints, gamesPlayed,`rank`) VALUES (%s, %i, %i, %s)"
#             cursor.execute(insert_query, (account['summonerId'], account['leaguePoints'], account['gamesPlayed'], account['`rank`']))

# parseMasters()
# # leaderboard = []
# # leaderboard.sort(reverse=True)
# # print(leaderboard)
