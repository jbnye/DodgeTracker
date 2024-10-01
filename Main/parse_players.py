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
    return result


def update_summoner_info(summoner_id):

    getSummoner_path = f"https://na1.api.riotgames.com/lol/summoner/v4/summoners/{summoner_id}?api_key={api_key}"
    summoner_response = requests.get(getSummoner_path)
    summoner = summoner_response.json()
    summoner_puuid = summoner["puuid"]
    summoner_account_id = summoner["accountId"]
    summoner_profile_icon = summoner["profileIconId"]
    summoner_level = summoner["summonerLevel"]


    getAccount_path = f"https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/{summoner_puuid}?api_key={api_key}"
    account_response = requests.get(getAccount_path)
    account = account_response.json()
    account_game_name = account["gameName"]
    account_tagLine = account["tagline"]

    update_query = """
        UPDATE Summoner
        SET
            iconId = %s,
            summonerLevel = %s,
            puuId = %s,
            gameName = %s,
            tagLine = %s
        WHERE summonerId = %s    
    """
    data = (summoner_profile_icon,summoner_level, summoner_puuid, account_game_name, account_tagLine, summoner_id)

    cursor.execute(update_query, data)



# if a dodge has been detected, insert a new entry in the dodge table. Inserts the summonerId, lp lost, the data, the rank, and the lp they were at.
def insert_dodge_entry(summoner_id, lp_lost, rank, league_points):
    
    insert_query = """
        INSERT INTO Dodges (summonerId, lpLost, `rank`, leaguePoints, date)
        VALUES (%s, %s, %s, %s, %s)
    """
    data = (summoner_id, lp_lost, rank,league_points, datetime.now())
    print(data)
    cursor.execute(insert_query, data)



# loop that saves their summonerId, league points, games_played, and rank
# main if else statements to branch out logical paths.
def update_or_insert_summoner(account, tier):

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
                update_summoner_info(summoner_id)

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



getChallenger_path = f"https://na1.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5?api_key={api_key}"
challenger_players_response = requests.get(getChallenger_path)
#saves challegner json League data
challenger_players = challenger_players_response.json()


getGrandmasters_path = f"https://na1.api.riotgames.com/lol/league/v4/grandmasterleagues/by-queue/RANKED_SOLO_5x5?api_key={api_key}"
grandmaster_players_response = requests.get(getGrandmasters_path)
#saves grandmaster json League data
grandmaster_players = grandmaster_players_response.json()

#api call for masters
getMasters_path = f"https://na1.api.riotgames.com/lol/league/v4/masterleagues/by-queue/RANKED_SOLO_5x5?api_key={api_key}"
master_players_response = requests.get(getMasters_path)
#saves masters json League data
master_players = master_players_response.json()



#Main section for starting the alogrithm atm just for challenger players
for account in challenger_players['entries']:
    update_or_insert_summoner(account, "challenger")

#Main section for starting the alogrithm atm just for grandmaster players
for account in grandmaster_players['entries']:
    update_or_insert_summoner(account, "grandmaster")

#Main section for starting the alogrithm atm just for master players
for account in master_players['entries']:
    update_or_insert_summoner(account, "master")



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
