# Generated by Django 4.2.11 on 2024-03-30 17:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('communiche', '0003_rename_ispublic_community_is_public_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='password',
            field=models.CharField(max_length=128),
        ),
    ]
