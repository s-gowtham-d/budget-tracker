
# from django.urls import path
# from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
# from . import views

# app_name = 'accounts'

# urlpatterns = [
#     # Authentication
#     path('register/', views.RegisterView.as_view(), name='register'),
#     path('login/', TokenObtainPairView.as_view(), name='login'),
#     # path('login/', views.CustomTokenObtainPairView.as_view(), name='login'),
#     path('refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    
#     # Profile
#     path('profile/', views.ProfileView.as_view(), name='profile'),
#     path('password/change/', views.ChangePasswordView.as_view(), name='change-password'),
# ]
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from .views import (
    CustomTokenObtainPairView,
    RegisterView,
    ProfileView,
    ChangePasswordView,
    export_user_data,
)

app_name = 'users'

urlpatterns = [
    # Auth endpoints
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User profile endpoints
    path('users/profile/', ProfileView.as_view(), name='profile'),
    path('users/change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('users/export-data/', export_user_data, name='export_data'),
]
