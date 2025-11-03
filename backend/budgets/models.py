from django.db import models
from django.conf import settings
from core.models import TimeStampedModel


class Budget(TimeStampedModel):
    """
    Budget model for monthly category budgets
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='budgets'
    )
    category = models.ForeignKey(
        'transactions.Category',
        on_delete=models.CASCADE,
        related_name='budgets'
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    month = models.DateField()  # Store first day of month
    
    class Meta:
        db_table = 'budgets'
        verbose_name = 'Budget'
        verbose_name_plural = 'Budgets'
        unique_together = ['user', 'category', 'month']
        ordering = ['-month', 'category__name']
        indexes = [
            models.Index(fields=['user', 'month']),
        ]
    
    def __str__(self):
        return f"{self.category.name} - ${self.amount} ({self.month.strftime('%B %Y')})"
    
    def get_spent(self):
        """Calculate total spent in this category for the month"""
        from transactions.models import Transaction
        from django.db.models import Sum
        
        # Get start and end of month
        from datetime import datetime
        start_date = self.month
        if self.month.month == 12:
            end_date = datetime(self.month.year + 1, 1, 1).date()
        else:
            end_date = datetime(self.month.year, self.month.month + 1, 1).date()
        
        spent = Transaction.objects.filter(
            user=self.user,
            category=self.category,
            type='expense',
            date__gte=start_date,
            date__lt=end_date
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        return abs(spent)
    
    @property
    def remaining(self):
        return float(self.amount) - float(self.get_spent())
    
    @property
    def percentage_used(self):
        if self.amount == 0:
            return 0
        return (float(self.get_spent()) / float(self.amount)) * 100

