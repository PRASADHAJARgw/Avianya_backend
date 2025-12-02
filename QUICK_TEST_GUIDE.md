# Quick Test Instructions

## Testing the Fixes

### Start the Backend
```bash
cd go_server/mongo_golang
./backend
```

### Testing Steps

#### 1. Test Duplicate Prevention
1. Send a message from your WhatsApp to the business number
2. Check the terminal logs - you should see:
   - First webhook: `✅ Saved message to database`
   - Second webhook: `⚠️ Message already exists (duplicate webhook)`
3. Verify in database:
   ```sql
   SELECT wa_message_id, COUNT(*) as count 
   FROM chat_messages 
   GROUP BY wa_message_id 
   HAVING COUNT(*) > 1;
   ```
   Should return **0 results** (no duplicates)

#### 2. Test Contact Profile Storage
1. Have a NEW contact (someone who hasn't messaged before) send a message
2. Check the terminal logs for:
   ```
   👤 Contact Profile: wa_id=..., name=...
   📝 Using profile name: ...
   ```
3. Check database:
   ```sql
   SELECT customer_phone, customer_name 
   FROM chat_conversations 
   ORDER BY created_at DESC 
   LIMIT 1;
   ```
   The `customer_name` should show the WhatsApp profile name, not just the phone number

#### 3. Test Message Persistence
1. Open the Live Chat in your browser
2. View a conversation - you should see messages
3. **Refresh the page** (F5 or Cmd+R)
4. Messages should **still be visible** after refresh
5. Check browser console for:
   ```
   🔵 Active chat changed, fetching messages for: ...
   ```

### Expected Terminal Output for New Message

```
📥 WEBHOOK RECEIVED:
   Method: POST
   📱 Processing WhatsApp Business Account webhook
   Field: messages
   📞 Phone Number: 917755991053 (ID: 830558756814059)
   👤 Contact Profile: wa_id=917755991051, name=Prasad Hajare
   📩 Incoming Message:
      From: 917755991051
      ID: wamid.HBg...
      Type: text
      Text: Hi
   🔍 Found user_id: ..., waba_id: ... for phone_number_id: ...
   📝 Using profile name: Prasad Hajare
   ✅ Created new conversation ID: 18 for 917755991051 (name: Prasad Hajare)
   ✅ Saved message to database: conversation_id=18, message_id=wamid.HBg..., media_url=
   📡 Broadcasting new message: conversation_id=18, user_id=...
```

### If Webhook Comes Twice (Expected)

```
📥 WEBHOOK RECEIVED:  (first time)
   ...
   ✅ Saved message to database: conversation_id=18, message_id=wamid.HBg...
   
📥 WEBHOOK RECEIVED:  (second time - same message)
   ...
   ⚠️ Message already exists (duplicate webhook): wa_message_id=wamid.HBg..., id=500
```

## Troubleshooting

### Issue: Messages not showing after refresh
**Check:**
1. Browser console for errors
2. Check if `activeChat` is being set (look for log: `🔵 Active chat changed`)
3. Verify API is responding: `http://localhost:8080/api/live-chat/conversations?limit=100`

### Issue: Still seeing duplicate messages
**Check:**
1. Database for unique constraint on `wa_message_id`
2. Make sure you're using the latest build (`go build -o backend`)
3. Restart the backend server

### Issue: Profile name not updating
**Check:**
1. WhatsApp webhook is including the `contacts` array
2. Terminal logs show: `👤 Contact Profile: wa_id=..., name=...`
3. If not, the webhook might not include profile data for existing contacts

## Database Queries for Verification

### Check for duplicate messages
```sql
SELECT wa_message_id, COUNT(*) as duplicate_count
FROM chat_messages
GROUP BY wa_message_id
HAVING COUNT(*) > 1;
```

### Check recent conversations with profile data
```sql
SELECT 
    customer_phone,
    customer_name,
    last_message,
    unread_count,
    created_at
FROM chat_conversations
ORDER BY updated_at DESC
LIMIT 10;
```

### Check recent messages
```sql
SELECT 
    cm.conversation_id,
    cm.wa_message_id,
    cm.content,
    cm.sender,
    cm.timestamp,
    cc.customer_name
FROM chat_messages cm
JOIN chat_conversations cc ON cm.conversation_id = cc.id
ORDER BY cm.timestamp DESC
LIMIT 10;
```

---

**All tests should pass!** ✅
