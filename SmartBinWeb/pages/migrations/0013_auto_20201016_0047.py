# Generated by Django 3.0.2 on 2020-10-15 13:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0012_auto_20201015_1409'),
    ]

    operations = [
        migrations.AddField(
            model_name='assignment',
            name='datetime_finished',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='bin',
            name='is_active',
            field=models.BooleanField(default=False),
        ),
    ]
