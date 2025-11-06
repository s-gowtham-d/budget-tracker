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
                # Handle both YYYY-MM and YYYY-MM-DD formats
                if len(month) == 7:  # YYYY-MM format
                    month_date = datetime.strptime(month, '%Y-%m').date()
                else:  # YYYY-MM-DD format
                    month_date = datetime.strptime(month, '%Y-%m-%d').date()
                
                # Ensure first day of month
                month_date = month_date.replace(day=1)
                queryset = queryset.filter(month=month_date)
            except (ValueError, AttributeError):
                pass
        
        return queryset
    
    @action(detail=False, methods=['get'])
    @action(detail=False, methods=['get'])
    def comparison(self, request):
        """Get budget vs actual comparison"""
        month_param = request.query_params.get('month')
        if month_param:
            try:
                # Handle both formats
                if len(month_param) == 7:  # YYYY-MM
                    month = datetime.strptime(month_param, '%Y-%m').date()
                else:  # YYYY-MM-DD
                    month = datetime.strptime(month_param, '%Y-%m-%d').date()
                
                # Ensure first day of month
                month = month.replace(day=1)
            except (ValueError, AttributeError):
                return Response(
                    {'error': 'Invalid month format. Use YYYY-MM or YYYY-MM-DD'},
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
    
    @action(detail=False, methods=['get'])
    def available_months(self, request):
        """Return only months that have budget data or the current month"""
        user = request.user
        now = datetime.now()
        current_month = datetime(now.year, now.month, 1).date()

        # Get distinct months from budgets
        months_with_data = (
            Budget.objects.filter(user=user)
            .values_list("month", flat=True)
            .distinct()
        )

        # Always include current month
        all_months = set(months_with_data)
        all_months.add(current_month)

        # Sort months (latest first)
        sorted_months = sorted(all_months, reverse=True)

        # Format for frontend
        formatted_months = [
            {
                "value": m.strftime("%Y-%m"),
                "label": m.strftime("%B %Y"),
            }
            for m in sorted_months
        ]

        return Response(formatted_months)
