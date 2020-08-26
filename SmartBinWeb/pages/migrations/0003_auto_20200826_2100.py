# Generated by Django 3.0.2 on 2020-08-26 11:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0002_remove_bin_area_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employee',
            name='emp_points',
            field=models.PositiveSmallIntegerField(blank=True, default=0),
        ),
        migrations.AlterField(
            model_name='employee',
            name='on_shift',
            field=models.BooleanField(blank=True, default=True),
        ),
    ]