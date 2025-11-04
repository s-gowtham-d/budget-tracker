# from rest_framework import generics, status
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated, AllowAny
# from rest_framework_simplejwt.views import TokenObtainPairView
# from django.contrib.auth import get_user_model
# from .serializers import (
#     UserSerializer, UserRegistrationSerializer, ChangePasswordSerializer, CustomTokenObtainPairSerializer
# )

# User = get_user_model()

# class CustomTokenObtainPairView(TokenObtainPairView):
#     serializer_class = CustomTokenObtainPairSerializer
    
# class RegisterView(generics.CreateAPIView):
#     """Register a new user"""
#     queryset = User.objects.all()
#     permission_classes = [AllowAny]
#     serializer_class = UserRegistrationSerializer
    
#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.save()
        
#         # Generate tokens
#         from rest_framework_simplejwt.tokens import RefreshToken
#         refresh = RefreshToken.for_user(user)
        
#         return Response({
#             'user': UserSerializer(user).data,
#             'token': str(refresh.access_token),
#             'refresh': str(refresh),
#         }, status=status.HTTP_201_CREATED)


# class ProfileView(generics.RetrieveUpdateAPIView):
#     """Get and update user profile"""
#     serializer_class = UserSerializer
#     permission_classes = [IsAuthenticated]
    
#     def get_object(self):
#         return self.request.user


# class ChangePasswordView(generics.UpdateAPIView):
#     """Change user password"""
#     serializer_class = ChangePasswordSerializer
#     permission_classes = [IsAuthenticated]
    
#     def update(self, request, *args, **kwargs):
#         user = request.user
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
        
#         # Check old password
#         if not user.check_password(serializer.validated_data['old_password']):
#             return Response(
#                 {'old_password': 'Wrong password'},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
        
#         # Set new password
#         user.set_password(serializer.validated_data['new_password'])
#         user.save()
        
#         return Response(
#             {'message': 'Password updated successfully'},
#             status=status.HTTP_200_OK
#         )


from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from .serializers import (
    UserSerializer, 
    UserRegistrationSerializer, 
    ChangePasswordSerializer, 
    CustomTokenObtainPairSerializer
)

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom JWT token view with user data"""
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """Register a new user"""
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)


class ProfileView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, and delete user profile"""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        """Update user profile"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        """Delete user account"""
        instance = self.get_object()
        
        # You might want to add additional logic here like:
        # - Soft delete instead of hard delete
        # - Send confirmation email
        # - Delete related data
        
        self.perform_destroy(instance)
        return Response(
            {'message': 'Account deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )


class ChangePasswordView(generics.UpdateAPIView):
    """Change user password"""
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]
    
    def update(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Check old password
        if not user.check_password(serializer.validated_data['old_password']):
            return Response(
                {'old_password': ['Wrong password']},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Set new password
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        # Optionally invalidate all other sessions/tokens
        # You might want to force re-login after password change
        
        return Response(
            {'message': 'Password updated successfully'},
            status=status.HTTP_200_OK
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_user_data(request):
    """Export all user data"""
    user = request.user
    
    # Collect all user data
    data = {
        'profile': UserSerializer(user).data,
        'transactions': [],  # Add transaction serializer data
        'budgets': [],  # Add budget serializer data
        'goals': [],  # Add goals serializer data
        'categories': [],  # Add categories serializer data
    }
    
    # If you have related models, add them here
    # Example:
    # from .models import Transaction, Budget, Goal
    # data['transactions'] = TransactionSerializer(
    #     Transaction.objects.filter(user=user), many=True
    # ).data
    
    return JsonResponse(data, safe=False)

