# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('theswap', '0012_auto_20151225_0032'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='recipient_name',
            field=models.CharField(default=b'Sam', max_length=200),
        ),
        migrations.AddField(
            model_name='message',
            name='sender_name',
            field=models.CharField(default=b'Sam', max_length=200),
        ),
    ]
