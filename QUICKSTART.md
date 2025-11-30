# AI Recruiter Platform - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Python 3.9+
- Node.js 18+
- Supabase account (free)

### Step 1: Database Setup (2 minutes)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your connection string from Settings → Database
3. Open SQL Editor and run the schema:
   ```bash
   # Copy contents from backend/schema.sql and paste in SQL Editor
   ```
4. Disable RLS: Authentication → Policies → Disable RLS for all tables

### Step 2: Backend Setup (2 minutes)

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env  # Windows
cp .env.example .env    # Mac/Linux
```

**Edit `.env`**:
```env
DATABASE_URL=your-supabase-connection-string-here?sslmode=require
SECRET_KEY=your-secret-key-min-32-characters-here
```

**Run backend**:
```bash
uvicorn app.main:app --reload
```

✅ Backend running at `http://localhost:8000`

### Step 3: Frontend Setup (1 minute)

```bash
cd frontend

# Install dependencies
npm install

# Create .env
copy .env.example .env  # Windows
cp .env.example .env    # Mac/Linux
```

**Edit `.env`**:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

**Run frontend**:
```bash
npm run dev
```

✅ Frontend running at `http://localhost:5173`

---

## 🎯 First Steps

1. **Open** `http://localhost:5173`
2. **Sign up** as a candidate or recruiter
3. **For Candidates**:
   - Browse jobs at `/jobs`
   - Apply to jobs
   - View applications at `/dashboard`
4. **For Recruiters**:
   - Create a company
   - Post a job
   - View applicants with AI match scores

---

## 📚 API Documentation

Once backend is running, visit:
- **Swagger UI**: `http://localhost:8000/api/docs`
- **ReDoc**: `http://localhost:8000/api/redoc`

---

## ⚠️ Quick Troubleshooting

**Backend won't start?**
- Check `DATABASE_URL` in `.env`
- Ensure `?sslmode=require` is at the end
- Verify Supabase project is running

**Frontend can't connect?**
- Ensure backend is running at `http://localhost:8000`
- Check `VITE_API_BASE_URL` in frontend `.env`
- Check browser console for errors

**CORS errors?**
- Check `ALLOWED_ORIGINS` in backend `.env`
- Restart backend after changing `.env`

---

## 🔑 Key Features

✅ AI-powered job-candidate matching (0-100% score)
✅ Resume parsing (PDF/DOCX)
✅ Skill extraction
✅ Role-based access (Candidate/Recruiter)
✅ Application tracking
✅ Job filtering and search

---

## 📖 Full Documentation

See [README.md](file:///c:/Users/adita/OneDrive/Documents/VS%20CODE/AI%20Recruiter%20Platform/AI-Recruiter-Platform/README.md) for complete documentation.
