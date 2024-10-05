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


conn = get_db_connection()
cursor = conn.cursor()




# function to check if the summoner exists. Search the summonerId in the database and fetch the results and send back to update or insert
def check_summoner_exists(summoner_id):

    check_query = "SELECT leaguePoints, gamesPlayed FROM Summoner WHERE summonerId = %s"
    cursor.execute(check_query, (summoner_id,))
    result = cursor.fetchone()
    return result


def update_summoner_info(summoner_id):


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

        data = ( summoner_profile_icon, summoner_level, summoner_puuid, account_game_name, account_tagLine)

        return data


    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
        print(f"Response content: {summoner_response.content if 'summoner_response' in locals() else 'No response'}")
    except Exception as err:
        print(f"Other error occurred: {err}")
        print(f"Response content: {summoner_response.content if 'summoner_response' in locals() else 'No response'}")


# loop that saves their summonerId, league points, games_played, and rank
# main if else statements to branch out logical paths.
def insert_summoner(account, tier):

    summoner_id = account['summonerId']
    league_points = account['leaguePoints']
    games_played = account['wins'] + account['losses']
    rank = tier

    # take the result of checking if the summoenr is in the database already.
    result = check_summoner_exists(summoner_id)


    # if else logic path to see what must be done with the result of if the summoner is in the database
    #if the summoner is in the database, check to see if their lp is the same, if it is go next. If their lp is not the same check their games played, if it is different update the database. If the games played is the same, create and execute dodge function to enter dodge info into the database.
    if not result:

        account_data = update_summoner_info(summoner_id)
        insert_query = """
            INSERT INTO Summoner (summonerId, leaguePoints, gamesPlayed, `rank`, iconId, puuId, gameName, tagLine)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        data = (
            summoner_id,
            league_points,
            games_played,
            rank,
            account_data[0],
            account[1],
            account_data[2],
            account_data[3],
            account_data[4]
        )
        cursor.execute(insert_query, data)


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


#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#


#worked on the sql database to better enahnce looksups.
def populate_NA(api_key):
        try:
            # Fetch and process challenger players
            challenger_players = fetch_challenger_players(api_key)
            for account in challenger_players['entries']:
                insert_summoner(account, "challenger")

            # Fetch and process grandmaster players
            grandmaster_players = fetch_grandmaster_players(api_key)
            for account in grandmaster_players['entries']:
                insert_summoner(account, "grandmaster")

            # Fetch and process master players
            master_players = fetch_master_players(api_key)
            for account in master_players['entries']:
                insert_summoner(account, "master")

        except requests.exceptions.HTTPError as http_err:
            print(f"HTTP error occurred: {http_err}")
        except Exception as err:
            print(f"Other error occurred: {err}")

populate_NA(api_key)
conn.commit()
conn.close()