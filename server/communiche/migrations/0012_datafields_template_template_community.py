# Generated by Django 4.2.11 on 2024-04-06 12:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('communiche', '0011_rename_datafield_datafields'),
    ]

    operations = [
        migrations.AddField(
            model_name='datafields',
            name='template',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='template', to='communiche.template'),
        ),
        migrations.AddField(
            model_name='template',
            name='community',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='community', to='communiche.community'),
        ),
    ]
