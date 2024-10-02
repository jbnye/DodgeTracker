# pretty print
import pprint
#requests for api
import requests
#honestly no clue, i think its the objects for the enviroment
import os
import time
from db_connection import get_db_connection
from datetime import datetime
#getting the api key from the .env
api_key = os.getenv("Riot_Api_Key")



# function to check if the summoner exists. Search the summonerId in the database and fetch the results and send back to update or insert
def check_summoner_exists(summoner_id):

    conn = get_db_connection()
    cursor = conn.cursor()
    check_query = "SELECT leaguePoints, gamesPlayed FROM Summoner WHERE summonerId = %s"
    cursor.execute(check_query, (summoner_id,))
    result = cursor.fetchone()
    conn.close()
    return result



def update_summoner_info(summoner_id, league_points):

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        getSummoner_path = f"https://na1.api.riotgames.com/lol/summoner/v4/summoners/{summoner_id}?api_key={api_key}"
        summoner_response = requests.get(getSummoner_path)
        summoner_response.raise_for_status()  # Raise an error for bad status codes
        summoner = summoner_response.json()
        summoner_puuid = summoner["puuid"]
        summoner_account_id = summoner["accountId"]
        summoner_profile_icon = summoner["profileIconId"]
        summoner_level = summoner["summonerLevel"]


        getAccount_path = f"https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/{summoner_puuid}?api_key={api_key}"
        account_response = requests.get(getAccount_path)
        account_response.raise_for_status()  # Raise an error for bad status codes
        account = account_response.json()
        account_game_name = account["gameName"]
        account_tagLine = account["tagLine"]

        update_query = """
            UPDATE Summoner
            SET
                leaguePoints = %s
                iconId = %s,
                summonerLevel = %s,
                puuId = %s,
                gameName = %s,
                tagLine = %s
            WHERE summonerId = %s    
        """
        data = (league_points, summoner_profile_icon,summoner_level, summoner_puuid, account_game_name, account_tagLine, summoner_id)

        cursor.execute(update_query, data)

    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
        print(f"Response content: {summoner_response.content if 'summoner_response' in locals() else 'No response'}")
    except Exception as err:
        print(f"Other error occurred: {err}")
        print(f"Response content: {summoner_response.content if 'summoner_response' in locals() else 'No response'}")
    conn.commit()
    conn.close()



# if a dodge has been detected, insert a new entry in the dodge table. Inserts the summonerId, lp lost, the data, the rank, and the lp they were at.
def insert_dodge_entry(summoner_id, lp_lost, rank, league_points):

    conn = get_db_connection()
    cursor = conn.cursor()
    
    insert_query = """
        INSERT INTO Dodges (summonerId, lpLost, `rank`, leaguePoints, dodgeDate)
        VALUES (%s, %s, %s, %s, %s)
    """
    data = (summoner_id, lp_lost, rank,league_points, datetime.now())
    print(data)
    cursor.execute(insert_query, data)
    conn.commit()
    conn.close()



# loop that saves their summonerId, league points, games_played, and rank
# main if else statements to branch out logical paths.
def update_or_insert_summoner(account, tier):

    conn = get_db_connection()
    cursor = conn.cursor()

    summoner_id = account['summonerId']
    league_points = account['leaguePoints']
    games_played = account['wins'] + account['losses']
    rank = tier

    # take the result of checking if the summoenr is in the database already.
    result = check_summoner_exists(summoner_id)


    # if else logic path to see what must be done with the result of if the summoner is in the database
    #if the summoner is in the database, check to see if their lp is the same, if it is go next. If their lp is not the same check their games played, if it is different update the database. If the games played is the same, create and execute dodge function to enter dodge info into the database.
    if result:
        db_league_points, db_games_played = result

        if db_games_played == games_played: #there was a game played, update database for rank, lp, and games played
            if (db_league_points - league_points == 5) or (db_league_points - league_points == 15): 
                lp_lost = db_league_points - league_points
                insert_dodge_entry(summoner_id, lp_lost, rank, league_points)
                update_summoner_info(summoner_id, league_points)

        else: 
            update_query = """
            UPDATE Summoner
            SET leaguePoints = %s, gamesPlayed = %s, `rank` = %s
            WHERE summonerId = %s
            """
            cursor.execute(update_query, (league_points, games_played, rank, summoner_id)) # update database entry for the summonerId

    else:
        insert_query = """
            INSERT INTO Summoner (summonerId, leaguePoints, gamesPlayed, `rank`)
            VALUES (%s, %s, %s, %s)
        """
        data = (
            summoner_id,
            league_points,
            games_played,
            rank
            # account.get('iconId', 23),
            # account['summonerLevel'],
            # account['puuId'],
            # account['gameName'],
            # account['tagLine']
        )
        cursor.execute(insert_query, data)
        conn.commit()
        conn.close()



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


def main_loop(api_key):
    while True:
        try:
            # Fetch and process challenger players
            challenger_players = fetch_challenger_players(api_key)
            for account in challenger_players['entries']:
                update_or_insert_summoner(account, "challenger")

            # Fetch and process grandmaster players
            grandmaster_players = fetch_grandmaster_players(api_key)
            for account in grandmaster_players['entries']:
                update_or_insert_summoner(account, "grandmaster")

            # Fetch and process master players
            master_players = fetch_master_players(api_key)
            for account in master_players['entries']:
                update_or_insert_summoner(account, "master")

        except requests.exceptions.HTTPError as http_err:
            print(f"HTTP error occurred: {http_err}")
        except Exception as err:
            print(f"Other error occurred: {err}")

        # Wait for 1 minute before the next iteration
        time.sleep(10)

main_loop(api_key)


















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
