#!/bin/bash

# Test the signup endpoint

echo "🧪 Testing signup endpoint..."

# Test data
EMAIL="testuser$(date +%s)@example.com"
PAYLOAD="{\"email\":\"$EMAIL\",\"full_name\":\"Test User\",\"role\":\"candidate\",\"password\":\"password123\"}"

echo "📤 Sending signup request for: $EMAIL"

# Make the request
RESPONSE=$(curl -s -X POST http://localhost:8000/api/auth/signup \
  -H 'Content-Type: application/json' \
  -d "$PAYLOAD")

# Check if we got a response
if [ -z "$RESPONSE" ]; then
    echo "❌ No response from server. Is it running?"
    echo "💡 Start the server with: ./start_server.sh"
    exit 1
fi

# Check if response contains access_token
if echo "$RESPONSE" | grep -q "access_token"; then
    echo "✅ Signup successful!"
    echo "🔑 Access token received"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
else
    echo "❌ Signup failed!"
    echo "📋 Response:"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
fi
