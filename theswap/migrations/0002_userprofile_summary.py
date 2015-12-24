# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('theswap', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='summary',
            field=models.TextField(default='summary'),
            preserve_default=False,
        ),
    ]
