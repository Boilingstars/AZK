from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import Group
from .models import CustomUser

@receiver(post_save, sender=CustomUser)
def add_user_to_admin_group(sender, instance, created, **kwargs):
    if created and instance.user_type == 'ADMIN':
        admin_group, _ = Group.objects.get_or_create(name='Admin')
        instance.groups.add(admin_group)
