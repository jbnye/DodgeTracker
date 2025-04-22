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
import threading

import socketio
#getting the api key from the .env
api_key = os.getenv("Riot_Api_Key")
BATCH_SIZE = 10_000
TIERS = ["master", "grandmaster", "challenger"]


#checks if the summoner is in the database
def checkSummonerExists(cursor,summoner_id, region):
    try:
        check_query = "SELECT leaguePoints, gamesPlayed FROM Summoner WHERE summonerId = %s AND region = %s"
        cursor.execute(check_query, (summoner_id, region))
        result = cursor.fetchone()
        return result
    except Exception as e:
        print(f"Error checking for summoner: {e}")
    
def batchUpdateSummonerSmall(conn, cursor, batch_update_summoner):
    try:
        update_query = """
            UPDATE Summoner
            SET leaguePoints = %s, gamesPlayed = %s, `rank` = %s
            WHERE summonerId = %s AND region = %s
            """
        cursor.executemany(update_query, batch_update_summoner)
        conn.commit()
        # print(f"Updating summoner small: {len(batch_update_summoner)}")
    except Exception as e:
        conn.rollback()
        print(f"Batch insert failed for small update: {e}")
        raise  # Re-raise to handle upstream

#this updates the lp after a dodge -5 or -15
def batchUpdateAccountAfterDodge(conn, cursor, batch_update_after_dodge):
    try:
        update_lp_query = """
        UPDATE Summoner
        SET leaguePoints = %s, iconId = %s, summonerLevel = %s, gameName = %s, tagLine = %s
        WHERE summonerId = %s AND region = %s
        """
        cursor.executemany(update_lp_query, batch_update_after_dodge)
        conn.commit()
        # print(f"I have just updated summoner {summoner_id} to have league_points = {league_points}")
    except Exception as e:
        conn.rollback()
        print(f"Error updating account after dodge: {e}")

# if a dodge has been detected, insert a new entry in the dodge table. Inserts the summonerId, lp lost, the data, the rank, and the lp they were at.
def insertDodgeEntry(summoner_id, lpLost, rank, leaguePoints, summoner_info, region, batch_insert_dodge_entry):
    dodgeDate = datetime.now(timezone.utc)
    data = (summoner_id, lpLost, rank, dodgeDate, leaguePoints, region)
    batch_insert_dodge_entry.append(data)
    # cursor.execute("SELECT LAST_INSERT_ID()")
    # dodgeId = cursor.fetchone()[0]
    data2 = (
        rank,
        leaguePoints,
        lpLost,
        summoner_info['gameName'],
        summoner_info['tagLine'],
        summoner_info['summonerLevel'],
        summoner_info['iconId'],
        dodgeDate,
        # dodgeId,
        region
    )
    notifyNewDodge(data2)
    print(f"A dodge has been recorded: {data2} for {summoner_id}")

def testDodge():
    data = (
        "master",
        100,
        5,
        "TestUser",
        "NA1",
        250,
        "1234",
        datetime.now(timezone.utc),
        "NA"
    )
    notifyNewDodge(data)

