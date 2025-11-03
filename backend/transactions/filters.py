
import django_filters
from .models import Transaction


class TransactionFilter(django_filters.FilterSet):
    """Filters for transactions"""
    min_amount = django_filters.NumberFilter(field_name='amount', lookup_expr='gte')
    max_amount = django_filters.NumberFilter(field_name='amount', lookup_expr='lte')
    start_date = django_filters.DateFilter(field_name='date', lookup_expr='gte')
    end_date = django_filters.DateFilter(field_name='date', lookup_expr='lte')
    type = django_filters.ChoiceFilter(choices=Transaction.TRANSACTION_TYPES)
    category = django_filters.NumberFilter(field_name='category__id')
    
    class Meta:
        model = Transaction
        fields = ['type', 'category', 'min_amount', 'max_amount', 'start_date', 'end_date']
