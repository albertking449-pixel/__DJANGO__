from django.urls import path
from . import views

urlpatterns = [
    path('hostels/', views.hostel_list),
    path('hostels/<int:pk>/book/', views.book_hostel),
]