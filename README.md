# Task Manager

A React + TypeScript task management frontend that connects to a REST backend. Tasks are organised in a Kanban-style board with three columns — **To Do**, **In Progress**, and **Done** — and support drag-and-drop status changes.

## Features

- **Kanban board** — three-column layout (To Do / In Progress / Done)
- **Drag and drop** — drag a card between columns to update its status instantly
- **Double-click to edit** — double-click any task card to open the edit form
- **Sorted by due date** — tasks within each column are ordered soonest due first
- **Create / edit / delete tasks** — full CRUD with form validation
- **JWT authentication** — register, login, and protected routes

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| HTTP client | Axios |
| Routing | React Router v7 |

## Prerequisites

- Node.js 18+
- npm 9+
- The backend API running on `http://localhost:4000` (see [Backend API](#backend-api))

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

The `.env` file is pre-configured to point at the local backend:

```
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

Update this value if your backend runs on a different host or port.

### 3. Start the dev server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**.

Open `http://localhost:5173/tasks` in your browser. If you are not logged in you will be redirected to `/login` automatically.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Serve the production build locally |
| `npm run type-check` | Run TypeScript type checking without emitting |
| `npm run lint` | Run ESLint |
| `npm run format` | Format all files with Prettier |

## Project Structure

```
src/
├── api/
│   └── client.ts          # Axios instance + auth/task API helpers
├── components/
│   ├── TaskForm.tsx        # Create / edit task form
│   ├── TaskItem.tsx        # Individual task card (draggable)
│   └── TaskList.tsx        # Kanban column with drag-and-drop drop zone
├── context/
│   └── AuthContext.tsx     # JWT token state and auth helpers
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── TasksPage.tsx       # Kanban board — groups and sorts tasks per column
├── types/
│   └── index.ts            # Shared TypeScript types
├── index.css               # Tailwind imports + design system tokens
└── main.tsx
```

## Backend API

The frontend expects a REST API at `http://localhost:4000`. The full API contract is documented in [`backend_api/swagger_api.json`](backend_api/swagger_api.json).

### Key endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Register a new user |
| `POST` | `/api/v1/auth/login` | Login and receive a JWT |
| `GET` | `/api/v1/tasks` | List tasks (paginated) |
| `POST` | `/api/v1/tasks` | Create a task |
| `PUT` | `/api/v1/tasks/{id}` | Update a task |
| `DELETE` | `/api/v1/tasks/{id}` | Delete a task |

All task endpoints require a `Bearer <token>` header. The token is stored in `localStorage` and attached automatically by the Axios request interceptor.

### Task validation rules

| Field | Constraint |
|---|---|
| `title` | Required, 10–50 characters |
| `description` | Optional, max 200 characters |
| `status` | `TODO` \| `IN_PROGRESS` \| `DONE` |
| `dueAt` | Required, ISO 8601 date-time |
| `password` | Min 8 chars, must include uppercase, lowercase, number, and special character |

## Usage Walkthrough

1. **Register** — go to `/register` and create an account
2. **Login** — use your credentials at `/login`
3. **Create a task** — click **+ New Task** in the header, fill in the form, and submit
4. **Move a task** — drag a card from one column and drop it on another to update its status
5. **Edit a task** — double-click a card, or click the **Edit** button on the card
6. **Delete a task** — click the **Delete** button on a card and confirm the prompt
