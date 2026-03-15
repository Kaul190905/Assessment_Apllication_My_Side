# 🧪 Quick Testing Guide

## Test the Integration

### **Step 1: Verify Backend is Running**
```bash
# Check if backend is accessible
curl http://localhost:5000/api/tests/published
```

Expected: JSON array of published tests

---

### **Step 2: Test Staff Workflow**

1. **Open Staff Dashboard:** `http://localhost:5173`
2. **Login as Staff**
3. **Create a Test:**
   - Topic: "Sample Test"
   - Add 5-10 questions
   - Click "Publish Test"
4. **Verify:** Test appears in published tests list

---

### **Step 3: Test Student Workflow**

1. **Open Student Dashboard:** `http://localhost:5174`
2. **Login:**
   - **Real Auth:** Use your backend credentials
   - **Demo Mode:** 
     - Roll: `STU2025001`
     - Pass: `student123`
3. **Verify Dashboard:**
   - Published tests appear in "Upcoming Tests"
   - Dashboard categorization works as expected
4. **Take Test:**
   - Click "Start Test"
   - Review rules
   - Answer questions
   - Submit with roll number
5. **Verify Submission:**
   - Check backend logs for submission
   - Check browser console for success message

---

## 🔍 Debug Checklist

### **Backend Not Responding**
```bash
# Check if backend is running
netstat -ano | findstr :5000

# Restart backend if needed
cd C:\Echo-Route\gradeflow\server
npm start
```

### **CORS Errors**
Check `server/app.js` includes:
```javascript
"http://localhost:5174"
```

### **No Tests Showing**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Reload dashboard
4. Check `/api/tests/published` request
5. Verify response has tests

### **Login Fails**
1. Check backend `/api/auth/login` endpoint
2. Verify credentials
3. Try demo credentials
4. Check browser console for errors

---

## 📊 Expected API Responses

### **GET /api/tests/published**
```json
[
  {
    "testId": "test-123",
    "topic": "Mathematics",
    "count": 10,
    "difficulty": "medium",
    "questions": [...],
    "published": true,
    "createdAt": "2026-01-23T10:00:00Z"
  }
]
```

### **POST /api/auth/login**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "email": "student@example.com",
  "name": "John Doe",
  "role": "student"
}
```

### **POST /api/attempts/submit**
```json
{
  "success": true,
  "score": 18,
  "totalMarks": 20,
  "attemptId": "attempt-456"
}
```

---

## ✅ Success Indicators

- [ ] Backend running on port 5000
- [ ] Staff dashboard on port 5173
- [ ] Student dashboard on port 5174
- [ ] Can login to student dashboard
- [ ] Published tests appear
- [ ] Can start a test
- [ ] Can submit test
- [ ] No CORS errors in console
- [ ] Toast notifications work
- [ ] Backend logs show submission

---

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| "Failed to fetch tests" | Check backend is running |
| CORS error | Verify port 5174 in CORS config |
| Login fails | Try demo credentials |
| No tests showing | Publish a test from staff dashboard |
| Submission fails | Check test has valid testId |

---

**Quick Test Command:**
```bash
# Test all endpoints
curl http://localhost:5000/api/tests/published
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"test123\"}"
```
