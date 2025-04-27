
#honestly no clue, i think its the objects for the enviroment
import os
#needed for hidden api
from dotenv import load_dotenv
load_dotenv()
import mysql.connector
from mysql.connector import Error

try:
    connection = mysql.connector.connect(

        #server ip address
        host = os.getenv("hostName"),
        user = os.getenv("user"),
        password = os.getenv("password"),
        database = "DodgeTracker"
    )   
    if connection.is_connected():
        print("Successfully connected to the database")

        # Creating a cursor object
        cursor = connection.cursor()

        # SQL command to create Summoner table
        create_summoner_table = """
        CREATE TABLE IF NOT EXISTS Summoner (
            summonerId VARCHAR(255) PRIMARY KEY,
            icon VARCHAR(255),
            leaguePoints INT,
            gamesPlayed INT,
            `rank` VARCHAR(255),
            iconId INT,
            summonerLevel INT,
            puuId VARCHAR(255),
            gameName VARCHAR(255),
            tagLine VARCHAR(255)
        )
        """
        cursor.execute(create_summoner_table)

        print("Table 'Summoner' created successfully!")

        # SQL command to create Dodges table
        create_dodges_table = """
        CREATE TABLE IF NOT EXISTS Dodges (
            dodgeId INT AUTO_INCREMENT PRIMARY KEY,
            summonerId VARCHAR(255),
            lpLost INT,
            `rank` VARCHAR(255),
            timestamp DATETIME,
            leaguePoints INT,
            FOREIGN KEY (summonerId) REFERENCES Summoner(summonerId)
        )
        """
        cursor.execute(create_dodges_table)
        print("Table 'Dodges' created successfully!")

except Error as e:
    print(f"Error: {e}")

finally:
    if connection.is_connected():
        cursor.close()
        connection.close()
        print("MySQL connection is closed")



# CREATE INDEX idx_summoner_id_region ON Summoner(summonerId, region);
# CREATE INDEX idx_game_name_tagline_region ON Summoner(gameName, tagLine, region);
# CREATE INDEX idx_dodge_summoner_region ON Dodges(summonerId, region);
# CREATE INDEX idx_dodge_id ON Dodges(dodgeId DESC);
# CREATE INDEX idx_last_seen ON Summoner(lastSeen);
# ALTER TABLE Dodges 
# ADD INDEX idx_summoner_region_dodge_date (summonerId, region, dodgeDate DESC);
# ALTER TABLE summoner 
# ADD INDEX idx_leaguetier_region (leagueTier, region);
