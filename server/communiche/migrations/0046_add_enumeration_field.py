from django.db import migrations

def add_enumerated_field(apps, schema_editor):
    DataFields = apps.get_model('communiche', 'DataFields')
    DataFields.objects.create(data_type='enum', label='Enumerated', preferred_keyword='')

class Migration(migrations.Migration):

    dependencies = [
        ('communiche', '0045_badge_types_user_created_at'),
    ]
    operations = [
        migrations.RunPython(add_enumerated_field),
    ]