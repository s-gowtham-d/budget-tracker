from rest_framework import serializers
from .models import Budget


class BudgetSerializer(serializers.ModelSerializer):
    """Serializer for budgets"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_icon = serializers.CharField(source='category.icon', read_only=True)
    spent = serializers.SerializerMethodField()
    remaining = serializers.ReadOnlyField()
    percentage_used = serializers.ReadOnlyField()
    
    class Meta:
        model = Budget
        fields = [
            'id', 'category', 'category_name', 'category_icon',
            'amount', 'month', 'spent', 'remaining', 'percentage_used',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_spent(self, obj):
        return obj.get_spent()
    
    def validate_category(self, value):
        """Ensure category belongs to user and is expense type"""
        request = self.context.get('request')
        if value.user != request.user:
            raise serializers.ValidationError("Invalid category")
        if value.type != 'expense':
            raise serializers.ValidationError("Budget can only be set for expense categories")
        return value
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class BudgetComparisonSerializer(serializers.Serializer):
    """Serializer for budget comparison data"""
    category = serializers.CharField()
    budget = serializers.DecimalField(max_digits=12, decimal_places=2)
    spent = serializers.DecimalField(max_digits=12, decimal_places=2)
    percentage = serializers.FloatField()
