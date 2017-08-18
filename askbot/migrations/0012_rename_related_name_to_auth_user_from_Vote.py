# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('askbot', '0011_auto_20160110_1343'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vote',
            name='user',
            field=models.ForeignKey(related_name='askbot_votes', to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
    ]
