#!/bin/bash

# Quick Start Script for Backend-Frontend Integration
# This script helps you get started with the multi-tenant system

echo "================================================"
echo "🚀 Backend-Frontend Integration Quick Start"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend is running
echo -e "${BLUE}Checking backend status...${NC}"
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${GREEN}✅ Backend is running on port 8080${NC}"
else
    echo -e "${YELLOW}⚠️  Backend is not running${NC}"
    echo ""
    echo "Starting backend server..."
    cd go_server/mongo_golang
    nohup ./mongo_golang > server.log 2>&1 &
    BACKEND_PID=$!
    echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
    echo "   Logs: go_server/mongo_golang/server.log"
    cd ../..
    sleep 2
fi

echo ""
echo "================================================"
echo "📝 Quick Test"
echo "================================================"
echo ""

# Test signup
echo -e "${BLUE}1. Testing Signup...${NC}"
SIGNUP_RESPONSE=$(curl -s -X POST http://localhost:8080/api/v2/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"quickstart@example.com",
    "password":"password123",
    "name":"Quick Start User",
    "organization_name":"Quick Start Org"
  }')

if echo "$SIGNUP_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✅ Signup successful!${NC}"
    TOKEN=$(echo "$SIGNUP_RESPONSE" | jq -r '.token')
    USER_NAME=$(echo "$SIGNUP_RESPONSE" | jq -r '.user.name')
    ORG_NAME=$(echo "$SIGNUP_RESPONSE" | jq -r '.user.organization_name')
    echo "   User: $USER_NAME"
    echo "   Organization: $ORG_NAME"
else
    echo -e "${YELLOW}⚠️  User might already exist, trying login...${NC}"
    
    # Try login instead
    LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/v2/auth/login \
      -H "Content-Type: application/json" \
      -d '{
        "email":"quickstart@example.com",
        "password":"password123"
      }')
    
    if echo "$LOGIN_RESPONSE" | grep -q "token"; then
        echo -e "${GREEN}✅ Login successful!${NC}"
        TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
        USER_NAME=$(echo "$LOGIN_RESPONSE" | jq -r '.user.name')
        ORG_NAME=$(echo "$LOGIN_RESPONSE" | jq -r '.user.organization_name')
        echo "   User: $USER_NAME"
        echo "   Organization: $ORG_NAME"
    else
        echo -e "${YELLOW}❌ Could not login${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}2. Testing Authenticated Endpoint...${NC}"
ME_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/v2/auth/me)
if echo "$ME_RESPONSE" | grep -q "user"; then
    echo -e "${GREEN}✅ Authentication working!${NC}"
else
    echo -e "${YELLOW}❌ Authentication failed${NC}"
fi

echo ""
echo -e "${BLUE}3. Testing Chat Creation...${NC}"
CHAT_RESPONSE=$(curl -s -X POST http://localhost:8080/api/v2/whatsapp/chats \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_name":"Test Chat",
    "phone_number":"+1234567890",
    "is_shared":true
  }')
if echo "$CHAT_RESPONSE" | grep -q "id"; then
    echo -e "${GREEN}✅ Chat creation working!${NC}"
    CHAT_ID=$(echo "$CHAT_RESPONSE" | jq -r '.chat.id')
    echo "   Chat ID: $CHAT_ID"
else
    echo -e "${YELLOW}⚠️  Chat might already exist or error occurred${NC}"
fi

echo ""
echo "================================================"
echo "✨ Success! System is ready to use"
echo "================================================"
echo ""
echo "📚 Next Steps:"
echo ""
echo "1. Start frontend development server:"
echo -e "   ${BLUE}npm run dev${NC}"
echo ""
echo "2. Access your app at:"
echo -e "   ${BLUE}http://localhost:3000${NC}"
echo ""
echo "3. Use the auth store in your components:"
echo -e "   ${BLUE}import { useAuthStore } from '@/store/authStore';${NC}"
echo ""
echo "4. Check the integration guide:"
echo -e "   ${BLUE}cat BACKEND_FRONTEND_INTEGRATION.md${NC}"
echo ""
echo "📊 Your Credentials:"
echo "   Email: quickstart@example.com"
echo "   Password: password123"
echo "   Token: ${TOKEN:0:50}..."
echo ""
echo "🔗 API Base URL: http://localhost:8080/api/v2"
echo ""
echo "Happy coding! 🎉"
