from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    user_type = forms.ChoiceField(
        choices=CustomUser.USER_TYPES,
        label="Тип пользователя",
        widget=forms.Select(attrs={'class': 'form-control'})
    )

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'user_type', 'password1', 'password2')

class CustomAuthenticationForm(AuthenticationForm):
    username = forms.CharField(label='Логин или Email')
    user_type = forms.ChoiceField(
        choices=CustomUser.USER_TYPES,
        label="Тип пользователя",
        widget=forms.Select(attrs={'class': 'form-control'})
    )
