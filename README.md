# Budget Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
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

    # Budget Tracker

    A personal budget tracking web application with a Django REST backend and a Vite + React frontend. This repository contains both the API server (`backend/`) and the single-page application (`frontend/`). A Docker Compose configuration is included to run both services together for development or production testing.

    ## Table of contents

    - [Features](#features)
    - [Architecture](#architecture)
    - [Prerequisites](#prerequisites)
    - [Local development](#local-development)
      - [Backend (Django)](#backend-django)
      - [Frontend (Vite + React)](#frontend-vite--react)
    - [Docker (compose)](#docker-compose)
    - [Running tests](#running-tests)
    - [Project structure](#project-structure)
    - [Contributing](#contributing)
    - [License](#license)

    ## Features

    - User accounts and authentication (Django REST)
    - Transaction recording and categorization
    - Budgets and summaries/dashboard data
    - REST API for programmatic access
    - Modern TypeScript React frontend (Vite) for a fast developer experience

    ## Architecture

    - Backend: Django REST Framework — located in `backend/`. Uses SQLite for local development (`backend/db.sqlite3`).
    - Frontend: React + TypeScript built with Vite — located in `frontend/`.
    - Containerization: `docker-compose.yml` defines services to run the backend and frontend together.

    ## Prerequisites

    - Git
    - Docker & Docker Compose (optional — required to run with containers)
    - For running locally without Docker:
      - Python 3.10+ (3.11 recommended)
      - Node.js (v16+ or v18+) and a package manager — this repo includes a `pnpm-lock.yaml`, so `pnpm` is recommended but `npm` or `yarn` will also work.

    ## Local development

    The repository contains two main folders: `backend/` and `frontend/`. You can run them independently during development or use Docker Compose to run both together.

    ### Backend (Django)

    1. Open a terminal and change to the backend folder:

    ```bash
    cd backend
    ```

    2. Create and activate a virtual environment (macOS / Linux):

    ```bash
    python -m venv .venv
    source .venv/bin/activate
    ```

    3. Install Python dependencies:

    ```bash
    pip install -r requirements.txt
    ```

    4. Apply migrations and create a superuser:

    ```bash
    python manage.py migrate
    python manage.py createsuperuser
    ```

    5. Run the development server:

    ```bash
    python manage.py runserver
    ```

    By default the server runs on http://127.0.0.1:8000/ and exposes the API endpoints defined in the `backend` apps.

    Notes:

    - The project includes an existing SQLite DB at `backend/db.sqlite3` for quick local testing. If you rely on it, back it up before removing it.
    - Environment-specific settings (secrets, DBs, third-party keys) should be configured via environment variables (see Docker section for examples).

    ### Frontend (Vite + React)

    1. Open a terminal and change to the frontend folder:

    ```bash
    cd frontend
    ```

    2. Install JavaScript dependencies (pnpm recommended):

    ```bash
    pnpm install
    # or
    npm install
    ```

    3. Start the dev server:

    ```bash
    pnpm run dev
    # or
    npm run dev
    ```

    The dev server will usually run at http://localhost:5173/ (Vite default) — the exact address is printed in the terminal.

    To build for production:

    ```bash
    pnpm run build
    # or
    npm run build
    ```

    and preview:

    ```bash
    pnpm run preview
    ```

    ## Docker (compose)

    This repo includes a `docker-compose.yml` at the repository root to run the backend and frontend together. Docker is a convenient way to get the full stack running with minimal local setup.

    Start the stack (build on first run):

    ```bash
    docker compose up --build
    ```

    Stop and remove containers:

    ```bash
    docker compose down
    ```

    If you need to run only one service, you can run `docker compose up backend` or `docker compose up frontend`.

    Environment variables and secrets should be provided via a `.env` file or Docker Compose overrides; this repository does not commit secrets into source control.

    ## Running tests

    Backend tests use pytest. From the repository root run:

    ```bash
    cd backend
    pytest -q
    ```

    Frontend tests (if present) can be run from `frontend/` using the configured test runner (check `package.json`).

    ## Project structure

    - `backend/` — Django project and apps (accounts, budgets, transactions, dashboard, ai_assistant, ...)
      - `manage.py` — Django CLI
      - `requirements.txt` — Python dependencies
      - `db.sqlite3` — local SQLite DB (committed for convenience)
    - `frontend/` — Vite + React app (TypeScript)
    - `docker-compose.yml` — development/stack orchestration

    Explore each app folder for serializers, views, urls and tests.

    ## Contributing

    Contributions are welcome. A suggested flow:

    1. Fork the repository
    2. Create a feature branch: `git checkout -b feat/my-feature`
    3. Run tests and linters locally
    4. Open a pull request with a clear description of the change

    Please adhere to the existing code style and add tests for new behavior.

    ## License

    This project includes a `LICENSE` file in the repository root. Review that file for license details.

    ## Contact

    If you want to discuss features or report issues, open an issue in this repository or reach out via the preferred contact method listed in project metadata.

    ***

    If you'd like, I can also:

    - Add a short development checklist or troubleshooting section
    - Add example environment variable files for Docker and local development
    - Improve the contributing guide with a PR template and issue template

    Tell me which of the above you'd like next and I'll add it.

    This command will:

    - Build Docker images for both backend and frontend.
    - Start the Django backend on `http://localhost:8000/`.
    - Start the React frontend on `http://localhost:5173/`.
    - (Optionally) Start a PostgreSQL database and Redis if configured in `docker-compose.yml`.

    Access the application in your browser at `http://localhost:5173/`.

## API Documentation

The backend API is fully documented using Swagger/OpenAPI. Once the backend server is running (either locally or via Docker):

- **Swagger UI:** `http://localhost:8000/swagger/`
- **ReDoc:** `http://localhost:8000/redoc/`
- **OpenAPI JSON:** `http://localhost:8000/swagger.json`
