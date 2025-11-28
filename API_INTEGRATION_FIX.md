# API Backend Integration Fix

## Issue Fixed ✅

**Problem:** The live chat was trying to send messages to `/api/sendMessage` but there's no API route in the Vite app, and the backend is running on port 8080.

**Error:** `Failed to load resource: the server responded with a status of 404 (Not Found)`

## Solution Implemented

### 1. Added Backend URL Configuration

**File:** `.env`
```properties
# Backend API Configuration  
VITE_API_BASE_URL=http://localhost:8080
```

### 2. Created API Client Utility

**File:** `src/lib/api-client.ts`
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const apiClient = {
  async post(endpoint: string, data: FormData | Record<string, unknown>) {
    // Handles both FormData and JSON requests
    // Points to your backend on port 8080
  },
  async get(endpoint: string) {
    // GET request utility
  }
};
```

### 3. Updated Message Sending Components

**Files Updated:**
- `src/components/whatsapp/live_chat/(authorized)/(panel)/chats/[wa_id]/SendMessageWrapper.tsx`
- `src/components/whatsapp/live_chat/(authorized)/(panel)/chats/[wa_id]/page.tsx`

**Changes:**
- Replaced `fetch('/api/sendMessage', ...)` with `apiClient.post('/api/sendMessage', ...)`
- Both regular messages and template messages now point to `http://localhost:8080/api/sendMessage`

## How It Works Now

1. **User clicks contact** → Chat window opens
2. **User types message** → Click send
3. **Frontend** → Makes POST request to `http://localhost:8080/api/sendMessage`
4. **Backend** → Processes the message (you handle this)
5. **Response** → Frontend shows success/error

## Message Format

The frontend sends messages in this format:

### Regular Messages:
```javascript
FormData:
- to: "917755991051" (phone number)
- message: "Hello there!"
- file: (File object, if sending media)
- fileType: "image" | "video" | "document" (if sending media)
```

### Template Messages:
```javascript
FormData:
- to: "917755991051" 
- template: JSON.stringify({
    template_id: "hello_world",
    template_name: "Hello World", 
    language: "en",
    parameters: {...}
})
```

## Testing

✅ **Contact Selection**: Working - contacts show and can be clicked
✅ **Chat Window**: Working - shows when contact selected  
✅ **API Calls**: Fixed - now points to port 8080
✅ **Message UI**: Working - send button and template button ready

## Next Steps

Your **backend on port 8080** needs to handle:

1. **POST `/api/sendMessage`** endpoint that accepts:
   - Regular messages with `to`, `message`, optional `file`/`fileType`
   - Template messages with `to`, `template` (JSON string)

2. **Response format**: HTTP 200 for success, anything else for error

## Backend Example (if needed)

```javascript
// Example Express.js handler
app.post('/api/sendMessage', (req, res) => {
  const { to, message, template } = req.body;
  
  if (message) {
    // Handle regular message
    console.log(`Send to ${to}: ${message}`);
  } else if (template) {
    // Handle template message  
    const templateData = JSON.parse(template);
    console.log(`Send template to ${to}:`, templateData);
  }
  
  res.status(200).json({ success: true });
});
```

**The live chat should now work perfectly with your backend! 🎉**