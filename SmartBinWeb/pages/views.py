from django.http import HttpResponse, JsonResponse
from django.views.generic import View
from django.shortcuts import render
from django.shortcuts import get_object_or_404	# so that a 404 page will be shown on an invalid req
from rest_framework.views import APIView	# so that normal view can return an API data
from django.db.models import ExpressionWrapper, FloatField, F, Q
from django.db.models.functions import Sqrt
from rest_framework import viewsets
from rest_framework import generics
from rest_framework.response import Response # HTTP status response
from rest_framework import status
from django.contrib.auth.forms import UserCreationForm
import os
import sqlite3
import math

from .serializers import EmployeeSerializer
from .serializers import BinSerializer
from .serializers import CollectionCenterSerializer
from .serializers import AssignmentSerializer
from .serializers import DamageReportSerializer
from .models import Employee
from .models import Bin
from .models import CollectionCenter
from .models import Assignment
from .models import DamageReport

from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta
from dateutil.relativedelta import relativedelta

from django.db import IntegrityError


# Create your views here.
class HomePageView(View):
	template_name = "home.html"

	def get(self, request, *args, **kwargs):
		return render(request, "home.html", {})

class ReportDamageView(View):
	template_name = 'damageReportForm.html'

	def get(self, request, *args, **kwargs):
		return render(request, "damageReportForm.html", {})

class ProfileView(View):
	template_name = "profile.html"

	def get(self, request, *args, **kwargs):
		return render(request, "profile.html", {})

class LoginView(View):
	template_name = "login.html"

	def get(self, request, *args, **kwargs):
		return render(request, "login.html", {})

class RegisterView(View):
	template_name = "register.html"

	def get(self, request, *args, **kwargs):
		return render(request, "register.html", {})

class AdminMainPageView(View):
	template_name = "admin.html"

	def get(self, request, *args, **kwargs):
		return render(request, "admin.html", {})

class EmployeePerformanceView(View):
	template_name = "employeePerformance.html"

	def get(self, request, *args, **kwargs):
		return render(request, "employeePerformance.html", {})

class BinFrequencyView(View):
	template_name = "binFrequency.html"

	def get(self, request, *args, **kwargs):
		return render(request, "binFrequency.html", {})



"""
####################### REST-API views  ###################################################
"""

class EmployeeList(APIView):

	def get(self, request):
		employees = Employee.objects.all().exclude(emp_username='admin')
		serializer = EmployeeSerializer(employees, many=True)
		return Response(serializer.data)

	def post(self, request):
		emp_username = request.data.get("emp_username")
		emp_password1 = request.data.get("emp_password1")
		emp_password2 = request.data.get("emp_password2")
		emp_title = request.data.get("emp_title")
		emp_firstname = request.data.get("emp_firstname")
		emp_lastname = request.data.get("emp_lastname")
		emp_dob = request.data.get("emp_dob")	# YYYY-MM-DD
		emp_gender = request.data.get("emp_gender")
		employment_type = request.data.get("employment_type")
		email = request.data.get("email")
		bank_acc_name = request.data.get("bank_acc_name")
		bank_acc_bsb = request.data.get("bank_acc_bsb")
		bank_acc_number = request.data.get("bank_acc_number")	
		tfn_no = request.data.get("tfn_no")
		emp_address = request.data.get("emp_address_street") + "," + request.data.get("emp_address_suburb") + "," + request.data.get("emp_address_state") + "," + request.data.get("emp_address_postcode")
		emp_phone = request.data.get("emp_phone")

		# check rather password matched
		if emp_password1 != emp_password2:
			return Response("UNMATCHED_PASSWORD")
		# create a new employee instance in the DB
		try:
			new_emp = Employee.objects.create(	emp_username = emp_username,
										emp_password = emp_password1,
										emp_title = emp_title,
										emp_firstname = emp_firstname,
										emp_lastname = emp_lastname,
										emp_dob = emp_dob,
										emp_gender = emp_gender,
										employment_type = employment_type,
										email=email,
										bank_acc_name = bank_acc_name,
										bank_acc_bsb = bank_acc_bsb,
										bank_acc_number = bank_acc_number,
										tfn_no = tfn_no,
										emp_address = emp_address,
										emp_phone = emp_phone,
										bins_collected = 0
										)
			new_emp.save()
			return Response("OK")
		except IntegrityError as e:
			return Response("USERNAME_USED")

class EditEmployeeView(APIView):
	def post(self, request):
		emp = Employee.objects.get(pk = request.data.get("emp_username"))
		# change the emp details
		try:
			emp.emp_firstname = request.data.get("emp_firstname")
			emp.emp_lastname = request.data.get("emp_lastname")
			emp.emp_address = request.data.get("emp_address_street") + "," + request.data.get("emp_address_suburb") + "," + request.data.get("emp_address_state") + "," + request.data.get("emp_address_postcode")
			emp.emp_phone = request.data.get("emp_phone")
			emp.save()
			return Response("OK")
		except Exception as e:
			return Response("error")

class BinList(generics.ListAPIView):
	serializer_class = BinSerializer

	def get_queryset(self):
	    queryset = Bin.objects.all()
	    return queryset


class AssignmentList(APIView):

	def get(self, request):
		assignments = Assignment.objects.all()
		serializer = AssignmentSerializer(assignments, many=True)
		return Response(serializer.data)

	def post(self, request):
		pass


