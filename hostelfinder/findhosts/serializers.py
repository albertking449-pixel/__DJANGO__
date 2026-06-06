from rest_framework import serializers
from .models import Hostel, Booking

class HostelSerializer(serializers.ModelSerializer):
    rooms_left = serializers.ReadOnlyField()
    isFree = serializers.ReadOnlyField()
    rooms_booked = serializers.ReadOnlyField()
    
    class Meta:
        model = Hostel
        fields = ['id', 'name', 'location', 'price', 'total_rooms', 'rooms_left', 'rooms_booked', 'isFree']

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['status', 'booked_at']