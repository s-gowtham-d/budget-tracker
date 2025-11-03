from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from transactions.models import Category

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_default_categories_for_user(sender, instance, created, **kwargs):
    if created:
        default_categories = [
            {"name": "Salary", "type": "income", "icon": "💰", "color": "#16A34A"},
            {"name": "Freelance", "type": "income", "icon": "💼", "color": "#22C55E"},
            {"name": "Investments", "type": "income", "icon": "📈", "color": "#15803D"},
            {"name": "Food & Dining", "type": "expense", "icon": "🍽️", "color": "#EF4444"},
            {"name": "Shopping", "type": "expense", "icon": "🛍️", "color": "#F97316"},
            {"name": "Transportation", "type": "expense", "icon": "⛽", "color": "#3B82F6"},
            {"name": "Entertainment", "type": "expense", "icon": "🎬", "color": "#EAB308"},
            {"name": "Bills & Utilities", "type": "expense", "icon": "💡", "color": "#6366F1"},
            {"name": "Health & Fitness", "type": "expense", "icon": "🏥", "color": "#10B981"},
            {"name": "Travel", "type": "expense", "icon": "✈️", "color": "#0EA5E9"},
        ]
        for cat in default_categories:
            Category.objects.get_or_create(
                user=instance,
                name=cat["name"],
                type=cat["type"],
                defaults={"icon": cat["icon"], "color": cat["color"]}
            )
