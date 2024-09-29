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


# function to check if the summoner exists. Search the summonerId in the database and fetch the results and send back to update or insert
def check_summoner_exists(summoner_id):

    check_query = "SELECT leaguePoints, gamesPlayed FROM Summoner WHERE summonerId = %s"
    cursor.execute(check_query, (summoner_id,))
    result = cursor.fetchone()
    print(result)
    return result


# if a dodge has been detected, insert a new entry in the dodge table. Inserts the summonerId, lp lost, the data, the rank, and the lp they were at.
def insert_dodge_entry(summoner_id, lp_lost, rank, league_points):
    
    insert_query = """
        INSERT INTO Dodges (summonerId, lpLost, `rank`, leaguePoints, date)
        VALUES (%s, %s, %s, %s, %s)
    """
    data = (summoner_id, lp_lost, rank,league_points, datetime.now())

    cursor.execute(insert_query, data)



# loop that saves their summonerId, league points, games_played, and rank
# main if else statements to branch out logical paths.
def update_or_insert_summoner(account):

    summoner_id = account['summonerId']
    league_points = account['leaguePoints']
    games_played = account['wins'] + account['losses']
    rank = account['rank']

    # take the result of checking if the summoenr is in the database already.
    result = check_summoner_exists(summoner_id)


    # if else logic path to see what must be done with the result of if the summoner is in the database
    #if the summoner is in the database, check to see if their lp is the same, if it is go next. If their lp is not the same check their games played, if it is different update the database. If the games played is the same, create and execute dodge function to enter dodge info into the database.
    if result:
        db_league_points, db_games_played = result

        if db_league_points != league_points: #there was a change in lp
            if db_games_played != games_played: #there was a game played, update database for rank, lp, and 
                update_query = """
                UPDATE Summoner
                SET leaguePoints = %i, gamesPlayed = %i, `rank` = %s
                WHERE summonerId = %s
                """
                cursor.execute(update_query, (league_points, games_played, rank, summoner_id)) # update database entry for the summonerId
            else:
                lp_lost = db_league_points - league_points
                insert_dodge_entry(summoner_id, lp_lost, rank, league_points)
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

#api call for masters
getMasters_path = f"https://na1.api.riotgames.com/lol/league/v4/masterleagues/by-queue/RANKED_SOLO_5x5?api_key={api_key}"
masters_players_response = requests.get(getMasters_path)
#saves masters json League data
masters_players = masters_players_response.json()

#Main section for starting the alogrithm atm jsut for masters players
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
