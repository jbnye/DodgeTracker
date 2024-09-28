# pretty print
import pprint
#requests for api
import requests
#honestly no clue, i think its the objects for the enviroment
import os
from db_connection import get_db_connection
from datetime import datetime
#getting the api key from the .env
api_key = os.getenv("Riot_Api_Key")

conn = get_db_connection()
cursor = conn.cursor()



def check_summoner_exists(summoner_id):

    check_query = "SELECT leaguePoints, gamesPlayed FROM Summoner WHERE summonerId = %s"
    cursor.execute(check_query, (summoner_id,))
    result = cursor.fetchone()

    return result

def insert_dodge_entry(summoner_id, lp_lost, rank):

    insert_query = """
        INSERT INTO Dodges (summonerId, lpLost, `rank`, date)
        VALUES (%s, %s, %s, %s)
    """
    data = (summoner_id, lp_lost, rank, datetime.now())

    cursor.execute(insert_query, data)

def update_or_insert_summoner(account):

    summoner_id = account['summonerId']
    league_points = account['leaguePoints']
    games_played = account['wins'] + account['losses']
    rank = account['rank']

    result = check_summoner_exists(summoner_id)

    if result:
        db_league_points, db_games_played = result

        if db_league_points != league_points:
            if db_games_played != games_played:
                lp_lost = db_league_points - league_points
                insert_dodge_entry(summoner_id, lp_lost, rank)
            else:
                update_query = """
                    UPDATE Summoner
                    SET leaguePoints = %i, gamesPlayed = %i
                    WHERE summonerId = %s
                """
                cursor.execute(update_query, (league_points, games_played, summoner_id))
    else:
        insert_query = """
            INSERT INTO Summoner (summonerId, leaguePoints, gamesPlayed, `rank`, iconId, summonerLevel, puuId, gameName, tagLine)
            VALUES (%s, %i, %i, %s, %s, %s, %s, %s, %s)
        """
        data = (
            summoner_id,
            league_points,
            games_played,
            rank,
            account.get('iconId', 23),
            account['summonerLevel'],
            account['puuId'],
            account['gameName'],
            account['tagLine']
        )
        cursor.execute(insert_query, data)

# Fetch data from the API
getMasters_path = f"https://na1.api.riotgames.com/lol/league/v4/masterleagues/by-queue/RANKED_SOLO_5x5?api_key={api_key}"
masters_players_response = requests.get(getMasters_path)
masters_players = masters_players_response.json()

# Process each account
for account in masters_players['entries']:
    update_or_insert_summoner(account)


conn.commit()
conn.close()


















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
