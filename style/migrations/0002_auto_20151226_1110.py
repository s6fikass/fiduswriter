# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2015-12-26 17:10
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('style', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='documentstyle',
            name='fonts',
            field=models.ManyToManyField(blank=True, default=None, to='style.DocumentFont'),
        ),
    ]
