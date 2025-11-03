from django.contrib import admin
from django.contrib.auth import get_user_model
from transactions.models import Transaction, Category
from budgets.models import Budget

User = get_user_model()


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'username', 'first_name', 'last_name', 'is_active', 'created_at']
    list_filter = ['is_active', 'is_staff', 'created_at']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering = ['-created_at']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'user', 'icon', 'created_at']
    list_filter = ['type', 'created_at']
    search_fields = ['name', 'user__email']
    ordering = ['type', 'name']


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['name', 'amount', 'type', 'category', 'user', 'date', 'created_at']
    list_filter = ['type', 'date', 'created_at']
    search_fields = ['name', 'user__email', 'category__name']
    ordering = ['-date', '-created_at']
    date_hierarchy = 'date'


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ['category', 'amount', 'month', 'user', 'percentage_used']
    list_filter = ['month', 'created_at']
    search_fields = ['category__name', 'user__email']
    ordering = ['-month', 'category__name']
