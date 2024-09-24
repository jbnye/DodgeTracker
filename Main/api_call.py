# pretty print
import pprint
#requests for api
import requests
#honestly no clue, i think its the objects for the enviroment
import os
#needed for hidden api
from dotenv import load_dotenv

load_dotenv()
#getting the api key from the .env
api_key = os.getenv("Riot_Api_Key")

# url1 is new api url for riot, url2 is for the newer api calls
url = "https://americas.api.riotgames.com"
url2 = "https://na1.api.riotgames.com"



# i legit cant do any coding im too dtunk. 09/23/2024 jsut uploadimng for gituhb LOL!
# function to get all challegner players
def test(count):

    getChallengers_path = f"/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5?api_key= {api_key}"
    challenger_players_response = requests.get(url2+getChallengers_path)
    challenger_players = challenger_players_response.json()
    for players in challenger_players['entries']:
        count += 1
    return count

count = 0
count = test(count)
print(count)

#test name
name = "Flying%20Cow/NA1"

#gets the account puuid
account_path = f"/riot/account/v1/accounts/by-riot-id/{name}?api_key={api_key}"
account_response = requests.get(url+account_path)
account_puuid = account_response.json().get("puuid")
print(account_puuid)


#gets the last rnaked matchid they played for ranked
matches_path = f"{url}/lol/match/v5/matches/by-puuid/{account_puuid}/ids?type=ranked&start=0&count=1&api_key={api_key}"
matches_response = requests.get(matches_path)
print(matches_response)
print(matches_response.json())

#gets the summoner ID used for profileicon and to get their accountID and id using their puuid
summoner_path = f"{url2}/lol/summoner/v4/summoners/by-puuid/{account_puuid}?api_key={api_key}"
summoner_response = requests.get(summoner_path)
print(summoner_response)
id = summoner_response.json().get("id")
account_id = summoner_response.json().get("accountId")
profile_icon = summoner_response.json().get("profileIconId")

#gets the ranked data for a summoner, currently retrieving ranked solo queue, tier, rank, and league points
rank_path = f"{url2}/lol/league/v4/entries/by-summoner/{id}?api_key={api_key}"
rank_response = requests.get(rank_path)
rank_response = rank_response.json()[0]
print(rank_response)
summoner_rank = rank_response.get("tier")
summoner_div = rank_response.get("rank")
summoner_lp = repr(rank_response.get("leaguePoints")) #converts to string
print(summoner_rank +" " + summoner_div + " " + summoner_lp)


