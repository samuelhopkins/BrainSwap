# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('theswap', '0014_auto_20151228_0419'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='has_unread_messages',
            field=models.BooleanField(default=False),
        ),
    ]
