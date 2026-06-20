# BudgetBuddy

A simple monthly expense tracker with user accounts. Register, log in, and keep track of what you're spending each month — all saved to your own account so your data is private and persists across devices.

This started as two separate things — a plain HTML/JS expense calculator and a JWT-based auth system — and is now merged into one full-stack app with a React frontend and an Express + MongoDB backend.

## What it does

- **Sign up and log in** with a name, email, and password (passwords are hashed, never stored in plain text)
- **Track expenses by month** — set a monthly budget, add entries with a description, amount, and date
- **See your numbers at a glance** — total spent, money left, and a rough daily budget based on how many days remain
- **Keeps history** — every month you've tracked is saved separately, so you can come back and check past months
- **Quick spending insight** — a button that looks at your entries and tells you things like your biggest expense and whether you're on pace with your budget (calculated instantly in the browser, no external API needed)
- **Auto-save** — delete or edit an entry and it saves and recalculates immediately, no extra "save" click required (though a manual save button is there too, just in case)

## Tech stack

**Frontend:** React, Tailwind CSS, React Router, Axios
**Backend:** Node.js, Express
**Database:** MongoDB (via Mongoose)
**Auth:** JWT (JSON Web Tokens) + bcrypt for password hashing

## Project structure

```
auth-system/
├── client/                  # React frontend
│   └── src/
│       ├── pages/
│       │   ├── Register.jsx
│       │   ├── Login.jsx
│       │   ├── Profile.jsx
│       │   ├── Logout.jsx
│       │   └── ExpenseTracker.jsx
│       ├── App.jsx
│       └── main.jsx
│
└── server/                  # Express backend
    ├── config/
    │   └── db.js             # MongoDB connection
    ├── models/
    │   ├── User.js
    │   └── Expense.js
    ├── controllers/
    │   ├── authController.js
    │   └── expenseController.js
    ├── routes/
    │   ├── authRoutes.js
    │   └── expenseRoutes.js
    ├── middleware/
    │   └── authMiddleware.js
    └── server.js
```

## How the pieces fit together

- Every expense record in the database is linked to a `userId`, so when you're logged in, you only ever see your own data — never anyone else's
- The backend checks your JWT token on every expense request through `authMiddleware`, the same middleware your profile page already used
- One expense document is saved per user, per month — so March's data doesn't overwrite April's

## Running it locally

You'll need Node.js installed and a MongoDB connection string (either local MongoDB or a free MongoDB Atlas cluster).

**Backend:**
```bash
cd server
npm install
```


Then run:
```bash
npm run dev
```
The server starts on `http://localhost:5000`.

**Frontend:**
```bash
cd client
npm install
```

Create a `.env` file inside `client/`:
```
VITE_API_URL=http://localhost:5000
```

Then run:
```bash
npm run dev
```
The app opens at `http://localhost:5173`.

## Deployment

This is set up to deploy with **Render** (backend) and **Vercel** (frontend), with MongoDB Atlas as the database.

**Backend on Render:**
- Root directory: `server`
- Build command: `npm install`
- Start command: `node server.js`
- Environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your Vercel URL, once you have it)

**Frontend on Vercel:**
- Root directory: `client`
- Environment variable: `VITE_API_URL` (your Render backend URL)

One thing to remember on MongoDB Atlas: go to **Network Access** and allow access from anywhere (`0.0.0.0/0`), since Render's servers don't have a fixed IP address.

## A note on the "AI" feature

The spending insight feature doesn't call any paid API — it's plain JavaScript running in your browser that looks at your entries and budget and writes out a short, useful summary. This keeps the app free to run, with no API keys or billing required.

## What's not included (yet)

- Editing past months' budget after the fact beyond what's already there
- Exporting data (PDF/CSV)
- Multi-currency support — everything assumes ₹ (INR) for now

---
author: Komal Ahuja
Built as a learning project combining authentication, a real database, and a practical day-to-day tool.
