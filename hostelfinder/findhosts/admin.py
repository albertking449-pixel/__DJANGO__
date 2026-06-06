from django.contrib import admin
from .models import Hostel, Booking

@admin.register(Hostel)
class HostelAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'price', 'total_rooms', 'rooms_booked', 'rooms_left', 'isFree']
    list_filter = ['location']

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'hostel', 'status', 'booked_at']
    list_filter = ['status', 'hostel']
    actions = ['mark_confirmed']
    
    def mark_confirmed(self, request, queryset):
        queryset.update(status='confirmed')