# Finance Dashboard: Robust Backend with Role-Based Access Control (RBAC)

Welcome to my submission for the Finance Backend Assignment. This project is a feature-rich, enterprise-ready backend designed to handle financial transactions, user roles, and dashboard analytics.

> [!IMPORTANT]
> **Live Database Upgrade**: Although SQLite was an option, I have integrated this project with a live **Supabase (PostgreSQL)** instance to demonstrate cloud-native database management and scalability.

---

## 🔑 Ready-to-Test Credentials

You can use these pre-seeded accounts to test different permission levels immediately after setup:

| Role | Email | Password | What they can do |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@finance.dev` | `admin123` | **Full Power**: Create/Edit/Delete Records & Manage Users |
| **Analyst**| `analyst@finance.dev`| `analyst123`| **Analytics**: View records and dashboard insights only |
| **Viewer** | `viewer@finance.dev` | `viewer123` | **Summary Only**: Can only see the main dashboard stats |

---

## 🚀 Step-by-Step Testing Guide

I recommend using the **Swagger Documentation** to test, as it provides a visual interface for all API calls.

### 1. Initial Setup
1.  Run `npm install`.
2.  Set up your `.env` (details below).
3.  Run `npm run setup` (This installs, migrates, and seeds the DB automatically).
4.  Run `npm run dev`.

### 2. Authentication Flow
1.  Open **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**.
2.  Go to the **`POST /auth/login`** endpoint.
3.  Click "Try it out" and enter the **Admin** credentials above.
4.  **Copy the `token`** from the response.
5.  Click the **"Authorize"** button at the top of the Swagger page and paste your token. Now, all your requests will be authenticated!

### 3. Testing RBAC (Role-Based Access)
- **As Admin**: Try creating a record (`POST /records`). It will succeed.
- **As Viewer**: Log in with viewer credentials, authorize, and try `POST /records`. You will receive a `403 Forbidden` error—proving the access control logic is working.

### 4. Testing Dashboard Summary
- Call **`GET /dashboard/summary`**. 
- You will see aggregated totals for Income, Expenses, and a breakdown of spending by Category.

### 5. Testing Soft Delete
- Create a record, then use **`DELETE /records/{id}`**.
- Notice the response says "Deleted", but check the database or use `GET /records`. The record is hidden from the user but remains in the system with `isDeleted: true` for audit purposes.

---

## 🌟 Core Implementation Details

### ✅ User & Role Management
- Roles: `ADMIN`, `ANALYST`, `VIEWER`.
- Status: `ACTIVE`, `INACTIVE`.
- Middleware: Custom `restrictTo()` middleware ensures that only users with the correct role can hit specific routes.

### ✅ Financial Management
- Supports detailed entries: Amount, Type (Income/Expense), Category, Date, and Notes.
- **Advanced Filtering**: The `GET /records` endpoint supports query params like `startDate`, `endDate`, `category`, and `type`.
- **Pagination**: Built-in pagination with `page` and `limit`.

### ✅ Security & Reliability
- **JWT Auth**: Secure, stateless authentication.
- **Zod Validation**: Every request is validated against a schema before reaching the controller.
- **Rate Limiting**: Protects against API abuse.
- **Security Headers**: Integrated `helmet` for OWASP-standard security.

---

## 🏗️ Technical Stack

- **Runtime**: Node.js
- **Backend Framework**: Express.js
- **Database**: PostgreSQL (via **Supabase**)
- **ORM**: Prisma
- **Validation**: Zod
- **Documentation**: Swagger / OpenAPI 3.0

---

## 🛠️ Environment Configuration (`.env`)

```env
# Database URLs (Connect to your Supabase project)
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# JWT Config
JWT_SECRET="finance-super-secret-key-2024"
JWT_EXPIRES_IN="7d"

PORT=3000
```

---

## 💡 Important Design Decisions

1. **Soft Delete**: In financial systems, "deleting" data usually just means hiding it from the view while keeping it for audit trails. My implementation uses an `isDeleted` flag.
2. **Prisma & Supabase**: Using a type-safe ORM with a cloud-hosted Postgres database ensures that this code isn't just a prototype, but is ready for real-world deployment.
3. **Structured Errors**: Every error response follows a consistent format: `{ success: false, error: "Message" }`, making it easy for frontend developers to handle.

---
_Thank you for reviewing my assignment! I hope this implementation demonstrates my commitment to clean code and robust architecture._
