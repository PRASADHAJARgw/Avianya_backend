# 🎯 WABA "Not Connected" Issue - Quick Fix Guide

## Current Situation

✅ **Backend is working perfectly:**
- OAuth flow completed successfully
- WABA `811978564885194` stored for user `9332986b-424b-4d83-9559-f7c9a0e16e55`
- Phone number `+91 77559 91053` registered
- Business ID: `1786936435511275`

❌ **Frontend showing "Not Connected" in Header**

---

## 🔍 Root Cause Analysis

The issue is likely one of these:

1. **JWT Token Issue:** Token expired or not being sent correctly
2. **User ID Mismatch:** Frontend using different user ID than backend
3. **CORS Issue:** Browser blocking the API request
4. **API Response Format:** Frontend not parsing response correctly

---

## ✅ Quick Fix Steps

### Step 1: Open Browser DevTools

1. Open your app: **http://localhost:3001**
2. Press **F12** (or Cmd+Option+I on Mac)
3. Go to **Console** tab
4. Look for these logs:

```
🔍 Fetching WABA status for user: 9332986b-424b-4d83-9559-f7c9a0e16e55
🔗 Backend URL: http://localhost:8080
🔑 Token exists: true
📊 Status response status: 200
✅ WABA status data: { connected: true, accounts: [...] }
```

### Step 2: Check What You See

#### ✅ If you see "Status response status: 200":
- Good! API is working
- Look at the `WABA status data` log
- Check if `connected: true` and `accounts: [...]` is not empty
- **If connected is true but still shows "Not Connected"**, there's a UI state issue

#### ❌ If you see "Status response status: 401" or "403":
```bash
# Your token expired. Get a new one:
1. Log out from the app
2. Log back in
3. Refresh the page
```

#### ❌ If you see "No authenticated user found":
```bash
# User not logged in properly
1. Go to: http://localhost:3001/login
2. Log in with your credentials
3. After login, check the Header again
```

#### ❌ If you see "Failed to fetch" or network error:
```bash
# Backend not responding
cd go_server/mongo_golang
go run .

# Wait for: "Starting server on :8080"
```

---

## 🧪 Manual API Test

Run this script to test the API directly:

```bash
./test_waba_api.sh
```

This will:
1. Ask for your JWT token
2. Test the `/api/waba/status` endpoint
3. Test the `/api/waba/phone-numbers` endpoint
4. Show you exactly what the API returns

**To get your JWT token:**
1. Open browser DevTools (F12)
2. Console tab
3. Type: `localStorage.getItem('access_token')`
4. Copy the token value (without quotes)

---

## 🔧 Force Refresh Frontend Data

If the API is working but UI still shows "Not Connected":

### Method 1: Use the Refresh Button
1. Click on the WhatsApp Account dropdown (top-right)
2. Click the **🔄 refresh icon** next to the dropdown title
3. Wait for the spinner to finish
4. Check if it now shows connected

### Method 2: Hard Refresh Browser
```bash
# Windows/Linux
Ctrl + Shift + R

# Mac
Cmd + Shift + R
```

### Method 3: Clear Cache and Reload
```javascript
// In browser console, run:
localStorage.clear();
window.location.reload();

// Then log in again
```

---

## 🐛 Debug Console Logs

Run this in your browser console to see what's happening:

```javascript
// Check if user is authenticated
console.log('User ID:', localStorage.getItem('access_token'));

// Manually fetch WABA status
const userId = '9332986b-424b-4d83-9559-f7c9a0e16e55';
const token = localStorage.getItem('access_token');
const backendUrl = 'http://localhost:8080';

fetch(`${backendUrl}/api/waba/status?user_id=${userId}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
})
  .then(r => r.json())
  .then(data => {
    console.log('✅ WABA Status:', data);
    console.log('Connected:', data.connected);
    console.log('Accounts:', data.accounts);
    console.log('Total WABAs:', data.total_wabas);
  })
  .catch(err => console.error('❌ Error:', err));
```

---

## 📊 Expected API Response

When working correctly, you should see:

```json
{
  "success": true,
  "user_id": "9332986b-424b-4d83-9559-f7c9a0e16e55",
  "connected": true,
  "accounts": [
    {
      "waba_id": "811978564885194",
      "owner_business_id": "1786936435511275",
      "phone_count": 1,
      "registered_count": 1,
      "is_active": true,
      "created_at": "2025-11-26T01:13:12Z"
    }
  ],
  "total_wabas": 1
}
```

---

## 🔍 Check Database Directly

To verify WABA is actually in the database:

```bash
cd go_server/mongo_golang

