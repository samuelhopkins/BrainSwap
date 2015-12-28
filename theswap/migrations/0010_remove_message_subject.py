# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('theswap', '0009_remove_profile_contacts'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='message',
            name='subject',
        ),
    ]
