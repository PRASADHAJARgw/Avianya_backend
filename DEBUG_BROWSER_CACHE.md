# 🔍 Debug: Check if Browser Has Latest Code

## Step 1: Verify Code is Updated

Open browser console (F12) and run:
```javascript
// Check if the old code is still running
console.log('=== CODE VERSION CHECK ===');
console.log('Current URL:', window.location.href);
console.log('Browser cache cleared:', performance.navigation.type === 1 ? 'YES (reload)' : 'NO (cached)');
```

## Step 2: Force Clear Everything

### Option A: Clear Site Data (Recommended)
1. Open DevTools (`F12` or `Cmd + Option + I`)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click "Clear site data" or "Clear All"
4. Close the tab completely
5. Reopen `http://localhost:5173`

### Option B: Incognito/Private Mode
1. Open a new Incognito/Private window
2. Go to `http://localhost:5173`
3. This ensures no cache is used

### Option C: Disable Cache While DevTools Open
1. Open DevTools (`F12`)
2. Go to **Network** tab
3. Check "Disable cache" checkbox
4. Keep DevTools open
5. Refresh the page

## Step 3: Verify in Console

After clearing cache and reloading, check the console for these logs:

### Initial Load (Should see ONCE):
```
🟢 LiveChat component mounted/rendered
🟢 useEffect triggered - fetching initial conversations
🔵 fetchConversations called
🔍 Fetching conversations for user_id: ...
✅ Returning 1 conversations to frontend
```

### When WebSocket Connects:
```
🔌 Connecting to WebSocket: ws://localhost:8080/ws?user_id=...
✅ WebSocket connected
✅ Live chat: WebSocket connected for real-time updates
```

###SHOULD NOT See (Every 5 Seconds):
```
❌ 🔵 fetchConversations called  (repeating)
❌ 🔍 Fetching conversations (repeating every 5s)
```

## Step 4: Test Message Send

1. Send a test message
2. Check server logs - should see:
```
📤 Sending message
📡 Broadcasting outgoing message
📡 Broadcasting conversation update
🔍 Fetching conversations ← ONLY ONCE via WebSocket
✅ Returning 1 conversations to frontend
```

## Step 5: If Still Seeing Duplicates

Run this in browser console to find the culprit:
```javascript
// Intercept fetch to see what's calling the API
const originalFetch = window.fetch;
window.fetch = function(...args) {
  if (args[0].includes('/api/live-chat/conversations')) {
    console.trace('🔍 API CALL STACK:', args[0]);
  }
  return originalFetch.apply(this, args);
};
```

Then trigger the issue and check the console stack trace to see where the call is coming from.

## Step 6: Nuclear Option - Build Fresh

If nothing works:
```bash
# Stop dev server (Ctrl+C)
cd /Users/prasadhajare/Prasad_dev/whats_app_dev/msg-canvas-flow-main

# Clear node modules and cache
rm -rf node_modules/.vite
rm -rf dist

# Restart dev server
npm run dev
```

Then hard refresh browser.

## Expected Result

After doing ALL of the above, you should see:
- ✅ Initial load: 1 API call
- ✅ WebSocket connects
- ✅ Send message: 1 API call (via WebSocket)
- ✅ No polling every 5 seconds

## If STILL Not Working

There might be another component I missed. Please share:
1. Browser console output (full log from page load)
2. Network tab (filter: `/api/live-chat/conversations`)
3. The stack trace from Step 5

This will help me find the exact source of the repeated calls.
