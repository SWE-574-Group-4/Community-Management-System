# Generated by Django 3.2.8 on 2024-05-06 21:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('communiche', '0032_pcomment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pcomment',
            name='content',
            field=models.CharField(max_length=5000),
        ),
    ]
