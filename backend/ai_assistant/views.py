# import os
# import re
# import json
# from datetime import datetime, timedelta
# from decimal import Decimal
# from rest_framework import status
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response
# import google.generativeai as genai
# from transactions.models import Transaction, Category
# from transactions.serializers import TransactionSerializer
# from pathlib import Path
# from dotenv import load_dotenv 
# from django.db.models import Sum, F # Import F for more complex queries

# # Build paths inside the project like this: BASE_DIR / 'subdir'.
# BASE_DIR = Path(__file__).resolve().parent.parent

# # Load environment variables from .env file
# load_dotenv(os.path.join(BASE_DIR, '.env'))

# # Configure Gemini
# # Ensure you're using os.environ.get and not hardcoding the key here if using dotenv
# genai.configure(api_key=os.environ.get('GEMINI_API_KEY')) 
# model = genai.GenerativeModel('gemini-2.5-flash-lite') # Using lite model as you specified

# class FinanceAIAssistant:
#     """AI Assistant for processing financial transactions"""
    
#     def __init__(self, user):
#         self.user = user
#         self.categories = Category.objects.filter(user=user)
        
#     def get_system_prompt(self):
#         """Generate system prompt with user context"""
#         categories = [cat.name for cat in self.categories]
        
#         return f"""You are a helpful finance assistant for a budget tracking app.
# Your role is to:
# 1. Extract transaction information from user messages
# 2. Ask follow-up questions if information is missing (especially for 'description'/'name')
# 3. Answer questions about user's finances (e.g., total balance, expenses today, income this month)
# 4. Be conversational and friendly
# 5. Always default to today's date if a date is not specified for a transaction for transaction creation.
# 6. When answering financial queries, correctly interpret date ranges like 'today', 'this month', 'last week'.

# User's currency: {self.user.currency.upper()}
# User's timezone: {self.user.timezone if hasattr(self.user, 'timezone') else 'UTC'}
# Available categories: {', '.join(categories)}

# When extracting transactions:
# - Amount: Extract numerical value
# - Type: 'income' or 'expense'
# - Category: Match to available categories or suggest new one.
# - Description: A brief, specific name/description of the transaction. If not explicitly provided, infer it from the context or ask for it. This is important for clarity.
# - Date: Parse relative dates (today, yesterday, last week) or specific dates. Default to today if not provided.
# - Payment method: Cash, card, online, etc. (optional)

# Required fields for transaction creation: amount, type, category, date, description
# Optional fields: payment_method
# If any required field is missing, ask a follow-up question. Prioritize asking for a clear 'description' if it's vague or missing.

# Respond in JSON format:
# {{
#     "response": "Your conversational response",
#     "needs_follow_up": true/false,
#     "extracted_data": {{
#         "amount": number,
#         "type": "income/expense",
#         "category": "category_name",
#         "description": "text",
#         "date": "YYYY-MM-DD",
#         "period": "today/this_month/last_week/all_time" // Added period for queries
#     }},
#     "suggestions": ["suggestion1", "suggestion2"],
#     "action": "create_transaction/query_data/general_chat"
# }}

# Examples for Transaction Extraction:
# User: "I spent $50 on groceries today"
# {{
#     "response": "Got it! I've recorded your grocery expense of {self.user.currency.upper()} 50 for today. What would you like to call this transaction, or is 'Groceries' good?",
#     "needs_follow_up": true,
#     "extracted_data": {{
#         "amount": 50,
#         "type": "expense",
#         "category": "Groceries",
#         "description": null,
#         "date": "{datetime.now().strftime('%Y-%m-%d')}"
#     }},
#     "suggestions": ["Lunch at cafe", "Weekly groceries"],
#     "action": "create_transaction"
# }}

# User: "What's my total balance?"
# {{
#     "response": "Let me check your total balance for you...",
#     "needs_follow_up": false,
#     "extracted_data": {{
#         "period": "all_time"
#     }},
#     "suggestions": [],
#     "action": "query_data"
# }}

# User: "How much did I spend yesterday?"
# {{
#     "response": "Let me calculate your expenses for yesterday...",
#     "needs_follow_up": false,
#     "extracted_data": {{
#         "date": "{ (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d') }",
#         "type": "expense",
#         "period": "yesterday"
#     }},
#     "suggestions": [],
#     "action": "query_data"
# }}

# User: "Whats my income this month?"
# {{
#     "response": "Calculating your income for this month...",
#     "needs_follow_up": false,
#     "extracted_data": {{
#         "type": "income",
#         "period": "this_month"
#     }},
#     "suggestions": [],
#     "action": "query_data"
# }}
# """

#     def parse_date_range(self, period_string, date_string=None):
#         """
#         Parses natural language date periods (e.g., 'today', 'this month', 'all_time')
#         or specific dates into start and end datetime.date objects.
#         Returns (start_date, end_date, display_period_name).
#         """
#         today = datetime.now().date()
        
#         # Handle specific date string if provided (e.g., "yesterday", "2024-05-16")
#         if date_string:
#             specific_date = self.parse_date(date_string) # Use existing parse_date for single date
#             return specific_date, specific_date + timedelta(days=1), date_string
            
#         # Handle period strings
#         period_string = period_string.lower() if period_string else ''

