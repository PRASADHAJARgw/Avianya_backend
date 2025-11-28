#!/bin/bash

# Script to help get Supabase JWT Secret
# The JWT secret is available in the Supabase dashboard

echo "🔍 Getting Supabase JWT Secret..."
echo ""
echo "Your Supabase Project: ucqnbhbluzqtnarcogrm"
echo ""
echo "📋 Option 1: Dashboard (Easiest)"
echo "1. Open: https://app.supabase.com/project/ucqnbhbluzqtnarcogrm/settings/api"
echo "2. Scroll down to 'JWT Settings'"
echo "3. Copy the 'JWT Secret' value"
echo ""
echo "📋 Option 2: Use this command to extract from your browser"
echo "1. Login to Supabase Dashboard"
echo "2. Go to your project settings/API page"
echo "3. Open browser console (F12)"
echo "4. Run this in the console:"
echo ""
echo "   // Copy JWT Secret"
echo "   copy(document.querySelector('[data-test=\"jwt-secret\"]')?.textContent || 'Not found - look for JWT Secret manually')"
echo ""
echo "📋 Option 3: It might be in local Supabase config"
echo "Running: supabase status (if CLI is installed)"
echo ""

# Try to get from Supabase CLI if available
if command -v supabase &> /dev/null; then
    echo "✅ Supabase CLI found, trying to get JWT secret..."
    supabase status 2>/dev/null | grep -i "jwt" || echo "❌ No local Supabase instance found"
else
    echo "❌ Supabase CLI not installed"
    echo "   Install with: brew install supabase/tap/supabase"
fi

echo ""
echo "⚠️  IMPORTANT: The JWT Secret is NOT the same as:"
echo "   - SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo ""
echo "Once you have the JWT Secret, update the .env file:"
echo "   nano /Users/prasadhajare/Prasad_dev/whats_app_dev/msg-canvas-flow-main/go_server/mongo_golang/.env"
echo ""
echo "   Change this line:"
echo "   SUPABASE_JWT_SECRET=your-supabase-jwt-secret-here"
echo ""
echo "   To:"
echo "   SUPABASE_JWT_SECRET=<your-actual-jwt-secret>"
echo ""
echo "Then restart the backend server!"
