from rest_framework import serializers
from .models import Employee
from .models import Bin
from .models import CollectionCenter

class EmployeeSerializer(serializers.HyperlinkedModelSerializer):

	class Meta:
		model = Employee
		fields = ('emp_username', 'emp_name', 'emp_dob', 'tfn_no', 'emp_address', 'emp_phone', 'on_shift', 'emp_points')

class BinSerializer(serializers.HyperlinkedModelSerializer):

	class Meta:
		model = Bin
		fields = ('bin_num', 'bin_type', 'bin_fullness', 'bin_longitude', 'bin_latitude', 'last_cleared_datetime', 'installation_date', 'bin_status', 'postcode')

class CollectionCenterSerializer(serializers.HyperlinkedModelSerializer):

	class Meta:
		model = CollectionCenter
		fields = ('colcen_id', 'colcen_longitude', 'colcen_latitude', 'colcen_phone', 'manager_name')