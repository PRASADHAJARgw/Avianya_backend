#!/bin/bash

# Contact Auto-Upsert Test Script
# This script helps verify that contacts are being automatically created/updated

echo "🧪 Contact Auto-Upsert Test Script"
echo "=================================="
echo ""

# Database connection details (replace with your actual values)
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-whatsapp_saas}"
DB_USER="${DB_USER:-postgres}"

# Test phone number
TEST_PHONE="${1:-917775599105}"

echo "📋 Configuration:"
echo "   Database: $DB_NAME"
echo "   Host: $DB_HOST:$DB_PORT"
echo "   User: $DB_USER"
echo "   Test Phone: $TEST_PHONE"
echo ""

# Check if contact exists before test
echo "1️⃣ Checking if contact exists before test..."
BEFORE_COUNT=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c \
  "SELECT COUNT(*) FROM contacts WHERE tenant_id = 1 AND phone_number = '$TEST_PHONE';" 2>/dev/null | xargs)

if [ "$BEFORE_COUNT" = "0" ]; then
    echo "   ✅ Contact does not exist (will be created)"
    CONTACT_EXISTS="no"
else
    echo "   ℹ️  Contact already exists (will be updated)"
    CONTACT_EXISTS="yes"
    # Show existing contact
    echo ""
    echo "   Existing contact data:"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c \
      "SELECT id, tenant_id, phone_number, name, created_at, updated_at FROM contacts WHERE tenant_id = 1 AND phone_number = '$TEST_PHONE';"
fi
echo ""

# Instructions for sending test message
echo "2️⃣ ACTION REQUIRED: Send a WhatsApp message"
echo "   📱 From phone: +${TEST_PHONE}"
echo "   💬 Message: Hello, this is a test"
echo ""
echo "   Press ENTER after sending the message..."
read -r

# Wait a bit for webhook to process
echo "   ⏳ Waiting 3 seconds for webhook processing..."
sleep 3
echo ""

# Check backend logs for contact upsert
echo "3️⃣ Checking backend logs for contact upsert..."
if [ -f "backend.log" ]; then
    echo "   Looking for upsert logs in backend.log..."
    UPSERT_LOGS=$(tail -50 backend.log | grep "Upserting contact" | grep "$TEST_PHONE" | tail -1)
    SUCCESS_LOGS=$(tail -50 backend.log | grep "Contact upserted successfully" | grep "$TEST_PHONE" | tail -1)
    
    if [ -n "$UPSERT_LOGS" ]; then
        echo "   ✅ Found upsert attempt:"
        echo "      $UPSERT_LOGS"
    else
        echo "   ⚠️  No upsert log found (check if backend is running)"
    fi
    
    if [ -n "$SUCCESS_LOGS" ]; then
        echo "   ✅ Found success confirmation:"
        echo "      $SUCCESS_LOGS"
    else
        echo "   ⚠️  No success log found"
    fi
else
    echo "   ⚠️  backend.log not found in current directory"
    echo "   💡 Check your backend logs manually for:"
    echo "      📇 Upserting contact: phone=$TEST_PHONE"
    echo "      ✅ Contact upserted successfully for $TEST_PHONE"
fi
echo ""

# Check if contact was created/updated
echo "4️⃣ Verifying contact in database..."
AFTER_COUNT=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c \
  "SELECT COUNT(*) FROM contacts WHERE tenant_id = 1 AND phone_number = '$TEST_PHONE';" 2>/dev/null | xargs)

if [ "$AFTER_COUNT" = "1" ]; then
    echo "   ✅ Contact found in database"
    echo ""
    echo "   Contact details:"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c \
      "SELECT id, tenant_id, phone_number, name, created_at, updated_at FROM contacts WHERE tenant_id = 1 AND phone_number = '$TEST_PHONE';"
    
    if [ "$CONTACT_EXISTS" = "no" ]; then
        echo ""
        echo "   🎉 SUCCESS! New contact was created automatically"
    else
        echo ""
        echo "   🎉 SUCCESS! Existing contact was updated"
        echo ""
        echo "   Timestamp comparison:"
        echo "   (updated_at should be newer than before)"
    fi
else
    echo "   ❌ ERROR: Contact not found in database"
    echo "   Possible issues:"
    echo "   - Backend not running"
    echo "   - Webhook not configured"
    echo "   - Database connection error"
    echo "   - Foreign key constraint on tenant_id"
fi
echo ""

# Check for duplicate contacts
echo "5️⃣ Checking for duplicate contacts..."
DUPLICATE_COUNT=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c \
  "SELECT COUNT(*) FROM contacts WHERE tenant_id = 1 AND phone_number = '$TEST_PHONE';" 2>/dev/null | xargs)

if [ "$DUPLICATE_COUNT" -gt "1" ]; then
    echo "   ⚠️  WARNING: Found $DUPLICATE_COUNT duplicate contacts!"
    echo "   This should not happen (unique constraint issue)"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c \
      "SELECT id, tenant_id, phone_number, name FROM contacts WHERE tenant_id = 1 AND phone_number = '$TEST_PHONE' ORDER BY id;"
else
    echo "   ✅ No duplicates found (unique constraint working)"
fi
echo ""

# Check chat_messages table to verify message was saved
echo "6️⃣ Checking if message was also saved to chat_messages..."
MESSAGE_COUNT=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c \
  "SELECT COUNT(*) FROM chat_messages m 
   JOIN chat_conversations c ON m.conversation_id = c.id 
   WHERE c.customer_phone = '$TEST_PHONE' 
   AND m.created_at > NOW() - INTERVAL '5 minutes';" 2>/dev/null | xargs)

if [ "$MESSAGE_COUNT" -gt "0" ]; then
    echo "   ✅ Found $MESSAGE_COUNT recent message(s) from this contact"
    echo "   (Contact upsert + message save both working)"
else
    echo "   ⚠️  No recent messages found"
    echo "   (Either webhook didn't fire or message not saved)"
fi
echo ""

# Summary
echo "=================================="
echo "📊 Test Summary"
echo "=================================="
echo "Contact Phone: $TEST_PHONE"
echo "Contact Exists: $([ "$AFTER_COUNT" = "1" ] && echo "✅ YES" || echo "❌ NO")"
echo "No Duplicates: $([ "$DUPLICATE_COUNT" -le "1" ] && echo "✅ YES" || echo "❌ NO")"
echo "Message Saved: $([ "$MESSAGE_COUNT" -gt "0" ] && echo "✅ YES" || echo "⚠️  NO")"
echo ""

if [ "$AFTER_COUNT" = "1" ] && [ "$DUPLICATE_COUNT" -le "1" ]; then
    echo "🎉 Contact auto-upsert is working correctly!"
else
    echo "⚠️  Some issues detected. Check the logs above."
fi
echo ""

# Offer to check unique index
echo "7️⃣ Verifying database schema..."
INDEX_EXISTS=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c \
  "SELECT COUNT(*) FROM pg_indexes 
   WHERE tablename = 'contacts' 
   AND indexname = 'contacts_tenant_id_phone_number_key';" 2>/dev/null | xargs)

if [ "$INDEX_EXISTS" = "1" ]; then
    echo "   ✅ Unique index on (tenant_id, phone_number) exists"
else
    echo "   ⚠️  WARNING: Unique index not found!"
    echo "   This could allow duplicate contacts"
    echo "   Run contacts_ddl.sql to create the index"
fi
echo ""

echo "Test complete!"
