# Generated by Django 3.0.2 on 2020-10-14 11:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0007_auto_20201014_2141'),
    ]

    operations = [
        migrations.AlterField(
            model_name='damagereport',
            name='desc',
            field=models.CharField(default='', max_length=300, null=True),
        ),
    ]
