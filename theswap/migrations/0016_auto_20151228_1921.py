# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('theswap', '0015_profile_has_unread_messages'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='has_unread_messages',
        ),
        migrations.AddField(
            model_name='profile',
            name='unread_messages',
            field=models.IntegerField(default=0),
        ),
    ]
