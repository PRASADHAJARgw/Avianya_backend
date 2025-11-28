#!/bin/bash

# WhatsApp Media Debug Script
# This script checks if media messages are being properly processed

echo "🔍 Checking WhatsApp Media Processing..."
echo ""

# Check if backend is running
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Backend is running on port 8080"
else
    echo "❌ Backend is NOT running on port 8080"
    exit 1
fi

# Check Supabase credentials
cd "$(dirname "$0")/go_server/mongo_golang"

if grep -q "SUPABASE_URL=https://" .env && ! grep -q "your-project-id" .env; then
    echo "✅ Supabase URL configured"
    SUPABASE_URL=$(grep "SUPABASE_URL=" .env | cut -d'=' -f2)
    echo "   URL: $SUPABASE_URL"
else
    echo "❌ Supabase URL not configured properly"
fi

if grep -q "SUPABASE_ANON_KEY=eyJ" .env && ! grep -q "your-supabase-anon-key" .env; then
    echo "✅ Supabase anon key configured"
else
    echo "❌ Supabase anon key not configured properly"
fi

echo ""
echo "📊 Recent image messages in database:"
echo "======================================"

PGPASSWORD=redhat@123 psql -h localhost -p 5432 -U postgres -d whatsapp_saas -c "
SELECT 
    id,
    message_type,
    LEFT(content, 30) as content,
    CASE 
        WHEN media_url LIKE '%supabase%' THEN '✅ Supabase'
        WHEN media_url LIKE '%fbsbx%' THEN '⚠️ WhatsApp (temp)'
        WHEN media_url IS NULL THEN '❌ No URL'
        ELSE '❓ Unknown'
    END as storage,
    LEFT(media_url, 60) as url_preview,
    created_at
FROM chat_messages 
WHERE message_type IN ('image', 'video', 'document', 'audio')
ORDER BY created_at DESC 
LIMIT 5;
" 2>/dev/null

echo ""
echo "📝 Recent backend logs (media related):"
echo "======================================"
tail -n 100 backend.log | grep -E "(Downloading media|Supabase|Media uploaded|media_url)" | tail -n 10

echo ""
echo "🎯 What to do next:"
echo "===================="
echo "1. Send an image via WhatsApp to your business number"
echo "2. Watch the logs: tail -f go_server/mongo_golang/backend.log | grep media"
echo "3. Look for: '✅ Media uploaded to Supabase'"
echo "4. If you see '❌ Supabase credentials not configured', check .env file"
echo ""
echo "📚 Need help? Check: SUPABASE_STORAGE_SETUP_URGENT.md"
