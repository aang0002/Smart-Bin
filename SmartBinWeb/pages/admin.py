from django.contrib import admin

# Register your models here.

from .models import Employee, CollectionCenter, Bin, Assignment, DamageReport

admin.site.register(Employee)
admin.site.register(CollectionCenter)
admin.site.register(Bin)
admin.site.register(Assignment)
admin.site.register(DamageReport)
