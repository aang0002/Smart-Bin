# Generated by Django 3.0.2 on 2020-10-14 10:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0006_auto_20201014_2139'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='assignment',
            name='desc',
        ),
        migrations.AlterField(
            model_name='damagereport',
            name='desc',
            field=models.CharField(max_length=300, null=True),
        ),
        migrations.AlterField(
            model_name='damagereport',
            name='dmg_type',
            field=models.CharField(max_length=300),
        ),
    ]