#         if period_string == 'today':
#             return today, today + timedelta(days=1), "today"
#         elif period_string == 'yesterday':
#             yesterday = today - timedelta(days=1)
#             return yesterday, yesterday + timedelta(days=1), "yesterday"
#         elif period_string == 'this_month':
#             start_of_month = today.replace(day=1)
#             # Calculate end of month (first day of next month)
#             if today.month == 12:
#                 end_of_month = datetime(today.year + 1, 1, 1).date()
#             else:
#                 end_of_month = datetime(today.year, today.month + 1, 1).date()
#             return start_of_month, end_of_month, "this month"
#         elif period_string == 'last_month':
#             first_day_current_month = today.replace(day=1)
#             last_day_last_month = first_day_current_month - timedelta(days=1)
#             first_day_last_month = last_day_last_month.replace(day=1)
#             return first_day_last_month, first_day_current_month, "last month"
#         elif period_string == 'last_week':
#             # Assuming 'last week' means the last 7 days ending yesterday
#             start_of_last_week = today - timedelta(days=7)
#             return start_of_last_week, today + timedelta(days=1), "last 7 days"
#         elif period_string == 'all_time':
#             # This needs to be very broad
#             # For practical purposes, often you'd query from user's registration date
#             # or a very early date
#             return datetime(1900, 1, 1).date(), today + timedelta(days=1), "all time"
        
#         # Default for unspecified period (e.g., if AI just extracts a type, but no period)
#         # We can default to "this month" if no specific date/period is given for queries
#         start_of_month = today.replace(day=1)
#         if today.month == 12:
#             end_of_month = datetime(today.year + 1, 1, 1).date()
#         else:
#             end_of_month = datetime(today.year, today.month + 1, 1).date()
#         return start_of_month, end_of_month, "this month"


#     def parse_date(self, date_string):
#         """Parse natural language dates safely into a single date object"""
#         today = datetime.now().date()
#         if not date_string:
#             return today # Default to today if no date string
        
#         date_lower = str(date_string).lower()

#         if 'today' in date_lower:
#             return today
#         elif 'yesterday' in date_lower:
#             return today - timedelta(days=1)
#         elif 'last week' in date_lower:
#             return today - timedelta(weeks=1) # Same day last week
#         elif 'last month' in date_lower:
#             # Get the first day of the current month, then subtract a day to get last day of prev month
#             first_day_current_month = today.replace(day=1)
#             last_day_prev_month = first_day_current_month - timedelta(days=1)
#             # Return the date of the same day in the previous month, capped by last_day_prev_month
#             try:
#                 return today.replace(month=today.month-1) if today.month > 1 else today.replace(year=today.year-1, month=12)
#             except ValueError: # e.g. Feb 30th
#                 return last_day_prev_month
#         elif 'next week' in date_lower:
#             return today + timedelta(weeks=1)
#         elif 'tomorrow' in date_lower:
#             return today + timedelta(days=1)

#         # Try standard date formats
#         for fmt in ('%Y-%m-%d', '%m/%d/%Y', '%d-%m-%Y', '%d/%m/%Y', '%b %d, %Y', '%B %d, %Y', '%Y/%m/%d'):
#             try:
#                 parsed = datetime.strptime(date_string, fmt).date()
#                 # Consider a small buffer for future dates, e.g., next 7 days are okay.
#                 # If too far in future, revert to today.
#                 if parsed > today + timedelta(days=7):
#                      return today
#                 return parsed
#             except ValueError:
#                 continue

#         return today # Default to today if unable to parse

#     def process_message(self, user_message, pending_transaction=None, conversation_history=None):  
#         """Process user message with Gemini AI"""
#         try:
#             # Build conversation context
#             context = self.get_system_prompt()
            
#             if pending_transaction:
#                 context += f"\n\nCurrently, the user is helping complete this transaction: {json.dumps(pending_transaction)}"
#                 context += "\nThe user's current message should be used to fill in missing details for this transaction."

#             if conversation_history:
#                 context += "\n\nConversation history (recent interactions):\n"
#                 for entry in conversation_history:
#                     context += f"User: {entry['user_message']}\n"
#                     context += f"Assistant: {entry['ai_response_text']}\n"
            
#             # Call Gemini
#             prompt = f"{context}\n\nUser message: {user_message}"
#             response = model.generate_content(prompt)
            
#             # Parse JSON response
#             response_text = response.text
            
#             # Extract JSON from markdown code blocks if present
#             if '```json' in response_text:
#                 response_text = response_text.split('```json')[1].split('```')[0].strip()
#             elif '```' in response_text:
#                 response_text = response_text.split('```')[1].split('```')[0].strip()
            
#             ai_response = json.loads(response_text)
            
#             # Merge with pending transaction if it exists and AI extracted data
#             if pending_transaction and ai_response.get('extracted_data'):
#                 # Only update fields that were previously null or are explicitly provided now
#                 merged_data = pending_transaction.copy()
#                 for key, value in ai_response['extracted_data'].items():
#                     if value is not None: # Prefer new, non-null data
#                         merged_data[key] = value
#                 ai_response['extracted_data'] = merged_data
            
