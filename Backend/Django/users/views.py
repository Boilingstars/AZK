from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from .forms import CustomUserCreationForm, CustomAuthenticationForm
from .models import Developer, Customer
from mainapp.models import Apartments
from users.serializer import ApartmentsSerializer
from rest_framework import generics
from django.http import HttpResponse

def register_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            user_type = form.cleaned_data.get('user_type')

            # Создание профиля в зависимости от типа пользователя
            if user_type == 'DEVELOPER':
                Developer.objects.create(user=user)
                login(request, user)
                return redirect('developer-profile')

            elif user_type == 'CUSTOMER':
                Customer.objects.create(user=user)
                login(request, user)
                return redirect('customer-profile')

            elif user_type == 'ADMIN':
                login(request, user)
                return redirect('admin:index')
    else:
        form = CustomUserCreationForm()
    return render(request, 'register.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = CustomAuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            form_user_type = form.cleaned_data.get('user_type')

            if form_user_type == 'DEVELOPER' and user.user_type == form_user_type:
                login(request, user)
                return redirect('developer-profile')

            elif form_user_type == 'CUSTOMER' and user.user_type == form_user_type:
                login(request, user) # ЗДЕСЬ ЗАМЕНИТЬ НА RefreshToken
                return redirect('customer-profile')

            elif form_user_type == 'ADMIN' and user.user_type == form_user_type:
                login(request, user) # ЗДЕСЬ ЗАМЕНИТЬ НА RefreshToken
                return redirect('admin:index')
    else:
        form = CustomAuthenticationForm()
    return render(request, 'login.html', {'form': form})

@login_required
def customer_profile_view(request):
    return render(request, 'profile.html', {'user': request.user})

@login_required
def developer_profile_view(request):
    return render(request, 'profile.html', {'user': request.user})

def logout_view(request):
    logout(request)
    return redirect('login')

class ApartmentsList(generics.ListAPIView):
    queryset = Apartments.objects.all()
    serializer_class = ApartmentsSerializer
