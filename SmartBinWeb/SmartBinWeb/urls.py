"""SmartBinWeb URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.conf.urls import url
from django.urls import path, include
from pages.views import HomePageView
from pages.views import AdminMainPageView
from pages.views import register_view
from pages.views import ValidateLoginView
from pages.views import LoginView
from pages.views import ProfileView
from pages.views import EmployeePerformanceView
from pages.views import BinFrequencyView
from pages.views import EmployeeList
from pages.views import BinList
from pages.views import WasteProduction
from pages.views import BinFrequency
from pages.views import CollectionCenterList
from pages.views import NearestBinList
from pages.views import NearestCollectionCenterList
from rest_framework.urlpatterns import format_suffix_patterns
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    ### GET page urls ###
    path('', LoginView.as_view(), name='login'),
    path('login/', LoginView.as_view(), name='login'),
    path('home/', HomePageView.as_view(), name='home'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('employeeperformance/', EmployeePerformanceView.as_view(), name='employee pergormance'),
    path('binfrequency/', BinFrequencyView.as_view(), name='bin frequency'),
    path('register/', register_view, name='register'),
    path('admin/', admin.site.urls),
    path('smartbinadmin/', AdminMainPageView.as_view(), name='admin-main'),
    ### REST API urls ###
    url('^validatelogin/(?P<username>.+)/(?P<password>.+)/$', ValidateLoginView.as_view()),
    url(r'^getemployees', EmployeeList.as_view()),
    url(r'^getbins', BinList.as_view()),
    url(r'^getwasteproduction', WasteProduction.as_view()),
    url(r'^getbinfrequency', BinFrequency.as_view()),
    url(r'^getcolcens', CollectionCenterList.as_view()),
    url('^nearestbins/(?P<lat>.+)/(?P<long>.+)/(?P<limit>.+)/', NearestBinList.as_view()),
    url('^nearestcolcen/(?P<lat>.+)/(?P<long>.+)/', NearestCollectionCenterList.as_view()),
]

urlpatterns += staticfiles_urlpatterns()
