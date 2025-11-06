# 💰 Budget Tracker Frontend

A modern, responsive budget management dashboard built with **Vite + React + TypeScript** and integrated with a Django backend API.

---

## 🚀 Tech Stack

- ⚡ [Vite](https://vitejs.dev/) – blazing fast build tool
- ⚛️ [React 19](https://react.dev/) with TypeScript
- 🎨 [Tailwind CSS](https://tailwindcss.com/) for styling
- 🧱 [shadcn/ui](https://ui.shadcn.com/) & [Lucide Icons](https://lucide.dev/)
- 🔒 JWT Authentication via Django REST API
- 📊 Charts powered by [Recharts](https://recharts.org/)

---

## 🛠️ Setup & Development

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/s-gowtham-d/budget-tracker.git
cd budget-tracker/frontend
```

Here’s a **clean, production-ready `README.md`** template you can drop directly into your Vite (React/TypeScript) frontend project — ideal for apps like your **budget tracker** frontend.

---

### 🧭 `README.md` — Vite Frontend

````markdown
# 💰 Budget Tracker Frontend

A modern, responsive budget management dashboard built with **Vite + React + TypeScript** and integrated with a Django backend API.

---

## 🚀 Tech Stack

- ⚡ [Vite](https://vitejs.dev/) – blazing fast build tool
- ⚛️ [React 19](https://react.dev/) with TypeScript
- 🎨 [Tailwind CSS](https://tailwindcss.com/) for styling
- 🧱 [shadcn/ui](https://ui.shadcn.com/) & [Lucide Icons](https://lucide.dev/)
- 🔒 JWT Authentication via Django REST API
- 📊 Charts powered by [Recharts](https://recharts.org/)

---

## 🛠️ Setup & Development

### 1️⃣ Clone the Repository

```bash
git clone  https://github.com/s-gowtham-d/budget-tracker.git
cd budget-tracker/frontend
```
````

### 2️⃣ Install Dependencies

Use your preferred package manager:

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the `frontend/` directory:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
```

> Example for production:
>
> ```
> VITE_API_BASE_URL=https://budget-tracker-iysk.onrender.com
> ```

---

## 🧩 Scripts

| Command        | Description                  |
| -------------- | ---------------------------- |
| `pnpm dev`     | Run the development server   |
| `pnpm build`   | Build for production         |
| `pnpm preview` | Preview the production build |
| `pnpm lint`    | Lint code using ESLint       |
| `pnpm format`  | Format code with Prettier    |

---

## 🐳 Docker Support

To build and run the frontend in Docker:

```bash
docker build -t username/app:tag .
docker run -d -p 5173:80 username/app:tag
```

Or using **Docker Compose**:

```bash
docker compose up -d frontend
```

---

## 🌐 Deployment (Vercel / Render / Nginx)

- For **Vercel** or **Netlify**, simply point to the `frontend/` folder.
- For **Nginx/Docker** deployments, ensure your backend API URL is set in `.env` before building:

  ```bash
  VITE_API_BASE_URL=https://budget-tracker-iysk.onrender.com
  npm run build
  ```

---

## 🧠 Notes

- Ensure the backend (Django) is running before accessing the dashboard.
- Authentication tokens are managed via localStorage.
- If API calls fail, check your CORS configuration in the backend.

---
