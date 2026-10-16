# Vaishali Saree — Backend

Node.js + Express + MongoDB (Mongoose) API.

## 1. Install dependencies

```bash
npm install
```

## 2. Create your local .env

Copy the example file and fill in real values:

```bash
cp .env.example .env
```

Then open `.env` and set `MONGO_URI` to your Atlas connection string —
**add a database name** before the `?` in the string, e.g.:

```
mongodb://<user>:<password>@<cluster-host>/vaishali-saree?ssl=true&replicaSet=atlas-13z3va-shard-0&authSource=admin&appName=Cluster0
```

⚠️ Important: rotate your Atlas password if you ever pasted your real connection
string somewhere it could be seen (chat, GitHub, etc.) — Database Access → edit
user → Edit Password in the Atlas dashboard. Never commit `.env` (it's already
in `.gitignore`).

Also fill in `JWT_SECRET` (any long random string), and later `CLOUDINARY_*`
and `RAZORPAY_*` keys once you sign up for those services.

## 3. Run the server

```bash
npm run dev
```

Server runs on **http://localhost:5000**. Visit it in a browser — you should see
"Vaishali Saree API is running".

## API overview

| Route | Method | Access |
|---|---|---|
| `/api/auth/register` | POST | Public |
| `/api/auth/login` | POST | Public |
| `/api/products` | GET | Public |
| `/api/products` | POST | Admin |
| `/api/orders` | POST | User |
| `/api/orders/my` | GET | User |
| `/api/orders` | GET | Admin |
| `/api/payment/create-order` | POST | User |
| `/api/payment/verify` | POST | User |
| `/api/admin/dashboard` | GET | Admin |
| `/api/admin/reports/revenue` | GET | Admin |
| `/api/admin/reports/stock` | GET | Admin |

## Next steps
- Connect the frontend's `services/api.js` (axios) to `http://localhost:5000/api`
- Sign up for Cloudinary (free tier) and Razorpay (test mode) and drop their keys into `.env`
