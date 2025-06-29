from django.db import migrations
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType


def create_groups(apps, schema_editor):
    # Создаем группы
    developer_group, created = Group.objects.get_or_create(name='Застройщики')
    buyer_group, created = Group.objects.get_or_create(name='Покупатели')
    admin_group, created = Group.objects.get_or_create(name='Администраторы')

    # Получаем все разрешения
    content_type = ContentType.objects.get_for_model(Group)
    all_permissions = Permission.objects.filter(content_type=content_type)
    # Назначаем разрешения группам
    admin_group.permissions.set(all_permissions)
    developer_group.permissions.set([])  # Настраивайте по необходимости
    buyer_group.permissions.set([])  # Настраивайте по необходимости


class Migration(migrations.Migration):
    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_groups),
    ]