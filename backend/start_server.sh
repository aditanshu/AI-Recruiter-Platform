#!/bin/bash

# AI Recruiter Platform Backend Startup Script

echo "🚀 Starting AI Recruiter Platform Backend..."

# Set PATH to include local pip installations
export PATH="$HOME/.local/bin:$PATH"

# Check if required packages are installed
echo "📦 Checking dependencies..."
python3 -c "import fastapi, uvicorn, sqlalchemy, psycopg2" 2>/dev/null || {
    echo "❌ Missing dependencies. Installing..."
    python3 -m pip install --user --break-system-packages -r requirements.txt
}

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found! Please create it from .env.example"
    exit 1
fi

echo "✅ Dependencies ready"
echo "🔗 Testing database connection..."

# Test database connection
python3 -c "
from app.database import engine
from sqlalchemy import text
try:
    with engine.connect() as conn:
        conn.execute(text('SELECT 1'))
    print('✅ Database connection successful')
except Exception as e:
    print(f'❌ Database connection failed: {e}')
    exit(1)
"

echo "🌐 Starting server on http://localhost:8000"
echo "📚 API docs will be available at http://localhost:8000/api/docs"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
