
import pprint
import requests
from requests.exceptions import HTTPError, RequestException
import os
import time
from db_connection import get_db_connection
from datetime import datetime, timezone
import signal
import sys
import threading
import json
import socketio
from dotenv import load_dotenv
load_dotenv() 

#getting the api key from the .env
api_key = os.getenv("Riot_Api_Key")
BATCH_SIZE = 10_000
TIERS = ["master", "grandmaster", "challenger"]
REGIONS = ["NA", "EUW"]


def cleanup_everything():
    # Close MySQL pooled connections if needed
    try:
        import mysql.connector
        mysql.connector.connection.MySQLConnection.disconnect = lambda self: None
    except Exception as e:
        print(f"[WARN] Failed to patch MySQL connection: {e}")
def safe_post(url, json=None, headers=None, timeout=10):
    try:
        response = requests.post(url, json=json, headers=headers, timeout=timeout)
        response.close()  # Always close the response
        return response
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Safe post to {url} failed: {e}")
#         return None


#checks if the summoner is in the database
def checkSummonerExists(cursor, summoner_id, region):
    try:
        query = """
        SELECT leaguePoints, gamesPlayed, `rank`
        FROM Summoner
        WHERE summonerId = %s AND region = %s
        """
        cursor.execute(query, (summoner_id, region))
        return cursor.fetchone()
    except Exception as e:
        print(f"[ERROR] Error checking summoner: {e}")
        checkSummonerExists(cursor, summoner_id, region)
        return None
    
def batchUpdateSummonerSmall(conn, cursor, batch_update_summoner):
    if not batch_update_summoner:
        return

    update_query = """
        UPDATE Summoner
        SET leaguePoints = %s, gamesPlayed = %s, `rank` = %s
        WHERE summonerId = %s AND region = %s
    """

    try:
        cursor.executemany(update_query, batch_update_summoner)
        conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"[ERROR] Batch update failed for small update: {e}")
        # # Fallback to row-by-row
        # for entry in batch_update_summoner:
        #     try:
        #         cursor.execute(update_query, entry)
        #         if cursor.rowcount == 0:
        #             # Update didn't affect any row
        #             summoner_id = entry[3]
        #             region = entry[4]
        #             log_db_error(conn, "UpdateSummonerSmall-RowcountZero", summoner_id, region, entry, "Row not updated")
        #         conn.commit()
        #     except Exception as single_error:
        #         conn.rollback()
        #         summoner_id = entry[3]
        #         region = entry[4]
        #         log_db_error(conn, "UpdateSummonerSmall-Exception", summoner_id, region, entry, str(single_error))

