# 🍽️ CanteenEase – Smart College Canteen Pre-Order & Pickup System

A **complete full-stack web application** for college canteen management. Students can browse the menu, pre-order food, receive a smart pickup token, and track their order — all without standing in queues!

---

## 📸 Features

### 👨‍🎓 Student Features

- **Browse Menu** – View all canteen food items with search, category filter, and veg/non-veg filter
- **Add to Cart** – Select items and manage cart quantities
- **Place Order** – Checkout and place a pre-order
- **Smart Pickup Token** – Get a unique daily token number (e.g., Token #7)
- **Order Tracking** – Track order status: Pending → Confirmed → Preparing → Ready → Completed
- **Notifications** – Get in-app notifications when your food is ready
- **My Orders** – View full order history

### 👨‍💼 Admin / Canteen Staff Features

- **Admin Dashboard** – View and manage all incoming orders
- **Live Queue** – Real-time queue showing current orders and tokens
- **Update Order Status** – Change order status (confirming, preparing, ready, etc.)
- **Food Management** – Add, edit, delete food items; toggle availability
- **Automatic Notifications** – Students are notified when status changes

---

## 🛠️ Tech Stack

| Layer       | Technology            |
| ----------- | --------------------- |
| Frontend    | React.js (Vite)       |
| Backend     | Node.js + Express.js  |
| Database    | MongoDB + Mongoose    |
| Auth        | JWT (JSON Web Tokens) |
| Styling     | Vanilla CSS           |
| HTTP Client | Axios                 |

---

## ✅ Current Project Status

The core canteen workflow is implemented and validated for local demo use:

- Student login/register and admin login flow
- Menu browsing, cart, and order placement
- Smart pickup token generation and queue tracking
- Order status updates with automatic student notifications
- Notification center with unread count, read-all, and per-item read actions
- Toast feedback for auth and cart actions to improve UX during everyday use
- Integrated notification bell with unread badge and dropdown actions in the navbar
- Auth profile alias support for smoother authenticated session handling
- Frontend production build has been verified successfully

---

## 📁 Project Structure

```
canteenease/
│
├── client/                     # React Frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   └── layout/
│       │       ├── Navbar.jsx      # Top navigation with cart & notification badges
│       │       └── Navbar.css
│       │       FoodCard.jsx        # Reusable food item card
│       │       FoodCard.css
│       ├── context/
│       │   ├── AuthContext.jsx     # Authentication state (user, login, logout)
│       │   └── CartContext.jsx     # Cart state (add, remove, update)
│       ├── pages/
│       │   ├── Home.jsx            # Landing page with hero, features, food preview
│       │   ├── Login.jsx           # Student/Admin login
│       │   ├── Register.jsx        # Student registration
│       │   ├── Menu.jsx            # Browse menu with filters
│       │   ├── Cart.jsx            # Shopping cart
│       │   ├── Checkout.jsx        # Place order
│       │   ├── MyOrders.jsx        # Order history
│       │   ├── OrderDetails.jsx    # Single order with tracking timeline
│       │   ├── Notifications.jsx   # In-app notifications
│       │   ├── AdminDashboard.jsx  # Admin order management
│       │   ├── AdminQueue.jsx      # Live order queue for canteen
│       │   └── AdminFoods.jsx      # Add/Edit/Delete food items
│       ├── services/
│       │   └── api.js              # Axios instance with base URL & auth token
│       ├── App.jsx                 # Routes
│       └── main.jsx                # Entry point
│
└── server/                     # Node.js Backend
    ├── config/
    │   └── db.js                   # MongoDB connection
    ├── controllers/
    │   ├── authController.js       # Register, Login, Get Profile
    │   ├── foodController.js       # CRUD food items
    │   ├── orderController.js      # Create order, update status, get orders
    │   └── notificationController.js # Get notifications, mark as read
    ├── middleware/
    │   └── authMiddleware.js       # JWT protect & admin middleware
    ├── models/
    │   ├── User.js                 # Student/Admin user schema
    │   ├── Food.js                 # Food item schema
    │   ├── Order.js                # Order schema with pickup token
    │   └── Notification.js         # Notification schema
    ├── routes/
    │   ├── authRoutes.js
    │   ├── foodRoutes.js
    │   ├── orderRoutes.js
    │   └── notificationRoutes.js
    ├── seed.js                     # Database seeder with sample data
    ├── server.js                   # Express app entry point
    └── .env                        # Environment variables
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local installation OR MongoDB Atlas free tier)
- **npm** or **yarn**

### 1. Clone / Navigate to Project

```bash
cd canteenease
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create/edit the `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/canteenease
JWT_SECRET=canteenease_super_secret_key_2026
```

**Seed the database with sample data:**

```bash
npm run seed
```

**Start the backend server:**

```bash
npm run dev
```

The server will run at: `http://localhost:5000`

### 3. Frontend Setup

Open a **new terminal**:

```bash
cd client
npm install
npm run dev
```

The frontend will run at: `http://localhost:5173`

---

## 🔐 API Endpoints

### Authentication

| Method | Endpoint             | Description              | Access  |
| ------ | -------------------- | ------------------------ | ------- |
| POST   | `/api/auth/register` | Register new student     | Public  |
| POST   | `/api/auth/login`    | Login user               | Public  |
| GET    | `/api/auth/profile`  | Get current user profile | Private |

### Food Items

| Method | Endpoint         | Description        | Access |
| ------ | ---------------- | ------------------ | ------ |
| GET    | `/api/foods`     | Get all food items | Public |
| POST   | `/api/foods`     | Add food item      | Admin  |
| PUT    | `/api/foods/:id` | Update food item   | Admin  |
| DELETE | `/api/foods/:id` | Delete food item   | Admin  |

### Orders

| Method | Endpoint                 | Description         | Access  |
| ------ | ------------------------ | ------------------- | ------- |
| POST   | `/api/orders`            | Create new order    | Private |
| GET    | `/api/orders/my`         | Get my orders       | Private |
| GET    | `/api/orders/:id`        | Get order details   | Private |
| PUT    | `/api/orders/:id/status` | Update order status | Admin   |
| GET    | `/api/orders`            | Get all orders      | Admin   |

### Notifications

| Method | Endpoint                      | Description            | Access  |
| ------ | ----------------------------- | ---------------------- | ------- |
| GET    | `/api/notifications`          | Get user notifications | Private |
| PUT    | `/api/notifications/:id/read` | Mark one as read       | Private |
| PUT    | `/api/notifications/read-all` | Mark all as read       | Private |

---

## 🎫 Smart Pickup Token System

When a student places an order:

1. A **daily token number** is assigned automatically (resets to 1 each day)
2. The token is included in the order confirmation (e.g., Token #7)
3. Students show **only the token number** at the counter — no waiting required
4. Admin can see all tokens and the queue at `/admin/queue`

---

## 👥 Demo Credentials

| Role    | Email                 | Password   |
| ------- | --------------------- | ---------- |
| Admin   | admin@canteenease.com | admin123   |
| Student | student@college.edu   | student123 |

---

## 🎓 Viva Explanation Points

1. **Architecture**: 3-tier — React (View) → Express (Controller) → MongoDB (Model)
2. **Authentication**: JWT stored in localStorage, sent in Authorization header
3. **State Management**: React Context API (AuthContext + CartContext)
4. **Order Flow**: Cart → Checkout → Token Generated → Admin Updates Status → Student Notified
5. **Token System**: Sequential daily tokens from MongoDB, auto-incremented
6. **Notifications**: Created server-side when admin updates order status
7. **Admin Protection**: Middleware checks `user.role === 'admin'` on protected routes

---

## 📝 License

This is an academic project built for educational purposes.
