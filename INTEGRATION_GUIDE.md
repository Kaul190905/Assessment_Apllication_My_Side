# GradeFlow Student Dashboard - Backend Integration

## 🎯 Overview

This student dashboard is now fully integrated with the **GradeFlow Backend** running on `http://localhost:5000`. Students can:
- ✅ Login with real authentication
- ✅ View published tests from staff
- ✅ Take tests with real questions
- ✅ Submit test attempts to backend
- ✅ Fallback to demo mode if backend is unavailable

---

## 🔧 Backend Integration Details

### **API Configuration**

**File:** `src/config/api.js`

- **Base URL:** `http://localhost:5000/api` (configurable via `.env`)
- **Authentication:** JWT tokens stored in `localStorage`
- **Error Handling:** Automatic fallback to demo mode

### **Service Layer**

**File:** `src/services/testService.js`

Provides clean abstractions for:
- `testService.getPublishedTests()` - Fetch all published tests
- `testService.getTestById(id)` - Get specific test details
- `testService.submitAttempt(data)` - Submit test attempt
- `testService.getMyAttempts()` - Get student's attempt history
- `authService.login(email, password)` - Authenticate user

---

## 📊 Data Flow

### **1. Login Flow**
```
Student enters credentials
    ↓
Login.jsx → authService.login()
    ↓
Backend validates credentials
    ↓
JWT token + user data stored in localStorage
    ↓
Redirect to Dashboard
```

### **2. Test Fetching Flow**
```
Dashboard loads
    ↓
Dashboard.jsx → testService.getPublishedTests()
    ↓
Backend returns published tests
    ↓
Transform backend data to UI format
    ↓
Display tests in "Upcoming" section
```

### **3. Test Submission Flow**
```
Student completes test
    ↓
TestPage.jsx → testService.submitAttempt()
    ↓
Backend processes attempt
    ↓
Returns score and analysis
    ↓
Redirect to Dashboard with results
```

---

## 🗂️ Data Mapping

### **Backend Test → UI Format**

| Backend Field | UI Field | Transformation |
|--------------|----------|----------------|
| `test.testId` | `assessment.id` | Direct mapping |
| `test.topic` | `assessment.title` | Direct mapping |
| `test.topic` | `assessment.subject` | Direct mapping |
| `test.questions` | `assessment.questionsData` | Array of questions |
| `test.count` | `assessment.questions` | Number of questions |
| `test.count * 2` | `assessment.duration` | Estimate: 2 mins/question |
| `test.difficulty` | `assessment.difficulty` | Direct mapping |
| `test.createdAt` | `assessment.date` | Formatted date |

### **Test Submission Format**

```javascript
{
  studentId: "student@example.com",
  testId: "test-123",
  answers: {
    "0": 2,  // Question 0, selected option 2
    "1": 1,  // Question 1, selected option 1
    "3": 0   // Question 3, selected option 0
    // Unanswered questions are omitted
  },
  timeTaken: 1800  // Time in seconds
}
```

---

## 🚀 Running the Full Stack

### **Prerequisites**
1. **GradeFlow Backend** running on `http://localhost:5000`
2. **Staff Dashboard** running on `http://localhost:5173`
3. **Student Dashboard** running on `http://localhost:5174`

### **Start All Services**

#### **1. Start Backend**
```bash
cd C:\Echo-Route\gradeflow\server
npm start
```

#### **2. Start Staff Dashboard**
```bash
cd C:\Echo-Route\gradeflow\client
npm run dev
```

#### **3. Start Student Dashboard**
```bash
cd C:\assessment-application-master\assessment-application-master
npm run dev
```

---

## 🔐 Authentication

### **Real Login**
- Uses backend authentication API
- Stores JWT token in `localStorage.authToken`
- Stores user data in `localStorage.userData`

### **Demo Fallback**
If backend is unavailable:
- **Roll Number:** `STU2025001`
- **Password:** `student123`
- Works offline with demo data

---

## 🎓 Complete Workflow

### **Staff Side (Port 5173)**
1. Staff logs in
2. Creates a new test with questions
3. Publishes the test
4. Test becomes available to students

### **Student Side (Port 5174)**
1. Student logs in
2. Sees published tests in Dashboard
3. Clicks "Start Test" → Reviews rules
4. Takes the test
5. Submits test with roll number verification
6. Results stored in backend
7. Can view performance analytics

---

## 📁 Modified Files

### **Created Files**
- ✅ `.env` - Environment configuration
- ✅ `src/config/api.js` - API configuration
- ✅ `src/services/testService.js` - Service layer

### **Modified Files**
- ✅ `src/pages/Login.jsx` - Real authentication
- ✅ `src/pages/Dashboard.jsx` - Fetch real tests
- ✅ `src/pages/TestPage.jsx` - Submit to backend
- ✅ `src/App.jsx` - Remove mock data

---

## 🔄 CORS Configuration

Backend already configured to accept requests from student dashboard:

```javascript
// In server/app.js
const allowedOrigins = [
  "http://localhost:5173",  // Staff Dashboard
  "http://localhost:5174"   // Student Dashboard ✅
];
```

---

## 🐛 Troubleshooting

### **Tests Not Loading**
1. Check backend is running: `http://localhost:5000/api/tests/published`
2. Check browser console for errors
3. Verify CORS is configured correctly
4. Check if tests are published in staff dashboard

### **Login Fails**
1. Verify backend authentication endpoint is working
2. Check credentials are correct
3. Fallback to demo credentials if needed
4. Check browser console for API errors

### **Submission Fails**
1. Ensure test has valid `testId`
2. Check backend `/api/attempts/submit` endpoint
3. Verify student is authenticated
4. Check submission data format

---

## 🎨 Features

### **Maintained Features**
- ✅ Beautiful dark/light theme
- ✅ Responsive design
- ✅ Question palette
- ✅ Timer with warnings
- ✅ Mark for review
- ✅ Progress tracking
- ✅ Sound effects
- ✅ Toast notifications

### **New Features**
- ✅ Real backend integration
- ✅ JWT authentication
- ✅ Live test fetching
- ✅ Backend submission
- ✅ Graceful fallback to demo mode

---

## 📝 Environment Variables

Create `.env` file in project root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STAFF_DASHBOARD_URL=http://localhost:5173
```

---

## 🔮 Future Enhancements

### **Potential Improvements**
1. **Attempt History** - Fetch and display past attempts
2. **Performance Analytics** - Show detailed analytics from backend
3. **Real-time Updates** - WebSocket for live test notifications
4. **Profile Management** - Edit student profile
5. **Test Scheduling** - Show scheduled vs live tests
6. **Leaderboard** - Compare performance with peers

---

## 📞 Support

For issues or questions:
1. Check backend logs: `C:\Echo-Route\gradeflow\server`
2. Check browser console for frontend errors
3. Verify all services are running on correct ports
4. Review this integration guide

---

## ✅ Integration Checklist

- [x] API configuration created
- [x] Service layer implemented
- [x] Login integrated with backend
- [x] Dashboard fetches real tests
- [x] Test submission to backend
- [x] Error handling and fallbacks
- [x] CORS configured
- [x] Environment variables set
- [x] Documentation complete

---

**Last Updated:** January 23, 2026  
**Version:** 1.0.0  
**Status:** ✅ Fully Integrated