#this updates the lp after a dodge -5 or -15
def batchUpdateAccountAfterDodge(conn, cursor, batch_update_after_dodge):
    if not batch_update_after_dodge:
        return

    update_lp_query = """
        UPDATE Summoner
        SET leaguePoints = %s, iconId = %s, summonerLevel = %s, gameName = %s, tagLine = %s
        WHERE summonerId = %s AND region = %s
    """

    try:
        cursor.executemany(update_lp_query, batch_update_after_dodge)
        conn.commit()
        if cursor.rowcount == 0:
            print(f"[ERROR] Update failed for {batch_update_after_dodge}")  # log problematic entry
    except Exception as e:
        conn.rollback()
        print(f"[ERROR] Batch update failed after dodge: {e}")
        
        # # Fallback to row-by-row with proper error handling
        # for i, entry in enumerate(batch_update_after_dodge):
        #     try:
        #         cursor.execute(update_lp_query, entry)
        #         if cursor.rowcount == 0:
        #             # Safely get summoner_id and region with bounds checking
        #             summoner_id = entry[5] if len(entry) > 5 else None
        #             region = entry[6] if len(entry) > 6 else None
                    
        #             # Create new cursor for logging to avoid connection issues
        #             with conn.cursor() as log_cursor:
        #                 log_db_error(
        #                     conn=conn,
        #                     cursor=log_cursor,
        #                     error_type="UpdateAfterDodgeError-RowcountZero",
        #                     summoner_id=summoner_id,
        #                     region=region,
        #                     entry=str(entry),
        #                     message="Row not updated"
        #                 )
        #         conn.commit()
                
        #     except Exception as single_error:
        #         conn.rollback()
        #         summoner_id = entry[5] if len(entry) > 5 else None
        #         region = entry[6] if len(entry) > 6 else None
                
        #         with conn.cursor() as log_cursor:
        #             log_db_error(
        #                 conn=conn,
        #                 cursor=log_cursor,
        #                 error_type="UpdateAfterDodgeError-Exception",
        #                 summoner_id=summoner_id,
        #                 region=region,
        #                 entry=str(entry),
        #                 message=str(single_error)
        #             )
        #         print(f"[WARNING] Failed to update entry {i}: {single_error}")

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
    # print(f"A dodge has been recorded: {data2} for {summoner_id} at {datetime.now().isoformat()}")

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
            # print(f"Inserted {len(chunk)} rows (total: {min(i + BATCH_SIZE, total_rows)}/{total_rows})")
    except Exception as e:
        conn.rollback()
        batchInsertDodgeEntry(conn, cursor, batch_insert_dodge_entry)
        # print(f"[ERROR] Batch insert failed, falling back to row-by-row: {e}")
        # # Try each individually to log bad entries
        # for entry in chunk:
        #     try:
        #         cursor.execute(insert_query, entry)
        #         conn.commit()
        #     except Exception as single_error:
        #         conn.rollback()
        #         summoner_id = entry[0]
        #         region = entry[-1]
        #         log_db_error(cursor, "InsertDodgeError", summoner_id, region, entry, str(single_error))


# fetch the account and summoner info and return that data
def fetchSummonerInfo(summoner_id, region):
    summoner_url = {
        "NA": "https://na1.api.riotgames.com",
        "EUW": "https://euw1.api.riotgames.com",
        "KR": "https://kr.api.riotgames.com"
    }
    try:
        getSummoner_path = f"{summoner_url[region]}/lol/summoner/v4/summoners/{summoner_id}?api_key={api_key}"
        summoner_response = requests.get(getSummoner_path)
        summoner_response.raise_for_status()
        summoner = summoner_response.json()
        
    except HTTPError as http_err:
        if http_err.response and http_err.response.status_code == 429:
            print("[WARN] Summoner API Rate limit exceeded. Sleeping 60s...")
            time.sleep(60)
            return fetchSummonerInfo(summoner_id, region)
        else:
            print(f"[ERROR] Summoner API HTTP error: {http_err}")
            return None
    except RequestException as conn_err:
        print(f"[ERROR] Summoner API connection error: {conn_err}")
        return None
    except Exception as e:
        print(f"[ERROR] Summoner API unexpected error: {e}")
        return None
    
    try:
        getAccount_path = f"https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/{summoner['puuid']}?api_key={api_key}"
        account_response = requests.get(getAccount_path)
        account_response.raise_for_status()
        account = account_response.json()
        
    except HTTPError as http_err:
        if http_err.response and http_err.response.status_code == 429:
            print("[WARN] Account API Rate limit exceeded. Sleeping 60s...")
            time.sleep(60)
            return fetchSummonerInfo(summoner_id, region)
        else:
            print(f"[ERROR] Account API HTTP error: {http_err}")
            return None
    except RequestException as conn_err:
        print(f"[ERROR] Account API connection error: {conn_err}")
        return None
    except Exception as e:
        print(f"[ERROR] Account API unexpected error: {e}")
        return None

    # Success
    return {
        "iconId": summoner["profileIconId"],
        "summonerLevel": summoner["summonerLevel"],
        "gameName": account["gameName"],
        "tagLine": account["tagLine"],
    }

