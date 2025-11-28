#!/bin/bash

# Quick script to fix orphan WABA accounts
# This reassigns WABAs from 'default_user' to the authenticated user

echo "🔧 WABA User Mapping Fix Script"
echo "================================"
echo ""

# Check if user_id is provided
if [ -z "$1" ]; then
    echo "Usage: ./FIX_WABA_MAPPING.sh <user_id> [jwt_token]"
    echo ""
    echo "Example:"
    echo "  ./FIX_WABA_MAPPING.sh 9332986b-424b-4d83-9559-f7c9a0e16e55"
    echo ""
    echo "Or with JWT token:"
    echo "  ./FIX_WABA_MAPPING.sh 9332986b-424b-4d83-9559-f7c9a0e16e55 eyJhbGc..."
    exit 1
fi

USER_ID=$1
JWT_TOKEN=$2
BACKEND_URL=${BACKEND_URL:-http://localhost:8080}

echo "User ID: $USER_ID"
echo "Backend: $BACKEND_URL"
echo ""

# Prepare the curl command
if [ -z "$JWT_TOKEN" ]; then
    echo "⚠️  No JWT token provided, attempting without authentication..."
    echo "(This may fail if endpoint requires authentication)"
    echo ""
    
    curl -X POST "$BACKEND_URL/api/waba/fix-orphans" \
      -H "Content-Type: application/json" \
      -d "{\"user_id\": \"$USER_ID\"}" \
      -w "\n\nHTTP Status: %{http_code}\n"
else
    echo "✅ Using provided JWT token"
    echo ""
    
    curl -X POST "$BACKEND_URL/api/waba/fix-orphans" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $JWT_TOKEN" \
      -d "{\"user_id\": \"$USER_ID\"}" \
      -w "\n\nHTTP Status: %{http_code}\n"
fi

echo ""
echo "================================"
echo "Done! Check the output above for results."
echo ""
echo "To verify the fix, check the database:"
echo "  SELECT waba_id, user_id FROM waba_accounts WHERE user_id = '$USER_ID';"
