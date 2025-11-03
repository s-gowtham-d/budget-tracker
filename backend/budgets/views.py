from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from datetime import datetime
from .models import Budget
from .serializers import BudgetSerializer, BudgetComparisonSerializer


class BudgetViewSet(viewsets.ModelViewSet):
    """CRUD operations for budgets"""
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Budget.objects.filter(user=self.request.user).select_related('category')
        
        # Filter by month if provided
        month = self.request.query_params.get('month')
        if month:
            try:
                month_date = datetime.strptime(month, '%Y-%m').date()
                queryset = queryset.filter(month=month_date)
            except ValueError:
                pass
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def comparison(self, request):
        """Get budget vs actual comparison"""
        # Get current month by default
        month_param = request.query_params.get('month')
        if month_param:
            try:
                month = datetime.strptime(month_param, '%Y-%m').date()
            except ValueError:
                return Response(
                    {'error': 'Invalid month format. Use YYYY-MM'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            today = datetime.today()
            month = datetime(today.year, today.month, 1).date()
        
        budgets = self.get_queryset().filter(month=month)
        
        comparison_data = []
        for budget in budgets:
            spent = budget.get_spent()
            comparison_data.append({
                'category': budget.category.name,
                'budget': budget.amount,
                'spent': spent,
                'percentage': (float(spent) / float(budget.amount) * 100) if budget.amount > 0 else 0
            })
        
        serializer = BudgetComparisonSerializer(comparison_data, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def status(self, request):
        """Get current month budget status"""
        today = datetime.today()
        current_month = datetime(today.year, today.month, 1).date()
        
        budgets = Budget.objects.filter(
            user=request.user,
            month=current_month
        )
        
        total_budget = budgets.aggregate(total=Sum('amount'))['total'] or 0
        total_spent = sum(b.get_spent() for b in budgets)
        
        return Response({
            'month': current_month.strftime('%Y-%m'),
            'total_budget': total_budget,
            'total_spent': total_spent,
            'remaining': float(total_budget) - float(total_spent),
            'percentage_used': (float(total_spent) / float(total_budget) * 100) if total_budget > 0 else 0,
            'categories': BudgetSerializer(budgets, many=True).data
        })