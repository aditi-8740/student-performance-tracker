# 🎓 Student Performance Tracker

A full-stack web application for managing classes, assignments, and student performance with teacher and student role-based access.

---

## 🌐 Live Demo

- Frontend: https://student-performance-tracker-tau.vercel.app/
- Backend API: https://student-performance-tracker-nfx4.onrender.com/

---

## 🔐 Demo Credentials

- Teacher
  - Email: himanshusharma6132.as@gmail.com
  - Password: 1212

- Student
  - Email: aditisharma371.as@gmail.com
  - Password: 1234

---

## 🚀 Features

### 🔐 Authentication and Security

- JWT access-token and refresh-token flow
- HTTP-only refresh-token cookies
- Role-based access for teachers and students
- OTP verification during signup
- Password reset and password change support
- Google OAuth login/signup support
- Session tracking and logout from current or all devices

### 🏫 Class Management

* Teachers can create classes
* Students can enroll in classes
* Teachers and students can view class details and class assignments

### 📝 Assignment System

* Teachers create assignments for classes
* Students submit assignment responses
* Teachers review and grade submissions

### 📈 Performance Tracking

- Students can view their own performance data
- Teachers can access class-level performance and submission insights

### 🧩 Recent UI Enhancements

- Added a dedicated class page with tabbed views for a more structured learning experience
- Added an assignment submission page for individual student submissions
- Added an all-submissions page with assignment details and a submissions list for teachers
- Added a student list page for class-related participant management
- Improved assignment creation flow with a richer form experience
- Added loading states for login and signup screens for smoother UX

---

## 🛠️ Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication and refresh-session handling
- bcrypt, cookie-parser, cors, dotenv
- Email and OTP services for verification and password workflows

### Frontend

- React with Vite
- React Router DOM
- Tailwind CSS
- shadcn-style UI components
- Axios for API communication

---

## 📁 Project Structure

```text
SMART-SCHOOL-OS/
├── backend/
│   ├── config/
│   │   ├── config.js
│   │   ├── cookies.js
│   │   └── db.js
│   ├── controllers/
│   │   ├── assignmentController.js
│   │   ├── authController.js
│   │   ├── classController.js
│   │   ├── performanceController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   ├── Assignment.js
│   │   ├── Class.js
│   │   ├── otp.js
│   │   ├── Session.js
│   │   ├── Submission.js
│   │   └── User.js
│   ├── routes/
│   │   ├── assignmentRoutes.js
│   │   ├── authRoutes.js
│   │   ├── classRoutes.js
│   │   ├── performanceRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   └── emailService.js
│   ├── utils/
│   │   └── utils.js
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── AppLayout.jsx
│   │   │   ├── AppSidebar.jsx
│   │   │   ├── AssignmentTab.jsx
│   │   │   ├── AuthOverlay.jsx
│   │   │   ├── ClassHeader.jsx
│   │   │   ├── ClassTabs.jsx
│   │   │   ├── CreateAssignmentForm.jsx
│   │   │   ├── OtpVerification.jsx
│   │   │   ├── SessionCard.jsx
│   │   │   ├── SignupForm.jsx
│   │   │   ├── SubmissionTab.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── StudentView.jsx
│   │   │   │   └── TeacherView.jsx
│   │   │   └── ui/
│   │   │       ├── alert-dialog.jsx
│   │   │       ├── avatar.jsx
│   │   │       ├── badge.jsx
│   │   │       ├── button.jsx
│   │   │       ├── calendar.jsx
│   │   │       ├── card.jsx
│   │   │       ├── dialog.jsx
│   │   │       ├── dropdown-menu.jsx
│   │   │       ├── field.jsx
│   │   │       ├── input-otp.jsx
│   │   │       ├── input.jsx
│   │   │       ├── label.jsx
│   │   │       ├── popover.jsx
│   │   │       ├── select.jsx
│   │   │       ├── separator.jsx
│   │   │       ├── sheet.jsx
│   │   │       ├── sidebar.jsx
│   │   │       ├── skeleton.jsx
│   │   │       ├── sonner.jsx
│   │   │       ├── spinner.jsx
│   │   │       ├── table.jsx
│   │   │       ├── textarea.jsx
│   │   │       └── tooltip.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── use-mobile.js
│   │   ├── lib/
│   │   │   └── utils.js
│   │   ├── pages/
│   │   │   ├── AllSubmissionsPage.jsx
│   │   │   ├── AssignmentsPage.jsx
│   │   │   ├── ChangePassword.jsx
│   │   │   ├── Classes.jsx
│   │   │   ├── ClassPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── SecurityPage.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── StudentsPage.jsx
│   │   │   ├── SubmissionPage.jsx
│   │   │   └── UserSessions.jsx
│   │   ├── services/
│   │   │   ├── AuthService.js
│   │   │   └── tokenManager.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── routes.jsx
│   ├── components.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── jsconfig.json
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Authentication Flow

- Access tokens are returned by `/api/auth/login` and `/api/auth/signup`.
- Refresh tokens are stored in HTTP-only cookies and refreshed at `/api/auth/tokens/refresh`.
- The frontend uses Axios interceptors to refresh expired access tokens.
- Protected routes require `Authorization: Bearer <accessToken>`.
- `POST /api/auth/logout` ends the current session.
- `POST /api/auth/logout-all` ends all sessions for the user.

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

- `MONGO_URL` - MongoDB connection string
- `PORT` - Backend server port (optional, default: `3000`)
- `ACCESS_TOKEN_SECRET` - JWT secret for access tokens
- `REFRESH_TOKEN_SECRET` - JWT secret for refresh tokens
- `GOOGLE_USER` - Google service account email or OAuth user email
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GOOGLE_REFRESH_TOKEN` - Google refresh token for email sending
- `CLIENT_URL` - Frontend URL allowed by CORS
- `NODE_ENV` - Environment mode (`development` or `production`, optional)

---

## 💡 Notes

- The backend enables CORS with credentials so refresh-token cookies work correctly.
- The frontend attempts token refresh on app load through the authentication context.
- Token storage is handled in memory and cleared on logout for better security.
- The app uses clear role-based middleware to separate teacher and student access.

---

## 👨‍💻 Author

Built by Aditi Sharma

---

## ⭐ Final Note

This project demonstrates JWT refresh-token authentication, role-based authorization, session-backed user flows, and classroom assignment analytics.

