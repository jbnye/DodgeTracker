# pretty print
import pprint
#requests for api
import requests
#honestly no clue, i think its the objects for the enviroment
import os
import time
from db_connection import get_db_connection
from datetime import datetime, timezone

import socketio


def notify_new_dodge():
    
    dodge_dict = {
        "rank": "master",
        "leaguePoints": "120",
        "lpLost": "5",
        "gameName": "Fachizzle",
        "tagLine": "NA",
        "summonerLevel": "200",
        "iconId": "32",
        "timeDifference": "Just Now"  # Convert datetime to string in ISO 8601 format
    }

    response = requests.post("http://localhost:5000/api/add-dodge", json = dodge_dict)
    if response.status_code == 200:
        print("Dodge event successfully emitted!") 
    else: 
        print(f"Failed to emit dodge event. Status code: {response.status_code}, Response: {response.text}")

notify_new_dodge()