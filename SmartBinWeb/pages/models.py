from django.db import models
from django.core.validators import RegexValidator
from django.core.validators import MaxValueValidator, MinValueValidator 

# Create your models here.
class ToDoList(models.Model):
	name = models.CharField(max_length=200)

	def __str__(self):
		return self.name


# In here, Item is the parent of ToDoList
class Item(models.Model):
	todolist = models.ForeignKey(ToDoList, on_delete=models.CASCADE)
	text = models.CharField(max_length=300)
	complete = models.BooleanField()

	def __str__(self):
		return self.text


# Employee Model
class Employee(models.Model):
	emp_id = models.CharField(max_length=7, validators=[RegexValidator(r'^[0-9]{7}$')], primary_key=True)
	emp_name = models.CharField(max_length=100)
	emp_dob = models.DateField()
	tfn_no = models.CharField(max_length=10, validators=[RegexValidator(r'^[0-9]{10}$')])
	emp_address = models.CharField(max_length=100)
	emp_phone = models.CharField(max_length=10, validators=[RegexValidator(r'^[0-9]{10}$')])
	on_shift = models.BooleanField(default=True)
	emp_points = models.PositiveSmallIntegerField(default=0) 

	def __str__(self):
		return self.emp_id

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
	area_name = models.CharField(max_length=100)
	last_cleared_datetime = models.DateTimeField()
	installation_date = models.DateField(blank=True)
	bin_status = models.CharField(max_length=300)

# Assignment Model
class Assignment(models.Model):
	asgn_id = models.CharField(max_length=10, validators=[RegexValidator(r'^[0-9]{10}$')], primary_key=True)
	emp_id = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True)
	bin_num = models.ForeignKey(Bin, on_delete=models.CASCADE, blank=False)
	colcen_id =  models.ForeignKey(CollectionCenter, on_delete=models.SET_NULL, null=True)
	datetime_created = models.DateTimeField()
	datetime_finished = models.DateTimeField()
	desc = models.CharField(max_length=200)


# Damage Model
class DamageReport(models.Model):
	dmg_id = models.CharField(max_length=7, validators=[RegexValidator(r'^[0-9]{7}$')], primary_key=True)
	bin_num = models.ForeignKey(Bin, on_delete=models.CASCADE)
	desc = models.CharField(max_length=300)
	severity = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(10)])	# value in the range of 0 to 10
