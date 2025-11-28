# Messages Not Showing in Chat - Debugging Guide

## Issue: Empty Messages Array

Your contact has a message ("Hi") shown in the conversation list, but when you open the chat, the messages array is empty.

## Root Cause Analysis

From analyzing the code, here's what's happening:

### Backend Flow
1. ✅ WhatsApp webhook received at `/webhook` endpoint
2. ✅ `handleWhatsAppWebhook()` called
3. ✅ `handleMessagesWebhook()` extracts message
4. ❓ **POTENTIAL ISSUE**: Code checks for `messageText != ""` before saving (line 2103)

### Affected Code Location
**File**: `go_server/mongo_golang/main.go` around lines 2103-2180

```go
// Extract message content based on type
messageText := ""
if msgType == "text" {
    if textData, ok := msg["text"].(map[string]interface{}); ok {
        body, _ := textData["body"].(string)
        messageText = body
        log.Printf("      Text: %s", body)
    }
}

// Save message to database
if postgresDB != nil && phoneNumberID != "" && from != "" && messageText != "" {
    saveIncomingMessageToDB(phoneNumberID, from, msgID, messageText, msgType)
}
```

## Problem Scenarios

### Scenario 1: Message Not Being Parsed
If the message text is not being extracted, `messageText` will be empty and the message won't be saved.

**Check these logs in backend**:
```
📩 Incoming Message:
   From: 917755991051
   ID: wamid.xxx
   Type: text
   Timestamp: xxx
   Text: Hi  ← SHOULD SEE THIS
```

If you don't see "Text: Hi", then the JSON parsing failed.

### Scenario 2: Conversation Created But Message Not Inserted
The conversation is created with the last message, but then the message insert fails.

**Check these logs**:
```
✅ Created new conversation ID: 6 for 917755991051
✅ Saved message to database: conversation_id=6, message_id=wamid.xxx
```

If you see the first log but not the second, the message insertion failed.

### Scenario 3: Database Connection Issue
`postgresDB` might be nil, causing the message to not be saved at all.

**Check these logs**:
```
postgresDB != nil: ❌ (FALSE)
```

## Diagnostic Steps

### Step 1: Check Backend Logs
Look for these patterns in your Go backend logs:

```bash
# Check if webhook is being received
grep "📥 WEBHOOK RECEIVED" backend_logs.txt

# Check if message is being parsed
grep "Text: Hi" backend_logs.txt

# Check if message is being saved
grep "Saved message to database" backend_logs.txt

# Check for errors
grep "❌ Error" backend_logs.txt
```

### Step 2: Check Database Directly
```sql
-- Check if conversation exists
SELECT id, customer_phone, last_message FROM chat_conversations 
WHERE customer_phone = '917755991051';

-- Result should show: id=6, customer_phone='917755991051', last_message='Hi'

-- Now check if messages were saved
SELECT id, conversation_id, content, sender 
FROM chat_messages 
WHERE conversation_id = 6;

-- SHOULD NOT BE EMPTY if "Hi" message exists
```

### Step 3: Check Frontend Request
Open browser console and look for:
```
📨 Fetched messages: {count: 0, limit: 100, messages: Array(0), offset: 0, success: true}
```

This confirms backend is returning empty array.

## Possible Fixes

### Fix 1: Enable Debug Logging
Add detailed logging to `saveIncomingMessageToDB`:

```go
func saveIncomingMessageToDB(phoneNumberID, customerPhone, messageID, messageText, messageType string) {
    log.Printf("🔍 DEBUG saveIncomingMessageToDB called:")
    log.Printf("   phoneNumberID: %s", phoneNumberID)
    log.Printf("   customerPhone: %s", customerPhone)
    log.Printf("   messageID: %s", messageID)
    log.Printf("   messageText: %s", messageText)
    log.Printf("   messageType: %s", messageType)
    log.Printf("   postgresDB != nil: %v", postgresDB != nil)
    
    // ... rest of function ...
}
```

