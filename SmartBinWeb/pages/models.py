from django.db import models
from django.core.validators import RegexValidator
from django.core.validators import MaxValueValidator, MinValueValidator 

# Employee Model
class Employee(models.Model):
	emp_username = models.CharField(max_length=50, primary_key=True)
	emp_password = models.CharField(max_length=100, default="fit")
	emp_name = models.CharField(max_length=100)
	emp_dob = models.DateField()
	tfn_no = models.CharField(max_length=10, validators=[RegexValidator(r'^[0-9]{10}$')])
	emp_address = models.CharField(max_length=100)
	emp_phone = models.CharField(max_length=10, validators=[RegexValidator(r'^[0-9]{10}$')])
	on_shift = models.BooleanField(default=True, blank=True, null=True)
	emp_points = models.PositiveSmallIntegerField(default=0, blank=True, null=True)

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

	bin_num = models.CharField(max_length=7, validators=[RegexValidator(r'^[0-9]{7}$')], primary_key=True)
	bin_type = models.CharField(max_length=50, choices=BIN_TYPE_CHOICES, default="GENERAL_WASTE")
	bin_fullness = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
	bin_longitude = models.DecimalField(max_digits=8, decimal_places=5)
	bin_latitude = models.DecimalField(max_digits=8, decimal_places=5)
	last_cleared_datetime = models.DateTimeField()
	installation_date = models.DateField(blank=True)
	bin_status = models.CharField(max_length=300)
	postcode = models.CharField(max_length=4, validators=[RegexValidator(r'^[0-9]{4}$')])

# Assignment Model
class Assignment(models.Model):
	asgn_id = models.CharField(max_length=10, validators=[RegexValidator(r'^[0-9]{10}$')], primary_key=True)
	emp_username = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True)	# column stored will be emp_username_id
	bin_num = models.ForeignKey(Bin, on_delete=models.CASCADE, blank=False)				# column stored will be bin_num_id
	colcen_id =  models.ForeignKey(CollectionCenter, on_delete=models.SET_NULL, null=True)
	datetime_created = models.DateTimeField()
	desc = models.CharField(max_length=200)


# Damage Model
class DamageReport(models.Model):
	dmg_id = models.CharField(max_length=7, validators=[RegexValidator(r'^[0-9]{7}$')], primary_key=True)
	bin_num = models.ForeignKey(Bin, on_delete=models.CASCADE)
	desc = models.CharField(max_length=300)
	severity = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(10)])	# value in the range of 0 to 10
