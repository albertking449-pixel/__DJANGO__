from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Hostel, Booking
from .serializers import HostelSerializer, BookingSerializer

@api_view(['GET'])
def hostel_list(request):
    hostels = Hostel.objects.all()
    serializer = HostelSerializer(hostels, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def book_hostel(request, pk):
    try:
        hostel = Hostel.objects.get(pk=pk)
    except Hostel.DoesNotExist:
        return Response({'error': 'Hostel not found'}, status=404)
    
    if hostel.rooms_left <= 0:
        return Response({'error': 'No rooms left'}, status=400)
    
    name = request.data.get('name')
    phone = request.data.get('phone')
    
    if not name or not phone:
        return Response({'error': 'Name and phone required'}, status=400)
    
    booking = Booking.objects.create(
        hostel=hostel,
        name=name,
        phone=phone,
        status='pending'  # Pay later
    )
    
    serializer = BookingSerializer(booking)
    return Response({'message': 'Booked! Pay cash at hostel', 'booking': serializer.data}, status=201)