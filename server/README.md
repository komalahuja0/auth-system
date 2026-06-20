# JWT Authentication System (MERN Stack)

A full-stack JWT Authentication System built using React, Node.js, Express.js, MongoDB, and JSON Web Tokens (JWT).

## Features

### Authentication

* User Registration
* User Login
* Password Hashing with bcryptjs
* JWT Token Generation
* Protected Routes
* User Profile Access
* Logout Functionality

### Frontend

* React.js
* React Router DOM
* Axios API Requests
* Protected Pages
* Local Storage Token Management
* Responsive UI

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication Middleware
* Environment Variables Support

## Tech Stack

### Frontend

* React
* React Router DOM
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* bcryptjs
* jsonwebtoken
* dotenv
* cors

## Project Structure

```text
auth-system/
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── controllers/
├── middleware/
├── models/
├── routes/
├── server.js
├── .env
└── README.md
```

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd auth-system
```

### Install Backend Dependencies

```bash
npm install
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

## Running Backend

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

## Running Frontend

Open another terminal:

```bash
cd client
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## API Endpoints

### Register User

```http
POST /api/auth/register
```

Request Body:

```json
{
  "name": "Komal",
  "email": "komal@gmail.com",
  "password": "password123"
}
```

### Login User

```http
POST /api/auth/login
```

Request Body:

```json
{
  "email": "komal@gmail.com",
  "password": "password123"
}
```

### Get Profile

```http
GET /api/auth/profile
```

Headers:

```text
Authorization: Bearer <token>
```

## Learning Outcomes

* Authentication using JWT
* Password Encryption with bcrypt
* Protected Routes
* React State Management
* API Integration using Axios
* Full-Stack MERN Development
* MongoDB Atlas Integration

## Future Improvements

* Refresh Tokens
* Forgot Password
* Email Verification
* Google Authentication
* Role-Based Authorization
* Dashboard UI
* Profile Picture Upload

## Author

Komal Ahuja
B.Tech Student | MERN Stack Developer