class CollectionCenterList(generics.ListAPIView):
	serializer_class = CollectionCenterSerializer

	def get_queryset(self):
	    queryset = CollectionCenter.objects.all()
	    return queryset


class NearestBinList(generics.ListAPIView):
	serializer_class = BinSerializer

	def get_queryset(self):
	    cleaner_long = self.kwargs['long']
	    cleaner_lat = self.kwargs['lat']
	    limit = int(self.kwargs['limit'])

	    queryset = Bin.objects.annotate(distance = Sqrt((cleaner_long-F('bin_longitude'))**2 + (cleaner_lat-F('bin_latitude'))**2))
	    queryset = queryset.order_by('distance')[:limit]

	    return queryset


class NearestCollectionCenterList(generics.ListAPIView):
	serializer_class = CollectionCenterSerializer

	def get_queryset(self):
	    cleaner_long = self.kwargs['long']
	    cleaner_lat = self.kwargs['lat']

	    queryset = CollectionCenter.objects.annotate(distance = Sqrt((cleaner_long-F('colcen_longitude'))**2 + (cleaner_lat-F('colcen_latitude'))**2))
	    queryset = queryset.order_by('distance')[:1]

	    return queryset

class EmployeePerformance(APIView):
	serializer_class = AssignmentSerializer

	def get(self, request, *args, **kwargs):
		period = kwargs.get('period', None) # days/months
		time = kwargs.get('time')
		if period == 'days':
			date_treshold = timezone.now().date() - timedelta(days=int(time))
			assignments = Assignment.objects.filter(datetime_created__gte=date_treshold)
		elif period == 'months':
			date_treshold = timezone.now().date() - relativedelta(months=+int(time))
			assignments = Assignment.objects.filter(datetime_created__gte=date_treshold)
		else:
			assignments = Assignment.objects.all()
		queryset = {}
		for asgn in assignments:
			try:
				queryset[asgn.emp_username.emp_username] += 1
			except KeyError:
				queryset[asgn.emp_username.emp_username] = 1

		return Response(queryset)


class WasteProduction(APIView):

	def get(self, request):
		queryset = {}
		assignments = Assignment.objects.all()
		for asgn in assignments:
			print(asgn.bin_num_id)
			try:
				queryset[asgn.bin_num.bin_type] += asgn.waste_volume
			except KeyError:
				queryset[asgn.bin_num.bin_type] = asgn.waste_volume

		return Response(queryset)


class BinFrequency(APIView):

	def get(self, request):
		queryset = {}
		assignments = Assignment.objects.all()
		for asgn in assignments:
			try:
				queryset[asgn.bin_num.bin_num] += 1
			except KeyError:
				queryset[asgn.bin_num.bin_num] = 1

		return Response(queryset)


class BinFrequencyFilteredView(APIView):
	serializer_class = AssignmentSerializer

	def get(self, request, *args, **kwargs):
		period = kwargs.get('period') # days/months
		time = int(kwargs.get('time'))
		if period == 'days':
			date_treshold = timezone.now().date() - timedelta(days=time)
			assignments = Assignment.objects.filter(datetime_created__gte=date_treshold)
		elif period == 'months':
			date_treshold = timezone.now().date() - relativedelta(months=+time)
			assignments = Assignment.objects.filter(datetime_created__gte=date_treshold)
		queryset = {}
		for asgn in assignments:
			try:
				queryset[asgn.bin_num.bin_num] += 1
			except KeyError:
				queryset[asgn.bin_num.bin_num] = 1

		return Response(queryset)

class DamageReportView(generics.ListAPIView):
	serializer_class = DamageReportSerializer

	def get_queryset(self):
		reportFilter = self.kwargs['reportFilter']
		if reportFilter == 'all':
			queryset = DamageReport.objects.all()
		elif reportFilter == 'solved':
			queryset = DamageReport.objects.filter(is_solved=1)
		elif reportFilter == 'notsolved':
			queryset = DamageReport.objects.filter(is_solved=0)
		else:
			raise Exception("Invalid report filter is being passed")

		return queryset
		


class ValidateLoginView(generics.ListAPIView):
	serializer_class = EmployeeSerializer

	def get_queryset(self):
		username = self.kwargs['username']
		password = self.kwargs['password']
		queryset = Employee.objects.filter(emp_username=username, emp_password=password)
		return queryset


def register_view(request):
	context = {}
	if request.method == 'POST':
		try:
			BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
			conn = sqlite3.connect(os.path.join(BASE_DIR, "db.sqlite3"))
			cursor = conn.cursor()

			username = request.POST.get('username')
			password = request.POST.get('password')
			name = request.POST.get('name')
			dob = request.POST.get('dob')
			tfn = request.POST.get('tfn')
			address = request.POST.get('address')
			phone = request.POST.get('phone')

			print(username)

			# insert the the new employee to DB
			cursor.execute("""INSERT INTO pages_employee (emp_username, emp_password, emp_name, emp_dob, tfn_no, emp_address, emp_phone) 
				VALUES ('{username}', '{password}', '{name}', '{dob}', '{tfn}', '{address}', '{phone}');"""
				.format(username=username, password=password, name=name, dob=dobs, tfn=tfn, address=addresse, phone=phone))

			cursor.close()

			return render(request,'home.html',context)

		except sqlite3.Error as error:
			print("Error while connecting to sqlite", error)
			return HttpResponse("Registeration Failed")

		except Exception as e:
			print(e)
			return HttpResponse("Registeration Failed")

	return render(request,'register.html',context)