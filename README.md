# 🎬 ReelVerse Backend

The ReelVerse Backend is a RESTful API powering the ReelVerse movie streaming platform. It is built with Node.js, Express.js, and MySQL, providing secure authentication, movie management, wallet services, rentals, purchases, and watch history.

The backend follows a scalable architecture with clean code principles, modular routing, middleware, validation, and centralized error handling.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- MySQL
- JWT Authentication
- bcryptjs
- Joi Validation
- CORS
- dotenv

---

## ✨ Features Completed

### Authentication

- User Registration
- User Login
- JWT Access Token
- JWT Refresh Token
- Password Hashing (bcryptjs)
- Joi Request Validation

### User Management

- User Profile
- Authentication Middleware

### Wallet

- Automatic Wallet Creation
- Wallet Routes
- Wallet History

### Movies

- Movie Routes
- Movie CRUD Structure

### Rentals

- Rent Movies
- Rental History

### Purchases

- Purchase Movies

### Watch History

- Save Watch History
- Retrieve Watch History

### Security

- Global Error Handling
- Async Error Wrapper
- Request Sanitization
- Route Not Found Middleware

---

## 📁 Project Structure

```text
src
│
├── configuration
├── controller
├── dto
├── middlewares
├── route
├── utils
├── services
├── server.js
```

---

## 📦 Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/reelverse-backend.git
```

Move into the project

```bash
cd Backend
```

Install dependencies

```bash
npm install
```

Run the server

```bash
npm run dev
```

---

## ⚙️ Environment Variables

Create a `.env` file.

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=YOUR_USERNAME
DB_PASSWORD=YOUR_PASSWORD
DB_NAME=movie_db

JWT_SECRET=YOUR_SECRET
JWT_REFRESH_SECRET=YOUR_REFRESH_SECRET

JWT_ACCESS_TOKEN_EXPIRES_IN=5m
JWT_REFRESH_TOKEN_EXPIRES_IN=12h

CLIENT_URL=http://localhost:3000
```

---

## 🔐 API Modules

- Authentication
- Users
- Movies
- Wallet
- Wallet History
- Rentals
- Purchases
- Watch History

---

## 🚧 Upcoming Features

- Helmet Security
- HPP Protection
- XSS Protection
- Compression
- Rate Limiting
- Advanced CORS Configuration
- Cloudinary Image Uploads
- Email Verification
- Password Reset
- Role-Based Authorization
- Unit Testing
- API Documentation (Swagger)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Developed with ❤️ by **Olupona Damilare (Wealth)**.

Full-Stack Developer passionate about building scalable backend systems, secure REST APIs, and modern web applications.