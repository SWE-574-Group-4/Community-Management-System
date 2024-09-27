# Generated by Django 3.2.8 on 2024-04-14 13:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('communiche', '0020_communitytemplates'),
    ]

    operations = [
        migrations.AddField(
            model_name='template',
            name='community',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='templates', to='communiche.community'),
        ),
        migrations.DeleteModel(
            name='CommunityTemplates',
        ),
    ]
