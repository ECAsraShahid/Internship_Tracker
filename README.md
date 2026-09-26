# 📋 Fieldbook — Internship Tracker

A full-stack web application for managing and tracking internship and job applications through a visual application pipeline.

Fieldbook helps users keep all their applications, interview details, job links, salary information, and application notes organized in one place.

Applications can be tracked through four stages:

**Applied → Interview → Offer / Rejected**

---

## ✨ Features

### 🔐 Authentication

- User registration and login
- Password hashing using `bcryptjs`
- JWT-based authentication
- Protected API routes
- User-specific application data
- JWT stored in browser `localStorage`

### 📊 Application Tracking

- Create internship/job applications
- Edit existing applications
- Delete applications
- View all personal applications
- Track application status

Each application can contain:

- Company name
- Job role
- Application status
- Location
- Work mode
- Application date
- Salary / stipend
- Job URL
- Personal notes

### 🗂️ Kanban Board

Applications are organized into four columns:

- 📝 Applied
- 💬 Interview
- 🎉 Offer
- ❌ Rejected

Each column displays the current number of applications in that stage.

### 📈 Dashboard Statistics

The sidebar provides a quick overview of:

- Total applications
- Applied applications
- Interviews
- Offers
- Rejections

### 👤 User-Specific Data

Every application belongs to the authenticated user.

The backend uses the authenticated user's ID to ensure that users can only access, update, or delete their own applications.

### 📱 Responsive UI

The interface is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile devices

---

# 🛠️ Tech Stack

## Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express 5 | REST API and server |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| JSON Web Token | Authentication |
| bcryptjs | Password hashing |
| dotenv | Environment variables |
| CORS | Cross-origin request handling |

## Frontend

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styling and responsive layout |
| Vanilla JavaScript | Frontend logic |
| Fetch API | Backend API communication |
| localStorage | JWT storage |

> **Note:** The frontend intentionally does not use React, Vite, or another frontend framework. Express serves the static frontend directly, allowing the entire application to run from a single Node.js server.

---

# 🏗️ Project Structure

```text
Internship_Tracker/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── trackerController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── trackerModel.js
│   │
│   └── routes/
│       ├── authRoutes.js
│       └── trackerRoutes.js
│
├── frontend/
│   ├── index.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       ├── api.js
│       └── app.js
│
├── app.js
├── server.js
├── package.json
├── .env
├── .env.example
├── .gitignore
└── README.md