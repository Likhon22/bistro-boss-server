# 🍽️ Bistro Boss - Server

![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=flat&logo=nodedotjs)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-6.3-47A248?style=flat&logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat&logo=jsonwebtokens)
![Stripe](https://img.shields.io/badge/Stripe-API-008CDD?style=flat&logo=stripe)

The backend API for the **Bistro Boss Restaurant Management System**. Built with Node.js and Express, it provides RESTful endpoints for user authentication, menu management, order processing, and payment integration.

## ✨ Features

- **Authentication & Authorization**:
  - JWT-based authentication (access tokens).
  - Role-based access control (Admin vs. User).
  - Secure cookie handling for tokens.
- **User Management**:
  - Create and manage user accounts.
  - Admin capabilities to promote/demote users.
- **Menu Management**:
  - CRUD operations for menu items.
  - Categorization of food items.
- **Cart & Orders**:
  - Manage user shopping carts.
  - Process orders and track status.
- **Payment Integration**:
  - Secure payment intent creation using **Stripe API**.
  - Payment verification and history logging.
- **Reviews**:
  - Handle user ratings and reviews.
- **Analytics**:
  - Aggregated stats for admin dashboard (revenue, order counts).

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Native Driver)
- **Authentication**: [JSON Web Token (JWT)](https://jwt.io/)
- **Payment**: [Stripe SDK](https://stripe.com/docs/api)
- **Environment**: [Dotenv](https://github.com/motdotla/dotenv)
- **Middleware**: CORS, Cookie Parser.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Database (Local or Atlas)
- Stripe Account

### Installation

1.  **Navigate to the server directory:**
    ```bash
    cd bistro-boss-server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root of `bistro-boss-server` and add the following:

    ```env
    PORT=5000
    DB_USER=your_mongodb_username
    DB_PASS=your_mongodb_password
    ACCESS_TOKEN_SECRET=your_jwt_secret_key
    STRIPE_SECRET_KEY=your_stripe_secret_key
    ```

4.  **Run the server:**
    ```bash
    npm start
    # OR for development with nodemon
    npm run dev
    ```
    The server will run at `http://localhost:5000`.

## 📚 API Endpoints

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| **Auth** | | | |
| `POST` | `/auth/jwt` | Generate JWT token | ❌ |
| `POST` | `/auth/logout` | Clear auth cookie | ❌ |
| **Users** | | | |
| `GET` | `/users` | Get all users | ✅ (Admin) |
| `POST` | `/users` | Create a new user | ❌ |
| `PATCH` | `/users/admin/:id` | Make user admin | ✅ (Admin) |
| `DELETE` | `/users/:id` | Delete user | ✅ (Admin) |
| **Menu** | | | |
| `GET` | `/menu` | Get all menu items | ❌ |
| `POST` | `/menu` | Add menu item | ✅ (Admin) |
| `DELETE` | `/menu/:id` | Delete menu item | ✅ (Admin) |
| **Carts** | | | |
| `GET` | `/carts` | Get user's cart | ✅ |
| `POST` | `/carts` | Add item to cart | ✅ |
| `DELETE` | `/carts/:id` | Remove item from cart | ✅ |
| **Payments** | | | |
| `POST` | `/create-payment-intent` | Create Stripe intent | ✅ |
| `POST` | `/payments` | Save payment info | ✅ |
| `GET` | `/payments/:email` | Get payment history | ✅ |

## 📂 Project Structure

```
src/
├── api/                # Route handlers (auth, cart, menu, etc.)
├── middlewares/        # Custom middlewares (verifyToken, verifyAdmin)
├── utils/              # Utility functions (db connection)
├── app.js              # Express app setup
└── server.js           # Server entry point
```
