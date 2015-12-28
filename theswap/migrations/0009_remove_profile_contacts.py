# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('theswap', '0008_auto_20151224_2241'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='contacts',
        ),
    ]
