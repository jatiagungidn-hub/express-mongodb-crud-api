# Secure User API

A secure Express.js + MongoDB REST API for user authentication and management.

## Overview

This project provides a small backend for:

- registering new users
- logging in with email/password
- retrieving the current authenticated user
- updating the authenticated user profile
- managing users through admin-protected routes

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Zod

## Features

- Password hashing with `bcryptjs`
- JWT-based authentication
- Role-based authorization with `admin` and `user`
- Request validation using `Zod`
- MongoDB persistence with Mongoose

## Project Structure

```text
app.js
server.js
config/
controllers/
middleware/
models/
routes/
validators/
```

## Prerequisites

- Node.js 18+
- MongoDB instance or Atlas connection string

## Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root:

```env
MONGO_URI=mongodb://localhost:27017/secure-user-api
PORT=3000
JWT_SECRET=your_super_secret_key
```

## Run the API

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## API Endpoints

### Auth Routes

- `POST /auth/register` — register a new user
- `POST /auth/login` — log in and receive a JWT
- `GET /auth/me` — get the current logged-in user
- `PATCH /auth/me` — update the current logged-in user

### User Routes

- `GET /users` — get all users (admin only)
- `GET /users/:id` — get a user by ID (admin only)
- `PATCH /users/:id` — update a user by ID (admin only)
- `DELETE /users/:id` — delete a user by ID (admin only)

## Authentication

Most protected routes expect a Bearer token in the `Authorization` header:

```http
Authorization: Bearer <your_jwt_token>
```

## Notes

- Passwords are never returned in API responses.
- `admin` access is enforced on the user management routes.
- The `role` field is restricted to `user` or `admin`.

## Suggested Next Improvements

- Add tests with Jest or Vitest
- Add `helmet`, `cors`, and rate limiting
- Add Docker support
- Add a proper 404 handler and centralized error middleware
