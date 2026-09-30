# Full-Stack Authentication & Product Management System

A production-ready monorepo featuring a robust **Node.js / Express / MongoDB** backend with JWT dual-token authentication (Access Token + httpOnly Refresh Token cookie) and a modern **React (Vite)** frontend with Axios interceptors for automated token refreshing and protected routing.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Monorepo Folder Structure](#monorepo-folder-structure)
4. [Prerequisites & Environment Setup](#prerequisites--environment-setup)
5. [Local Installation & Running](#local-installation--running)
6. [Authentication Architecture](#authentication-architecture)
7. [API Documentation](#api-documentation)
8. [Validation & Error Handling](#validation--error-handling)

---

## Project Overview

This repository demonstrates industry-standard authentication patterns and full CRUD operations:
- **Dual-Token Authentication**: Stateless short-lived JWT Access Tokens (15 min) paired with secure, `httpOnly`, `SameSite` Refresh Tokens (7 days) persisted in MongoDB.
- **Automated Silent Refresh**: Axios interceptors intercept expired token errors (`401`) and transparently fetch a new access token without disrupting the user experience.
- **Robust Input Validation**: Strict validation and sanitization using `express-validator` returning uniform field-level `400 Bad Request` responses before reaching controller logic.
- **Product Management**: Complete CRUD operations for catalog products with schema constraints and route parameter verification.

---

## Tech Stack

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), Password Hashing (`bcryptjs`), Cookie Parser (`cookie-parser`)
- **Validation**: `express-validator`
- **Security & Utilities**: CORS, dotenv

### Frontend
- **Framework**: React 18+ (Vite)
- **Routing**: React Router (DOM)
- **HTTP Client**: Axios (configured with credentials and response interceptors)
- **State Management**: React Context API (`AuthContext`)
- **Styling**: Tailwind CSS / Vanilla CSS

---

## Monorepo Folder Structure

```text
auth-product-assignment/
├── backend/
│   ├── src/
│   │   ├── app/
│   │   │   └── app.js                 # Express application initialization & middleware pipeline
│   │   ├── config/
│   │   │   ├── db.config.js           # Mongoose MongoDB connection handler
│   │   │   ├── env.config.js          # Centralized environment variable loader
│   │   │   └── multer.config.js       # File upload configuration (optional assets)
│   │   ├── controllers/
│   │   │   ├── auth.controller.js     # Auth logic: register, login, refresh, logout, getMe
│   │   │   └── product.controller.js  # Product CRUD controller functions
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js     # Bearer token verification & req.user attachment
│   │   │   └── validate.middleware.js # Express-validator result parser (field-level 400s)
│   │   ├── models/
│   │   │   ├── product.model.js       # Product Mongoose schema & indexing
│   │   │   └── user.model.js          # User schema (bcrypt hash, stored refreshToken)
│   │   ├── routes/
│   │   │   ├── auth.routes.js         # /api/auth endpoint declarations & route binding
│   │   │   └── product.routes.js      # /api/products endpoint declarations
│   │   ├── utils/
│   │   │   ├── generateToken.util.js  # Access & Refresh token signing helpers
│   │   │   └── verifyToken.util.js    # JWT verification helpers
│   │   ├── validation/
│   │   │   ├── user.validation.js     # Auth request validation rules
│   │   │   └── product.validation.js  # Product payload & ObjectId param validation rules
│   │   └── index.js                   # Server entrypoint (db connection + app.listen)
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx             # Navigation header & logout trigger
│   │   │   ├── ProtectedRoute.jsx     # Route guard checking authentication state
│   │   │   ├── Products.jsx           # Product catalogue list & delete action
│   │   │   ├── CreateProduct.jsx      # Add product form
│   │   │   ├── EditProduct.jsx        # Edit product form
│   │   │   └── ProductDetails.jsx     # Single product view
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Auth state provider (user, token, login, logout)
│   │   ├── pages/
│   │   │   ├── Home.jsx               # Dashboard container layout
│   │   │   ├── Login.jsx              # Login page with field error binding
│   │   │   └── Register.jsx           # Registration page with confirm password
│   │   ├── Routes/
│   │   │   └── main.routes.jsx        # Application routing definitions
│   │   ├── utils/
│   │   │   └── axiosInstance.utils.js # Pre-configured Axios with interceptors
│   │   ├── App.jsx
│   │   ├── main.jsx                   # Vite entrypoint
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── package.json                       # Monorepo root script runner (concurrently)
└── README.md
```

---

## Prerequisites & Environment Setup

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017`) or MongoDB Atlas cluster URI.

### 1. Backend Environment Setup (`backend/.env`)

Create a `.env` file in `/backend`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/auth_product_db
FRONTEND_URL=http://localhost:5173

# JWT Configuration
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_32_bytes_min
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_32_bytes_min
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
```

### 2. Frontend Environment Setup (`frontend/.env`)

Create a `.env` file in `/frontend`:

```env
VITE_BACKEND_URL=http://localhost:5000
```

---

## Local Installation & Running

You can install dependencies and run both servers simultaneously from the root directory or run them individually in separate terminals.

### Option A: Running with Concurrently (Recommended)

1. Install root dependencies:
   ```bash
   npm install
   ```
2. Install subfolder dependencies:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   cd ..
   ```
3. Run both backend & frontend concurrently:
   ```bash
   npm run dev
   ```

### Option B: Running in Separate Terminals

#### Terminal 1 (Backend):
```bash
cd backend
npm install
npm run dev
```
*Backend runs on `http://localhost:5000`.*

#### Terminal 2 (Frontend):
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## Authentication Architecture

1. **Registration (`POST /api/auth/register`)**:
   - Validates user payload (Email format, Password length & confirmation).
   - Checks if email is already registered (`409 Conflict`).
   - Hashes password using bcrypt (10 rounds) and persists user to database.
   - Returns sanitized user object (`_id`, `name`, `email`).

2. **Login (`POST /api/auth/login`)**:
   - Verifies credentials against hashed password.
   - Signs a short-lived **Access Token** (15 mins) and sends it in the response body.
   - Signs a long-lived **Refresh Token** (7 days), writes it to the user's DB record, and sets an `httpOnly`, `secure`, `sameSite: "strict"` cookie.

3. **Access Protected Endpoints**:
   - The frontend attaches the access token via the HTTP header:
     `Authorization: Bearer <accessToken>`
   - `authenticate` middleware decodes and verifies the token and loads `req.user`.

4. **Token Refresh (`POST /api/auth/refresh-token`)**:
   - When the access token expires, Axios interceptors detect the `401 Unauthorized` status.
   - The interceptor hits `/api/auth/refresh-token` with credentials (sending the `httpOnly` cookie).
   - The server verifies the token signature and matches it against the stored token in MongoDB.
   - A fresh access token is returned and stored in memory. The failed API request is automatically retried.

5. **Logout (`POST /api/auth/logout`)**:
   - Invalidates and removes the refresh token from the database.
   - Clears the `refreshToken` cookie from the client.

---

## API Documentation

### Base URL: `http://localhost:5000/api`

| Endpoint | Method | Access | Request Body Sample | Success Response | Status Codes |
|---|---|---|---|---|---|
| `/auth/register` | `POST` | Public | `{"name":"John Doe","email":"john@example.com","password":"Password123","confirmPassword":"Password123"}` | `{"message":"User registered successfully","user":{"_id":"...","name":"John Doe","email":"john@example.com"}}` | `201`, `400`, `409`, `500` |
| `/auth/login` | `POST` | Public | `{"email":"john@example.com","password":"Password123"}` | `{"message":"Login successful","accessToken":"eyJhbG...","user":{"_id":"...","name":"John Doe","email":"john@example.com"}}` *(Sets httpOnly cookie)* | `200`, `400`, `401`, `500` |
| `/auth/refresh-token` | `POST` | Public *(Cookie Required)* | None *(Reads `refreshToken` cookie)* | `{"message":"Access token refreshed","accessToken":"eyJhbG..."}` | `200`, `401`, `403`, `500` |
| `/auth/me` | `GET` | Protected *(Bearer Token)* | None | `{"user":{"_id":"...","name":"John Doe","email":"john@example.com"}}` | `200`, `401`, `500` |
| `/auth/logout` | `POST` | Protected / Cookie | None | `{"message":"Logged out successfully"}` *(Clears cookie)* | `200`, `401`, `500` |
| `/products` | `GET` | Public | None | `{"products":[{"_id":"...","name":"Wireless Mouse","price":29.99,"stock":50,"category":"Electronics"}]}` | `200`, `500` |
| `/products/:id` | `GET` | Public | None | `{"product":{"_id":"...","name":"Wireless Mouse","price":29.99,"stock":50,"category":"Electronics"}}` | `200`, `400`, `404`, `500` |
| `/products` | `POST` | Protected *(Bearer Token)* | `{"name":"Mechanical Keyboard","price":89.99,"description":"RGB Keyboard","stock":25,"category":"Electronics"}` | `{"message":"Product created","product":{"_id":"...","name":"Mechanical Keyboard",...}}` | `201`, `400`, `401`, `500` |
| `/products/:id` | `PUT` | Protected *(Bearer Token)* | `{"name":"Updated Keyboard","price":99.99,"stock":20,"category":"Electronics"}` | `{"message":"Product updated","product":{"_id":"...","name":"Updated Keyboard",...}}` | `200`, `400`, `401`, `404`, `500` |
| `/products/:id` | `DELETE` | Protected *(Bearer Token)* | None | `{"message":"Product deleted successfully"}` | `200`, `400`, `401`, `404`, `500` |

---

## Validation & Error Handling

All request validations are performed using a dedicated `validate` middleware. If validation fails, requests are halted before hitting the controller and return standard field-level errors:

```json
{
  "message": "Validation failed",
  "errors": {
    "email": "Please provide a valid email address",
    "password": "Password must be at least 6 characters long",
    "price": "Price must be a positive number",
    "id": "Invalid product ID format"
  }
}
```