#             # Ensure date is always parsed for extracted_data if it's a transaction
#             # and ensure period is correctly extracted for query_data
#             if ai_response.get('action') == 'create_transaction' and ai_response.get('extracted_data'):
#                 if ai_response['extracted_data'].get('date'):
#                     ai_response['extracted_data']['date'] = self.parse_date(ai_response['extracted_data']['date']).strftime('%Y-%m-%d')
#                 else:
#                     # If date is still missing for a transaction, default to today
#                     ai_response['extracted_data']['date'] = datetime.now().date().strftime('%Y-%m-%d')
            
#             return ai_response
            
#         except json.JSONDecodeError as e:
#             print(f"JSON Decode Error: {e} - Response Text: {response_text}")
#             # Fallback if JSON parsing fails - try to return a conversational response
#             return {
#                 "response": response_text if response_text else "I understood your message. Could you provide more details?",
#                 "needs_follow_up": True,
#                 "extracted_data": pending_transaction or {},
#                 "suggestions": [],
#                 "action": "general_chat"
#             }
#         except Exception as e:
#             print(f"AI Error in process_message: {str(e)}")
#             return {
#                 "response": "I'm having trouble processing that right now. Could you rephrase?",
#                 "needs_follow_up": False,
#                 "extracted_data": {},
#                 "suggestions": [],
#                 "action": "general_chat"
#             }
            
#     def create_transaction(self, extracted_data):
#         """Create transaction from extracted data"""
#         try:
#             # Get or create category
#             category_name = extracted_data.get('category', 'Other')
#             category_type = extracted_data.get('type', 'expense') # Default to expense if not specified
#             category, _ = Category.objects.get_or_create(
#                 user=self.user,
#                 name=category_name,
#                 type=category_type, # Ensure category type matches transaction type
#                 defaults={'type': category_type}
#             )

#             # Ensure valid date
#             date_str = extracted_data.get('date')
#             transaction_date = self.parse_date(date_str) if date_str else datetime.now().date()

#             # If parsed date is in the future (beyond a small buffer), or very old, assume today
#             if transaction_date > datetime.now().date() + timedelta(days=7) or \
#                (datetime.now().date() - transaction_date).days > 365: # Prevent extremely old dates
#                 transaction_date = datetime.now().date()
            
#             # Smartly extract name/description
#             description = extracted_data.get('description')
#             if not description or description.strip().lower() in ["expense", "income", "transaction", "none", category_name.lower()]:
#                 # If description is vague or identical to category, try to make it more specific
#                 description = f"{category_name} {extracted_data.get('type')}" if category_name else "Transaction"

#             # Create transaction
#             transaction = Transaction.objects.create(
#                 user=self.user,
#                 amount=Decimal(str(extracted_data['amount'])),
#                 type=extracted_data['type'],
#                 category=category,
#                 name=description, # Map description to name for the Transaction model
#                 description=description, # Also store in description field
#                 date=transaction_date,
#             )

#             return True, transaction

#         except Exception as e:
#             print(f"Transaction creation error: {str(e)}")
#             return False, None

#     def validate_transaction_data(self, data):
#         """Check if transaction data is complete for creation"""
#         required_fields = ['amount', 'type', 'category', 'date']
#         missing_fields = [field for field in required_fields if not data.get(field)]
        
#         if not data.get('description'): # Ensure description is also asked for
#             missing_fields.append('description')

#         return len(missing_fields) == 0, missing_fields

#     def get_financial_summary(self, query_data=None):
#         """
#         Provides financial insights based on query_data.
#         e.g., total balance, expenses today, income last month.
#         """
#         user_transactions = Transaction.objects.filter(user=self.user)
        
#         # Extract period and date_string from query_data
#         period = query_data.get('period')
#         date_str = query_data.get('date') # This will be specific date if AI extracts it (e.g., "yesterday")
        
#         start_date, end_date, display_period_name = self.parse_date_range(period, date_str)
        
#         query_type = query_data.get('type') # 'income', 'expense', or None

#         # Filter transactions based on date range
#         filtered_transactions = user_transactions.filter(date__gte=start_date, date__lt=end_date)
        
#         total_income = filtered_transactions.filter(type='income').aggregate(Sum('amount'))['amount__sum'] or Decimal(0)
#         total_expenses = filtered_transactions.filter(type='expense').aggregate(Sum('amount'))['amount__sum'] or Decimal(0)

#         # Calculate balance for the period
#         balance = total_income - total_expenses

#         # Handle different query types
#         if query_type == 'income':
#             return f"Your total income for {display_period_name} is {self.user.currency.upper()} {total_income:.2f}."
#         elif query_type == 'expense':
#             return f"Your total expenses for {display_period_name} is {self.user.currency.upper()} {total_expenses:.2f}."
#         elif period == 'all_time': # If explicit 'all_time' balance is requested
#             # Recalculate all-time balance explicitly for clarity, though filtered_transactions would cover it if dates are broad enough
#             all_time_income = user_transactions.filter(type='income').aggregate(Sum('amount'))['amount__sum'] or Decimal(0)
#             all_time_expenses = user_transactions.filter(type='expense').aggregate(Sum('amount'))['amount__sum'] or Decimal(0)
#             overall_balance = all_time_income - all_time_expenses
#             return f"Your overall balance across all time is {self.user.currency.upper()} {overall_balance:.2f}."
#         else: # Generic balance for the queried period, or default 'this month'
#             return f"For {display_period_name}, your total income is {self.user.currency.upper()} {total_income:.2f}, total expenses are {self.user.currency.upper()} {total_expenses:.2f}, resulting in a balance of {self.user.currency.upper()} {balance:.2f}."

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def ai_chat(request):
#     """Handle AI chat messages"""
#     try:
#         user_message = request.data.get('message', '')
#         pending_transaction = request.data.get('pending_transaction')
#         conversation_history = request.data.get('conversation_history', []) 
        
