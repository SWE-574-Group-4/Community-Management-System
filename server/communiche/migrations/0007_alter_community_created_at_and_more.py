# Generated by Django 4.2.11 on 2024-04-06 10:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('communiche', '0006_rename_owner_id_community_owner'),
    ]

    operations = [
        migrations.AlterField(
            model_name='community',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='community',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
