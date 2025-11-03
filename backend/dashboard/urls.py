
from django.urls import path
from . import views

app_name = 'dashboard'

urlpatterns = [
    path('summary/', views.dashboard_summary, name='summary'),
    path('transactions/recent/', views.recent_transactions, name='recent-transactions'),
]