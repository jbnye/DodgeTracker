#honestly no clue, i think its the objects for the enviroment
import os
#needed for hidden api
from dotenv import load_dotenv
load_dotenv()
import mysql.connector
from mysql.connector import pooling, Error


# Create a connection pool
connection_pool = pooling.MySQLConnectionPool(
    pool_name="dodge_tracker_pool",
    pool_size=10,  # Adjust this number based on expected concurrency
    pool_reset_session=True,
    host=os.getenv("hostName"),
    user=os.getenv("user"),
    password=os.getenv("password"),
    database="DodgeTracker",
)

def get_db_connection():
    try:
        # Get a connection from the pool
        return connection_pool.get_connection()
    except Error as e:
        print(f"Error: '{e}'")
        return None
    


# def get_db_connection():
#     connection = mysql.connector.connect(
#         host = os.getenv("hostName"),
#         user = os.getenv("user"),
#         password = os.getenv("password"),
#         database = "DodgeTracker"
#     )
#     return connection 