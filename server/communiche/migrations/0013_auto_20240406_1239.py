# Generated by Django 4.2.11 on 2024-04-06 12:39

from django.db import migrations

def create_fields(apps, schema_editor):
    DataFields = apps.get_model('communiche', 'DataFields')
    DataFields.objects.create(data_type='text', label='Text')
    DataFields.objects.create(data_type='date', label='Date')
    DataFields.objects.create(data_type='geo', label='Geolocation')
    DataFields.objects.create(data_type='number', label='Number')
    DataFields.objects.create(data_type='image', label='Image')
    DataFields.objects.create(data_type='video', label='Video')
    DataFields.objects.create(data_type='audio', label='Audio')


class Migration(migrations.Migration):

    dependencies = [
        ('communiche', '0012_datafields_template_template_community'),
    ]

    operations = [
        migrations.RunPython(create_fields),
    ]

