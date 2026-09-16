# LearnHub - Full-Stack MERN E-Learning Platform

LearnHub is a full-stack e-learning web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with JWT authentication and role-based access control for **Admin** and **Student** accounts.

---

## 🌟 Features

### 🔐 Authentication & Roles
- **Secret Admin Code Registration**: Anyone can register as a student. If the secret `ADMIN_SECRET_CODE` is entered in the signup form, the account is assigned the **Admin** role; otherwise, it defaults to **Student**.
- **Role-based Route Guards**: Frontend and backend protection preventing unauthorized access to administrative endpoints and pages.
- **JWT Authorization**: Token stored securely in `localStorage` and included in request headers.

### 👑 Admin Features
- **Course Management**: Create, edit, and delete courses.
- **Syllabus & Lesson Builder**: Add text or video embedded lessons to courses and specify lesson order numbers.
- **Student Enrollment Tracker**: View all students enrolled in a course along with their completion percentage and enrolled timestamp.

### 🎓 Student Features
- **Course Discovery**: Browse available courses and view details before enrolling.
- **Simulated Enrollment**: One-click course enrollment without payment processing.
- **Interactive Classroom**: View lessons with side navigation, study content (text or embedded videos), and check off completed lessons.
- **Progress Tracking**: Real-time progress bar displaying percentage of completed lessons per course on the "My Courses" dashboard.

---

## 🛠️ Project Structure

```
learnhub/
├── README.md
├── server/
│   ├── .env
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Lesson.js
│   │   └── Enrollment.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   └── enrollmentController.js
│   └── routes/
│       ├── authRoutes.js
│       ├── courseRoutes.js
│       └── enrollmentRoutes.js
└── client/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx
        ├── App.css
        ├── main.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── CourseCard.jsx
        │   └── ProgressBar.jsx
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── StudentDashboard.jsx
            ├── CourseDetail.jsx
            ├── MyCourses.jsx
            ├── LessonView.jsx
            ├── AdminDashboard.jsx
            ├── CreateCourse.jsx
            ├── EditCourse.jsx
            └── CourseStudents.jsx
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/learnhub
JWT_SECRET=learnhub_super_secret_jwt_key_2026
ADMIN_SECRET_CODE=ADMIN123
```

---

## 🚀 Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm
- MongoDB running locally or a MongoDB Atlas URI

### Step 1: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd ../client
npm install
```

### Step 3: Run the Application

1. **Start the Express backend server:**
   ```bash
   cd server
   npm start
   ```
   *(Server runs on http://localhost:5000)*

2. **Start the Vite React frontend server:**
   ```bash
   cd client
   npm run dev
   ```
   *(Frontend runs on http://localhost:3000)*

---

## 🔑 How to Sign Up as Admin vs Student

1. Navigate to `http://localhost:3000/register`.
2. **To Sign Up as a Student**: Fill out Name, Email, and Password. Leave the **Admin Passcode** field **blank**.
3. **To Sign Up as an Admin**: Fill out Name, Email, and Password, and enter `ADMIN123` (or the code configured in `ADMIN_SECRET_CODE`) in the **Admin Passcode** field.
4. You will automatically be logged in with the corresponding role!
