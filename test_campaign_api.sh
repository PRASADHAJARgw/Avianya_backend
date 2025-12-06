#!/bin/bash

# Campaign Management API Test Script
# Tests the multi-threaded campaign backend

BASE_URL="http://localhost:8080"
JWT_TOKEN="YOUR_JWT_TOKEN_HERE"  # Replace with actual JWT token
USER_ID="3f947ab3-f228-4d1c-9c2f-5bfb5f8a5fd5"
TEMPLATE_ID=24

echo "🚀 Campaign Management API Test"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Create Campaign
echo -e "${BLUE}1. Creating Campaign...${NC}"
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/campaigns/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d "{
    \"user_id\": \"$USER_ID\",
    \"name\": \"Test Campaign - $(date +%s)\",
    \"template_id\": $TEMPLATE_ID,
    \"recipients\": [
      {
        \"country_code\": \"+1\",
        \"phone_number\": \"1234567890\",
        \"body_param_1\": \"Test User 1\",
        \"body_param_2\": \"Value A\"
      },
      {
        \"country_code\": \"+1\",
        \"phone_number\": \"0987654321\",
        \"body_param_1\": \"Test User 2\",
        \"body_param_2\": \"Value B\"
      },
      {
        \"country_code\": \"+91\",
        \"phone_number\": \"9876543210\",
        \"body_param_1\": \"Test User 3\",
        \"body_param_2\": \"Value C\"
      }
    ]
  }")

echo "$CREATE_RESPONSE" | jq '.'
CAMPAIGN_ID=$(echo "$CREATE_RESPONSE" | jq -r '.campaign_id')

if [ "$CAMPAIGN_ID" == "null" ] || [ -z "$CAMPAIGN_ID" ]; then
  echo -e "${RED}❌ Failed to create campaign${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Campaign created: $CAMPAIGN_ID${NC}"
echo ""

# 2. Get Campaign Details
echo -e "${BLUE}2. Getting Campaign Details...${NC}"
curl -s "$BASE_URL/campaigns/$CAMPAIGN_ID" \
  -H "Authorization: Bearer $JWT_TOKEN" | jq '.'
echo ""

# 3. Get All Campaigns
echo -e "${BLUE}3. Getting All Campaigns...${NC}"
curl -s "$BASE_URL/campaigns?user_id=$USER_ID" \
  -H "Authorization: Bearer $JWT_TOKEN" | jq '.[0:2]'  # Show first 2
echo ""

# 4. Send Campaign (Multi-threaded)
echo -e "${BLUE}4. Starting Campaign Execution (Multi-threaded)...${NC}"
SEND_RESPONSE=$(curl -s -X POST "$BASE_URL/campaigns/$CAMPAIGN_ID/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{
    "worker_count": 5,
    "rate_limit": 10
  }')

echo "$SEND_RESPONSE" | jq '.'
echo -e "${GREEN}✅ Campaign execution started in background${NC}"
echo ""

# 5. Monitor Progress
echo -e "${BLUE}5. Monitoring Campaign Progress...${NC}"
for i in {1..5}; do
  echo -e "${YELLOW}Check $i of 5...${NC}"
  STATS=$(curl -s "$BASE_URL/campaigns/$CAMPAIGN_ID" \
    -H "Authorization: Bearer $JWT_TOKEN")
  
  SENT=$(echo "$STATS" | jq -r '.sent')
  DELIVERED=$(echo "$STATS" | jq -r '.delivered')
  FAILED=$(echo "$STATS" | jq -r '.failed')
  PENDING=$(echo "$STATS" | jq -r '.pending')
  STATUS=$(echo "$STATS" | jq -r '.status')
  
  echo "  Status: $STATUS | Sent: $SENT | Delivered: $DELIVERED | Failed: $FAILED | Pending: $PENDING"
  
  if [ "$STATUS" == "completed" ]; then
    echo -e "${GREEN}✅ Campaign completed!${NC}"
    break
  fi
  
  sleep 2
done
echo ""

# 6. Pause Campaign (if still active)
if [ "$STATUS" == "active" ]; then
  echo -e "${BLUE}6. Pausing Campaign...${NC}"
  curl -s -X POST "$BASE_URL/campaigns/$CAMPAIGN_ID/status" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -d '{"status": "paused"}' | jq '.'
  echo ""
fi

# 7. Final Statistics
echo -e "${BLUE}7. Final Campaign Statistics...${NC}"
curl -s "$BASE_URL/campaigns/$CAMPAIGN_ID" \
  -H "Authorization: Bearer $JWT_TOKEN" | jq '{
    name: .name,
    status: .status,
    total_recipients: .total_recipients,
    sent: .sent,
    delivered: .delivered,
    read: .read,
    failed: .failed,
    pending: .pending,
    sent_percentage: (.sent / .total_recipients * 100 | floor),
    delivered_percentage: (.delivered / .total_recipients * 100 | floor)
  }'

echo ""
echo -e "${GREEN}✅ Test Complete!${NC}"
echo ""
echo "📊 Campaign ID: $CAMPAIGN_ID"
echo ""
echo "💡 Tips:"
echo "   - Check server logs for detailed execution info"
echo "   - Monitor database: SELECT * FROM campaigns WHERE id = '$CAMPAIGN_ID';"
echo "   - View recipients: SELECT * FROM campaign_recipients WHERE campaign_id = '$CAMPAIGN_ID';"
echo "   - Test with real WhatsApp by setting WA_TOKEN in .env"
