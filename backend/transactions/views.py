
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Transaction, Category
from .serializers import (
    TransactionSerializer, CategorySerializer, TransactionStatsSerializer
)
from .filters import TransactionFilter


class CategoryViewSet(viewsets.ModelViewSet):
    """CRUD operations for categories"""
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'type', 'created_at']
    ordering = ['type', 'name']
    
    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)


class TransactionViewSet(viewsets.ModelViewSet):
    """CRUD operations for transactions"""
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = TransactionFilter
    search_fields = ['name', 'description']
    ordering_fields = ['date', 'amount', 'created_at']
    ordering = ['-date', '-created_at']
    
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).select_related('category')
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get transaction statistics"""
        queryset = self.filter_queryset(self.get_queryset())
        
        # Calculate statistics
        stats = queryset.aggregate(
            total_income=Sum('amount', filter=Q(type='income')) or 0,
            total_expenses=Sum('amount', filter=Q(type='expense')) or 0,
            transaction_count=Count('id'),
            income_count=Count('id', filter=Q(type='income')),
            expense_count=Count('id', filter=Q(type='expense')),
        )
        
        stats['total_expenses'] = abs(stats['total_expenses'])
        stats['balance'] = stats['total_income'] - stats['total_expenses']
        
        serializer = TransactionStatsSerializer(stats)
        return Response(serializer.data)
