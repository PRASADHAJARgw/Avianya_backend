# Live Chat Data Flow Explanation

## Overview
The URL `http://localhost:3000/wa/live-chat/chats` displays a WhatsApp live chat interface where users can view conversations with their customers.

## What is "NAND" and What it Does?

The "NAND" you're seeing likely refers to **conversation data** or **contact data** being fetched from the backend. Here's the complete data flow:

### Data Flow Architecture

```
User visits: http://localhost:3000/wa/live-chat/chats
                    ↓
            LiveChatPanel Component
                    ↓
            ChatContactsClient Component
                    ↓
            useContactList Hook (Custom React Hook)
                    ↓
        Calls: GET /api/live-chat/conversations
                    ↓
            Backend (Go API @ localhost:8080)
                    ↓
        Returns: Array of BackendConversation objects
                    ↓
        Transformed to Contact objects
                    ↓
        Filtered (Active/Inactive)
                    ↓
        Displayed in ContactUI Components
```

## Component Hierarchy

### 1. **LiveChatPanel** (`/pages/whatsapp/LiveChatPanel.tsx`)
   - **Purpose**: Main container component for the live chat feature
   - **Contains**: Contact list sidebar + Chat window area
   - **Uses**: `ContactContextProvider` to manage current selected contact
   - **Children**: `ChatContactsClient` + `ContactChat`

### 2. **ChatContactsClient** (`/(authorized)/(panel)/chats/ChatContactsClient.tsx`)
   - **Purpose**: Renders the list of contacts/conversations
   - **Features**:
     - Tabs for "Active" and "Inactive" conversations
     - Infinite scroll loading
     - Contact list UI
   - **Uses**: `useContactList` hook to fetch and manage conversation data
   - **Children**: Maps over contacts and renders `ContactUI` for each

### 3. **useContactList Hook** (`/(authorized)/(panel)/chats/useContactList.ts`)
   - **Purpose**: Manages conversation/contact data fetching and state
   - **Key Functions**:
     - `getContacts()`: Fetches conversations from backend API
     - `loadMore()`: Loads additional conversations for pagination
   - **Data Source**: `http://localhost:8080/api/live-chat/conversations`
   - **Returns**: `[contacts, loadMore, isLoading]`

### 4. **ContactUI** (`/(authorized)/(panel)/chats/ContactUI.tsx`)
   - **Purpose**: Renders individual contact/conversation items
   - **Shows**: Contact name, last message, avatar, unread count, status

### 5. **ChatWindow** (`/live_chat/ChatWindow.tsx`)
   - **Purpose**: Displays the actual chat messages
   - **Contains**: Message bubbles, input area, header with contact info
   - **Children**: `MessageBubble`, `MessageInput`

## Data Types

### BackendConversation (from Go API)
```typescript
{
    id: number;
    user_id: string;
    waba_id: string;                    // WhatsApp Business Account ID
    phone_number_id: string;            // Phone number to send from
    customer_phone: string;             // Customer's WhatsApp number
    customer_name: string;              // Customer's name
    customer_profile_pic?: string;      // Customer's profile picture
    last_message: string;               // Most recent message text
    last_message_time: string;          // When last message was sent
    unread_count: number;               // Unread messages count
    status: string;                     // Conversation status
    created_at: string;                 // When conversation started
    updated_at: string;                 // Last update timestamp
}
```

### Contact (Frontend)
```typescript
{
    wa_id: string;                      // Customer's WhatsApp ID (phone)
    phone_number: string;
    name: string;
    profile_pic_url?: string;
    last_message_text: string;
    last_message_at: string;
    last_message_received_at: string;
    unread_count: number;
    in_chat: boolean;
    created_at: string;
    updated_at: string;
}
```

### ContactFE (Frontend with time calculation)
```typescript
extends Contact {
    timeSince: string | null;           // e.g., "5 mins ago", "2 hours ago"
}
```

## API Endpoint Details

### Endpoint: `GET /api/live-chat/conversations`
- **Location**: Go backend at `http://localhost:8080`
- **Authentication**: Bearer token (from Supabase session)
- **Query Parameters**:
  - `limit`: Number of conversations to fetch (default: 100)
- **Response Format**:
```json
{
    "conversations": [
        {
            "id": 1,
            "customer_phone": "+1234567890",
            "customer_name": "John Doe",
            "last_message": "Hello, how can I help?",
            "last_message_time": "2025-11-26T10:30:00Z",
            "unread_count": 0,
            ...
        }
    ]
}
```

## Key Features

### 1. **Active vs Inactive Filtering**
   - **Active**: Conversations with messages from the last 24 hours
   - **Inactive**: Conversations without messages for more than 24 hours
   - Filter logic is in `useContactList`:
     ```typescript
     isLessThanADay(new Date(c.last_message_received_at))
     ```

### 2. **Real-time Updates**
   - Polls backend every 10 seconds for new conversations
   - Updates conversation list automatically
   - Each contact's "time since" updates every 30 seconds

### 3. **Infinite Scroll**
   - Loads 100 contacts at a time
   - Loads more when user scrolls near bottom
   - Stops when no more contacts available

### 4. **Search & Filtering**
   - Can search contacts by name or message content
   - Filter by active/inactive status via tabs

## Authentication Flow

1. User logs in (Supabase Auth)
2. Session token stored in auth context
3. When fetching conversations:
   - Get current session: `supabase.auth.getSession()`
   - Extract JWT token: `session?.access_token`
   - Send in Authorization header: `Bearer ${token}`
4. Backend validates token and returns user-specific conversations

## Error Handling

- If no auth token: Shows error in console, returns empty array
- If API fails: Logs error, returns empty array
- Shows loading spinner while fetching
- Shows "No chats" message when list is empty

## Real-time Message Flow

When a message arrives:
1. Backend receives webhook from WhatsApp
2. Updates `conversations` table with new message
3. Frontend polls every 10 seconds and fetches updated list
4. UI re-renders with new message data

## Files Involved

- **Routes**: `/wa/live-chat/chats` → `LiveChatPanel`
- **Components**: 
  - `src/pages/whatsapp/LiveChatPanel.tsx`
  - `src/components/whatsapp/live_chat/(authorized)/(panel)/chats/ChatContactsClient.tsx`
  - `src/components/whatsapp/live_chat/(authorized)/(panel)/chats/ContactUI.tsx`
  - `src/components/whatsapp/live_chat/ChatWindow.tsx`
  - `src/components/whatsapp/live_chat/MessageBubble.tsx`
  - `src/components/whatsapp/live_chat/MessageInput.tsx`
- **Hooks**: 
  - `src/components/whatsapp/live_chat/(authorized)/(panel)/chats/useContactList.ts`
- **Contexts**: 
  - `src/contexts/AuthContext.tsx` (Authentication)
  - `CurrentContactContext.tsx` (Selected contact state)
- **Backend**: 
  - `go_server/mongo_golang/live_chat_handlers.go` (API handlers)
  - Database: Conversations table in MongoDB

## Summary

**NAND** in your context = **Backend API Data / Conversation Objects**

When you visit the live chat page, the system:
1. ✅ Authenticates the user
2. ✅ Fetches all conversations from the Go backend API
3. ✅ Transforms backend data to frontend format
4. ✅ Filters conversations (Active/Inactive)
5. ✅ Displays them in the contact list
6. ✅ Allows users to click and view full chat history
7. ✅ Sends and receives messages via WhatsApp API
