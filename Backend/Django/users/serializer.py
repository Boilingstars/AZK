from rest_framework import serializers
from mainapp.models import Apartments

class ApartmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Apartments
        fields = '__all__'