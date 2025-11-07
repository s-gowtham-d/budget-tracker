# Budget Tracker

[![License: GPL](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.9%2B-blue?logo=python)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.x-green?logo=django)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18.x-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-ES6%2B-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue?logo=docker)](https://www.docker.com/)

## About

The Budget Tracker is a robust personal finance management application designed to help users take control of their money. It provides an intuitive interface to track income and expenses, set budgets, and gain insights into spending habits. This application stands out by integrating an AI assistant to provide intelligent financial advice and personalized recommendations, making financial management smarter and more accessible.

## Features

- **User Authentication:** Secure user registration and login.
- **Transaction Management:** Record, categorize, and view all your income and expenses.
- **Budgeting:** Create and manage budgets for various categories to monitor spending.
- **Dashboard Overview:** A centralized dashboard to visualize your financial health at a glance.
- **AI Assistant:** Get personalized financial advice, spending insights, and budget recommendations powered by AI.
- **Responsive UI:** A modern, user-friendly interface built with React.
- **API-Driven:** A powerful Django REST Framework backend serving all necessary data.
- **Theme Support:** Light and dark mode toggling for a personalized experience.
- **Onboarding:** Guided initial setup for new users.

## Tech Stack

The Budget Tracker is built with a powerful combination of modern technologies.

### Backend (Django & Django REST Framework)

- **Python:** The core language.
- **Django:** High-level Python Web framework that encourages rapid development and clean, pragmatic design.
- **Django REST Framework (DRF):** A powerful and flexible toolkit for building Web APIs.
- **PostgreSQL (Recommended):** Robust relational database for production (SQLite for development).
- **drf-yasg:** For automatic generation of Swagger/OpenAPI documentation.
- **Gemin:** For the AI assistant integration.
- **debug_toolbar:** For development-time performance debugging.

### Frontend (React & TypeScript)

- **React:** A JavaScript library for building user interfaces.
- **TypeScript:** JavaScript with syntax for types.
- **Vite:** A fast build tool that provides a lightning-fast development experience.
- **Tailwind CSS / Shadcn UI:** For modern, utility-first CSS styling and UI components.
- **Zustand:** A small, fast and scalable bear-necessities state-management solution.
- **React Router DOM:** For declarative routing in React applications.
- **Axios:** Promise-based HTTP client for the browser and Node.js.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

- **Git**
- **Python 3.9+**
- **pip** (Python package installer)
- **Node.js (LTS)**
- **npm** or **yarn**
- **Docker & Docker Compose** (Highly Recommended for easier setup)

### Backend Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/s-gowtham-d/budget-tracker.git
    cd budget-tracker/backend
    ```

2.  **Create and activate a virtual environment:**

    ```bash
    python -m venv venv
    # On Windows
    venv\Scripts\activate
    # On macOS/Linux
    source venv/bin/activate
    ```

3.  **Install backend dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure environment variables:**
    Create a `.env` file based on `.env.example` in the `backend/config` directory (or wherever your `settings.py` expects it) based on a `.env.example` (if provided, otherwise create one manually).
    You'll typically need:

    ```env
    SECRET_KEY=your_django_secret_key
    DEBUG=True
    DATABASE_URL=sqlite:///db.sqlite3 # Or your PostgreSQL URL
    DJANGO_SETTINGS_MODULE=config.settings
    # AI Assistant API Keys
    OPENAI_API_KEY=your_openai_api_key
    ```

5.  **Run database migrations:**

    ```bash
    python manage.py migrate
    ```

6.  **Create a superuser (optional, for admin access):**

    ```bash
    python manage.py createsuperuser
    ```

7.  **Run the Django development server:**
    ```bash
    python manage.py runserver
    ```
    The backend API will be available at `http://127.0.0.1:8000/`.

### Frontend Setup

1.  **Navigate to the frontend directory:**

    ```bash
    cd ../frontend
    ```

2.  **Install frontend dependencies:**

    ```bash
    npm install # or yarn install
    ```

3.  **Configure environment variables:**
    Create a `.env` file in the `frontend` directory.

    ```env
    VITE_API_BASE_URL=http://localhost:8000/api/
    ```

4.  **Start the frontend development server:**
    ```bash
    npm run dev # or yarn dev
    ```
    The frontend application will be available at `http://localhost:5173/` (or another port if 5173 is in use).

### Running with Docker (Recommended)

Docker simplifies the setup process by containerizing both the backend and frontend.

1.  **Ensure Docker is running on your machine.**

2.  **Clone the repository:**

    ```bash
    git clone https://github.com/s-gowtham-d/budget-tracker.git
    cd budget-tracker
    ```

3.  **Create `.env` files:**

    - `backend/.env`: For Django settings and database configuration.
    - `frontend/.env`: For React environment variables (e.g., `VITE_API_BASE_URL`).

    Refer to the `.env.example` files within `backend/config` and `frontend` for required variables.

## API Documentation

The backend API is fully documented using Swagger/OpenAPI. Once the backend server is running (either locally or via Docker):

- **Swagger UI:** `http://localhost:8000/swagger/`
- **ReDoc:** `http://localhost:8000/redoc/`
- **OpenAPI JSON:** `http://localhost:8000/swagger.json`
