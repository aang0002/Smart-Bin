"""
Run this to generate dummy bin datas in the DB 
The bins will be located around Melbourne Central Station
"""

import os, sys
import sqlite3
import random

"""
Fill in pages_bin table in the DB
"""
def generate_bin_dummy_data(cursor):
	# bin datas constraints
	N = 30	# number of bins that we want to generate
	MAX_LAT = -37.794729
	MIN_LAT = -37.818508
	MAX_LONG = 144.993702
	MIN_LONG = 144.946693

	# clear all existing bin datas
	cursor.execute("DELETE FROM pages_bin;")

	# create N dummy bin datas
	bin_num = 1
	for i in range(N):

		cursor.execute("""INSERT INTO pages_bin
			(bin_num, bin_type, bin_fullness, bin_latitude, bin_longitude, last_cleared_datetime, installation_date, bin_status)
			VALUES ('{bin_num}', 'GENERAL_WASTE', {bin_fullness}, {bin_latitude}, {bin_longitude}, '2007-01-01 10:00:00', '2020-08-19', 'perfect condition');"""
			.format(bin_num=format(bin_num,'05d'), bin_fullness=random.randint(0,100), bin_latitude=random.uniform(MIN_LAT, MAX_LAT), bin_longitude=random.uniform(MIN_LONG, MAX_LONG)))
		bin_num += 1

	return

"""
Fill in pages_employee table in the DB
"""
def generate_emp_dummy_data(cursor):
	# clear all existing employee datas
	cursor.execute("DELETE FROM pages_employee;")

	# create a list of datas
	usernames = ['aang0002','ylao0002','mgad0002']
	passwords = ['fit','fit','fit']
	names = ['Adrian Ang', 'Jayden Lao', 'Matthew Gadsden']
	dobs = ['1998-09-04','1998-11-12','1998-11-05']
	tfns = ['1111111111','2222222222','3333333333']
	addresses = ['39 Waverly Drive, Mount Waverly','17 Anchora Palace, Glen Waverly','1 Venice Street, Box Hill']
	phones = ['0455611990','0418224233','0411909988']

	# start filling in datas
	for i in range(len(usernames)):
		cursor.execute("""INSERT INTO pages_employee (emp_username, emp_password, emp_name, emp_dob, tfn_no, emp_address, emp_phone) 
			VALUES ('{username}', '{password}', '{name}', '{dob}', '{tfn}', '{address}', '{phone}');"""
			.format(username=usernames[i], password=passwords[i], name=names[i], dob=dobs[i], tfn=tfns[i], address=addresses[i], phone=phones[i]))
	

	return


"""
Fill in pages_collectioncenter table in the DB
"""
def generate_collectioncenter_dummy_data(cursor):
	# clear all existing collection center datas
	cursor.execute("DELETE FROM pages_collectioncenter;")

	# create a list of datas
	colcen_id = [1111,2222,3333] #models.CharField(max_length=4, validators=[RegexValidator(r'^[0-9]{4}$')], primary_key=True)
	colcen_longitude = [144.969851, 144.989234, 144.992626] 
	colcen_latitude = [-37.786885, -37.816558, -37.795310] 
	colcen_phone = ['0311784655','0376335877', '0311990723']
	manager_name = ['Bradley Park', 'Henry Cooper', 'Garry Maxima']

	# start filling in datas
	for i in range(len(colcen_id)):
		cursor.execute("""INSERT INTO pages_collectioncenter (colcen_id, colcen_longitude, colcen_latitude, colcen_phone, manager_name) 
			VALUES ('{id}', '{long}', '{lat}', '{ph}', '{manager}');"""
			.format(id=colcen_id[i], long=colcen_longitude[i], lat=colcen_latitude[i], ph=colcen_phone[i], manager=manager_name[i]))




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

		# generate bin dummy date
		generate_bin_dummy_data(cursor)

		# generate employee dummy data
		generate_emp_dummy_data(cursor)

		# generate collection ceters dummy data
		generate_collectioncenter_dummy_data(cursor)

		# commit changes
		cursor.execute("COMMIT;")

		# close connection
		print("connection closed")
		cursor.close()

	except sqlite3.Error as error:
		print("SQL error:", error)

	except Exception as error:
		print(error)