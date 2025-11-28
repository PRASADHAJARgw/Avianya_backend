#!/bin/bash

echo "🎬 Starting live media upload monitoring..."
echo "📸 Send an image via WhatsApp now!"
echo ""
echo "Looking for these messages:"
echo "  ✅ Media uploaded to Supabase"
echo "  ❌ Failed to upload"
echo ""
echo "Press Ctrl+C to stop monitoring"
echo "================================"
echo ""

cd "$(dirname "$0")/go_server/mongo_golang"
tail -f backend.log | grep --line-buffered -E "(Downloading media|Media uploaded|Failed to upload|Supabase)" | while read line; do
    if echo "$line" | grep -q "Media uploaded to Supabase"; then
        echo "✅ SUCCESS! $line"
    elif echo "$line" | grep -q "Failed to upload"; then
        echo "❌ ERROR! $line"
    else
        echo "$line"
    fi
done
