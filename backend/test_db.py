from app.database import engine
from sqlalchemy import text

print("Testing database connection...")
try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("✅ Database connection successful!")
        print("Testing if tables exist...")
        result = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
        tables = [row[0] for row in result]
        if tables:
            print(f"✅ Found {len(tables)} tables: {', '.join(tables)}")
        else:
            print("❌ No tables found! You need to run schema.sql in Supabase")
except Exception as e:
    print(f"❌ Database connection failed!")
    print(f"Error: {e}")
    print("\nPlease check:")
    print("1. Is your DATABASE_URL correct in .env?")
    print("2. Does it end with ?sslmode=require?")
    print("3. Is your Supabase project running?")
