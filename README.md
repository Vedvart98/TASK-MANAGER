 📝 MERN Stack Task Manager Web App

A full-stack task management application built using the **MERN** stack (React, Node, Express, MySQL) to help users manage daily tasks across three phases: **To Do**, **In Progress**, and **Done**.

---

## ✨ Features

* ✅ JWT-based user authentication
* ✅ Secure password hashing with Bcrypt
* ✅ Create, update, delete tasks
* ✅ Categorize tasks by progress state
* ✅ RESTful API
* ✅ MySQL database with Sequelize ORM

---

## 🧰 Tech Stack

### 🔹 Frontend

* React.js (Vite)
* Tailwind CSS
* Axios
* React Router DOM

### 🔹 Backend

* Node.js
* Express.js
* JWT (JSON Web Token)
* Bcrypt.js
* Sequelize ORM
* MySQL

---

## 🗃️ Database

* **MySQL** is used to store users and tasks.
* Managed via Sequelize ORM.

---

## ⚙️ Setup Instructions

### 📦 Prerequisites

Make sure you have the following installed:

* [Node.js v20+](https://nodejs.org/)
* NodeJs v21 not preferred . v20 preferred
* [MySQL](https://dev.mysql.com/downloads/)
* npm (comes with Node)
---

## 📁 Project Structure

```
task-manager/
├── backend/
│   ├── config/         # DB connection
│   ├── models/         # Sequelize models
│   ├── routes/         # API routes
│   ├── middleware/     # Auth middleware
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

---

## 🔧 Backend Setup

### 1️⃣ Initialize and install dependencies

```bash
cd backend
npm init -y

# Install backend dependencies
npm install express sequelize mysql2 bcryptjs jsonwebtoken cors dotenv

# Install dev dependencies
npm install -D nodemon
```

### 2️⃣ Create `.env` in `/backend`

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=task_manager
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

### 3️⃣ Create the database in MySQL

```bash
mysql -u root -p
CREATE DATABASE task_manager;
exit
```

### 4️⃣ Start the backend server

```bash
npx nodemon server.js
```

---

## 🎨 Frontend Setup

### 1️⃣ Navigate to frontend

```bash
cd ../frontend
```

### 2️⃣ Install frontend dependencies

```bash
# Core dependencies
npm install react react-dom react-router-dom axios

# Tailwind CSS setup
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3️⃣ Configure Tailwind

In `tailwind.config.js`, update the content paths:

```js
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
```

In `src/index.css`, add:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4️⃣ Start the frontend development server

```bash
npm run dev
```

---

## ✅ Ready to Go!

* Backend: [http://localhost:5000](http://localhost:5000)
* Frontend: [http://localhost:5173](http://localhost:5173) (default Vite port)