def batchInsertAll(conn, cursor, batch_insert_summoner_all):
    if not batch_insert_summoner_all:
        return
    upsert_query = """
    INSERT INTO summoner (
        summonerId, leaguePoints, gamesPlayed, `rank`, 
        iconId, summonerLevel, puuid, gameName, tagLine, region
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE
        leaguePoints = VALUES(leaguePoints),
        gamesPlayed = VALUES(gamesPlayed),
        `rank` = VALUES(`rank`),
        iconId = VALUES(iconId),
        summonerLevel = VALUES(summonerLevel),
        gameName = VALUES(gameName),
        tagLine = VALUES(tagLine),
        lastUpdated = NOW()
    """
    total_rows = len(batch_insert_summoner_all)
    try:
        for i in range(0, total_rows, BATCH_SIZE):
            chunk = batch_insert_summoner_all[i:i + BATCH_SIZE]
            cursor.executemany(upsert_query, chunk)
            conn.commit()  # Commit per chunk
            # print(f"Inserted {len(chunk)} rows (total: {min(i + BATCH_SIZE, total_rows)}/{total_rows})")
    except Exception as e:
        conn.rollback()
        print(f"Batch summoner all insert failed: {e}")
        batchInsertAll(conn, cursor, batch_insert_summoner_all)
        raise  # Re-raise to handle upstream

def fetchSummonerInfo(summoner_id, region, retries=3):
    summoner_url = {
        "NA": "https://na1.api.riotgames.com",
        "EUW": "https://euw1.api.riotgames.com",
        "KR": "https://kr.api.riotgames.com"
    }
    
    for attempt in range(retries):
        try:
            getSummoner_path = f"{summoner_url[region]}/lol/summoner/v4/summoners/{summoner_id}?api_key={api_key}"
            summoner_response = requests.get(getSummoner_path, timeout=10)
            summoner_response.raise_for_status()
            summoner = summoner_response.json()
            break  # success
        except HTTPError as http_err:
            if http_err.response.status_code == 429:
                print("[WARN] Summoner API rate limit. Sleeping 60s...")
                time.sleep(60)
                continue
            elif http_err.response.status_code in (404, 403):
                print(f"[ERROR] Summoner not found or forbidden: {http_err}")
                return None
            else:
                print(f"[ERROR] Summoner HTTP error: {http_err}")
                return None
        except (requests.Timeout, requests.ConnectionError) as conn_err:
            print(f"[WARN] Summoner connection error, attempt {attempt+1}/{retries}: {conn_err}")
            time.sleep(10)
        except Exception as e:
            print(f"[ERROR] Summoner unexpected error: {e}")
            return None
    else:
        print("[FATAL] Summoner API completely failed after retries.")
        return None

    # --- Now same thing for the account request ---
    for attempt in range(retries):
        try:
            getAccount_path = f"https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/{summoner['puuid']}?api_key={api_key}"
            account_response = requests.get(getAccount_path, timeout=10)
            account_response.raise_for_status()
            account = account_response.json()
            break
        except HTTPError as http_err:
            if http_err.response.status_code == 429:
                print("[WARN] Account API rate limit. Sleeping 60s...")
                time.sleep(60)
                continue
            elif http_err.response.status_code in (404, 403):
                print(f"[ERROR] Account not found or forbidden: {http_err}")
                return None
            else:
                print(f"[ERROR] Account HTTP error: {http_err}")
                return None
        except (requests.Timeout, requests.ConnectionError) as conn_err:
            print(f"[WARN] Account connection error, attempt {attempt+1}/{retries}: {conn_err}")
            time.sleep(10)
        except Exception as e:
            print(f"[ERROR] Account unexpected error: {e}")
            return None
    else:
        print("[FATAL] Account API completely failed after retries.")
        return None

    return {
        "iconId": summoner["profileIconId"],
        "summonerLevel": summoner["summonerLevel"],
        "gameName": account["gameName"],
        "tagLine": account["tagLine"],
    }


