
# import django_filters
# from .models import Transaction


# class TransactionFilter(django_filters.FilterSet):
#     """Filters for transactions"""
#     min_amount = django_filters.NumberFilter(field_name='amount', lookup_expr='gte')
#     max_amount = django_filters.NumberFilter(field_name='amount', lookup_expr='lte')
#     start_date = django_filters.DateFilter(field_name='date', lookup_expr='gte')
#     end_date = django_filters.DateFilter(field_name='date', lookup_expr='lte')
#     type = django_filters.ChoiceFilter(choices=Transaction.TRANSACTION_TYPES)
#     category = django_filters.NumberFilter(field_name='category__id')
    
#     class Meta:
#         model = Transaction
#         fields = ['type', 'category', 'min_amount', 'max_amount', 'start_date', 'end_date']
import django_filters
from django.utils.dateparse import parse_datetime
from .models import Transaction


class TransactionFilter(django_filters.FilterSet):
    """Comprehensive filters for transactions"""

    minAmount = django_filters.NumberFilter(field_name='amount', lookup_expr='gte')
    maxAmount = django_filters.NumberFilter(field_name='amount', lookup_expr='lte')
    startDate = django_filters.CharFilter(method='filter_start_date')
    endDate = django_filters.CharFilter(method='filter_end_date')
    type = django_filters.CharFilter(method='filter_type')
    category = django_filters.CharFilter(method='filter_category')

    class Meta:
        model = Transaction
        fields = ['type', 'category', 'minAmount', 'maxAmount', 'startDate', 'endDate']

    def filter_type(self, queryset, name, value):
        """Filter by transaction type, ignore 'all'"""
        if value and value != 'all':
            return queryset.filter(type=value)
        return queryset

    def filter_category(self, queryset, name, value):
        """Filter by category name or ID, ignore 'all'"""
        if not value or value == 'all':
            return queryset
        # Try by ID
        if value.isdigit():
            return queryset.filter(category__id=value)
        # Else by name (case-insensitive)
        return queryset.filter(category__name__iexact=value)

    def filter_start_date(self, queryset, name, value):
        """Filter by start date (handles ISO format)"""
        if not value:
            return queryset
        dt = parse_datetime(value)
        if dt:
            return queryset.filter(date__gte=dt.date())
        return queryset

    def filter_end_date(self, queryset, name, value):
        """Filter by end date (handles ISO format)"""
        if not value:
            return queryset
        dt = parse_datetime(value)
        if dt:
            return queryset.filter(date__lte=dt.date())
        return queryset
