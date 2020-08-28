from rest_framework import serializers
from .models import Employee

class EmployeeSerializer(serializers.HyperlinkedModelSerializer):

	class Meta:
		model = Employee
		fields = ('emp_username','emp_password')
