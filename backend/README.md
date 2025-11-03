# Budget Tracker Backend API

Django REST Framework backend for Budget Tracker application.

## Features

- ✅ JWT Authentication with refresh tokens
- ✅ User registration and profile management
- ✅ Transaction CRUD with filters and pagination
- ✅ Category management
- ✅ Budget tracking and comparison
- ✅ Dashboard statistics and analytics
- ✅ API documentation (Swagger/ReDoc)
- ✅ CORS enabled for frontend integration
- ✅ Industry-standard project structure

## Tech Stack

- Django 5.0
- Django REST Framework 3.14
- Simple JWT for authentication
- PostgreSQL/SQLite
- Swagger/OpenAPI documentation

## Installation

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create .env file:
```bash
cp .env.example .env
# Update SECRET_KEY and other settings
```

4. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Create superuser:
```bash
python manage.py createsuperuser
```

6. Run development server:
```bash
python manage.py runserver
```

## API Endpoints

### Authentication
- POST `/api/auth/register/` - Register
- POST `/api/auth/login/` - Login (get tokens)
- POST `/api/auth/refresh/` - Refresh token
- GET `/api/auth/profile/` - Get profile
- PUT `/api/auth/profile/` - Update profile
- POST `/api/auth/password/change/` - Change password

### Transactions
- GET `/api/transactions/` - List (with filters)
- POST `/api/transactions/` - Create
- GET `/api/transactions/{id}/` - Detail
- PUT `/api/transactions/{id}/` - Update
- DELETE `/api/transactions/{id}/` - Delete
- GET `/api/transactions/transactions/stats/` - Statistics

### Categories
- GET `/api/categories/` - List
- POST `/api/categories/` - Create
- GET `/api/categories/{id}/` - Detail
- PUT `/api/categories/{id}/` - Update
- DELETE `/api/categories/{id}/` - Delete

### Budgets
- GET `/api/budgets/` - List
- POST `/api/budgets/` - Create
- GET `/api/budgets/{id}/` - Detail
- PUT `/api/budgets/{id}/` - Update
- DELETE `/api/budgets/{id}/` - Delete
- GET `/api/budgets/comparison/` - Budget vs Actual
- GET `/api/budgets/status/` - Current status

### Dashboard
- GET `/api/dashboard/summary/` - Summary stats
- GET `/api/dashboard/transactions/recent/` - Recent transactions

## Testing

Run tests:
```bash
pytest
```

With coverage:
```bash
pytest --cov=. --cov-report=html
```

## API Documentation

- Swagger UI: http://localhost:8000/swagger/
- ReDoc: http://localhost:8000/redoc/
- Admin Panel: http://localhost:8000/admin/

## Deployment

See deployment guide in `docs/deployment.md`