def log_db_error(conn, error_type, summoner_id, region, data, message):
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO ErrorLog (errorType, summonerId, region, data, errorMessage)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            error_type,
            summoner_id,
            region,
            json.dumps(data, default=str),
            message
        ))
        cursor.connection.commit()
    except Exception as log_err:
        print(f"[FATAL] Failed to log error: {log_err}")


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
        db_league_points, db_games_played, db_rank = result
        if db_league_points == league_points and db_games_played == games_played and db_rank == rank:
            return
        if db_games_played == games_played:
            if ((db_league_points - league_points) > 0 and (db_league_points - league_points) <= 15):
                now_utc = datetime.now(timezone.utc)
                account_data = fetchSummonerInfo(summoner_id, region)
                lp_lost = db_league_points - league_points
                recent = checkLastDodge(cursor, summoner_id, region)
                if recent:
                    last_dodge, last_league_points, last_lp_lost = recent
                    time_since_last = (now_utc - last_dodge).total_seconds()
                    if(lp_lost  <= 5):
                        if(lp_lost == last_lp_lost and time_since_last < 43200):
                            return
                    else:
                        if(lp_lost == last_lp_lost and time_since_last < 1800):
                            return

                print(f"There is a dodge with {summoner_id} DB LP = {db_league_points} API LP =  {league_points}" )
                batch_update_after_dodge.append((league_points, account_data['iconId'], account_data['summonerLevel'], account_data['gameName'], account_data['tagLine'], summoner_id, region))
                insertDodgeEntry(summoner_id, lp_lost, rank, db_league_points, account_data, region, batch_insert_dodge_entry)
        
            if rank != db_rank:
                batch_update_summoner.append((league_points, games_played, rank, summoner_id, region))
        else:
            batch_update_summoner.append((league_points, games_played, rank, summoner_id, region))

def checkLastDodge(cursor, summoner_id, region):
    try:
        check_last_dodge = """
        SELECT dodgeDate, leaguePoints, lpLost  FROM Dodges WHERE summonerId = %s AND region = %s ORDER BY dodgeDate DESC LIMIT 1
        """
        cursor.execute(check_last_dodge, (summoner_id, region))
        result = cursor.fetchone()
        if result:
            last_dodge = result[0]
            leaguePoints = result[1]
            lpLost = result[2]

            if last_dodge.tzinfo is None:  # If naive datetime
                last_dodge = last_dodge.replace(tzinfo=timezone.utc)
            return last_dodge, leaguePoints, lpLost
        else:
            return None
    except Exception as e:
        print(f"[ERROR] Error checking summoner last dodge date: {e}")
        return None
    


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

    resp = safe_post("http://localhost:5000/api/add-dodge", json=dodge_dict)
    if resp.status_code == 200:
        print(f"Dodge event successfully emitted!") 
    else: 
        print(f"Failed to emit dodge event. Status code: {resp.status_code}, Response: {resp.text}")

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

        seen_data = [(summoner_id, region) for (summoner_id, tier) in batch_current_set]
        cursor.executemany("INSERT INTO TempSeenSummoners (summonerId, region) VALUES (%s, %s)", seen_data)
        conn.commit()

        cursor.execute("""
            UPDATE Summoner s
            LEFT JOIN TempSeenSummoners t
            ON s.summonerId = t.summonerId AND s.region = t.region
            SET s.rank = 'DEMOTED'
            WHERE s.region = %s
            AND t.summonerId IS NULL
            AND s.rank IN ('MASTER', 'GRANDMASTER', 'CHALLENGER');
        """, (region,))
        conn.commit()

        updateRegionCount(conn, cursor, region, batch_current_set)

        print(f"[INFO] Demoted all {region} summoners not seen in this batch.")
    except Exception as e:
        conn.rollback()
        print(f"[ERROR] Demotion failed: {e}")
        batch_db_demote(conn, cursor, region, batch_current_set)

def updateRegionCount(conn, cursor, region, batch_current_set):

    try:
        tiers = {}
        for (_, tier) in batch_current_set:
            tiers[tier] = tiers.get(tier, 0) + 1
        
        for tier, count in tiers.items():
            cursor.execute("""
                INSERT INTO regions (region, `rank`, totalNum)
                VALUES (%s, %s, %s)
                ON DUPLICATE KEY UPDATE
                    totalNum = VALUES(totalNum),
                    last_updated = NOW()
            """, (region, tier, count))
        conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"[ERROR] Updating region count failure: {e}")




