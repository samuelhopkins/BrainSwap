# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('theswap', '0002_userprofile_summary'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, default=11, serialize=False, verbose_name='ID'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='user',
            field=models.OneToOneField(to=settings.AUTH_USER_MODEL),
        ),
    ]
