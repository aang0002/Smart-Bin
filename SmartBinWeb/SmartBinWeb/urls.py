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
from pages.views import homepage_view
from pages.views import contact_view
from pages.views import todolist_view
from pages.views import register_view
from pages.views import login
from pages.views import login_view
from pages.views import EmployeeList
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('', login_view, name='home'),
    path('home/', homepage_view, name='home'),
    path('contact/', contact_view, name='contact'),
    path('register/', register_view, name='register'),
    path('admin/', admin.site.urls),
    path('<int:id>', todolist_view, name='todolist'),
    path('login/', login, name='login'),
    url(r'^employees', EmployeeList.as_view()),
]
