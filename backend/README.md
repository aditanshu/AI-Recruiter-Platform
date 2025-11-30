# AI Recruiter Platform - Backend

## 🚀 Quick Start

### Option 1: Use the startup script (Recommended)
```bash
cd backend
./start_server.sh
```

### Option 2: Manual start
```bash
cd backend
export PATH="$HOME/.local/bin:$PATH"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 🧪 Testing

Test the signup endpoint:
```bash
cd backend
./test_signup.sh
```

Or manually:
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","full_name":"Test User","role":"candidate","password":"password123"}'
```

## 📚 API Documentation

Once the server is running:
- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc
- **Health Check**: http://localhost:8000/api/health

## 🔧 Troubleshooting

### 500 Internal Server Error
If you get a 500 error, it's usually due to missing dependencies:

```bash
cd backend
python3 -m pip install --user --break-system-packages -r requirements.txt
export PATH="$HOME/.local/bin:$PATH"
```

### Database Connection Issues
1. Check your `.env` file exists and has correct DATABASE_URL
2. Ensure your Supabase project is running
3. Test connection: `python3 test_db.py`

### Missing .env file
Copy from example:
```bash
cp .env.example .env
# Edit .env with your actual values
```

## 📋 Environment Variables

Required in `.env`:
```env
DATABASE_URL=postgresql://postgres:PASSWORD@HOST:5432/postgres?sslmode=require
SECRET_KEY=your-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
APP_NAME=AI Recruiter Platform
DEBUG=True
```

## ✅ Verification

Server is working correctly if you see:
- ✅ Database connection successful
- ✅ Server running on http://localhost:8000
- ✅ Signup endpoint returns JWT token
- ✅ API docs accessible at /api/docs
