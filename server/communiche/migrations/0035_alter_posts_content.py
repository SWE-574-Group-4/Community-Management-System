# Generated by Django 3.2.8 on 2024-05-19 13:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('communiche', '0034_remove_posts_comments'),
    ]

    operations = [
        migrations.AlterField(
            model_name='posts',
            name='content',
            field=models.CharField(max_length=10000),
        ),
    ]
