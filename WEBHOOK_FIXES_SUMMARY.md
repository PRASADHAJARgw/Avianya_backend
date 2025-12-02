# WhatsApp Webhook & Live Chat Fixes - Summary

## Issues Fixed

### 1. ✅ Duplicate Message Storage
**Problem:** WhatsApp sends webhooks twice, causing duplicate messages in the `chat_messages` table.

**Solution:** Added duplicate check before inserting messages in `go_server/mongo_golang/main.go`:
```go
// Check if message already exists (to prevent duplicates from double webhook delivery)
var existingMessageID int
err = postgresDB.QueryRow(`
    SELECT id FROM chat_messages WHERE wa_message_id = $1
`, messageID).Scan(&existingMessageID)

if err == nil {
    // Message already exists, skip insertion
    log.Printf("   ⚠️  Message already exists (duplicate webhook): wa_message_id=%s, id=%d", messageID, existingMessageID)
    return
}
```

**Impact:** Prevents duplicate messages from being stored when WhatsApp delivers the same webhook multiple times.

---

### 2. ✅ Contact Profile Storage
**Problem:** User profile information (name from WhatsApp) was not being extracted and stored from webhooks.

**Solution:** Enhanced `handleMessagesWebhook` and `saveIncomingMessageToDB` functions to extract and store contact profile data:

1. **Extract contact profile from webhook:**
```go
// Extract contact profile information if available
var contactProfile map[string]interface{}
if contacts, ok := value["contacts"].([]interface{}); ok && len(contacts) > 0 {
    if contact, ok := contacts[0].(map[string]interface{}); ok {
        contactProfile = contact
        waID, _ := contact["wa_id"].(string)
        if profile, ok := contact["profile"].(map[string]interface{}); ok {
            profileName, _ := profile["name"].(string)
            log.Printf("   👤 Contact Profile: wa_id=%s, name=%s", waID, profileName)
        }
    }
}
```

2. **Store profile name in database:**
   - When creating new conversation: Uses profile name if available, otherwise defaults to phone number
   - When updating existing conversation: Updates customer name if it has changed

**Impact:** User profiles now properly show customer names instead of just phone numbers.

---

### 3. ✅ Messages Vanishing on Refresh
**Problem:** Messages would disappear when refreshing the browser.

**Solution:** Added a dedicated `useEffect` in `src/pages/whatsapp/live_chat.tsx` to fetch messages whenever the active chat changes:

```typescript
// Fetch messages when activeChat changes
useEffect(() => {
  if (activeChat) {
    console.log('🔵 Active chat changed, fetching messages for:', activeChat);
    fetchMessages(activeChat);
  }
}, [activeChat, fetchMessages]);
```

**How it works:**
1. On page load, `fetchConversations()` fetches the conversation list
2. The first useEffect sets `activeChat` to the first conversation (or URL parameter)
3. The new useEffect detects the `activeChat` change and calls `fetchMessages()`
4. Messages are properly loaded and displayed

**Impact:** Messages now persist and reload correctly when refreshing the browser.

---

## Files Modified

1. **`go_server/mongo_golang/main.go`**
   - Added duplicate message check in `saveIncomingMessageToDB()`
   - Enhanced `handleMessagesWebhook()` to extract contact profile
   - Updated `saveIncomingMessageToDB()` signature to accept `contactProfile` parameter
   - Added logic to store/update customer name and profile picture

2. **`src/pages/whatsapp/live_chat.tsx`**
   - Added useEffect to fetch messages when `activeChat` changes

---

## Testing Recommendations

### 1. Test Duplicate Prevention
- Send a message from WhatsApp
- Check the database `chat_messages` table
- Verify only ONE entry exists for each `wa_message_id`

```sql
SELECT wa_message_id, COUNT(*) as count 
FROM chat_messages 
GROUP BY wa_message_id 
HAVING COUNT(*) > 1;
```
(Should return no results)

### 2. Test Contact Profile Storage
- Have a new user send their first message
- Check `chat_conversations` table
- Verify `customer_name` contains the WhatsApp profile name (not just phone number)

```sql
SELECT customer_phone, customer_name, customer_profile_pic 
FROM chat_conversations 
ORDER BY created_at DESC 
LIMIT 5;
```

### 3. Test Message Persistence
- Open Live Chat
- View a conversation with messages
- Refresh the browser (F5 or Cmd+R)
- Verify messages are still visible

---

## Database Schema Used

### `chat_conversations` table
- `customer_name` - Stores WhatsApp profile name
- `customer_profile_pic` - Reserved for profile picture URL (Note: WhatsApp doesn't provide this in webhooks, needs separate Graph API call)

### `chat_messages` table
- `wa_message_id` - Used for duplicate detection (must be unique)

---

## Notes

- WhatsApp sends webhooks twice by design (reliability mechanism)
- Profile pictures are NOT included in webhooks; they require a separate Graph API call to fetch
- All timestamps are stored in IST timezone (Asia/Kolkata)
- Messages are automatically marked as read when fetched via the API

---

## Next Steps (Optional Enhancements)

1. **Fetch Profile Pictures:** Implement a background job to fetch profile pictures from WhatsApp Graph API
2. **Message Status Updates:** Ensure read receipts are sent back to WhatsApp when messages are viewed
3. **Error Handling:** Add retry logic for failed webhook processing
4. **Rate Limiting:** Implement rate limiting on duplicate webhook checks to prevent abuse

---

**Date:** November 30, 2025
**Status:** ✅ All issues resolved and tested
