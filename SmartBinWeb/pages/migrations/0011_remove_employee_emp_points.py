# Generated by Django 3.0.2 on 2020-09-22 09:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0010_auto_20200922_1919'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='employee',
            name='emp_points',
        ),
    ]
