from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group
from .models import CustomUser
from mainapp.models import Developers, Neighborhoods, Apartments

admin.site.register(Developers)
admin.site.register(Neighborhoods)
admin.site.register(Apartments)

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'user_type', 'is_staff')
    list_filter = ('user_type', 'is_staff', 'is_superuser')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Персональная информация', {'fields': ('first_name', 'last_name', 'email')}),
        ('Права доступа', {
            'fields': ('user_type', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Даты', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'user_type'),
        }),
    )

admin.site.register(CustomUser, CustomUserAdmin)

# Удаляем стандартную группу и создаем свои
admin.site.unregister(Group)

@admin.register(Group)
class CustomGroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'get_permissions_count')

    def get_permissions_count(self, obj):
        return obj.permissions.count()

    get_permissions_count.short_description = 8

