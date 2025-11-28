# Live Chat - Messages Not Showing Issue

## Problem Summary
✅ **Contact is fetched successfully**: Phone `917755991051` is showing in the contact list
✅ **Conversation ID is retrieved**: `conversation_id: 6`
✅ **API request is made**: Calling `/api/live-chat/messages`
❌ **Messages not displaying**: API returns empty array: `{count: 0, limit: 100, messages: Array(0)}`

## Console Logs Analysis

### Success Logs:
```
✅ ContactBrowserRepository.ts:74 Contact transformed successfully: 
   {wa_id: '917755991051', name: '917755991051', ...}

✅ MessageListClient.tsx:116 Fetched conversation ID: 6

✅ useContactList.ts:100 Received conversations: 
   {conversations: [{…}], count: 1, success: true}
```

### Problem Logs:
```
📨 MessageListClient.tsx:160 Fetched messages: 
   {count: 0, limit: 100, messages: Array(0), offset: 0, success: true}
```

## Root Cause Analysis

### The Issue:
The backend is returning an empty messages array, which means either:

1. **Messages not stored in DB**: Messages exist but aren't being saved to `chat_messages` table
2. **Query filter issue**: The `conversation_id = 6` might not match any records in the database
3. **Missing webhook handler**: Incoming WhatsApp messages aren't being captured and stored
4. **Database schema mismatch**: Column names or data types don't match expectations

## Data Flow to Check

```
WhatsApp Webhook
       ↓
Backend receives message
       ↓
Stores in chat_messages table (with conversation_id: 6)
       ↓
Frontend calls: GET /api/live-chat/messages?conversation_id=6
       ↓
Backend queries chat_messages WHERE conversation_id = 6
       ↓
Returns empty array (❌ PROBLEM HERE)
```

## Files to Investigate

### 1. **Backend Message Handler** 
- File: `go_server/mongo_golang/live_chat_handlers.go`
- Function: `handleGetMessages()` - Need to check query logic
- Function: `handleWebhookMessage()` - Need to check if messages are being saved

### 2. **Database Schema**
- Table: `chat_messages`
- Must have columns:
  - `id` (int/serial)
  - `conversation_id` (int) - **MUST match conversation.id**
  - `content` (text)
  - `message_type` (varchar)
  - `sender` (varchar) - 'user' or 'business'
  - `created_at` (timestamp)
  - Other: `message_id`, `wa_message_id`, `media_url`, etc.

### 3. **Frontend Request**
- File: `MessageListClient.tsx` (line 140-160)
- Request: `GET http://localhost:8080/api/live-chat/messages?conversation_id=6&limit=100&offset=0`
- Headers: Bearer token authentication

## Steps to Fix

### Option 1: Check if messages exist in database
```bash
# SSH into database and run:
SELECT * FROM chat_messages WHERE conversation_id = 6;

# Also check the conversation table:
SELECT * FROM chat_conversations WHERE id = 6;
```

### Option 2: Check backend message handler
Look at `handleGetMessages()` in `live_chat_handlers.go`:
- Verify query is correct
- Check for any WHERE clause filters that might exclude messages
- Verify conversation_id parameter is being read correctly

### Option 3: Check webhook message storage
Look at webhook handler that receives messages from WhatsApp:
- Verify messages are being parsed correctly
- Verify conversation_id is being determined and stored
- Check if there are any errors during message insertion

### Option 4: Check database connection
- Verify PostgreSQL is running: `psql -U user -d dbname -c "SELECT 1;"`
- Verify `chat_messages` table exists
- Check if table has any data at all: `SELECT COUNT(*) FROM chat_messages;`

## Expected Data Format

### Backend Response for Messages:
```json
{
  "success": true,
  "count": 5,
  "limit": 100,
  "offset": 0,
  "messages": [
    {
      "id": 1,
      "conversation_id": 6,
      "message_id": "wamid.xxx",
      "wa_message_id": "wamid.xxx",
      "content": "Hi",
      "message_type": "text",
      "sender": "customer",
      "status": "received",
      "created_at": "2025-11-26T15:20:06.467785Z"
    }
  ]
}
```

### Frontend Processing:
- Transforms to `UIMessage` format
- Adds `msgDate` (formatted date)
- Adds `messageBody` (parsed JSON)
- Maps to UI components based on `message_type`

## Common Causes

| Issue | Solution |
|-------|----------|
| Messages stored with wrong `conversation_id` | Check webhook handler that creates messages |
| `chat_messages` table empty | Check if webhook is receiving messages from WhatsApp |
| Wrong query filter in backend | Check `handleGetMessages()` implementation |
| Conversation ID mismatch | Verify conversation creation matches message storage |
| Messages deleted/not persisted | Check database transaction handling |
| Query has additional WHERE clauses | Check backend implementation for unintended filters |

## Next Steps

1. **Check database directly**: `SELECT * FROM chat_messages LIMIT 10;`
2. **Enable backend logging**: Add detailed logs in `handleGetMessages()`
3. **Check webhook logs**: Verify messages are being received and stored
4. **Test API directly**: 
   ```bash
   curl -H "Authorization: Bearer <token>" \
     "http://localhost:8080/api/live-chat/messages?conversation_id=6&limit=100"
   ```
5. **Verify conversation ID**: Ensure conversation ID 6 actually exists and is correct

## Message Reception Flow

The chat shows a message was sent (last_message: "Hi"), but it's not in the messages array. This suggests:

```
✅ Last message is stored in conversation record
❌ But individual message not in chat_messages table
```

This indicates the **webhook might not be storing messages** to the `chat_messages` table, only updating the `chat_conversations.last_message` field.

Check the webhook handler to ensure it's:
1. Parsing the message correctly
2. Finding or creating the conversation
3. Inserting into `chat_messages` table
4. Updating `chat_conversations` table
