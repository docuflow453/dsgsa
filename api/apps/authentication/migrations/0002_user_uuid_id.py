# Generated migration for UUID primary key

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        # Add UUID field
        migrations.AddField(
            model_name='user',
            name='uuid_id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, null=True),
        ),
        # Populate UUID for existing users
        migrations.RunSQL(
            """
            UPDATE users SET uuid_id = uuid_generate_v4() WHERE uuid_id IS NULL;
            """,
            reverse_sql=migrations.RunSQL.noop,
        ),
        # Remove old primary key
        migrations.AlterField(
            model_name='user',
            name='id',
            field=models.BigIntegerField(),
        ),
        # Set UUID as primary key
        migrations.RemoveField(
            model_name='user',
            name='id',
        ),
        migrations.RenameField(
            model_name='user',
            old_name='uuid_id',
            new_name='id',
        ),
        migrations.AlterField(
            model_name='user',
            name='id',
            field=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False),
        ),
        # Update role choices
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.CharField(
                max_length=20,
                choices=[
                    ('Admin', 'Administrator'),
                    ('Rider', 'Rider'),
                    ('Club', 'Club'),
                    ('ShowHoldingBody', 'Show Holding Body'),
                    ('SAEF', 'SAEF Administrator'),
                    ('Provincial', 'Provincial'),
                    ('Official', 'Official'),
                ],
                default='Rider'
            ),
        ),
    ]

