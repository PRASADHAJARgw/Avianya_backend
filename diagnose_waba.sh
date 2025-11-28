#!/bin/bash

echo "🔍 WABA Connection Diagnostic"
echo "=============================="
echo ""

# Check if backend is running
echo "1️⃣ Checking Backend Server..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 2>/dev/null)
if [ "$BACKEND_STATUS" = "200" ] || [ "$BACKEND_STATUS" = "302" ]; then
    echo "   ✅ Backend is running on port 8080"
else
    echo "   ❌ Backend is NOT running (status: $BACKEND_STATUS)"
    echo "   💡 Start it with: cd go_server/mongo_golang && go run ."
    exit 1
fi

echo ""
echo "2️⃣ Checking Frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 2>/dev/null)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "   ✅ Frontend is running on port 3001"
    echo "   🔗 Open: http://localhost:3001"
else
    echo "   ❌ Frontend is NOT running"
    echo "   💡 Start it with: npm run dev"
fi

echo ""
echo "3️⃣ Checking Database..."
USER_ID="9332986b-424b-4d83-9559-f7c9a0e16e55"
DB_CHECK=$(PGPASSWORD=postgres psql -h localhost -U postgres -d whatsapp_saas -tAc "SELECT COUNT(*) FROM waba_accounts WHERE user_id = '$USER_ID';" 2>/dev/null)

if [ $? -eq 0 ]; then
    if [ "$DB_CHECK" -gt 0 ]; then
        echo "   ✅ Found $DB_CHECK WABA(s) in database"
        
        # Show WABA details
        echo ""
        echo "   📊 WABA Details:"
        PGPASSWORD=postgres psql -h localhost -U postgres -d whatsapp_saas -c "
            SELECT 
                waba_id,
                owner_business_id,
                TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created,
                (SELECT COUNT(*) FROM phone_numbers WHERE waba_id = waba_accounts.waba_id) as phones
            FROM waba_accounts 
            WHERE user_id = '$USER_ID';
        " 2>/dev/null
    else
        echo "   ⚠️  No WABAs found for user $USER_ID"
        echo "   💡 You need to connect WABA through OAuth"
    fi
else
    echo "   ❌ Cannot connect to database"
    echo "   💡 Check if PostgreSQL is running"
fi

echo ""
echo "4️⃣ Next Steps:"
echo "   1. Open browser: http://localhost:3001"
echo "   2. Press F12 to open DevTools"
echo "   3. Go to Console tab"
echo "   4. Look for these logs:"
echo "      - 🔍 Fetching WABA status for user: ..."
echo "      - 📊 Status response status: 200"
echo "      - ✅ WABA status data: ..."
echo "      - ✅ Set wabaConnected state to: true"
echo "      - 🎨 Rendering Header with state: ..."
echo ""
echo "   If wabaConnected is false in the render log, that's the issue!"
echo ""
echo "=============================="
