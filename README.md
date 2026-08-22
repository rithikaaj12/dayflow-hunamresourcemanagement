# DAYFLOW HRMS

DAYFLOW is a full-stack Human Resource Management System focused on time, flow, people, and action.

## Project structure

- frontend/ - React + TypeScript + Vite app
- backend/ - Express + TypeScript + Prisma + SQLite API

## Quick start

### 1. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at http://localhost:3000

### 2. Backend

```bash
cd backend
npm install
npx prisma db push
npm run prisma:seed
npm run dev
```

The API runs at http://localhost:4000

## Demo accounts

- Employee: employee@dayflow.io / Demo@123
- Admin: admin@dayflow.io / Demo@123

## Environment

Copy the example files:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

## Tech stack

Frontend:
- React 18
- Vite
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router
- Recharts

Backend:
- Node.js
- Express
- TypeScript
- Prisma
- SQLite
- JWT
- bcryptjs
- Zod
