from django.db import models

class Hostel(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)  # UGX
    total_rooms = models.IntegerField(default=10)
    
    @property
    def rooms_booked(self):
        return self.bookings.filter(status__in=['pending', 'confirmed']).count()
    
    @property
    def rooms_left(self):
        return max(0, self.total_rooms - self.rooms_booked)
    
    @property
    def isFree(self):
        return self.rooms_left > 0

    def __str__(self):
        return self.name

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending - Pay at hostel'),
        ('confirmed', 'Confirmed - Paid'),
        ('cancelled', 'Cancelled'),
    ]
    
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE, related_name='bookings')
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    booked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.hostel.name} - {self.status}"