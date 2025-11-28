# Debug: Live Chat Conversations Not Showing

## Issue
Webhook is successfully saving messages to database (conversation_id=5), but frontend Live Chat UI is not displaying any conversations.

## What's Working ✅
1. **Webhook Processing**: Messages are being received and saved correctly
   - Conversation ID 5 created
   - Messages saved with correct data
   - User ID: 9332986b-424b-4d83-9559-f7c9a0e16e55
   - WABA ID: 811978564885194
   - Phone Number ID: 830558756814059

2. **Database**: Data is confirmed in database
   ```sql
   SELECT * FROM chat_conversations WHERE user_id = '9332986b-424b-4d83-9559-f7c9a0e16e55';
   -- Returns: id=5, customer_phone=917755991051, last_message=Hi, unread_count=6
   ```

3. **Authentication**: JWT middleware is working correctly
   - Extracting user_id from Supabase token
   - Adding user_id to query parameters

4. **Backend API**: Endpoints are registered and ready
   - `/api/live-chat/conversations` - protected by JWT middleware
   - `/api/live-chat/messages` - protected by JWT middleware
   - `/api/live-chat/send-message` - protected by JWT middleware

## What We're Debugging 🔍

### Added Debug Logging:

#### Backend (`live_chat_handlers.go`):
```go
log.Printf("🔍 Fetching conversations for user_id: %s", userID)
log.Printf("📝 Query: %s", query)
log.Printf("📝 Args: %v", args)
log.Printf("📩 Found conversation: ID=%d, customer=%s", conv.ID, conv.CustomerPhone)
log.Printf("✅ Returning %d conversations to frontend", len(conversations))
```

#### Frontend (`live_chat.tsx`):
```typescript
console.log('🔵 fetchConversations called');
console.log('🔵 Calling API:', url);
console.log('🔵 API Response Status:', response.status);
console.log('🔵 API Response Data:', data);
console.log('🔵 Conversations:', conversations);
console.log('🔵 Transformed Chats:', transformedChats);
```

## Next Steps

1. **Check Browser Console**: Open F12 > Console tab and look for 🔵 messages
2. **Check Server Logs**: Watch for 🔍 messages in server output
3. **Verify API Call**: Ensure frontend is actually calling the API

## Possible Issues to Check

### 1. Frontend Not Calling API
- Check if `useEffect` is running
- Check if auto-refresh interval is working
- Check if component is mounted

### 2. CORS Issues
- Verify CORS headers are set correctly
- Check browser network tab for CORS errors

### 3. Auth Token Issues
- Verify Supabase session is valid
- Check if token extraction is working

### 4. Empty Response
- API might be returning empty array
- Check if query is filtering correctly by user_id

## How to Test

### Terminal 1: Watch Server Logs
```bash
tail -f /tmp/go-server.log | grep -E "(🔍|✅|📩)"
```

### Terminal 2: Check Database
```bash
PGPASSWORD='redhat@123' psql -h localhost -U postgres -d whatsapp_saas -c "
SELECT id, customer_phone, last_message, unread_count 
FROM chat_conversations 
WHERE user_id = '9332986b-424b-4d83-9559-f7c9a0e16e55';
"
```

### Browser: Open Console
1. Navigate to http://localhost:3000/whatsapp/live-chat
2. Press F12 to open DevTools
3. Go to Console tab
4. Look for 🔵 log messages
5. Check Network tab for `/api/live-chat/conversations` request

## Expected Behavior

When working correctly:
1. Frontend logs: `🔵 fetchConversations called`
2. Frontend logs: `🔵 Calling API: http://localhost:8080/api/live-chat/conversations?limit=100`
3. Backend logs: `🔍 Fetching conversations for user_id: 9332986b-424b-4d83-9559-f7c9a0e16e55`
4. Backend logs: `📩 Found conversation: ID=5, customer=917755991051`
5. Backend logs: `✅ Returning 1 conversations to frontend`
6. Frontend logs: `🔵 API Response Data: {success: true, conversations: [...], count: 1}`
7. Frontend logs: `🔵 Transformed Chats: [{id: "5", name: "917755991051", ...}]`
8. UI displays conversation in chat list

## Quick Fix Commands

### Restart Backend with Logs
```bash
cd /Users/prasadhajare/Prasad_dev/whats_app_dev/msg-canvas-flow-main/go_server/mongo_golang
lsof -ti:8080 | xargs kill -9 2>/dev/null
nohup go run . > /tmp/go-server.log 2>&1 &
```

### Watch Logs
```bash
tail -f /tmp/go-server.log
```

### Check Frontend Dev Server
```bash
# Should be running on port 3000 or 5173
curl -I http://localhost:3000/whatsapp/live-chat
```

---

**Status**: Debugging in progress
**Last Updated**: 2025-11-26 14:25
**Server Running**: ✅ Port 8080
**Database**: ✅ Has data
**Auth**: ✅ Working
**Frontend API**: ⏳ Testing with debug logs
