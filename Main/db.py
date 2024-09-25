
#honestly no clue, i think its the objects for the enviroment
import os
#needed for hidden api
from dotenv import load_dotenv
load_dotenv()
import mysql.connector

db = mysql.connector.connect(

    #server ip address
    host = os.getenv("hostName"),
    user = "root",
    passwd = os.getenv("password"),
    database = "DodgeTracker"

)   

#Create a cursor object that will allow me to connect and use the database for crud.
# mycursor = db.cursor()

# mycursor.execute("CREATE DATABASE db")

