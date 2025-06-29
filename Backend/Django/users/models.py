from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from mainapp import models as main_models

class CustomUser(AbstractUser):
    USER_TYPES = (
        ('DEVELOPER', 'Застройщик'),
        ('CUSTOMER', 'Покупатель'),
        ('ADMIN', 'Администратор'),
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPES, verbose_name="Тип пользователя")

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"

class Developer(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='developer_profile')
    company_name = models.ForeignKey(main_models.Developers, on_delete=models.CASCADE, null=True)
    license_number = models.CharField(max_length=50)
    def __str__(self):
        return f"Developer Profile: {self.user.username}"

class Customer(models.Model):
    user = models.OneToOneField(CustomUser , on_delete=models.CASCADE, related_name='customer_profile')

    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)
    city = models.CharField(max_length=128, default='Неизвестно')

    marriage = models.TextField(max_length=15, default='Неизвестно')
    age = models.PositiveIntegerField(default=0)
    kids = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Customer Profile: {self.user.username}"