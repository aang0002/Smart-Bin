"""
Run this to generate dummy bin datas in the DB 
The bins will be located around Melbourne Central Station
"""

import os, sys
import sqlite3
import random
from datetime import datetime, timedelta
# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# pages_dir = os.path.join(BASE_DIR, "pages")
# sys.path.insert(0, pages_dir)
# from models import Employee
# from pages.models import Employee

NUMBER_OF_BINS = 30
NUMBER_OF_COLCENS = 3
emp_usernames = ['aang0002','ylao0002','mgad0002','mjan0001','jdoe0001']

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
			(bin_num, bin_type, bin_fullness, bin_latitude, bin_longitude, bin_volume, installation_date, bin_status, postcode, is_active)
			VALUES ('{bin_num}', '{bin_type}', {bin_fullness}, {bin_latitude}, {bin_longitude}, {bin_volume}, '2020-08-19', 'perfect condition', {postcode}, 0);"""
			.format(bin_num=bin_num,
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
	passwords = ['fit','fit','fit','fit','fit']
	firstnames = ['Adrian', 'Jayden', 'Matthew', 'Mary', 'John']
	lastnames = ['Ang', 'Lao', 'Gadsden', 'Jane', 'Doe']
	dobs = ['1998-04-09','1998-11-15','1998-11-05','1998-11-05','1998-11-05']
	tfns = ['1111111111','2222222222','3333333333','4444444444','5555555555']
	addresses = ['39 Waverly Drive,Mount Waverly,VIC,3150','17 Anchora Palace,Glen Waverly,VIC,3150','1 Venice Street,Box Hill,VIC,3128','39 Waverly Drive,Mount Waverly,VIC,3150','39 Waverly Drive,Mount Waverly,VIC,3150']
	phones = ['0455611990','0418224233','0411909988','0418273333','0411772189']

	# start filling in datas
	for i in range(len(emp_usernames)):
		cursor.execute("""
			INSERT INTO pages_employee (emp_username, 
										emp_password, 
										emp_title,
										emp_firstname, 
										emp_lastname, 
										emp_dob, 
										emp_gender,
										employment_type,
										email, 
										bank_acc_name,
										bank_acc_bsb,
										bank_acc_number,
										tfn_no,
										emp_address, 
										emp_phone, 
										on_shift, 
										bins_collected) 
			VALUES ('{username}', 
					'{password}', 
					'Mr',
					'{firstname}', 
					'{lastname}', 
					'{dob}', 
					'MALE',
					'FULL-TIME',
					'test@gmail.com',
					'{firstname} {lastname}',
					'123123',
					'12341234',
					'{tfn}', 
					'{address}', 
					'{phone}', 
					{on_shift}, 
					{bins_collected});
			"""
			.format(username=emp_usernames[i], 
					password=passwords[i], 
					firstname=firstnames[i],
					lastname=lastnames[i], 
					dob=dobs[i], 
					tfn=tfns[i], 
					address=addresses[i], 
					phone=phones[i],
					on_shift=1,
					bins_collected=0))
	
	# create one admin user
	cursor.execute("""INSERT INTO pages_employee (emp_username, 
										emp_password, 
										emp_title,
										emp_firstname, 
										emp_lastname, 
										emp_dob, 
										emp_gender,
										employment_type,
										email, 
										bank_acc_name,
										bank_acc_bsb,
										bank_acc_number,
										tfn_no,
										emp_address, 
										emp_phone, 
										on_shift) 
			VALUES ('admin', 'admin', 'Mr', 'admin', 'admin', '1970-01-01', 'MALE', 'FULL-TIME', 'admin@smartbin.co.au', 
					'admin', '123123', '12341234', '0000000000', 'address', '0400000000', 1);""")

	return


"""
Fill in pages_collectioncenter table in the DB
"""
def generate_collectioncenter_dummy_data(cursor):
	# clear all existing collection center datas
	cursor.execute("DELETE FROM pages_collectioncenter;")

	# create a list of datas
	colcen_id = ["1","2","3"] #models.CharField(max_length=4, validators=[RegexValidator(r'^[0-9]{4}$')], primary_key=True)
	colcen_longitude = [144.989234, 144.992626, 144.940649] 
	colcen_latitude = [-37.816558, -37.795310, -37.800840] 
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
	number_of_days = 300 #450
	tasks_in_a_day = 5 #10
	date = datetime.now() - timedelta(days=number_of_days)	# the date of first assignment
	asgn_id = 1

	# start filling datas
	for i in range(number_of_days):
		for j in range(tasks_in_a_day):
 			cursor.execute("""INSERT INTO pages_assignment (asgn_id, emp_username_id, bin_num_id, colcen_id_id, datetime_created, waste_volume)
							VALUES ('{asgn_id}', '{emp_username}', '{bin_num}', '{colcen_id}', '{datetime_created}', {waste_volume});"""
							.format(
								asgn_id = asgn_id,
								emp_username = emp_usernames[random.randint(0,len(emp_usernames)-1)],
								bin_num = random.randint(1,NUMBER_OF_BINS),
								colcen_id = random.randint(1,3),
								datetime_created = date.strftime("%Y-%m-%d") + ' ' + str(random.randint(0,23)) + ':' + str(random.randint(0,59)) + ':' + str(random.randint(0,59)),
								waste_volume = random.randint(0, 200)
							))
 			asgn_id += 1
		date += timedelta(days=1)

"""
Fill in pages_damagereport table in the DB
"""
def generate_damagereport_dummy_data(cursor):
	# clear all existing collection center datas
	cursor.execute("DELETE FROM pages_damagereport;")

	# create a list of random descriptions
	dmg_types = [
		'broken handle',
		'sensor emits wrong reading',
		'leaks on bin'
	]

	dmg_id = 1
	number_of_days = 100
	date = datetime.now() - timedelta(days=number_of_days)	# the date of first assignment

	for i in range(number_of_days):
		x = random.randint(0,1)
		cursor.execute("""
						INSERT INTO pages_damagereport (dmg_id, reported_at, emp_username_id, bin_num_id, dmg_type, desc, is_solved, datetime_solved)
						VALUES ({dmg_id}, '{reported_at}', '{emp_username}', '{bin_num}', '{dmg_type}', '' ,{is_solved}, '{datetime_solved}');
						"""
						.format(
							dmg_id = dmg_id,
							reported_at = date.strftime("%Y-%m-%d") + ' ' + str(random.randint(0,23)) + ':' + str(random.randint(0,59)) + ':' + str(random.randint(0,59)),
							emp_username = emp_usernames[random.randint(0,len(emp_usernames)-1)],
							bin_num = random.randint(1,NUMBER_OF_BINS),
							dmg_type = dmg_types[random.randint(0, len(dmg_types)-1)],
							is_solved = [0,1][x],
							datetime_solved = [None,'2020-10-15 15:12:59'][x]
							))
		dmg_id += 1
		date += timedelta(days=1)


def create_trigger(cursor):
	cursor.execute("DROP TRIGGER IF EXISTS increment_bins_collected;");
	# incerements bins_collected whenever an assignment is created
	cursor.execute("""
					CREATE TRIGGER IF NOT EXISTS increment_bins_collected
						AFTER INSERT ON pages_assignment
					BEGIN
						UPDATE pages_employee
						SET bins_collected = bins_collected + 1
						WHERE emp_username = NEW.emp_username_id;
					END;
				""");

	cursor.execute("DROP TRIGGER IF EXISTS update_bin_last_cleared_datetime;");
	# updates the "last_cleared" attribute of bin whenever the 
	cursor.execute("""
					CREATE TRIGGER IF NOT EXISTS update_bin_last_cleared_datetime
						AFTER UPDATE ON pages_assignment
					WHEN NEW.is_done = 1
					BEGIN
						UPDATE pages_bin
						SET last_cleared_datetime = datetime('now')
						WHERE bin_num = NEW.bin_num_id;
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

	# generate collection centers dummy data
	generate_collectioncenter_dummy_data(cursor)

	# generate collection ceters dummy data
	generate_assignment_dummy_data(cursor)

	# generare damage reports dummy data
	generate_damagereport_dummy_data(cursor)

	# commit changes
	cursor.execute("COMMIT;")

	# close connection
	print("connection closed")
	cursor.close()
