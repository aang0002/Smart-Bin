from django.db import models
from django.core.validators import RegexValidator
from django.core.validators import MaxValueValidator, MinValueValidator 

# Employee Model
class Employee(models.Model):
	EMPLOYMENT_TYPE_CHOICES = [
    	("FULL-TIME","FULL-TIME"),
    	("CASUAL","CASUAL"),
    	("PART-TIME","PART-TIME"),
    ]

	GENDER_CHOICES = [
    	("MALE","MALE"),
    	("FEMALE","FEMALE"),
    ]

	TITLE_CHOICES = [
    	("Mr", "Mr"),
    	("Miss", "Miss"),
    	("Mrs", "Mrs"),
    	("Ms", "Ms"),
    ]

	emp_username = models.CharField(max_length=50, primary_key=True)
	emp_password = models.CharField(max_length=100, default="fit")
	emp_title = models.CharField(max_length=4, choices=TITLE_CHOICES)
	emp_firstname = models.CharField(max_length=100)
	emp_lastname = models.CharField(max_length=100)
	emp_dob = models.DateField()
	emp_gender = models.CharField(max_length=6, choices=GENDER_CHOICES)
	employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE_CHOICES)
	email = models.CharField(max_length=100)
	bank_acc_name = models.CharField(max_length=100)
	bank_acc_bsb = models.CharField(max_length=6)
	bank_acc_number =  models.CharField(max_length=8)
	tfn_no = models.CharField(max_length=10, validators=[RegexValidator(r'^[0-9]{10}$')])
	emp_address = models.CharField(max_length=100)
	emp_phone = models.CharField(max_length=10, validators=[RegexValidator(r'^[0-9]{10}$')])
	on_shift = models.BooleanField(default=True, blank=True)
	bins_collected = models.PositiveSmallIntegerField(default=0, blank=True, null=True)

# CollectionCenter Model
class CollectionCenter(models.Model):
	colcen_id = models.CharField(max_length=4, validators=[RegexValidator(r'^[0-9]{4}$')], primary_key=True)
	colcen_longitude = models.DecimalField(max_digits=8, decimal_places=5)
	colcen_latitude = models.DecimalField(max_digits=8, decimal_places=5)
	colcen_phone = models.CharField(max_length=10, validators=[RegexValidator(r'^[0-9]{10}$')])
	manager_name = models.CharField(max_length=100)

# Smart Bin Model
class Bin(models.Model):
	# bin type choices (enum)
	BIN_TYPE_CHOICES = [
    	("RECYCLE", "RECYCLE"),
    	("ORGANIC", "ORGANIC"),
    	("GENERAL_WASTE", "GENERAL_WASTE"),
    ]

	bin_num = models.CharField(max_length=7, primary_key=True)
	bin_type = models.CharField(max_length=50, choices=BIN_TYPE_CHOICES, default="GENERAL_WASTE")
	bin_fullness = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
	bin_longitude = models.DecimalField(max_digits=8, decimal_places=5)
	bin_latitude = models.DecimalField(max_digits=8, decimal_places=5)
	bin_volume = models.PositiveIntegerField(validators=[MinValueValidator(0), MaxValueValidator(300)]) # in Litre
	installation_date = models.DateField(blank=True)
	bin_status = models.CharField(max_length=300)
	postcode = models.CharField(max_length=4, validators=[RegexValidator(r'^[0-9]{4}$')])
	is_active = models.BooleanField(default=False)	# active means that someone is coming to clear the bin

# Assignment Model
class Assignment(models.Model):
	asgn_id = models.CharField(max_length=10, validators=[RegexValidator(r'^[0-9]{10}$')], primary_key=True)
	emp_username = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True)	# column stored will be emp_username_id
	bin_num = models.ForeignKey(Bin, on_delete=models.CASCADE, blank=False)				# column stored will be bin_num_id
	colcen_id =  models.ForeignKey(CollectionCenter, on_delete=models.SET_NULL, null=True)
	datetime_created = models.DateTimeField()
	datetime_finished = models.DateTimeField(null=True)
	waste_volume = models.PositiveIntegerField(validators=[MinValueValidator(0), MaxValueValidator(360)], default=0, null=True)

# Damage Model
class DamageReport(models.Model):
	dmg_id = models.PositiveIntegerField(primary_key=True)
	reported_at = models.DateTimeField()
	emp_username = models.ForeignKey(Employee, on_delete=models.CASCADE)
	dmg_type = models.CharField(max_length=300)
	bin_num = models.ForeignKey(Bin, on_delete=models.CASCADE)
	desc = models.CharField(max_length=300, default="")
	is_solved = models.BooleanField(default=False)
	datetime_solved = models.DateTimeField(null=True)