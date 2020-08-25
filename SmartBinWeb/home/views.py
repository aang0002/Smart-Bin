from django.shortcuts import render
# from django.http import HttpResponse

# Create your views here.

posts = [
    {
        'author': 'Jayden Lao',
        'title': 'post 1 ',
        'content': 'first dummy data',
        'date': '18 Aug 2020'
    },
    {
        'author': 'Adrian A',
        'title': 'post 2 ',
        'content': 'second dummy data',
        'date': '19 Aug 2020'
    },

]


def home(request):

    context = {
        'posts': posts
    }

    return render(request, 'home/login.html', context)
