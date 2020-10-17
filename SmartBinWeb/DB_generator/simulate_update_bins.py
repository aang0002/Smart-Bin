import os, sys
import sqlite3
from random import randint
from time import sleep


if __name__ == "__main__":
	BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
	sqliteConnection = sqlite3.connect(os.path.join(BASE_DIR, "db.sqlite3"))
	cursor = sqliteConnection.cursor()
	print("Database created and Successfully Connected to SQLite")

	sqlite_select_Query = "SELECT sqlite_version();"
	cursor.execute(sqlite_select_Query)
	record = cursor.fetchall()
	print("SQLite Database Version is: ", record)

	# get the number of bins in the DB
	cursor.execute(""" 
					SELECT COUNT(*)
					FROM pages_bin;
					""")
	number_of_bins = cursor.fetchall()[0][0]

	# start updating bins
	while True:
		bin_num = randint(1,number_of_bins-1)
		print("trying to update bin number",bin_num)
		cursor.execute(""" 
						UPDATE pages_bin
						SET bin_fullness = bin_fullness + 1
						WHERE bin_num = '{bin_num}' AND bin_fullness < 100
						;
						""".format(bin_num=bin_num))
		# empty all full bins
		cursor.execute(""" 
						UPDATE pages_bin
						SET bin_fullness = 0
						WHERE bin_fullness = 100
						;
						""".format(bin_num=bin_num))
		# commit changes
		cursor.execute("COMMIT;")
		# sleep for 2 secs, before executing the next bin
		sleep(0.1)


	# close connection
	cursor.close()
	print("connection closed")