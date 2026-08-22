# DAYFLOW Deployment Guide

## Local development

### 1. Install frontend deps

```bash
cd frontend
npm install
npm run dev
```

### 2. Install backend deps

```bash
cd backend
npm install
npx prisma db push
npm run prisma:seed
npm run dev
```

## Production deployment

### Frontend

Build the frontend bundle:

```bash
cd frontend
npm run build
```

Deploy it to Vercel, Netlify, or another static hosting platform.

### Backend

```bash
cd backend
npm install
npm run build
npm start
```

For production, set secure values for:
- JWT_SECRET
- DATABASE_URL
- CLIENT_URL

Use PostgreSQL in production by adjusting the Prisma datasource and deployment configuration.

## Recommended env values

backend/.env:

```env
PORT=4000
JWT_SECRET=your-production-secret
DATABASE_URL="file:./dev.db"
CLIENT_URL=https://your-frontend-url
```
