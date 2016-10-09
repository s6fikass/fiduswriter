# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-10-06 23:32
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import usermedia.models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('usermedia', '0004_auto_20160218_2250'),
    ]

    operations = [
        migrations.CreateModel(
            name='Style',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=128)),
                ('added', models.DateTimeField(auto_now_add=True)),
                ('style', models.FileField(upload_to=usermedia.models.get_cssfile_path)),
                ('file_type', models.CharField(blank=True, max_length=20, null=True)),
                ('owner', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='style_owner', to=settings.AUTH_USER_MODEL)),
                ('uploader', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='style_uploader', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