#         if not user_message:
#             return Response(
#                 {'error': 'Message is required'},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
        
#         assistant = FinanceAIAssistant(request.user)
#         ai_response = assistant.process_message(user_message, pending_transaction, conversation_history)
        
#         extracted_data = ai_response.get('extracted_data', {})
#         action = ai_response.get('action')
        
#         if action == 'create_transaction':
#             is_complete, missing_fields = assistant.validate_transaction_data(extracted_data)
            
#             if is_complete:
#                 success, transaction = assistant.create_transaction(extracted_data)
                
#                 if success:
#                     ai_response['transaction_created'] = True
#                     ai_response['transaction'] = TransactionSerializer(transaction).data
#                     ai_response['response'] = f"Success! I've added your {extracted_data['type']} of {request.user.currency.upper()} {extracted_data['amount']} for '{extracted_data.get('description', extracted_data['category'])}'."
#                     ai_response['needs_follow_up'] = False
#                     ai_response['extracted_data'] = {}
#                 else:
#                     ai_response['response'] = "I had trouble saving that transaction. Could you please check the details and try again?"
#                     ai_response['needs_follow_up'] = True
#             else:
#                 ai_response['needs_follow_up'] = True
#                 missing_str = ', '.join(missing_fields)
#                 if 'description' in missing_fields:
#                     ai_response['response'] = f"I have the amount, type, category, and date. What would you like to call this transaction (a brief description)?"
#                     ai_response['suggestions'] = [extracted_data.get('category', 'item')]
#                 else:
#                     ai_response['response'] = f"I still need the following information: {missing_str}. Please provide it."
        
#         elif action == 'query_data':
#             # Pass the original user message or a derived query phrase to get_financial_summary
#             # to help it distinguish between 'total balance' and other queries.
#             extracted_data['query_phrase'] = user_message 
#             query_response = assistant.get_financial_summary(extracted_data)
#             ai_response['response'] = query_response
#             ai_response['needs_follow_up'] = False
#             ai_response['extracted_data'] = {}
            
#         conversation_history.append({
#             'user_message': user_message,
#             'ai_response_text': ai_response['response']
#         })
#         ai_response['conversation_history'] = conversation_history[-5:]

#         return Response(ai_response)
        
#     except Exception as e:
#         print(f"AI Chat Error: {str(e)}")
#         return Response(
#             {'error': 'Failed to process message'},
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR
#         )

# # The ai_insights view remains unchanged
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def ai_insights(request):
#     """Get AI-powered financial insights"""
#     try:
#         assistant = FinanceAIAssistant(request.user)
        
#         # Get recent transactions
#         recent_transactions = Transaction.objects.filter(
#             user=request.user
#         ).order_by('-date')[:20]
        
#         # Prepare data for AI
#         transactions_data = [
#             f"{t.type} of {t.amount} on {t.category.name} on {t.date}"
#             for t in recent_transactions
#         ]
        
#         prompt = f"""Analyze these recent transactions and provide 3 insights:
# {chr(10).join(transactions_data)}

# Provide insights in JSON format:
# {{
#     "insights": [
#         {{"title": "Insight title", "description": "Details", "type": "positive/warning/info"}},
#     ]
# }}"""
        
#         response = model.generate_content(prompt)
#         insights_data = json.loads(response.text)
        
#         return Response(insights_data)
        
#     except Exception as e:
#         return Response(
#             {'insights': []},
#             status=status.HTTP_200_OK
#         )

import os
import re
import json
from datetime import datetime, timedelta
from decimal import Decimal
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import google.generativeai as genai
from transactions.models import Transaction, Category
from transactions.serializers import TransactionSerializer
from budgets.models import Budget
from budgets.serializers import BudgetSerializer
from pathlib import Path
from dotenv import load_dotenv 
from django.db.models import Sum, F

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env file
load_dotenv(os.path.join(BASE_DIR, '.env'))

# Configure Gemini
genai.configure(api_key=os.environ.get('GEMINI_API_KEY')) 
model = genai.GenerativeModel('gemini-2.5-flash-lite')

