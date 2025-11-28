#!/bin/bash

# Test WABA Status API
USER_ID="9332986b-424b-4d83-9559-f7c9a0e16e55"
BACKEND_URL="http://localhost:8080"

# Get JWT token from user (they need to provide this)
echo "🔍 Testing WABA Status API"
echo "============================"
echo ""
echo "ℹ️  To get your JWT token:"
echo "   1. Open browser DevTools (F12)"
echo "   2. Go to Console tab"
echo "   3. Type: localStorage.getItem('access_token')"
echo "   4. Copy the token value"
echo ""
read -p "📋 Paste your JWT token here: " JWT_TOKEN

if [ -z "$JWT_TOKEN" ]; then
    echo "❌ No token provided. Exiting."
    exit 1
fi

echo ""
echo "🔗 Testing: ${BACKEND_URL}/api/waba/status?user_id=${USER_ID}"
echo ""

# Test WABA Status API
RESPONSE=$(curl -s -w "\n%{http_code}" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  "${BACKEND_URL}/api/waba/status?user_id=${USER_ID}")

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "📊 HTTP Status: $HTTP_CODE"
echo ""
echo "📄 Response Body:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    CONNECTED=$(echo "$BODY" | jq -r '.connected' 2>/dev/null)
    TOTAL_WABAS=$(echo "$BODY" | jq -r '.total_wabas' 2>/dev/null)
    
    if [ "$CONNECTED" = "true" ]; then
        echo "✅ WABA is connected!"
        echo "📱 Total WABAs: $TOTAL_WABAS"
        
        # Extract first WABA ID
        FIRST_WABA=$(echo "$BODY" | jq -r '.accounts[0].waba_id' 2>/dev/null)
        
        if [ "$FIRST_WABA" != "null" ] && [ ! -z "$FIRST_WABA" ]; then
            echo ""
            echo "🔍 Testing phone numbers for WABA: $FIRST_WABA"
            
            PHONE_RESPONSE=$(curl -s -w "\n%{http_code}" \
              -H "Authorization: Bearer ${JWT_TOKEN}" \
              -H "Content-Type: application/json" \
              "${BACKEND_URL}/api/waba/phone-numbers?waba_id=${FIRST_WABA}")
            
            PHONE_HTTP_CODE=$(echo "$PHONE_RESPONSE" | tail -n 1)
            PHONE_BODY=$(echo "$PHONE_RESPONSE" | sed '$d')
            
            echo "📊 Phone API HTTP Status: $PHONE_HTTP_CODE"
            echo ""
            echo "📄 Phone Numbers:"
            echo "$PHONE_BODY" | jq '.' 2>/dev/null || echo "$PHONE_BODY"
        fi
    else
        echo "⚠️  WABA is not connected"
    fi
else
    echo "❌ API request failed with status $HTTP_CODE"
fi

echo ""
echo "============================"
echo "✅ Test complete"
