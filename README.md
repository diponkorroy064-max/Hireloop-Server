# HireLoop Server

Backend API for **HireLoop**, a modern job recruitment and hiring platform that connects Job Seekers, Recruiters, Companies, and Administrators.

The server provides secure REST APIs for job management, company management, applications, users, subscriptions, plans, and authentication-related operations.

---

## 🚀 Project Overview

HireLoop is designed to simplify the hiring process by providing separate experiences for:

- 👨‍💻 Job Seekers
- 🏢 Recruiters
- 🛡️ Administrators

Recruiters can create companies and publish job opportunities, while job seekers can browse jobs and submit applications. Administrators can monitor users and companies across the platform.

---

## 🛠️ Technology Stack

### Backend

- Node.js
- Express.js
- MongoDB
- MongoDB Native Driver
- JavaScript
- REST API
- JWT / Session Token Authentication
- CORS
- dotenv

### Database

- MongoDB Atlas
- Collections:
  - `jobs`
  - `companies`
  - `user`
  - `applications`
  - `plans`
  - `subscriptions`
  - `session`

### Authentication

- Email & Password Authentication
- Session-based token verification
- Authorization middleware
- Role-based authorization
- Google Authentication handled through the client authentication system

---

## ✨ Features

### 👤 User Management

- Get all users
- User role management
- User authentication support
- Session-based authentication
- Protected API routes

### 💼 Job Management

- Create jobs
- Get all jobs
- Get job by ID
- Filter jobs by company
- Filter jobs by status
- Store job creation date
- Manage job visibility and status

### 🏢 Company Management

- Create companies
- Get companies
- Get recruiter-specific company
- Update company status
- Calculate active job count for companies
- Protected company APIs

### 📝 Application Management

- Submit job applications
- Retrieve applications
- Filter applications by applicant
- Filter applications by job
- Seeker-only application access

### 💳 Subscription & Plans

- Retrieve subscription plans
- Create subscriptions
- Update user's selected plan
- Store subscription information

### 🔐 Security

- Authorization header validation
- Token/session verification
- Protected routes
- Role-based authorization
- Seeker-specific authorization middleware
- Environment variable configuration

### 🔎 API Features

- RESTful API architecture
- Query parameter filtering
- MongoDB ObjectId handling
- Middleware-based request processing
- Error handling
- Server-side logging

---

## 📂 Project Structure

```text
hireloop-server/
│
├── index.js
├── package.json
├── package-lock.json
├── .env
├── .gitignore
│
└── node_modules/
