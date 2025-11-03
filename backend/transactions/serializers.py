from rest_framework import serializers
from .models import Transaction, Category


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for categories"""
    transaction_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'type', 'icon', 'color', 'transaction_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_transaction_count(self, obj):
        return obj.transactions.count()
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class TransactionSerializer(serializers.ModelSerializer):
    """Serializer for transactions"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_icon = serializers.CharField(source='category.icon', read_only=True)
    icon = serializers.ReadOnlyField()
    
    class Meta:
        model = Transaction
        fields = [
            'id', 'name', 'amount', 'type', 'category', 'category_name',
            'category_icon', 'icon', 'date', 'description', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_category(self, value):
        """Ensure category belongs to user and matches transaction type"""
        request = self.context.get('request')
        if value.user != request.user:
            raise serializers.ValidationError("Invalid category")
        return value
    
    def validate(self, attrs):
        """Validate transaction type matches category type"""
        if 'category' in attrs and 'type' in attrs:
            if attrs['category'].type != attrs['type']:
                raise serializers.ValidationError({
                    "category": f"Category must be of type {attrs['type']}"
                })
        return attrs
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class TransactionStatsSerializer(serializers.Serializer):
    """Serializer for transaction statistics"""
    total_income = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_expenses = serializers.DecimalField(max_digits=12, decimal_places=2)
    balance = serializers.DecimalField(max_digits=12, decimal_places=2)
    transaction_count = serializers.IntegerField()
    income_count = serializers.IntegerField()
    expense_count = serializers.IntegerField()

