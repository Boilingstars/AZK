# Generated by Django 5.1.7 on 2025-06-28 21:34

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0002_remove_apartments_residential_complex_and_more'),
        ('users', '0005_alter_developer_company_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='developer',
            name='company_name',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='mainapp.developers'),
        ),
    ]