### Fix 2: Add Validation Check
In `handleMessagesWebhook`, after extracting text:

```go
if msgType == "text" {
    if textData, ok := msg["text"].(map[string]interface{}); ok {
        body, _ := textData["body"].(string)
        messageText = body
        log.Printf("      Text: %s", body)
        log.Printf("      Text is empty: %v", messageText == "")  // DEBUG
    } else {
        log.Printf("      ❌ Failed to extract text data")  // DEBUG
    }
}
```

### Fix 3: Check for Non-Text Message Types
The current code only saves "text" messages. If your message is a different type:

```go
// After: if msgType == "text" { ... }

// Handle other message types
if messageText == "" && msgType != "text" {
    // Handle image, video, location, etc.
    log.Printf("   🔍 Non-text message type: %s", msgType)
    // For now, log the message type
    messageText = fmt.Sprintf("[%s message]", msgType)
}
```

### Fix 4: Check JWT/Auth Issue
If the phone_number_id lookup fails:

```go
var userID, wabaID string
err := postgresDB.QueryRow(`
    SELECT w.user_id, p.waba_id 
    FROM phone_numbers p
    JOIN waba_accounts w ON p.waba_id = w.waba_id
    WHERE p.phone_number_id = $1
    LIMIT 1
`, phoneNumberID).Scan(&userID, &wabaID)

if err != nil {
    log.Printf("   ❌ Error finding user_id and waba_id for phone_number_id %s: %v", phoneNumberID, err)
    // Maybe the phone_number_id doesn't exist in database?
    // Try to find it with a debug query
    log.Printf("   🔍 Available phone_number_ids in database:")
    rows, _ := postgresDB.Query(`SELECT phone_number_id FROM phone_numbers LIMIT 10`)
    for rows.Next() {
        var pid string
        rows.Scan(&pid)
        log.Printf("      - %s", pid)
    }
    return
}
```

## Expected Behavior

When a message arrives:
1. Webhook received ✅
2. Message extracted: `Text: Hi` ✅
3. Conversation found or created ✅
4. Message inserted: `✅ Saved message to database: conversation_id=6` ✅
5. Frontend fetches and displays ✅

## Quick Checklist

- [ ] Backend is receiving webhooks (check logs for 📥 WEBHOOK RECEIVED)
- [ ] Message text is being extracted (check logs for "Text: Hi")
- [ ] Message is being saved (check logs for "✅ Saved message to database")
- [ ] Database has the message (run SELECT on chat_messages)
- [ ] Frontend is making correct API call (check Network tab)
- [ ] PostgreSQL connection is active (check postgresDB != nil)
- [ ] phone_number_id exists in phone_numbers table

## Next Actions

1. Enable verbose logging in `handleMessagesWebhook` and `saveIncomingMessageToDB`
2. Check backend logs for all the emojis and debug messages
3. Query database to verify message was inserted
4. Compare conversation_id from logs with what's in database
5. If still empty, check for transaction/commit issues in database

## Database Query Reference

```sql
-- Find the conversation
SELECT * FROM chat_conversations WHERE customer_phone = '917755991051';

-- Find messages for that conversation
SELECT * FROM chat_messages WHERE conversation_id = <ID_FROM_ABOVE>;

-- Check if there are ANY messages at all
SELECT COUNT(*) as total_messages FROM chat_messages;

-- Check phone_numbers table exists
SELECT phone_number_id, waba_id FROM phone_numbers LIMIT 5;

-- Check WABA accounts
SELECT waba_id, user_id FROM waba_accounts LIMIT 5;
```

## Backend Log Output Guide

**Good signs** (message will be saved):
```
✅ Updated conversation ID: 6 for 917755991051
✅ Saved message to database: conversation_id=6, message_id=wamid.xxx
```

**Bad signs** (message won't be saved):
```
❌ Error finding user_id and waba_id for phone_number_id
❌ Error updating conversation
❌ Error inserting message
```

**Debug signs** (verify message was received):
```
📩 Incoming Message:
   From: 917755991051
   Text: Hi
```
