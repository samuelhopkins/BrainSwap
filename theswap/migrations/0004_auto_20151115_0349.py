# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('theswap', '0003_auto_20151115_0330'),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('summary', models.TextField()),
                ('defs', models.ManyToManyField(to='theswap.Def')),
                ('majors', models.ManyToManyField(to='theswap.Major')),
                ('profs', models.ManyToManyField(to='theswap.Prof')),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.RemoveField(
            model_name='userprofile',
            name='defs',
        ),
        migrations.RemoveField(
            model_name='userprofile',
            name='majors',
        ),
        migrations.RemoveField(
            model_name='userprofile',
            name='profs',
        ),
        migrations.RemoveField(
            model_name='userprofile',
            name='user',
        ),
        migrations.DeleteModel(
            name='UserProfile',
        ),
    ]
