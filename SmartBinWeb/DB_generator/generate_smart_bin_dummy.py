"""
Run this to generate dummy bin datas in the DB 
The bins will be located around Melbourne Central Station
"""

import os, sys
import sqlite3
import random
# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# pages_dir = os.path.join(BASE_DIR, "pages")
# sys.path.insert(0, pages_dir)
# from models import Employee
# from pages.models import Employee

NUMBER_OF_BINS = 30
NUMBER_OF_COLCENS = 3
emp_usernames = ['aang0002','ylao0002','mgad0002']

"""
Fill in pages_bin table in the DB
"""
def generate_bin_dummy_data(cursor):
	# bin datas constraints
	N = NUMBER_OF_BINS	# number of bins that we want to generate
	MAX_LAT = -37.794729
	MIN_LAT = -37.818508
	MAX_LONG = 144.993702
	MIN_LONG = 144.946693
	bin_types = ['RECYCLE', "ORGANIC", "GENERAL_WASTE"]
	bin_volumes = [360, 240, 120, 80]
	postcodes = ['3000','3005','3016','3011']

	# clear all existing bin datas
	cursor.execute("DELETE FROM pages_bin;")

	# create N dummy bin datas
	bin_num = 1
	for i in range(N):

		cursor.execute("""INSERT INTO pages_bin
			(bin_num, bin_type, bin_fullness, bin_latitude, bin_longitude, bin_volume, last_cleared_datetime, installation_date, bin_status, postcode)
			VALUES ('{bin_num}', '{bin_type}', {bin_fullness}, {bin_latitude}, {bin_longitude}, {bin_volume}, '2007-01-01 10:00:00', '2020-08-19', 'perfect condition', {postcode});"""
			.format(bin_num=format(bin_num,'05d'),
					bin_type=bin_types[random.randint(0,len(bin_types)-1)], 
					bin_fullness=random.randint(0,100), 
					bin_latitude=random.uniform(MIN_LAT, MAX_LAT), 
					bin_longitude=random.uniform(MIN_LONG, MAX_LONG), 
					bin_volume=bin_volumes[random.randint(0, len(bin_volumes)-1)],
					postcode=postcodes[random.randint(0, len(postcodes)-1)]
					))
		bin_num += 1

	return

"""
Fill in pages_employee table in the DB
"""
def generate_emp_dummy_data(cursor):
	# clear all existing employee datas
	cursor.execute("DELETE FROM pages_employee;")

	# create a list of datas
	passwords = ['fit','fit','fit']
	names = ['Adrian Ang', 'Jayden Lao', 'Matthew Gadsden']
	dobs = ['1998-09-04','1998-11-12','1998-11-05']
	tfns = ['1111111111','2222222222','3333333333']
	addresses = ['39 Waverly Drive, Mount Waverly','17 Anchora Palace, Glen Waverly','1 Venice Street, Box Hill']
	phones = ['0455611990','0418224233','0411909988']

	# start filling in datas
	for i in range(len(emp_usernames)):
		cursor.execute("""INSERT INTO pages_employee (emp_username, emp_password, emp_name, emp_dob, tfn_no, emp_address, emp_phone, bins_collected) 
			VALUES ('{username}', '{password}', '{name}', '{dob}', '{tfn}', '{address}', '{phone}', {bins_collected});"""
			.format(username=emp_usernames[i], 
				password=passwords[i], 
				name=names[i], 
				dob=dobs[i], 
				tfn=tfns[i], 
				address=addresses[i], 
				phone=phones[i],
				bins_collected=0))
	
	# create one admin user
	cursor.execute("""INSERT INTO pages_employee (emp_username, emp_password, emp_name, emp_dob, tfn_no, emp_address, emp_phone) 
			VALUES ('{username}', '{password}', '{name}', '{dob}', '{tfn}', '{address}', '{phone}');"""
			.format(username='admin', password='admin', name='admin', dob='1970-01-01', tfn='0000000000', address='address', phone='0000000000'))

	return


