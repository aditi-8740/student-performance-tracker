# 🎓 Student Performance Tracker

A full-stack web application designed to manage classes, assignments, and track student performance with role-based access for teachers and students.

---

## 🌐 Live Demo
* Frontend: https://student-performance-tracker-tau.vercel.app/
* Backend API: https://student-performance-tracker-nfx4.onrender.com/

---

## 🔐 Demo Credentials

* Teacher:
  * email: sanjeev@example.com
  * password: password123

* Student:
  * email: aditi@gmail.com
  * password: password123

---

## 🚀 Features

### 🔐 Authentication

* User Signup & Login (JWT-based)
* Role-based access (Student / Teacher)

### 🏫 Class Management

* Teachers can create classes
* Students can join classes using a unique join code

### 📝 Assignment System

* Teachers can create assignments for their classes
* Students can submit assignments
* Prevents duplicate submissions

### 📊 Grading System

* Teachers can evaluate and assign marks
* Supports re-grading

### 📈 Performance Tracking

* Students can view:

  * Average marks
  * Highest & Lowest scores
* Teachers can view:

  * Class-wise performance
  * Individual student averages

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

### Frontend

* React (Vite)
* Tailwind CSS
* Axios

---

## 📁 Project Structure

```
student-performance-tracker/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── classController.js
│   │   ├── assignmentController.js
│   │   ├── submissionController.js
│   │   └── performanceController.js
│   │   └── gradeController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Class.js
│   │   ├── Assignment.js
│   │   └── Submission.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── classRoutes.js
│   │   ├── assignmentRoutes.js
│   │   ├── submissionRoutes.js
│   │   ├── gradeRoutes.js
│   │   └── performanceRoutes.js
│   │
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   │
│   │   ├── components/
│   │   │   ├── AppLayout.jsx
│   │   │   ├── AppSidebar.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── StudentView.jsx
│   │   │   │   └── TeacherView.jsx
│   │   │   └── ui/   (shadcn components)
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Classes.jsx
│   │   │   └── ClassDetail.jsx
│   │   │
│   │   ├── hooks/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## ⚙️ API Endpoints (Key)

### Auth

* POST `/api/signup`
* POST `/api/login`

### Classes

* POST `/api/create-class`
* POST `/api/join-class`

### Assignments

* POST `/api/create-assignment`
* POST `/api/submit-assignment`
* POST `/api/grade-assignment`

### Performance

* GET `/api/student-performance`
* GET `/api/class-performance/:classId`

---

## 💡 Key Highlights

* Designed a scalable backend with proper separation of concerns
* Implemented role-based authorization middleware
* Optimized database queries (avoided N+1 query problem)
* Built real-world workflows (assignment → submission → grading → analytics)
* Clean and modular code structure

---

## 🧪 How to Run Locally

### Backend

```
cd server
npm install
npm run dev
```

### Frontend

```
cd client
npm install
npm run dev
```

---

## 🔮 Future Improvements

* 📚 Quiz system with scoring
* 🤖 AI-based performance insights (weak topics detection)
* 📊 Charts & visual analytics dashboard
* 📎 File upload for assignments (PDF/Image)
* 🏆 Activity & extracurricular tracking
* 🔔 Notifications system
* 👨‍🏫 Teacher dashboard with deeper analytics

---

## 👨‍💻 Author

Built by Aditi Sharma

---

## ⭐ Final Note

This project demonstrates real-world full-stack development concepts including authentication, authorization, database design, and performance analytics.

---
