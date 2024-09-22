import pprint
import requests

api_key = "RGAPI-ee366c81-c961-4eb2-a916-a77c2cb04561"
#api_key =  "RGAPI-8e66f881-a52e-4ac5-a222-4a91fad3015c"

url = "https://americas.api.riotgames.com/"
id = "Flying%20Cow/NA1"
account_path = f"riot/account/v1/accounts/by-riot-id/{id}?api_key={api_key}"
print(url+account_path)
response = requests.get(url+account_path)
# print(response.json().get("puuid"))
account_puuid = response.json().get("puuid")

matches_path = f"{url}lol/match/v5/matches/by-puuid/{account_puuid}/ids?type=ranked&start=0&count=1&api_key={api_key}"
#print(matches_path)
#print("https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/IVga1cf6XMrNUogvgZMghwMwzDXcquSA40azk0rNPTfKGJCq9O-4lskw2sww5XqYi--ntlIV0UANpQ/ids?start=0&count=20&api_key=RGAPI-ee366c81-c961-4eb2-a916-a77c2cb04561")
response  = requests.get("https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/IVga1cf6XMrNUogvgZMghwMwzDXcquSA40azk0rNPTfKGJCq9O-4lskw2sww5XqYi--ntlIV0UANpQ/ids?start=0&count=1&api_key=RGAPI-ee366c81-c961-4eb2-a916-a77c2cb04561")
print(response.json())
lp_path = f""