# Generated by Django 3.0.2 on 2020-08-30 04:37

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Bin',
            fields=[
                ('bin_num', models.CharField(max_length=7, primary_key=True, serialize=False, validators=[django.core.validators.RegexValidator('^[0-9]{7}$')])),
                ('bin_type', models.CharField(choices=[('RECYCLE', 'RECYCLE'), ('ORGANIC', 'ORGANIC'), ('GENERAL_WASTE', 'GENERAL_WASTE')], default='GENERAL_WASTE', max_length=50)),
                ('bin_fullness', models.PositiveIntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)])),
                ('bin_longitude', models.DecimalField(decimal_places=5, max_digits=8)),
                ('bin_latitude', models.DecimalField(decimal_places=5, max_digits=8)),
                ('last_cleared_datetime', models.DateTimeField()),
                ('installation_date', models.DateField(blank=True)),
                ('bin_status', models.CharField(max_length=300)),
            ],
        ),
        migrations.CreateModel(
            name='CollectionCenter',
            fields=[
                ('colcen_id', models.CharField(max_length=4, primary_key=True, serialize=False, validators=[django.core.validators.RegexValidator('^[0-9]{4}$')])),
                ('colcen_longitude', models.DecimalField(decimal_places=5, max_digits=8)),
                ('colcen_latitude', models.DecimalField(decimal_places=5, max_digits=8)),
                ('colcen_phone', models.CharField(max_length=10, validators=[django.core.validators.RegexValidator('^[0-9]{10}$')])),
                ('manager_name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('emp_username', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('emp_password', models.CharField(default='fit', max_length=100)),
                ('emp_name', models.CharField(max_length=100)),
                ('emp_dob', models.DateField()),
                ('tfn_no', models.CharField(max_length=10, validators=[django.core.validators.RegexValidator('^[0-9]{10}$')])),
                ('emp_address', models.CharField(max_length=100)),
                ('emp_phone', models.CharField(max_length=10, validators=[django.core.validators.RegexValidator('^[0-9]{10}$')])),
                ('on_shift', models.BooleanField(blank=True, default=True, null=True)),
                ('emp_points', models.PositiveSmallIntegerField(blank=True, default=0, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='ToDoList',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=300)),
                ('complete', models.BooleanField()),
                ('todolist', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pages.ToDoList')),
            ],
        ),
        migrations.CreateModel(
            name='DamageReport',
            fields=[
                ('dmg_id', models.CharField(max_length=7, primary_key=True, serialize=False, validators=[django.core.validators.RegexValidator('^[0-9]{7}$')])),
                ('desc', models.CharField(max_length=300)),
                ('severity', models.PositiveIntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(10)])),
                ('bin_num', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pages.Bin')),
            ],
        ),
        migrations.CreateModel(
            name='Assignment',
            fields=[
                ('asgn_id', models.CharField(max_length=10, primary_key=True, serialize=False, validators=[django.core.validators.RegexValidator('^[0-9]{10}$')])),
                ('datetime_created', models.DateTimeField()),
                ('datetime_finished', models.DateTimeField()),
                ('desc', models.CharField(max_length=200)),
                ('bin_num', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pages.Bin')),
                ('colcen_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='pages.CollectionCenter')),
                ('emp_username', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='pages.Employee')),
            ],
        ),
    ]
