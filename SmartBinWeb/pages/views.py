from django.http import HttpResponse
from django.shortcuts import render
from .models import *

# Create your views here.
def homepage_view(request, *args, **kwargs):
	print(args, kwargs)
	print(request.user)
	return render(request, "home.html", {})

def contact_view(request, *args, **kwargs):
	return render(request, "contact.html", {})

def todolist_view(response, id):
	ls = ToDoList.objects.get(id=id)
	return HttpResponse(ls.name)