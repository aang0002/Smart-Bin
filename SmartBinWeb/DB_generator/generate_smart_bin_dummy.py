"""
Run this to generate dummy bin datas in the DB 
The bins will be located around Melbourne Central Station
"""

import os
import sqlite3
import random


if __name__ == "__main__":
	try:
		BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
		sqliteConnection = sqlite3.connect(os.path.join(BASE_DIR, "db.sqlite3"))
		cursor = sqliteConnection.cursor()
		print("Database created and Successfully Connected to SQLite")

		sqlite_select_Query = "SELECT sqlite_version();"
		cursor.execute(sqlite_select_Query)
		record = cursor.fetchall()
		print("SQLite Database Version is: ", record)

		# bin datas constraints
		N = 20	# number of bins that we want to generate
		MAX_LAT = -37.794240
		MIN_LAT = -37.816393
		MAX_LONG = 144.995321
		MIN_LONG = 144.952883

		# clear all existing bin datas
		cursor.execute("DELETE FROM pages_bin;")

		# create N dummy bin datas
		bin_num = 1
		for i in range(N):
			cursor.execute("""INSERT INTO pages_bin
				(bin_num, bin_type, bin_fullness, bin_latitude, bin_longitude, last_cleared_datetime, installation_date, bin_status)
				VALUES ('{bin_num}', 'GENERAL_WASTE', 0, {bin_latitude}, {bin_longitude}, '2020-08-19', '2020-08-19', 'no defect');"""
				.format(bin_num=format(bin_num,'05d'), bin_latitude=random.uniform(MIN_LAT, MAX_LAT), bin_longitude=random.uniform(MIN_LONG, MAX_LONG)))
			bin_num += 1

		# close connection
		print("connection closed")
		cursor.close()

	except sqlite3.Error as error:
		print("Error while connecting to sqlite", error)