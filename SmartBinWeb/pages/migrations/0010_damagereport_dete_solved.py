# Generated by Django 3.0.2 on 2020-10-15 03:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0009_auto_20201014_2208'),
    ]

    operations = [
        migrations.AddField(
            model_name='damagereport',
            name='dete_solved',
            field=models.DateTimeField(null=True),
        ),
    ]