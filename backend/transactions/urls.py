
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'transactions'

router = DefaultRouter()
router.register(r'transactions', views.TransactionViewSet, basename='transaction')
router.register(r'categories', views.CategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),
]