"""
Fill in pages_collectioncenter table in the DB
"""
def generate_collectioncenter_dummy_data(cursor):
	# clear all existing collection center datas
	cursor.execute("DELETE FROM pages_collectioncenter;")

	# create a list of datas
	colcen_id = ["0001","0002","0003"] #models.CharField(max_length=4, validators=[RegexValidator(r'^[0-9]{4}$')], primary_key=True)
	colcen_longitude = [144.969851, 144.989234, 144.992626] 
	colcen_latitude = [-37.786885, -37.816558, -37.795310] 
	colcen_phone = ['0311784655','0376335877', '0311990723']
	manager_name = ['Bradley Park', 'Henry Cooper', 'Garry Maxima']

	# start filling in datas
	for i in range(len(colcen_id)):
		cursor.execute("""INSERT INTO pages_collectioncenter (colcen_id, colcen_longitude, colcen_latitude, colcen_phone, manager_name) 
			VALUES ('{id}', '{long}', '{lat}', '{ph}', '{manager}');"""
			.format(id=colcen_id[i], long=colcen_longitude[i], lat=colcen_latitude[i], ph=colcen_phone[i], manager=manager_name[i]))

"""
Fill in pages_assignment table in the DB
"""
def generate_assignment_dummy_data(cursor):
	# clear all existing collection center datas
	cursor.execute("DELETE FROM pages_assignment;")

	# create dummy datas
	date = 1
	month = 10
	year = 2020
	tasks_in_a_day = 20
	asgn_id = 1

	# start filling datas
	for i in range(30):
		for j in range(tasks_in_a_day):
 			cursor.execute("""INSERT INTO pages_assignment (asgn_id, emp_username_id, bin_num_id, colcen_id_id, datetime_created, desc, waste_volume)
							VALUES ('{asgn_id}', '{emp_username}', '{bin_num}', '{colcen_id}', '{datetime_created}', '{desc}', {waste_volume})"""
							.format(
								asgn_id = format(asgn_id, '010d'),
								emp_username = emp_usernames[random.randint(0,len(emp_usernames)-1)],
								bin_num = format(random.randint(1,NUMBER_OF_BINS), '05d'),
								colcen_id = format(random.randint(1,3), '04d'),
								datetime_created = str(year) + '-' + str(month) + '-' + str(date) + ' ' + str(random.randint(0,23)) + ':' + str(random.randint(0,59)) + ':' + str(random.randint(0,59)),
								desc = "This is an empty bin assignment",
								waste_volume = random.randint(0, 200)
							))
 			asgn_id += 1
		date += 1


def create_trigger(cursor):
	cursor.execute("""
					CREATE TRIGGER increment_bins_collected
						AFTER INSERT ON pages_assignment
					BEGIN
						UPDATE pages_employee
						SET bins_collected = bins_collected + 1
						WHERE emp_username = NEW.emp_username_id;
					END;
				""");



if __name__ == "__main__":
	BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
	sqliteConnection = sqlite3.connect(os.path.join(BASE_DIR, "db.sqlite3"))
	cursor = sqliteConnection.cursor()
	print("Database created and Successfully Connected to SQLite")

	sqlite_select_Query = "SELECT sqlite_version();"
	cursor.execute(sqlite_select_Query)
	record = cursor.fetchall()
	print("SQLite Database Version is: ", record)

	# create trigger in the DB
	create_trigger(cursor)

	# generate bin dummy date
	generate_bin_dummy_data(cursor)

	# generate employee dummy data
	generate_emp_dummy_data(cursor)

	# generate collection ceters dummy data
	generate_collectioncenter_dummy_data(cursor)

	# generate collection ceters dummy data
	generate_assignment_dummy_data(cursor)

	# commit changes
	cursor.execute("COMMIT;")

	# close connection
	print("connection closed")
	cursor.close()
