# 🔍 Header WABA Connection - Debugging Guide

## Current Issue: "Not Connected" showing in Header

### ✅ Quick Checklist

1. **Check if user is authenticated**
   - Open browser console (F12)
   - Look for log: `🔍 Fetching WABA status for user: <user_id>`
   - If you see: `❌ No authenticated user found` → User not logged in properly

2. **Check backend is running**
   - Look for log: `🔗 Backend URL: http://localhost:8080`
   - Look for log: `🔑 Token exists: true`
   - Try opening: http://localhost:8080 (should see "ok" or redirect)

3. **Check WABA status API**
   - Look for log: `📊 Status response status: 200`
   - Look for log: `✅ WABA status data: {...}`
   - If you see error status (401, 403, 404, 500) → Backend issue

4. **Check if WABA exists in database**
   - Look for: `connected: true` in status data
   - Look for: `accounts: [...]` with at least one account
   - If empty → No WABA registered for this user

---

## 🐛 Common Issues & Solutions

### Issue 1: "No authenticated user found"
**Symptoms:**
```
Console shows:
❌ No authenticated user found
```

**Solution:**
- Check if you're logged in (look at top-right of screen)
- If not logged in, go to `/login`
- After login, refresh the page

---

### Issue 2: "403 Forbidden" or "401 Unauthorized"
**Symptoms:**
```
Console shows:
📊 Status response status: 403
❌ Failed to fetch WABA status: 403 Forbidden
```

**Solution:**
- JWT token might be invalid or expired
- Log out and log back in
- Check if `localStorage.getItem('access_token')` exists in console

---

### Issue 3: "No accounts found"
**Symptoms:**
```
Console shows:
✅ WABA status data: { connected: false, accounts: [] }
⚠️ No accounts found or not connected
```

**Solution A: WABA not connected yet**
1. Go to Dashboard: http://localhost:3000/wa/dashboard
2. Click "Connect WABA" button
3. Complete Facebook OAuth
4. Wait for success message
5. Refresh Header (click refresh icon in account selector)

**Solution B: WABA connected but using wrong user_id**
Run the fix script:
```bash
./FIX_WABA_MAPPING.sh <your_user_id>
```

Get your user_id from browser console:
```javascript
// Run this in console:
localStorage.getItem('access_token')
// Then decode the JWT at jwt.io to see your user_id
```

---

### Issue 4: Backend not responding
**Symptoms:**
```
Console shows:
❌ Error fetching WABA accounts: Failed to fetch
```

**Solution:**
1. Check if Go server is running:
   ```bash
   # Should see output like:
   Starting server on :8080
   Successfully connected to PostgreSQL...
   ```

2. If not running, start it:
   ```bash
   cd go_server/mongo_golang
   go run .
   ```

3. Check if backend URL is correct:
   - Open `.env` file
   - Verify `VITE_BACKEND_URL=http://localhost:8080`

---

## 🧪 Manual Testing Steps

### Step 1: Check User Authentication
```javascript
// In browser console:
console.log('User ID:', localStorage.getItem('access_token'));

// Or check Supabase session:
import { supabase } from '@/lib/supabase/client';
const { data } = await supabase.auth.getSession();
console.log('User:', data.session?.user);
```

### Step 2: Test WABA Status API Manually
```javascript
// In browser console:
const userId = 'YOUR_USER_ID_HERE'; // Replace with your actual user ID
const token = localStorage.getItem('access_token');

fetch(`http://localhost:8080/api/waba/status?user_id=${userId}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
})
  .then(r => r.json())
  .then(data => console.log('WABA Status:', data));
```

Expected response:
```json
{
  "success": true,
  "user_id": "9332986b-424b-4d83-9559-f7c9a0e16e55",
  "connected": true,
  "accounts": [
    {
      "waba_id": "811978564885194",
      "owner_business_id": "1786936435511275",
      "is_active": true,
      "phone_count": 1
    }
  ],
  "total_wabas": 1
}
```

### Step 3: Check Database Directly
```sql
-- Connect to PostgreSQL
psql postgresql://postgres:postgres@localhost:5432/whatsapp_saas

-- Check WABA accounts
SELECT 
    waba_id, 
    user_id, 
    owner_business_id,
    created_at
FROM waba_accounts
ORDER BY created_at DESC;

-- Should show:
-- waba_id          | user_id                              | owner_business_id
-- 811978564885194  | 9332986b-424b-4d83-9559-f7c9a0e16e55 | 1786936435511275
```

---

## 🔄 Quick Refresh Actions

### Action 1: Refresh WABA Data in Header
1. Click on the WhatsApp Account selector dropdown
2. Click the refresh icon (🔄) next to the dropdown title
3. Wait for loading spinner
4. Check console for new logs

### Action 2: Force Refresh from Dashboard
1. Go to Dashboard: http://localhost:3000/wa/dashboard
2. Click "Connect WABA" (even if already connected)
3. This will re-fetch WABA data
4. Navigate back to see updated Header

### Action 3: Full Page Refresh
```javascript
// In console or add button:
window.location.reload();
```

---

## 📊 Expected Console Output (Success)

```
🔍 Fetching WABA status for user: 9332986b-424b-4d83-9559-f7c9a0e16e55
🔗 Backend URL: http://localhost:8080
🔑 Token exists: true
📊 Status response status: 200
✅ WABA status data: { connected: true, accounts: [...], total_wabas: 1 }
📱 Fetching phone numbers for WABA: 811978564885194
📞 Phone data: { success: true, phone_numbers: [...] }
📋 Final accounts with phones: [{ id: "811978564885194", name: "...", phone: "+91 ...", ... }]
✅ Auto-selected first account: { id: "811978564885194", ... }
```

---

## 🆘 Still Not Working?

### Last Resort: Complete Reset

1. **Clear localStorage**
   ```javascript
   localStorage.clear();
   ```

2. **Log out and log back in**
   - Go to /login
   - Enter credentials
   - Log in

3. **Reconnect WABA**
   - Go to Dashboard
   - Click "Connect WABA"
   - Complete OAuth

4. **Check database**
   ```bash
   ./FIX_WABA_MAPPING.sh <your_user_id>
   ```

5. **Restart everything**
   ```bash
   # Terminal 1: Stop and restart Go server
   cd go_server/mongo_golang
   go run .
   
   # Terminal 2: Stop and restart frontend
   npm run dev
   ```

6. **Hard refresh browser**
   - Press Ctrl+Shift+R (Windows/Linux)
   - Press Cmd+Shift+R (Mac)

---

## 📝 Report Issue Template

If still not working, provide these details:

```
**Browser Console Logs:**
[Paste all logs starting with 🔍, ❌, ✅]

**Backend Logs:**
[Paste Go server logs showing OAuth and webhook]

**Database Query Result:**
[Run: SELECT * FROM waba_accounts WHERE user_id = 'YOUR_ID']

**Environment:**
- Backend URL: [from console log]
- User ID: [from console log]
- Token exists: [true/false from console log]
- WABA Status API: [200/403/404/500]

**Steps Taken:**
1. [List what you tried]
2. [...]
```

---

**Most Common Fix:** Run the orphan WABA fix script! 🎯
```bash
./FIX_WABA_MAPPING.sh <your_user_id>
```
