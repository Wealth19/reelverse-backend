# 🎬 ReelVerse Backend

The **ReelVerse Backend** is the RESTful API powering the ReelVerse movie streaming platform.

It is built with **Node.js, Express.js, and MySQL**, providing authentication, user management, wallet services, payments, virtual accounts, movie-related services, rentals, purchases, and watch history.

The backend follows a modular architecture with controllers, services, routes, validation, middleware, centralized error handling, and database migrations.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- MySQL
- JWT Authentication
- bcryptjs
- Joi Validation
- Axios
- CORS
- dotenv
- Monnify
- REST API

---

## ✨ Features

### 🔐 Authentication

- User registration
- User login
- JWT access tokens
- JWT refresh tokens
- HttpOnly refresh-token cookies
- Refresh-token rotation
- Automatic access-token renewal
- Password hashing with bcryptjs
- Authentication middleware
- Logout
- Request validation with Joi

### 👤 User Management

- View authenticated user's profile
- Update profile information
- Change password
- Delete account
- User lookup services
- User roles

### 💳 Wallet

- Automatic wallet creation during registration
- Wallet balance management
- Wallet history
- Wallet transaction support

### 💰 Payments

- Payment transaction handling
- Payment initialization
- Payment verification
- Payment status management
- Webhook processing

### 🏦 Virtual Accounts

- User virtual account creation
- Virtual account management
- Monnify integration
- Virtual account webhook support

### 🎬 Movies

- Movie management structure
- Movie CRUD architecture
- Movie-related database migrations

### 🎟️ Rentals

- Movie rentals
- Rental records
- Rental history

### 🛒 Purchases

- Movie purchases
- Purchase records

### 👁️ Watch History

- Save watch history
- Retrieve watch history
- Track user movie activity

### 🛡️ Security

- JWT authentication
- HttpOnly refresh-token cookies
- Password hashing
- Protected routes
- Request validation
- Centralized error handling
- Async error handling
- Route-not-found handling
- CORS configuration

---

## 📁 Project Structure

```text
Backend/
│
├── src/
│   │
│   ├── configuration/
│   │   └── Database configuration
│   │
│   ├── controller/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── wallet.controller.js
│   │   ├── wallet-history.controller.js
│   │   ├── payment.controller.js
│   │   ├── virtual-account.controller.js
│   │   └── webhook.controller.js
│   │
│   ├── database/
│   │   └── migration/
│   │
│   ├── dto/
│   │   ├── auth.validator.js
│   │   ├── user.validator.js
│   │   ├── wallet.validator.js
│   │   └── payment/
│   │
│   ├── middlewares/
│   │
│   ├── route/
│   │   ├── auth.route.js
│   │   ├── user.route.js
│   │   ├── payment.route.js
│   │   ├── virtual-account.route.js
│   │   └── webhook.route.js
│   │
│   ├── services/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── wallet/
│   │   ├── payment/
│   │   └── virtual-account/
│   │
│   ├── third-party/
│   │
│   ├── utils/
│   │   ├── AppError.js
│   │   ├── catchAsync.js
│   │   └── token.js
│   │
│   └── server.js
│
├── package.json
├── package-lock.json
└── README.md


## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Developed with ❤️ by **Olupona Damilare (Wealth)**.

Full-Stack Developer passionate about building scalable backend systems, secure REST APIs, and modern web applications. -->