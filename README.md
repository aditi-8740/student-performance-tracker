# 🎓 Student Performance Tracker

A full-stack web application for managing classes, assignments, and student performance with teacher and student role-based access.

---

## 🌐 Live Demo
* Frontend: https://student-performance-tracker-tau.vercel.app/
* Backend API: https://student-performance-tracker-nfx4.onrender.com/

---

## 🔐 Demo Credentials

* Teacher:
  * email: himanshusharma6132.as@gmail.com
  * password: 1212

* Student:
  * email: aditisharma371.as@gmail.com
  * password: 1234

---

## 🚀 Features

### 🔐 Authentication

* JWT access token and refresh token flow
* HTTP-only refresh token cookie
* Role-based access for Teachers and Students
* OTP verification during signup
* Password reset and password change support
* Google OAuth login/signup

### 🏫 Class Management

* Teachers can create classes
* Students can enroll in classes
* Teachers and students can view class details and class assignments

### 📝 Assignment System

* Teachers create assignments for classes
* Students submit assignment responses
* Teachers review and grade submissions

### 📈 Performance Tracking

* Students view personal performance metrics
* Teachers access class performance analytics

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB with Mongoose
* JWT authentication and refresh session handling

### Frontend

* React with Vite
* Tailwind CSS
* Axios

---

## 📁 Project Structure

```
student-performance-tracker/
│
├── backend/
│   ├── config/
│   │   ├── config.js
│   │   ├── cookies.js
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── classController.js
│   │   ├── assignmentController.js
│   │   ├── performanceController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
│   ├── models/
│   │   ├── Assignment.js
│   │   ├── Class.js
│   │   ├── otp.js
│   │   ├── Session.js
│   │   ├── Submission.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── classRoutes.js
│   │   ├── assignmentRoutes.js
│   │   ├── performanceRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── services/
│   │   └── emailService.js
│   │
│   ├── utils/
│   │   └── utils.js
│   │
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── ...
│   │
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   │
│   │   ├── components/
│   │   │   ├── AppLayout.jsx
│   │   │   ├── AppSidebar.jsx
│   │   │   ├── OtpVerification.jsx
│   │   │   ├── SessionCard.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── StudentView.jsx
│   │   │   │   └── TeacherView.jsx
│   │   │   └── ui/
│   │   │       ├── alert-dialog.jsx
│   │   │       ├── avatar.jsx
│   │   │       ├── badge.jsx
│   │   │       ├── button.jsx
│   │   │       ├── card.jsx
│   │   │       ├── dropdown-menu.jsx
│   │   │       ├── field.jsx
│   │   │       ├── input-otp.jsx
│   │   │       ├── input.jsx
│   │   │       ├── label.jsx
│   │   │       ├── select.jsx
│   │   │       ├── separator.jsx
│   │   │       ├── sheet.jsx
│   │   │       ├── sidebar.jsx
│   │   │       ├── skeleton.jsx
│   │   │       ├── sonner.jsx
│   │   │       ├── table.jsx
│   │   │       ├── tooltip.jsx
│   │   │       └── ...
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── hooks/
│   │   │   └── use-mobile.js
│   │   │
│   │   ├── lib/
│   │   │   └── utils.js
│   │   │
│   │   ├── pages/
│   │   │   ├── ChangePassword.jsx
│   │   │   ├── ClassDetail.jsx
│   │   │   ├── Classes.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── SecurityPage.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── UserSessions.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── AuthService.js
│   │   │   └── tokenManager.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── eslint.config.js
│   ├── jsconfig.json
│   ├── package.json
│   └── vite.config.js
│
└── README.md
└── .gitignore
```

---

## ⚙️ Authentication Flow

* `accessToken` is returned by `/api/auth/login` and `/api/auth/signup`.
* `refreshToken` is stored as an HTTP-only cookie and refreshed at `/api/auth/tokens/refresh`.
* Frontend uses `axios` interceptors to refresh expired access tokens.
* Protected routes require `Authorization: Bearer <accessToken>`.
* `POST /api/auth/logout` ends the current session.
* `POST /api/auth/logout-all` ends all user sessions.

---

## 📦 API Endpoints

### Auth

* POST `/api/auth/signup` - Register a new user
* POST `/api/auth/login` - Login a user
* POST `/api/auth/verifications` - Verify signup OTP
* POST `/api/auth/tokens/refresh` - Refresh access token using refresh token cookie
* POST `/api/auth/logout` - Logout current session
* POST `/api/auth/logout-all` - Logout from all devices
* POST `/api/auth/otp/resend` - Resend OTP
* POST `/api/auth/password/forgot` - Request password reset
* POST `/api/auth/password/reset/:resetToken` - Reset password
* POST `/api/auth/password/change` - Change password while authenticated
* GET `/api/auth/me` - Get current authenticated user info
* GET `/api/auth/sessions` - List active user sessions
* POST `/api/auth/google` - Google OAuth login/signup

### Classes

* GET `/api/classes` - Get classes for authenticated user
* POST `/api/classes` - Create a class (Teacher only)
* POST `/api/classes/enroll` - Enroll in a class (Student only)
* GET `/api/classes/:classId` - Get class details
* GET `/api/classes/:classId/assignments` - Get assignments for a class
* GET `/api/classes/:classId/performance` - Get class performance (Teacher only)

### Assignments

* POST `/api/assignments` - Create an assignment (Teacher only)
* POST `/api/assignments/:assignmentId/submissions` - Submit an assignment (Student only)
* GET `/api/assignments/:assignmentId/submissions` - Get submissions for an assignment (Teacher only)
* PATCH `/api/assignments/:assignmentId/submissions/:submissionId` - Grade a submission (Teacher only)

### Users

* GET `/api/users/performance` - Get student performance (Student only)

---

## 🧪 Running Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Backend Environment Variables

Create a `.env` file in `backend/` with the following variables:

* `MONGO_URL` - MongoDB connection string
* `PORT` - Backend server port (optional, default: `3000`)
* `ACCESS_TOKEN_SECRET` - JWT secret for access tokens
* `REFRESH_TOKEN_SECRET` - JWT secret for refresh tokens
* `GOOGLE_USER` - Google service account email or OAuth user email
* `GOOGLE_CLIENT_ID` - Google OAuth client ID
* `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
* `GOOGLE_REFRESH_TOKEN` - Google refresh token for email sending
* `CLIENT_URL` - Frontend URL allowed by CORS
* `NODE_ENV` - Environment mode (`development` or `production`, optional)

---

## 💡 Notes

* Backend `server.js` enables CORS with credentials so refresh-token cookies work.
* Frontend `AuthContext.jsx` attempts token refresh on app load.
* `tokenManager.js` keeps the access token in memory and clears it on logout.
* The app separates teacher and student access using role middleware.

---

## 👨‍💻 Author

Built by Aditi Sharma

---

## ⭐ Final Note

This project demonstrates JWT refresh-token authentication, role-based authorization, session-backed user flows, and classroom assignment analytics.

