# Generated by Django 3.0.2 on 2020-08-26 11:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0004_auto_20200826_2101'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employee',
            name='emp_username',
            field=models.CharField(max_length=50, primary_key=True, serialize=False),
        ),
    ]