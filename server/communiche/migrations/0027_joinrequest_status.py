# Generated by Django 3.2.8 on 2024-04-25 11:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('communiche', '0026_communityuser_role'),
    ]

    operations = [
        migrations.AddField(
            model_name='joinrequest',
            name='status',
            field=models.IntegerField(default=0),
        ),
    ]