def fetch_all_players(api_key, region, tier, stop_event):
    if stop_event.is_set():
        return None

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
        if stop_event.is_set():
            return None
        response.raise_for_status()
        return response.json()
    except requests.exceptions.Timeout:
        print(f"⏳ Timeout fetching {region}/{tier}")
        return None
    except requests.exceptions.HTTPError as e:
        print(f"❌ HTTP error fetching {region}/{tier}: {e}")
        return None

def parseRegion(api_key, region, stop_event):
    print(f"[THREAD] Starting processing for {region}")
    conn = get_db_connection()  # Your DB connection
    cursor = conn.cursor()
    counter = 0

    try:
        while not stop_event.is_set():
            batch_insert_summoner_all = []
            batch_update_after_dodge = []
            batch_insert_dodge_entry = []
            batch_update_summoner = []
            batch_current_set = []

            for tier in TIERS:
                if stop_event.is_set():
                    break

                accounts = fetch_all_players(api_key, region, tier, stop_event)
                if stop_event.is_set():
                    break

                if accounts and "entries" in accounts:
                    for account in accounts["entries"]:
                        if stop_event.is_set():
                            break
                        if counter == 10:
                            batch_current_set.append((account["summonerId"], tier))

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

            batchInsertAll(conn, cursor, batch_insert_summoner_all)
            batchUpdateSummonerSmall(conn, cursor, batch_update_summoner)
            batchUpdateAccountAfterDodge(conn, cursor, batch_update_after_dodge)
            # checkLp(cursor,batch_update_after_dodge)
            batchInsertDodgeEntry(conn, cursor, batch_insert_dodge_entry)

            if counter == 10:
                batch_db_demote(conn, cursor, region, batch_current_set)

            counter = 0 if counter == 10 else counter + 1
            safe_post(f"http://localhost:5000/api/last-checked?region={region}")
            # Sleep 10s in small steps to allow Ctrl+C break
            for _ in range(10):
                if stop_event.is_set():
                    break
                time.sleep(1)

    except Exception as e:
        print(f"[ERROR] {region} thread crashed: {e}")
    finally:
        cursor.close()
        conn.close()
        print(f"[THREAD] {region} thread stopped")

def checkLp(cursor, batch_update_after_dodge):
    if batch_update_after_dodge is None:
        return

    for each in batch_update_after_dodge:
        try:
            check_lp_query = """
                SELECT leaguePoints FROM SUMMONER WHERE summonerId = %s AND region = %s
            """
            summoner_id, region = each[5], each[6]
            cursor.execute(check_lp_query, (summoner_id, region))
            result = cursor.fetchone()
            print(f"Summoner {each[3] + each[4]} : {summoner_id} has dodged and should have lp: {each[0]}")
            print(f"The result of the query shows lp as: {result}")
        except Exception as e:
            print(f"Error checking for summoner in checkLp: {e}")


def main():
    threads = []
    stop_event = threading.Event()

    def handle_sigint(sig, frame):
        print("[INFO] Ctrl+C detected. Stopping all threads...")
        stop_event.set()

    signal.signal(signal.SIGINT, handle_sigint)

    for region in REGIONS:
        thread = threading.Thread(target=parseRegion, args=(api_key, region, stop_event))
        thread.start()
        threads.append(thread)

    try:
        while any(t.is_alive() for t in threads):
            time.sleep(0.5)
    except KeyboardInterrupt:
        stop_event.set()
    finally:
        for t in threads:
            t.join(timeout=10)  # Max wait 10s per thread
        print("[Main] All threads stopped cleanly. Exiting.")

    sys.exit(0)

if __name__ == "__main__":
    main()
    

    # Close other libraries if needed
    # Example: requests session close, sockets, etc


# sio.disconnect()