# Connect to PostgreSQL
PGPASSWORD=postgres psql -h localhost -U postgres -d whatsapp_saas -c "
SELECT 
    waba_id, 
    user_id, 
    owner_business_id,
    created_at,
    (SELECT COUNT(*) FROM phone_numbers WHERE waba_id = waba_accounts.waba_id) as phone_count
FROM waba_accounts 
WHERE user_id = '9332986b-424b-4d83-9559-f7c9a0e16e55';
"
```

**Expected output:**
```
     waba_id      |               user_id                | owner_business_id  |         created_at          | phone_count
------------------+--------------------------------------+--------------------+-----------------------------+-------------
 811978564885194  | 9332986b-424b-4d83-9559-f7c9a0e16e55 | 1786936435511275   | 2025-11-26 01:13:12.123456  | 1
```

---

## 🎯 Most Likely Issues & Quick Fixes

### Issue 1: Token Expired
**Symptom:** Console shows `403 Forbidden` or `401 Unauthorized`

**Fix:**
```bash
1. Log out from the app
2. Log back in
3. Refresh the page
```

---

### Issue 2: User Not Logged In
**Symptom:** Console shows `❌ No authenticated user found`

**Fix:**
```bash
1. Go to: http://localhost:3001/login
2. Enter your credentials
3. After login, Header should update automatically
```

---

### Issue 3: Frontend Cached Old Data
**Symptom:** Console shows old/stale data or nothing at all

**Fix:**
```javascript
// In console:
localStorage.clear();
window.location.reload();

// Then log in again
```

---

### Issue 4: Wrong Port
**Symptom:** Frontend trying to connect to wrong backend URL

**Fix:**
```bash
# Check .env file
cat .env | grep VITE_BACKEND_URL

# Should show:
# VITE_BACKEND_URL=http://localhost:8080

# If missing or wrong, add:
echo "VITE_BACKEND_URL=http://localhost:8080" >> .env

# Then restart frontend:
npm run dev
```

---

## 🚀 Complete Reset (Last Resort)

If nothing works, do a complete reset:

```bash
# 1. Stop all servers
# Ctrl+C in all terminal windows

# 2. Clear browser data
# In browser console:
localStorage.clear();
sessionStorage.clear();

# 3. Restart backend
cd go_server/mongo_golang
go run .

# 4. Restart frontend (in new terminal)
cd /Users/prasadhajare/Prasad_dev/whats_app_dev/msg-canvas-flow-main
npm run dev

# 5. Open fresh browser window (incognito mode)
# Go to: http://localhost:3001

# 6. Log in with your credentials

# 7. Check Header - should show connected now
```

---

## 📝 What to Share If Still Not Working

If you've tried everything and it's still not working, share these details:

```bash
# 1. Run the test script
./test_waba_api.sh
# Paste the full output

# 2. Browser console logs
# Copy all logs starting with 🔍, ❌, ✅

# 3. Backend logs
# Copy the last 50 lines from the Go server terminal

# 4. Database check
PGPASSWORD=postgres psql -h localhost -U postgres -d whatsapp_saas -c "
SELECT waba_id, user_id, owner_business_id 
FROM waba_accounts 
WHERE user_id = '9332986b-424b-4d83-9559-f7c9a0e16e55';
"

# 5. Environment check
echo "Frontend URL: $(cat .env | grep VITE_BACKEND_URL)"
echo "Backend running: $(curl -s http://localhost:8080 && echo 'YES' || echo 'NO')"
```

---

## ✅ Success Indicators

You'll know it's working when you see:

1. **In Browser Console:**
   ```
   ✅ WABA status data: { connected: true, accounts: [...], total_wabas: 1 }
   ✅ Auto-selected first account: { id: "811978564885194", ... }
   ```

2. **In Header UI:**
   - WhatsApp Account selector has **green border**
   - Shows phone number: **+91 77559 91053**
   - No red alert icon

3. **In Dropdown:**
   - Shows WABA account with phone number
   - No "Not Connected" message

---

## 🎉 Quick Test

After following any fix:

1. Open: http://localhost:3001
2. Look at top-right Header
3. Click on WhatsApp Account dropdown
4. Should see:
   - ✅ Green border around button
   - ✅ Phone number displayed
   - ✅ Account in dropdown list

---

**Need help?** Run `./test_waba_api.sh` and share the output!
