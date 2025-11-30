# AI Recruiter Platform

A complete AI-powered hiring platform built with React, FastAPI, and Supabase PostgreSQL. Features intelligent candidate-job matching, resume parsing, and automated screening.

## 🚀 Features

### For Candidates
- ✅ Create and manage profile
- ✅ Upload and parse resume automatically
- ✅ Browse and search jobs with filters
- ✅ Apply to jobs with AI match scoring
- ✅ Track application status
- ✅ View recommended jobs based on skills

### For Recruiters
- ✅ Create and manage company profiles
- ✅ Post and manage job listings
- ✅ View applicants sorted by AI match score
- ✅ Update application status
- ✅ Schedule interviews
- ✅ AI-powered screening question scoring

### AI/ML Features
- 🤖 Resume parsing (PDF/DOCX)
- 🤖 Skill extraction and matching
- 🤖 Job-candidate match scoring (0-100%)
- 🤖 Automated screening answer evaluation

## 📋 Prerequisites

- **Node.js** v18+ and npm
- **Python** 3.9+
- **Supabase** account (free tier works)
- **Git**

## 🛠️ Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/aditanshu/AI-Recruiter-Platform.git
cd AI-Recruiter-Platform
```

### Step 2: Database Setup (Supabase)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned
3. Go to **Settings** → **Database**
4. Copy the **Connection String** (URI format)
5. Go to **SQL Editor** and run the schema:

```bash
# Open the schema file
cat backend/schema.sql
```

Copy the entire content and paste it into the Supabase SQL Editor, then click **Run**.

6. **Important**: Disable Row Level Security (RLS) for development:
   - Go to **Authentication** → **Policies**
   - For each table, click **Disable RLS** (we'll enable it later for production)

### Step 3: Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate


# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env  # Windows
# OR
cp .env.example .env    # Mac/Linux
```

**Edit `.env` file** with your actual values:

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres?sslmode=require
SECRET_KEY=your-super-secret-key-change-this-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
APP_NAME=AI Recruiter Platform
DEBUG=True
```

⚠️ **Important**: 
- Replace `[YOUR-PASSWORD]` and `[YOUR-PROJECT-REF]` with your Supabase credentials
- Generate a secure `SECRET_KEY` (at least 32 characters)
- Ensure `?sslmode=require` is at the end of the DATABASE_URL

**Run the backend:**

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`
- API Docs: `http://localhost:8000/api/docs`
- ReDoc: `http://localhost:8000/api/redoc`

### Step 4: Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
copy .env.example .env  # Windows
# OR
cp .env.example .env    # Mac/Linux
```

**Edit `.env` file:**

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

**Run the frontend:**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🎯 Usage Guide

### First Time Setup

1. **Start both backend and frontend**
2. **Sign up** as a candidate or recruiter
3. **For Candidates**:
   - Complete your profile
   - Upload your resume (PDF or DOCX)
   - Browse jobs and apply
4. **For Recruiters**:
   - Create a company profile
   - Post a job
   - View applicants and their match scores

## ⚠️ Common Errors & Solutions

### Backend Errors

#### 1. **Database Connection Error**

```
sqlalchemy.exc.OperationalError: could not connect to server
```

**Solutions:**
- ✅ Check your `DATABASE_URL` in `.env`
- ✅ Ensure `?sslmode=require` is at the end of the URL
- ✅ Verify your Supabase project is running
- ✅ Check if your IP is allowed (Supabase allows all IPs by default)
- ✅ Test connection string format:
  ```
  postgresql://postgres:PASSWORD@HOST:5432/postgres?sslmode=require
  ```

#### 2. **JWT "Signature has expired"**

```
jose.exceptions.ExpiredSignatureError
```

**Solutions:**
- ✅ Token expired (default 60 minutes) - login again
- ✅ Check `ACCESS_TOKEN_EXPIRE_MINUTES` in `.env`
- ✅ Ensure `SECRET_KEY` hasn't changed

#### 3. **CORS Error**

```
Access to fetch at 'http://localhost:8000' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solutions:**
- ✅ Check `ALLOWED_ORIGINS` in backend `.env`
- ✅ Ensure it includes your frontend URL
- ✅ Restart the backend after changing `.env`

#### 4. **Pydantic Validation Error**

```
pydantic.error_wrappers.ValidationError
```

**Solutions:**
- ✅ Check request body matches the schema
- ✅ Ensure all required fields are provided
- ✅ Check data types (e.g., UUID format, email format)

#### 5. **File Upload Error (Resume Parsing)**

```
ValueError: Could not extract meaningful text from resume
```

**Solutions:**
- ✅ Ensure file is PDF or DOCX format
- ✅ Check file is not corrupted
- ✅ File size must be under 10MB
- ✅ Ensure PDF is text-based, not scanned images

### Frontend Errors

#### 1. **Network Error / API Not Responding**

```
AxiosError: Network Error
```

**Solutions:**
- ✅ Check backend is running (`http://localhost:8000`)
- ✅ Verify `VITE_API_BASE_URL` in frontend `.env`
- ✅ Check CORS configuration in backend
- ✅ Restart both frontend and backend

#### 2. **401 Unauthorized**

```
Error: Request failed with status code 401
```

**Solutions:**
- ✅ Token expired - login again
- ✅ Token not being sent - check `apiClient.js`
- ✅ Clear localStorage and login again

#### 3. **403 Forbidden**

```
Error: Request failed with status code 403
```

**Solutions:**
- ✅ Wrong user role (e.g., candidate trying to access recruiter endpoint)
- ✅ Trying to access resources you don't own
- ✅ Check role-based access control

## 📁 Project Structure

```
ai-hiring-platform/
├── backend/
│   ├── app/
│   │   ├── api/              # API endpoints
│   │   ├── core/             # Config & security
│   │   ├── ml/               # ML modules
│   │   ├── models.py         # Database models
│   │   ├── schemas.py        # Pydantic schemas
│   │   ├── database.py       # DB connection
│   │   └── main.py           # FastAPI app
│   ├── requirements.txt
│   └── schema.sql            # Database schema
├── frontend/
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable components
│   │   ├── services/         # API services
│   │   ├── context/          # React context
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## 🧪 Testing

### Test Backend API

```bash
# Health check
curl http://localhost:8000/api/health

# Signup
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","full_name":"Test User","role":"candidate"}'
```

### Test Frontend

```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend (Render/Railway)

1. Create account on [Render](https://render.com) or [Railway](https://railway.app)
2. Create new Web Service
3. Connect GitHub repository
4. Set environment variables from `.env`
5. Deploy

### Frontend (Vercel/Netlify)

1. Create account on [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
2. Connect GitHub repository
3. Set `VITE_API_BASE_URL` to your deployed backend URL
4. Deploy

### Common Deployment Issues

#### 1. **Environment Variables Not Set**

**Solution:** Ensure all variables from `.env.example` are set in your deployment platform

#### 2. **Mixed HTTP/HTTPS**

**Solution:** Ensure both frontend and backend use HTTPS in production

#### 3. **Database Connection in Production**

**Solution:** Use the production connection string from Supabase (not the local one)

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/api/docs`
- **ReDoc**: `http://localhost:8000/api/redoc`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License

## 🆘 Support

If you encounter issues:
1. Check the **Common Errors** section above
2. Review API docs at `/api/docs`
3. Check browser console for frontend errors
4. Check terminal output for backend errors
5. Open an issue on GitHub

## 🎓 Learning Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
