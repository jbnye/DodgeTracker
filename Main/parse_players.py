# pretty print
import pprint
#requests for api
import requests
#honestly no clue, i think its the objects for the enviroment
import os
import db
#getting the api key from the .env
api_key = os.getenv("Riot_Api_Key")


# function to get all masters players
def test(leaderboard):

    getMasters_path = f"https://na1.api.riotgames.com/lol/league/v4/masterleagues/by-queue/RANKED_SOLO_5x5?api_key={api_key}"
    masters_players_response = requests.get(getMasters_path)
    masters_players = masters_players_response.json()
    for account in masters_players['entries']:
        leaderboard.append(account['leaguePoints'])

leaderboard = []
test(leaderboard)
leaderboard.sort(reverse=True)
print(leaderboard)

