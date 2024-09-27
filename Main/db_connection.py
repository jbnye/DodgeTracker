#honestly no clue, i think its the objects for the enviroment
import os
#needed for hidden api
from dotenv import load_dotenv
load_dotenv()
import mysql.connector
from mysql.connector import Error

def get_db_connection():
    connection = mysql.connector.connect(
        host="your_host",
        user="your_username",
        password="your_password",
        database="your_database"
    )
    return connection 