def batchInsertDodgeEntry(conn, cursor, batch_insert_dodge_entry):
    if not batch_insert_dodge_entry:
        return
    insert_query = """
        INSERT INTO Dodges (summonerId, lpLost, `rank`, dodgeDate, leaguePoints, region)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
    total_rows = len(batch_insert_dodge_entry)
    try:
        for i in range(0, total_rows, BATCH_SIZE):
            chunk = batch_insert_dodge_entry[i:i + BATCH_SIZE]
            cursor.executemany(insert_query, chunk)
            conn.commit()  # Commit per chunk
            print(f"Inserted {len(chunk)} rows (total: {min(i + BATCH_SIZE, total_rows)}/{total_rows})")
    except Exception as e:
        conn.rollback()
        print(f"Batch insert failed for dodges: {e}")
        raise  # Re-raise to handle upstream

# fetch the account and summoner info and return that data
def fetchSummonerInfo(summoner_id, region):
    summoner_url = {
        "NA": "https://na1.api.riotgames.com",
        "EUW": "https://euw1.api.riotgames.com",
        "KR": "https://kr.api.riotgames.com"
    }

    # account_url = {
    #     "NA": "https://americas.api.riotgames.com",
    #     "EUW": "https://europe.api.riotgames.com",
    #     "KR": "https://asia.api.riotgames.com"
    # } dont think I need region for this api
    try:

        # 1600 requests every 1 minutes
        getSummoner_path = f"{summoner_url[region]}/lol/summoner/v4/summoners/{summoner_id}?api_key={api_key}"
        summoner_response = requests.get(getSummoner_path)
        summoner_response.raise_for_status()
        summoner = summoner_response.json()



        # 1000 requests every 1 minutes
        getAccount_path = f"https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/{summoner['puuid']}?api_key={api_key}"
        account_response = requests.get(getAccount_path)
        account_response.raise_for_status()
        account = account_response.json()

        return {
            "iconId": summoner["profileIconId"],
            "summonerLevel": summoner["summonerLevel"],
            # "puuid": summoner["puuid"],
            "gameName": account["gameName"],
            "tagLine": account["tagLine"],
        }
    except requests.exceptions.HTTPError as http_err:
        if http_err.response.status_code == 429:
            print("Rate limit exceeded. Waiting for 1 minute before retrying...")
            time.sleep(60)
            return fetchSummonerInfo(summoner_id, region)
        raise

def batchInsertAll(conn, cursor, batch_insert_summoner_all):
    if not batch_insert_summoner_all:
        return
    insert_query = """
    INSERT INTO summoner(summonerId, leaguePoints, gamesPlayed, `rank`, iconId, summonerLevel, puuid, gameName, tagLine, region)
    VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)     
    """
    total_rows = len(batch_insert_summoner_all)
    try:
        for i in range(0, total_rows, BATCH_SIZE):
            chunk = batch_insert_summoner_all[i:i + BATCH_SIZE]
            cursor.executemany(insert_query, chunk)
            conn.commit()  # Commit per chunk
            print(f"Inserted {len(chunk)} rows (total: {min(i + BATCH_SIZE, total_rows)}/{total_rows})")
    except Exception as e:
        conn.rollback()
        print(f"Batch summoner all insert failed: {e}")
        raise  # Re-raise to handle upstream





# loop that saves their summonerId, league points, games_played, and rank
# main if else statements to branch out logical paths.
def updateOrInsertSummoner(cursor, account, tier, region, batch_insert_summoner_all, batch_insert_dodge_entry, batch_update_after_dodge, batch_update_summoner):

    summoner_id = account["summonerId"]
    league_points = account["leaguePoints"]
    games_played = account["wins"] + account["losses"]
    rank = tier
    puuid = account["puuid"]

    result = checkSummonerExists( cursor, summoner_id, region)
    if not result:
        account_data = fetchSummonerInfo(summoner_id, region)
        batch_insert_summoner_all.append((summoner_id, league_points, games_played, rank, account_data['iconId'], 
            account_data['summonerLevel'], puuid,account_data['gameName'],account_data['tagLine'], region))
        # print(f"Added {summoner_id} to the database")
    else:
        db_league_points, db_games_played = result
        if db_games_played == games_played:
            if ((db_league_points - league_points) > 0 and (db_league_points - league_points) <= 15):
                account_data = fetchSummonerInfo(summoner_id, region)
                lp_lost = db_league_points - league_points
                # print(f"There is a dodge with {summoner_id} DB LP = {db_league_points} API LP =  {league_points}" )
                batch_update_after_dodge.append((league_points, account_data['iconId'], account_data['summonerLevel'], account_data['gameName'], account_data['tagLine'], summoner_id, region))
                insertDodgeEntry( summoner_id, lp_lost, rank, db_league_points, account_data, region, batch_insert_dodge_entry)
        else:
            batch_update_summoner.append((league_points, games_played, rank, summoner_id, region))


def notifyNewDodge(dodge_data):
    
    dodge_dict = {
        "rank": str(dodge_data[0]),
        "leaguePoints": str(dodge_data[1]),
        "lpLost": str(dodge_data[2]),
        "gameName": str(dodge_data[3]),
        "tagLine": str(dodge_data[4]),
        "summonerLevel": str(dodge_data[5]),
        "iconId": str(dodge_data[6]),
        "dodgeDate": str(dodge_data[7].isoformat()),  # Convert datetime to string in ISO 8601 format
        "region": str(dodge_data[8])
    }

    response = requests.post("http://localhost:5000/api/add-dodge", json = dodge_dict)
    if response.status_code == 200:
        print("Dodge event successfully emitted!") 
    else: 
        print(f"Failed to emit dodge event. Status code: {response.status_code}, Response: {response.text}")

def graceful_exit(signal, frame):
    print("\n[INFO] Exiting gracefully. Closing DB connections...")
    sys.exit(0)

def batch_db_demote(conn, cursor, region, batch_current_set):
    try:
        cursor.execute("""
            CREATE TEMPORARY TABLE IF NOT EXISTS TempSeenSummoners (
                summonerId VARCHAR(64) NOT NULL,
                region VARCHAR(8) NOT NULL,
                PRIMARY KEY (summonerId, region)
            );
        """)
        cursor.execute("TRUNCATE TABLE TempSeenSummoners")

        seen_data = [(summoner_id, region) for summoner_id in batch_current_set]
        cursor.executemany("INSERT INTO TempSeenSummoners (summonerId, region) VALUES (%s, %s)", seen_data)
        conn.commit()

        cursor.execute("""
            UPDATE Summoner s
            LEFT JOIN TempSeenSummoners t
            ON s.summonerId = t.summonerId AND s.region = t.region
            SET s.rank = 'demoted'
            WHERE s.region = %s AND t.summonerId IS NULL;
        """, (region,))
        conn.commit()

        print(f"[INFO] Demoted all {region} summoners not seen in this batch.")
    except Exception as e:
        conn.rollback()
        print(f"[ERROR] Demotion failed: {e}")


def fetch_all_players(api_key, region, tier):
    base_url = {
        "NA": "https://na1.api.riotgames.com",
        "EUW": "https://euw1.api.riotgames.com",
        "KR": "https://kr.api.riotgames.com"
    }
    url = f"{base_url[region]}/lol/league/v4/{tier}leagues/by-queue/RANKED_SOLO_5x5?api_key={api_key}"

    try:
        start = time.perf_counter()
        response = requests.get(url, timeout=10)
        print(f"Fetch time to {region} for {tier}: {time.perf_counter() - start:.2f}s")
        response.raise_for_status()  # Raises HTTPError for 4XX/5XX
        return response.json()
    except requests.exceptions.Timeout:
        print(f"⏳ Timeout fetching {region}/{tier} - server too slow")
        return None
    except requests.exceptions.HTTPError as e:
        print(f"❌ HTTP error fetching {region}/{tier}: {e}")
        return None  

def parseRegion(api_key, region):
    print(f"[THREAD] Starting processing for {region}")
    conn = get_db_connection()
    cursor = conn.cursor()
    counter = 0  # For demotion batching

    batch_insert_summoner_all = []
    batch_update_after_dodge = []
    batch_insert_dodge_entry = []
    batch_update_summoner = []
    batch_current_set = []

    for tier in TIERS:
        try:
            accounts = fetch_all_players(api_key, region, tier)
            if accounts and "entries" in accounts:
                for account in accounts["entries"]:
                    if counter == 10:
                        batch_current_set.append(account["summonerId"])

                    updateOrInsertSummoner(
                        cursor,
                        account,
                        tier,
                        region,
                        batch_insert_summoner_all,
                        batch_insert_dodge_entry,
                        batch_update_after_dodge,
                        batch_update_summoner,
                    )
        except Exception as e:
            print(f"[{region}] Error processing {tier}: {e}")
            conn.rollback()

        # Perform batch DB operations
        batchInsertAll(conn, cursor, batch_insert_summoner_all)
        batchUpdateSummonerSmall(conn, cursor, batch_update_summoner)
        batchUpdateAccountAfterDodge(conn, cursor, batch_update_after_dodge)
        batchInsertDodgeEntry(conn, cursor, batch_insert_dodge_entry)
        if counter == 0:
            batch_db_demote(conn, cursor, region, batch_current_set)

        print(f"[{region}] Sleeping 10s for next iteration...")
        counter = 0 if counter == 10 else counter + 1
        time.sleep(10)  # Sleep but responsive to stop_event

    cursor.close()
    conn.close()
    print(f"[THREAD] {region} thread stopped")



def main():
    REGIONS = ["NA", "EUW"]
    threads = []

    for region in REGIONS:
        thread = threading.Thread(target=parseRegion, args=(api_key, region))
        thread.start()
        threads.append(thread)

    for t in threads:
        t.join()

    print("[INFO] All threads have stopped. Exiting main.")

if __name__ == "__main__":
    main()


# sio.disconnect()







# def fetch_challenger_players(api_key, region):
#     url = f"https://na1.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5?api_key={api_key}"
#     response = requests.get(url)
#     response.raise_for_status()  # Raise an error for bad status codes
#     return response.json()

# def fetch_grandmaster_players(api_key, region):
#     url = f"https://na1.api.riotgames.com/lol/league/v4/grandmasterleagues/by-queue/RANKED_SOLO_5x5?api_key={api_key}"
#     response = requests.get(url)
#     response.raise_for_status()  # Raise an error for bad status codes
#     return response.json()

# def fetch_master_players(api_key, region):
#     url = f"https://na1.api.riotgames.com/lol/league/v4/masterleagues/by-queue/RANKED_SOLO_5x5?api_key={api_key}"
#     response = requests.get(url)
#     response.raise_for_status()  # Raise an error for bad status codes
#     return response.json()





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
