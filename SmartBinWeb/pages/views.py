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
from .serializers import EmployeeSerializer
from .serializers import BinSerializer
from .models import Employee
from .models import Bin
from django.contrib.auth.forms import UserCreationForm
import os
import sqlite3
import math


# Create your views here.
class HomePageView(View):
	template_name = "home.html"

	def get(self, request, *args, **kwargs):
		return render(request, "home.html", {})

class LoginView(View):
	template_name = "login.html"

	def get(self, request, *args, **kwargs):
		return render(request, "login.html", {})



"""
####################### REST-API views  ###################################################
"""

class EmployeeList(APIView):

	def get(self, request):
		employees1 = Employee.objects.all()
		serializer = EmployeeSerializer(employees1, many=True)
		return Response(serializer.data)

	def post(self, request):
		pass

class BinList(generics.ListAPIView):
	serializer_class = BinSerializer

	def get_queryset(self):
	    queryset = Bin.objects.all()
	    return queryset

class NearestBinList(generics.ListAPIView):
	serializer_class = BinSerializer

	def get_queryset(self):
	    cleaner_long = self.kwargs['long']
	    cleaner_lat = self.kwargs['lat']
	    limit = self.kwargs['limit']

	    queryset = Bin.objects.annotate(distance = Sqrt((cleaner_long-F('bin_longitude'))**2 + (cleaner_lat-F('bin_latitude'))**2))
	    queryset = queryset.order_by('distance')[:5]
	    print(queryset)
	    return queryset

	def distance(self, x1, y1, x2, y2):
	 	return math.sqrt(((y2-y1)**2) + ((x2-x1)**2))

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