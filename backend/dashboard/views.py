
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum, Count, Q, Value, DecimalField
from datetime import datetime, timedelta
from transactions.models import Transaction
from transactions.serializers import TransactionSerializer
from budgets.models import Budget
from django.db.models.functions import Coalesce
from decimal import Decimal


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def dashboard_summary(request):
#     """Get dashboard summary statistics"""
#     user = request.user
    
#     # Get date range (default: current month)
#     today = datetime.today().date()
#     start_of_month = datetime(today.year, today.month, 1).date()
    
#     # Calculate statistics
#     transactions = Transaction.objects.filter(user=user)
#     month_transactions = transactions.filter(date__gte=start_of_month)
    
#     stats = month_transactions.aggregate(
#         total_income=Sum('amount', filter=Q(type='income')) or 0,
#         total_expenses=Sum('amount', filter=Q(type='expense')) or 0,
#         transaction_count=Count('id')
#     )
    
#     stats['total_expenses'] = abs(stats['total_expenses'] or 0)
#     stats['balance'] = stats['total_income'] - stats['total_expenses']
    
#     # Budget status
#     current_month_budget = Budget.objects.filter(
#         user=user,
#         month=start_of_month
#     )
#     total_budget = current_month_budget.aggregate(total=Sum('amount'))['total'] or 0
#     total_spent = sum(b.get_spent() for b in current_month_budget)
    
#     # Income vs Expenses for last 6 months
#     six_months_ago = today - timedelta(days=180)
#     monthly_data = []
    
#     for i in range(6):
#         month_date = today.replace(day=1) - timedelta(days=30 * i)
#         month_start = month_date.replace(day=1)
#         if month_date.month == 12:
#             month_end = month_date.replace(year=month_date.year + 1, month=1, day=1)
#         else:
#             month_end = month_date.replace(month=month_date.month + 1, day=1)
        
#         month_trans = transactions.filter(date__gte=month_start, date__lt=month_end)
#         month_stats = month_trans.aggregate(
#             income=Sum('amount', filter=Q(type='income')) or 0,
#             expense=Sum('amount', filter=Q(type='expense')) or 0
#         )
        
#         monthly_data.append({
#             'month': month_start.strftime('%b'),
#             'income': float(month_stats['income']),
#             'expense': abs(float(month_stats['expense']))
#         })
    
#     monthly_data.reverse()
    
#     # Expense breakdown by category
#     expense_by_category = Transaction.objects.filter(
#         user=user,
#         type='expense',
#         date__gte=start_of_month
#     ).values('category__name', 'category__icon').annotate(
#         total=Sum('amount')
#     ).order_by('-total')[:6]
    
#     category_data = [
#         {
#             'category': item['category__name'],
#             'amount': abs(float(item['total'])),
#             'icon': item['category__icon']
#         }
#         for item in expense_by_category
#     ]
    
#     return Response({
#         'summary': {
#             'total_income': stats['total_income'],
#             'total_expenses': stats['total_expenses'],
#             'balance': stats['balance'],
#             'transaction_count': stats['transaction_count'],
#         },
#         'budget': {
#             'total_budget': float(total_budget),
#             'total_spent': float(total_spent),
#             'remaining': float(total_budget) - float(total_spent),
#             'percentage_used': (float(total_spent) / float(total_budget) * 100) if total_budget > 0 else 0
#         },
#         'monthly_data': monthly_data,
#         'category_breakdown': category_data
#     })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_summary(request):
    """Get dashboard summary statistics"""
    user = request.user
    
    today = datetime.today().date()
    start_of_month = datetime(today.year, today.month, 1).date()
    
    transactions = Transaction.objects.filter(user=user)
    month_transactions = transactions.filter(date__gte=start_of_month)
    
    stats = month_transactions.aggregate(
        total_income=Coalesce(Sum('amount', filter=Q(type='income')), Value(Decimal('0.00'), output_field=DecimalField())),
        total_expenses=Coalesce(Sum('amount', filter=Q(type='expense')), Value(Decimal('0.00'), output_field=DecimalField())),
        transaction_count=Count('id')
    )

    stats['total_expenses'] = abs(stats['total_expenses'])
    stats['balance'] = stats['total_income'] - stats['total_expenses']
    
    # Budget status
    current_month_budget = Budget.objects.filter(
        user=user,
        month=start_of_month
    )
    total_budget = current_month_budget.aggregate(
        total=Coalesce(Sum('amount'), Value(Decimal('0.00'), output_field=DecimalField()))
    )['total']
    total_spent = sum(Decimal(b.get_spent()) for b in current_month_budget) or Decimal('0.00')
    
    # Income vs Expenses for last 6 months
    monthly_data = []
    for i in range(6):
        month_date = today.replace(day=1) - timedelta(days=30 * i)
        month_start = month_date.replace(day=1)
        if month_date.month == 12:
            month_end = month_date.replace(year=month_date.year + 1, month=1, day=1)
        else:
            month_end = month_date.replace(month=month_date.month + 1, day=1)
        
        month_trans = transactions.filter(date__gte=month_start, date__lt=month_end)
        month_stats = month_trans.aggregate(
            income=Coalesce(Sum('amount', filter=Q(type='income')), Value(Decimal('0.00'), output_field=DecimalField())),
            expense=Coalesce(Sum('amount', filter=Q(type='expense')), Value(Decimal('0.00'), output_field=DecimalField()))
        )
        
        monthly_data.append({
            'month': month_start.strftime('%b'),
            'income': float(month_stats['income']),
            'expense': abs(float(month_stats['expense']))
        })
    
    monthly_data.reverse()
    
    # Expense breakdown by category
    expense_by_category = Transaction.objects.filter(
        user=user,
        type='expense',
        date__gte=start_of_month
    ).values('category__name', 'category__icon').annotate(
        total=Coalesce(Sum('amount'), Value(Decimal('0.00'), output_field=DecimalField()))
    ).order_by('-total')[:6]
    
    category_data = [
        {
            'category': item['category__name'],
            'amount': abs(float(item['total'])),
            'icon': item['category__icon']
        }
        for item in expense_by_category
    ]
    
    return Response({
        'summary': {
            'total_income': float(stats['total_income']),
            'total_expenses': float(stats['total_expenses']),
            'balance': float(stats['balance']),
            'transaction_count': stats['transaction_count'],
        },
        'budget': {
            'total_budget': float(total_budget),
            'total_spent': float(total_spent),
            'remaining': float(total_budget - total_spent),
            'percentage_used': (float(total_spent) / float(total_budget) * 100) if total_budget > 0 else 0
        },
        'monthly_data': monthly_data,
        'category_breakdown': category_data
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_transactions(request):
    """Get recent transactions"""
    limit = int(request.query_params.get('limit', 10))
    transactions = Transaction.objects.filter(
        user=request.user
    ).select_related('category').order_by('-date', '-created_at')[:limit]
    
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)

