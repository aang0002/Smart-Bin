# Generated by Django 3.0.2 on 2020-10-15 03:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0010_damagereport_dete_solved'),
    ]

    operations = [
        migrations.RenameField(
            model_name='damagereport',
            old_name='dete_solved',
            new_name='date_solved',
        ),
    ]
