# Vaishali Saree — Admin Panel

React + Vite + Tailwind + Recharts. Talks to the backend at `http://localhost:5000/api`.

## Setup

```bash
npm install
npm run dev
```

Runs on **http://localhost:5174** (backend must be running on port 5000 first).

## Logging in

There's no separate admin signup screen — an admin is just a User document with
`role: "admin"`. Easiest way to create one for testing:

1. Register a normal account through the **frontend** app (or POST to
   `/api/auth/register` with a tool like Postman/Thunder Client).
2. In MongoDB Atlas (or MongoDB Compass), open the `users` collection and change
   that user's `role` field from `"user"` to `"admin"`.
3. Log in on this admin panel with that account's email/password.

## Pages
- **Dashboard** — revenue, orders, customers, low-stock alerts, revenue chart
- **Products** — list, search, add (with image upload), edit, delete
- **Orders** — view all orders, update status (placed → shipped → delivered → cancelled)
- **Reports** — best sellers, full stock report
- **Coupons** — create and list discount codes

## Notes
- Auth token is stored in `localStorage` as `adminToken`; requests attach it automatically via the axios interceptor in `src/services/api.js`.
- If a request gets a 401 (expired/invalid token), you're auto-redirected to `/login`.
- Mobile: sidebar collapses into a hamburger menu below the `md` breakpoint.
