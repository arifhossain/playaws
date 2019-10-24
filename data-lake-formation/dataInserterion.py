import sys
import logging
import pymysql

logging.basicConfig()
logger = logging.getLogger()
logger.setLevel(logging.INFO)

host="customerdb.cmfzhye7x7w4.us-east-2.rds.amazonaws.com"
port=3306
dbname="swacustomerdb"
user="admin"
password="bosstest1"

try:
    conn = pymysql.connect(host, user=user,port=port,
                           passwd=password, db=dbname)
except pymysql.MySQLError as e:
    logger.error("failed to get connection")
    sys.exit()

logger.info("Connection success!")

insert_query = """INSERT into swacustomerdb.tasks 
        (title,start_date, due_date, priority, description) 
        values (%s, %s, %s, %s, %s)"""

try:
    for j in range(5000):
        with conn.cursor() as cursor:
            cursor.execute(insert_query, 
                ("title - " + str(j),
                    "start-date - " + str(j), 
                    "due-date - " + str(j), 
                    5, 
                    "description - " + str(j)))
        conn.commit()
except pymysql.MySQLError as e:
    logger.error("failed to isnert", e)
    sys.exit()
finally:
    conn.close()



