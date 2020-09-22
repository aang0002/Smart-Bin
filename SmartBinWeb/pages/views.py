from django.http import HttpResponse, JsonResponse
from django.views.generic import View
from django.shortcuts import render
from django.shortcuts import get_object_or_404	# so that a 404 page will be shown on an invalid req
from rest_framework.views import APIView	# so that normal view can return an API data
from django.db.models import ExpressionWrapper, FloatField, F
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
from .models import Employee
from .models import Bin
from .models import CollectionCenter
from .models import Assignment

from django.db.models import Sum


# Create your views here.
class HomePageView(View):
	template_name = "home.html"

	def get(self, request, *args, **kwargs):
		return render(request, "home.html", {})

class ProfileView(View):
	template_name = "profile.html"

	def get(self, request, *args, **kwargs):
		return render(request, "profile.html", {})

class LoginView(View):
	template_name = "login.html"

	def get(self, request, *args, **kwargs):
		return render(request, "login.html", {})

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
		serializer.data[0].x = "x"
		return Response(serializer.data)

	def post(self, request):
		pass


class BinList(generics.ListAPIView):
	serializer_class = BinSerializer

	def get_queryset(self):
	    queryset = Bin.objects.all()
	    return queryset


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


class WasteProduction(APIView):

	def get(self, request):
		queryset = {}
		assignments = Assignment.objects.all()
		for asgn in assignments:
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