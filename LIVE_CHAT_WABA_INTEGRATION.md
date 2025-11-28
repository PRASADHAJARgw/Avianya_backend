# Live Chat WABA Integration Plan

## Overview
Integrate Live Chat with actual WABA accounts and phone numbers from the database, so users can see and manage real WhatsApp conversations.

## Current State
- ✅ Authentication working with Supabase JWT
- ✅ WABA accounts stored in `waba_accounts` table
- ✅ Phone numbers stored in `phone_numbers` table
- ❌ Live Chat using mock data
- ❌ No real chat messages from WhatsApp

## Database Schema

### Tables Needed

#### 1. `waba_accounts`
```sql
- waba_id (PK)
- user_id (FK to users)
- owner_business_id
- access_token (encrypted)
- created_at
```

#### 2. `phone_numbers`
```sql
- id (PK)
- waba_id (FK)
- phone_number_id
- display_phone_number
- verified_name
- is_registered
```

#### 3. `chat_conversations` (NEW - Need to create)
```sql
CREATE TABLE IF NOT EXISTS chat_conversations (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    waba_id VARCHAR(255) NOT NULL,
    phone_number_id VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_name VARCHAR(255),
    last_message TEXT,
    last_message_time TIMESTAMP,
    unread_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(waba_id, phone_number_id, customer_phone)
);
```

#### 4. `chat_messages` (NEW - Need to create)
```sql
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL REFERENCES chat_conversations(id),
    message_id VARCHAR(255) UNIQUE,
    wa_message_id VARCHAR(255), -- WhatsApp message ID
    content TEXT,
    message_type VARCHAR(50) DEFAULT 'text', -- text, image, video, document, audio
    media_url TEXT,
    sender VARCHAR(50) NOT NULL, -- 'user' or 'customer'
    status VARCHAR(50) DEFAULT 'sent', -- sent, delivered, read, failed
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);
```

## Implementation Steps

### Phase 1: Database Setup ✅ (To Do)
1. Create `chat_conversations` table
2. Create `chat_messages` table
3. Create indexes for performance

### Phase 2: Backend API Endpoints ✅ (To Do)

#### A. Get Chat Conversations
```
GET /api/live-chat/conversations?user_id={user_id}&phone_number_id={phone_number_id}
```
Response:
```json
{
  "success": true,
  "conversations": [
    {
      "id": 1,
      "customer_phone": "+1234567890",
      "customer_name": "John Doe",
      "last_message": "Hello!",
      "last_message_time": "2025-11-26T01:00:00Z",
      "unread_count": 2,
      "status": "active"
    }
  ]
}
```

#### B. Get Messages for Conversation
```
GET /api/live-chat/messages?conversation_id={id}&limit=50&offset=0
```
Response:
```json
{
  "success": true,
  "messages": [
    {
      "id": 1,
      "content": "Hello!",
      "message_type": "text",
      "sender": "customer",
      "timestamp": "2025-11-26T01:00:00Z",
      "status": "delivered"
    }
  ]
}
```

#### C. Send Message
```
POST /api/live-chat/send-message
Body:
{
  "conversation_id": 1,
  "phone_number_id": "123456",
  "to": "+1234567890",
  "message": "Hello!",
  "message_type": "text"
}
```

#### D. Webhook Handler for Incoming Messages
```
POST /api/webhooks/whatsapp
```
- Receives WhatsApp incoming messages
- Stores in database
- Can trigger real-time updates

### Phase 3: Frontend Updates ✅ (To Do)

1. Update `live_chat.tsx` to fetch real data
2. Connect to WebSocket for real-time updates
3. Integrate with selected phone number from Header
4. Handle message sending through API

### Phase 4: Real-time Features ✅ (Future)

1. WebSocket connection for instant message delivery
2. Typing indicators
3. Message status updates (sent/delivered/read)
4. Push notifications

## Quick Start Implementation

### Step 1: Create Database Tables

Run this SQL in your PostgreSQL:

```sql
-- Chat Conversations Table
CREATE TABLE IF NOT EXISTS chat_conversations (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    waba_id VARCHAR(255) NOT NULL,
    phone_number_id VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_name VARCHAR(255),
    customer_profile_pic TEXT,
    last_message TEXT,
    last_message_time TIMESTAMP,
    unread_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(waba_id, phone_number_id, customer_phone)
);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    message_id VARCHAR(255) UNIQUE,
    wa_message_id VARCHAR(255),
    content TEXT,
    message_type VARCHAR(50) DEFAULT 'text',
    media_url TEXT,
    media_caption TEXT,
    sender VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'sent',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_conversations_user_id ON chat_conversations(user_id);
CREATE INDEX idx_conversations_waba_phone ON chat_conversations(waba_id, phone_number_id);
CREATE INDEX idx_conversations_updated ON chat_conversations(updated_at DESC);
CREATE INDEX idx_messages_conversation ON chat_messages(conversation_id, timestamp DESC);
CREATE INDEX idx_messages_wa_id ON chat_messages(wa_message_id);
```

### Step 2: Add Backend Endpoints

I'll create the Go handlers for:
- Getting conversations
- Getting messages
- Sending messages
- Webhook handler for incoming messages

### Step 3: Update Frontend

Modify `live_chat.tsx` to:
- Fetch conversations from API
- Load messages from database
- Send messages through API
- Handle real-time updates

## Benefits

1. ✅ Real WhatsApp conversations
2. ✅ Message history persistence
3. ✅ Multi-user support (each user sees their own chats)
4. ✅ Multi-phone support (select phone number from Header)
5. ✅ Message status tracking
6. ✅ Scalable architecture
7. ✅ Ready for real-time features

## Next Steps

1. **Run SQL to create tables** ✅ 
2. **Implement backend endpoints** ✅
3. **Update frontend to use real data** ✅
4. **Test with actual WhatsApp messages** ✅
5. **Add real-time WebSocket support** (Future)

Would you like me to proceed with implementing these changes?