class FinanceAIAssistant:
    """AI Assistant for processing financial transactions and budgets"""
    
    def __init__(self, user):
        self.user = user
        self.categories = Category.objects.filter(user=user)
        self.current_date = datetime.now().date()  # Store current date context
        
    def get_system_prompt(self):
        """Generate system prompt with user context"""
        categories = [cat.name for cat in self.categories]
        
        return f"""You are a helpful finance assistant for a budget tracking app.
Your role is to:
1. Extract transaction information from user messages
2. Extract budget information (category, amount, month/year)
3. Ask follow-up questions if information is missing
4. Answer questions about user's finances
5. Be conversational and friendly
6. Always use the current date context: {self.current_date.strftime('%Y-%m-%d')}
7. When user says "yesterday", calculate from current date: {(self.current_date - timedelta(days=1)).strftime('%Y-%m-%d')}
8. When user says "this month", use: {self.current_date.strftime('%Y-%m')}
9. When user says "last month", use: {(self.current_date.replace(day=1) - timedelta(days=1)).strftime('%Y-%m')}

User's currency: {self.user.currency.upper()}
User's timezone: {self.user.timezone if hasattr(self.user, 'timezone') else 'UTC'}
Available categories: {', '.join(categories)}
Current Date: {self.current_date.strftime('%Y-%m-%d')}

When extracting transactions:
- Amount: Extract numerical value
- Type: 'income' or 'expense'
- Category: Match to available categories or suggest new one
- Description: A brief, specific name/description
- Date: Parse relative dates using CURRENT DATE context
- Payment method: Cash, card, online, etc. (optional)

When extracting budgets:
- Amount: Extract numerical value
- Category: Match to available expense categories only
- Month: Parse month/year (default to current month if not specified)
  - "this month" = {self.current_date.strftime('%Y-%m')}
  - "next month" = {(self.current_date.replace(day=1) + timedelta(days=32)).replace(day=1).strftime('%Y-%m')}
  - "January", "Feb 2025", etc. = specific month
  - If only year given, use current month of that year
  - If no month/year, use current month

Respond in JSON format:
{{
    "response": "Your conversational response",
    "needs_follow_up": true/false,
    "extracted_data": {{
        "amount": number,
        "type": "income/expense",
        "category": "category_name",
        "description": "text",
        "date": "YYYY-MM-DD",
        "month": "YYYY-MM",  // For budgets
        "period": "today/this_month/last_week/all_time"
    }},
    "suggestions": ["suggestion1", "suggestion2"],
    "action": "create_transaction/create_budget/edit_budget/query_data/general_chat"
}}

Examples for Budget Creation:
User: "Set budget for groceries to $500 this month"
{{
    "response": "I'll set your grocery budget to {self.user.currency.upper()} 500 for {self.current_date.strftime('%B %Y')}.",
    "needs_follow_up": false,
    "extracted_data": {{
        "amount": 500,
        "category": "Groceries",
        "month": "{self.current_date.strftime('%Y-%m')}"
    }},
    "suggestions": [],
    "action": "create_budget"
}}

User: "Budget $300 for dining next month"
{{
    "response": "Setting dining budget to {self.user.currency.upper()} 300 for {(self.current_date.replace(day=1) + timedelta(days=32)).replace(day=1).strftime('%B %Y')}.",
    "needs_follow_up": false,
    "extracted_data": {{
        "amount": 300,
        "category": "Dining",
        "month": "{(self.current_date.replace(day=1) + timedelta(days=32)).replace(day=1).strftime('%Y-%m')}"
    }},
    "suggestions": [],
    "action": "create_budget"
}}

User: "Update my transport budget to $200"
{{
    "response": "I'll update your transport budget to {self.user.currency.upper()} 200 for this month.",
    "needs_follow_up": false,
    "extracted_data": {{
        "amount": 200,
        "category": "Transport",
        "month": "{self.current_date.strftime('%Y-%m')}"
    }},
    "suggestions": [],
    "action": "edit_budget"
}}

User: "I spent $50 on groceries yesterday"
{{
    "response": "Recording your grocery expense of {self.user.currency.upper()} 50 for yesterday ({(self.current_date - timedelta(days=1)).strftime('%Y-%m-%d')}).",
    "needs_follow_up": false,
    "extracted_data": {{
        "amount": 50,
        "type": "expense",
        "category": "Groceries",
        "description": "Groceries",
        "date": "{(self.current_date - timedelta(days=1)).strftime('%Y-%m-%d')}"
    }},
    "suggestions": [],
    "action": "create_transaction"
}}
"""

    def parse_month(self, month_string):
        """
        Parse month string to YYYY-MM format using current date context
        Returns: (month_date as YYYY-MM-DD string, display_name)
        """
        if not month_string:
            # Default to current month
            first_day = self.current_date.replace(day=1)
            return first_day.strftime('%Y-%m-%d'), self.current_date.strftime('%B %Y')
        
        month_lower = str(month_string).lower().strip()
        
        # Handle relative months
        if 'this month' in month_lower or month_lower == 'current':
            first_day = self.current_date.replace(day=1)
            return first_day.strftime('%Y-%m-%d'), self.current_date.strftime('%B %Y')
            
        elif 'next month' in month_lower:
            # Get first day of next month
            if self.current_date.month == 12:
                next_month = datetime(self.current_date.year + 1, 1, 1).date()
            else:
                next_month = datetime(self.current_date.year, self.current_date.month + 1, 1).date()
            return next_month.strftime('%Y-%m-%d'), next_month.strftime('%B %Y')
            
        elif 'last month' in month_lower or 'previous month' in month_lower:
            # Get first day of last month
            first_day_current = self.current_date.replace(day=1)
            last_month = first_day_current - timedelta(days=1)
            first_day_last = last_month.replace(day=1)
            return first_day_last.strftime('%Y-%m-%d'), first_day_last.strftime('%B %Y')
        
        # Try parsing specific formats
        # Format: YYYY-MM or YYYY-MM-DD
        for fmt in ('%Y-%m-%d', '%Y-%m'):
            try:
                parsed = datetime.strptime(month_string, fmt).date()
                first_day = parsed.replace(day=1)
                return first_day.strftime('%Y-%m-%d'), first_day.strftime('%B %Y')
            except ValueError:
                continue
        
        # Format: "January", "Jan", "February 2025", "Jan 2025"
        month_names = {
            'jan': 1, 'january': 1, 'feb': 2, 'february': 2, 'mar': 3, 'march': 3,
            'apr': 4, 'april': 4, 'may': 5, 'jun': 6, 'june': 6,
            'jul': 7, 'july': 7, 'aug': 8, 'august': 8, 'sep': 9, 'september': 9,
            'oct': 10, 'october': 10, 'nov': 11, 'november': 11, 'dec': 12, 'december': 12
        }
        
        # Extract month name and optional year
        parts = month_lower.split()
        month_num = None
        year = self.current_date.year
        
        for part in parts:
            if part in month_names:
                month_num = month_names[part]
            elif part.isdigit() and len(part) == 4:
                year = int(part)
        
        if month_num:
            first_day = datetime(year, month_num, 1).date()
            return first_day.strftime('%Y-%m-%d'), first_day.strftime('%B %Y')
        
        # Default to current month if parsing fails
        first_day = self.current_date.replace(day=1)
        return first_day.strftime('%Y-%m-%d'), self.current_date.strftime('%B %Y')

    def parse_date_range(self, period_string, date_string=None):
        """Parse natural language date periods using current date context"""
        today = self.current_date
        
        if date_string:
            specific_date = self.parse_date(date_string)
            return specific_date, specific_date + timedelta(days=1), date_string
            
        period_string = period_string.lower() if period_string else ''

        if period_string == 'today':
            return today, today + timedelta(days=1), "today"
        elif period_string == 'yesterday':
            yesterday = today - timedelta(days=1)
            return yesterday, yesterday + timedelta(days=1), "yesterday"
        elif period_string == 'this_month':
            start_of_month = today.replace(day=1)
            if today.month == 12:
                end_of_month = datetime(today.year + 1, 1, 1).date()
            else:
                end_of_month = datetime(today.year, today.month + 1, 1).date()
            return start_of_month, end_of_month, "this month"
        elif period_string == 'last_month':
            first_day_current_month = today.replace(day=1)
            last_day_last_month = first_day_current_month - timedelta(days=1)
            first_day_last_month = last_day_last_month.replace(day=1)
            return first_day_last_month, first_day_current_month, "last month"
        elif period_string == 'last_week':
            start_of_last_week = today - timedelta(days=7)
            return start_of_last_week, today + timedelta(days=1), "last 7 days"
        elif period_string == 'all_time':
            return datetime(1900, 1, 1).date(), today + timedelta(days=1), "all time"
        
        # Default to this month
        start_of_month = today.replace(day=1)
        if today.month == 12:
            end_of_month = datetime(today.year + 1, 1, 1).date()
        else:
            end_of_month = datetime(today.year, today.month + 1, 1).date()
        return start_of_month, end_of_month, "this month"

    def parse_date(self, date_string):
        """Parse natural language dates using current date context"""
        today = self.current_date
        if not date_string:
            return today
        
        date_lower = str(date_string).lower()

        if 'today' in date_lower:
            return today
        elif 'yesterday' in date_lower:
            return today - timedelta(days=1)
        elif 'last week' in date_lower:
            return today - timedelta(weeks=1)
        elif 'last month' in date_lower:
            first_day_current_month = today.replace(day=1)
            last_day_prev_month = first_day_current_month - timedelta(days=1)
            try:
                return today.replace(month=today.month-1) if today.month > 1 else today.replace(year=today.year-1, month=12)
            except ValueError:
                return last_day_prev_month
        elif 'next week' in date_lower:
            return today + timedelta(weeks=1)
        elif 'tomorrow' in date_lower:
            return today + timedelta(days=1)

        # Try standard date formats
        for fmt in ('%Y-%m-%d', '%m/%d/%Y', '%d-%m-%Y', '%d/%m/%Y', '%b %d, %Y', '%B %d, %Y', '%Y/%m/%d'):
            try:
                parsed = datetime.strptime(date_string, fmt).date()
                if parsed > today + timedelta(days=7):
                    return today
                return parsed
            except ValueError:
                continue

        return today

    def process_message(self, user_message, pending_transaction=None, pending_budget=None, conversation_history=None):  
        """Process user message with Gemini AI"""
        try:
            # Build conversation context
            context = self.get_system_prompt()
            
            if pending_transaction:
                context += f"\n\nCurrently helping complete this transaction: {json.dumps(pending_transaction)}"
                
            if pending_budget:
                context += f"\n\nCurrently helping complete this budget: {json.dumps(pending_budget)}"

            if conversation_history:
                context += "\n\nConversation history:\n"
                for entry in conversation_history:
                    context += f"User: {entry['user_message']}\n"
                    context += f"Assistant: {entry['ai_response_text']}\n"
            
            # Call Gemini
            prompt = f"{context}\n\nUser message: {user_message}"
            response = model.generate_content(prompt)
            
            # Parse JSON response
            response_text = response.text
            
            # Extract JSON from markdown code blocks
            if '```json' in response_text:
                response_text = response_text.split('```json')[1].split('```')[0].strip()
            elif '```' in response_text:
                response_text = response_text.split('```')[1].split('```')[0].strip()
            
            ai_response = json.loads(response_text)
            
            # Merge with pending data if exists
            if pending_transaction and ai_response.get('extracted_data'):
                merged_data = pending_transaction.copy()
                for key, value in ai_response['extracted_data'].items():
                    if value is not None:
                        merged_data[key] = value
                ai_response['extracted_data'] = merged_data
                
            if pending_budget and ai_response.get('extracted_data'):
                merged_data = pending_budget.copy()
                for key, value in ai_response['extracted_data'].items():
                    if value is not None:
                        merged_data[key] = value
                ai_response['extracted_data'] = merged_data
            
            # Parse dates using current date context
            if ai_response.get('action') in ['create_transaction', 'create_budget', 'edit_budget']:
                extracted = ai_response.get('extracted_data', {})
                
                if 'date' in extracted and extracted['date']:
                    extracted['date'] = self.parse_date(extracted['date']).strftime('%Y-%m-%d')
                elif ai_response.get('action') == 'create_transaction':
                    extracted['date'] = self.current_date.strftime('%Y-%m-%d')
                
                if 'month' in extracted and extracted['month']:
                    month_date, month_display = self.parse_month(extracted['month'])
                    extracted['month'] = month_date
                    extracted['month_display'] = month_display
                elif ai_response.get('action') in ['create_budget', 'edit_budget']:
                    month_date, month_display = self.parse_month(None)
                    extracted['month'] = month_date
                    extracted['month_display'] = month_display
            
            return ai_response
            
        except json.JSONDecodeError as e:
            print(f"JSON Decode Error: {e} - Response: {response_text}")
            return {
                "response": response_text if response_text else "Could you provide more details?",
                "needs_follow_up": True,
                "extracted_data": pending_transaction or pending_budget or {},
                "suggestions": [],
                "action": "general_chat"
            }
        except Exception as e:
            print(f"AI Error: {str(e)}")
            return {
                "response": "I'm having trouble processing that. Could you rephrase?",
                "needs_follow_up": False,
                "extracted_data": {},
                "suggestions": [],
                "action": "general_chat"
            }
    
    def create_budget(self, extracted_data):
        """Create budget from extracted data"""
        try:
            # Get or validate category
            category_name = extracted_data.get('category')
            category = Category.objects.filter(
                user=self.user,
                name__iexact=category_name,
                type='expense'
            ).first()
            
            if not category:
                return False, None, f"Category '{category_name}' not found or is not an expense category."
            
            # Parse month
            month_str = extracted_data.get('month')
            month_date, _ = self.parse_month(month_str)
            month_obj = datetime.strptime(month_date, '%Y-%m-%d').date()
            
            # Create or update budget
            budget, created = Budget.objects.update_or_create(
                user=self.user,
                category=category,
                month=month_obj,
                defaults={'amount': Decimal(str(extracted_data['amount']))}
            )
            
            action = "created" if created else "updated"
            return True, budget, action
            
        except Exception as e:
            print(f"Budget creation error: {str(e)}")
            return False, None, str(e)
    
    def validate_budget_data(self, data):
        """Check if budget data is complete"""
        required_fields = ['amount', 'category', 'month']
        missing = [f for f in required_fields if not data.get(f)]
        return len(missing) == 0, missing
    
    def create_transaction(self, extracted_data):
        """Create transaction from extracted data"""
        try:
            category_name = extracted_data.get('category', 'Other')
            category_type = extracted_data.get('type', 'expense')
            category, _ = Category.objects.get_or_create(
                user=self.user,
                name=category_name,
                type=category_type,
                defaults={'type': category_type}
            )

            date_str = extracted_data.get('date')
            transaction_date = self.parse_date(date_str) if date_str else self.current_date

            if transaction_date > self.current_date + timedelta(days=7):
                transaction_date = self.current_date
            
            description = extracted_data.get('description')
            if not description or description.strip().lower() in ["expense", "income", "transaction", "none", category_name.lower()]:
                description = f"{category_name} {extracted_data.get('type')}"

            transaction = Transaction.objects.create(
                user=self.user,
                amount=Decimal(str(extracted_data['amount'])),
                type=extracted_data['type'],
                category=category,
                name=description,
                description=description,
                date=transaction_date,
            )

            return True, transaction

        except Exception as e:
            print(f"Transaction creation error: {str(e)}")
            return False, None

    def validate_transaction_data(self, data):
        """Check if transaction data is complete"""
        required_fields = ['amount', 'type', 'category', 'date']
        missing = [f for f in required_fields if not data.get(f)]
        
        if not data.get('description'):
            missing.append('description')

        return len(missing) == 0, missing

    def get_financial_summary(self, query_data=None):
        """Provides financial insights based on query_data"""
        user_transactions = Transaction.objects.filter(user=self.user)
        
        period = query_data.get('period')
        date_str = query_data.get('date')
        
        start_date, end_date, display_period_name = self.parse_date_range(period, date_str)
        query_type = query_data.get('type')

        filtered_transactions = user_transactions.filter(date__gte=start_date, date__lt=end_date)
        
        total_income = filtered_transactions.filter(type='income').aggregate(Sum('amount'))['amount__sum'] or Decimal(0)
        total_expenses = filtered_transactions.filter(type='expense').aggregate(Sum('amount'))['amount__sum'] or Decimal(0)

        balance = total_income - total_expenses

        if query_type == 'income':
            return f"Your total income for {display_period_name} is {self.user.currency.upper()} {total_income:.2f}."
        elif query_type == 'expense':
            return f"Your total expenses for {display_period_name} is {self.user.currency.upper()} {total_expenses:.2f}."
        elif period == 'all_time':
            all_time_income = user_transactions.filter(type='income').aggregate(Sum('amount'))['amount__sum'] or Decimal(0)
            all_time_expenses = user_transactions.filter(type='expense').aggregate(Sum('amount'))['amount__sum'] or Decimal(0)
            overall_balance = all_time_income - all_time_expenses
            return f"Your overall balance is {self.user.currency.upper()} {overall_balance:.2f}."
        else:
            return f"For {display_period_name}, income: {self.user.currency.upper()} {total_income:.2f}, expenses: {self.user.currency.upper()} {total_expenses:.2f}, balance: {self.user.currency.upper()} {balance:.2f}."


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_chat(request):
    """Handle AI chat messages"""
    try:
        user_message = request.data.get('message', '')
        pending_transaction = request.data.get('pending_transaction')
        pending_budget = request.data.get('pending_budget')
        conversation_history = request.data.get('conversation_history', []) 
        
        if not user_message:
            return Response(
                {'error': 'Message is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        assistant = FinanceAIAssistant(request.user)
        ai_response = assistant.process_message(
            user_message, 
            pending_transaction, 
            pending_budget,
            conversation_history
        )
        
        extracted_data = ai_response.get('extracted_data', {})
        action = ai_response.get('action')
        
        # Handle Transaction Creation
        if action == 'create_transaction':
            is_complete, missing_fields = assistant.validate_transaction_data(extracted_data)
            
            if is_complete:
                success, transaction = assistant.create_transaction(extracted_data)
                
                if success:
                    ai_response['transaction_created'] = True
                    ai_response['transaction'] = TransactionSerializer(transaction).data
                    ai_response['response'] = f"Success! Added {extracted_data['type']} of {request.user.currency.upper()} {extracted_data['amount']} for '{extracted_data.get('description')}'."
                    ai_response['needs_follow_up'] = False
                    ai_response['extracted_data'] = {}
                else:
                    ai_response['response'] = "Failed to save transaction. Please check details."
                    ai_response['needs_follow_up'] = True
            else:
                ai_response['needs_follow_up'] = True
                missing_str = ', '.join(missing_fields)
                ai_response['response'] = f"I need: {missing_str}. Please provide it."
        
        # Handle Budget Creation/Update
        elif action in ['create_budget', 'edit_budget']:
            is_complete, missing_fields = assistant.validate_budget_data(extracted_data)
            
            if is_complete:
                success, budget, action_performed = assistant.create_budget(extracted_data)
                
                if success:
                    ai_response['budget_saved'] = True
                    ai_response['budget'] = BudgetSerializer(budget).data
                    month_display = extracted_data.get('month_display', 'this month')
                    ai_response['response'] = f"Success! {action_performed.capitalize()} budget for {extracted_data['category']} to {request.user.currency.upper()} {extracted_data['amount']} for {month_display}."
                    ai_response['needs_follow_up'] = False
                    ai_response['extracted_data'] = {}
                else:
                    ai_response['response'] = f"Failed to save budget. {action_performed}"
                    ai_response['needs_follow_up'] = True
            else:
                ai_response['needs_follow_up'] = True
                missing_str = ', '.join(missing_fields)
                ai_response['response'] = f"I need: {missing_str}. Please provide it."
        
        # Handle Query
        elif action == 'query_data':
            extracted_data['query_phrase'] = user_message 
            query_response = assistant.get_financial_summary(extracted_data)
            ai_response['response'] = query_response
            ai_response['needs_follow_up'] = False
            ai_response['extracted_data'] = {}
            
        conversation_history.append({
            'user_message': user_message,
            'ai_response_text': ai_response['response']
        })
        ai_response['conversation_history'] = conversation_history[-5:]

        return Response(ai_response)
        
    except Exception as e:
        print(f"AI Chat Error: {str(e)}")
        return Response(
            {'error': 'Failed to process message'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ai_insights(request):
    """Get AI-powered financial insights"""
    try:
        assistant = FinanceAIAssistant(request.user)
        
        # Get recent transactions
        recent_transactions = Transaction.objects.filter(
            user=request.user
        ).order_by('-date')[:20]
        
        # Prepare data for AI
        transactions_data = [
            f"{t.type} of {t.amount} on {t.category.name} on {t.date}"
            for t in recent_transactions
        ]
        
        prompt = f"""Analyze these recent transactions and provide 3 insights:
{chr(10).join(transactions_data)}

Provide insights in JSON format:
{{
    "insights": [
        {{"title": "Insight title", "description": "Details", "type": "positive/warning/info"}},
    ]
}}"""
        
        response = model.generate_content(prompt)
        insights_data = json.loads(response.text)
        
        return Response(insights_data)
        
    except Exception as e:
        return Response(
            {'insights': []},
            status=status.HTTP_200_OK
        )