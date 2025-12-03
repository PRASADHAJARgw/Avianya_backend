# 🔧 Quick Fix Guide - Login Not Working

## Issue
After clicking "Sign In", the page doesn't redirect to the dashboard.

## Solution

### Step 1: Open Browser Console
1. Open your browser's Developer Tools (F12 or Right-click → Inspect)
2. Go to the **Console** tab
3. Try logging in again
4. Look for console messages starting with 🔐, ✅, or ❌

### Step 2: Check Console Logs

You should see:
```
🔐 Attempting login... your@email.com
✅ Login successful!
🚀 Navigating to dashboard...
```

### Common Issues & Fixes

#### Issue 1: CORS Error
**Error:** `Access to fetch at 'http://localhost:8080/api/v2/auth/login' from origin 'http://localhost:3000' has been blocked by CORS`

**Fix:**
Backend CORS is already configured. If you see this, the backend might not be running.

Check backend:
```bash
lsof -i :8080
```

If not running, start it:
```bash
cd go_server/mongo_golang
./mongo_golang
```

#### Issue 2: Network Error
**Error:** `Failed to fetch` or `Network request failed`

**Fix:**
1. Check backend is running: `curl http://localhost:8080/api/v2/auth/login`
2. Check your internet connection
3. Check if port 8080 is accessible

#### Issue 3: 404 Not Found
**Error:** `404` or `Cannot POST /api/v2/auth/login`

**Fix:**
Backend routes might not be registered. Check server logs:
```bash
tail -f go_server/mongo_golang/server.log
```

Should show:
```
✅ Multi-tenant authentication routes registered
```

#### Issue 4: 401 Unauthorized
**Error:** `Invalid credentials`

**Fix:**
- Check email and password are correct
- Try creating a new account first
- Or use test credentials: `quickstart@example.com` / `password123`

#### Issue 5: Password too short
**Error:** `password must be at least 8 characters`

**Fix:**
Use a password with 8+ characters.

---

## Quick Test

### 1. Test Backend Directly
```bash
# Test signup
curl -X POST http://localhost:8080/api/v2/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@test.com",
    "password":"password123",
    "name":"Test User",
    "organization_name":"Test Org"
  }' | jq .

# Test login
curl -X POST http://localhost:8080/api/v2/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@test.com",
    "password":"password123"
  }' | jq .
```

### 2. Check Auth Store
Open browser console and type:
```javascript
localStorage.getItem('auth-storage')
```

After successful login, you should see user data and token.

### 3. Check Network Tab
1. Open Developer Tools → **Network** tab
2. Try logging in
3. Look for request to `localhost:8080/api/v2/auth/login`
4. Check:
   - Status: Should be `200 OK`
   - Response: Should have `token` and `user` fields

---

## Manual Navigation Test

If login works but navigation doesn't, try manually:

1. Login successfully
2. Open console
3. Type:
```javascript
window.location.href = '/wa/dashboard'
```

If this works, the issue is with React Router navigation.

---

## Check Dashboard Route

Make sure the dashboard route exists in your router:
```tsx
<Route path="/wa/dashboard" element={<Dashboard />} />
```

---

## Console Commands for Testing

### Check if logged in:
```javascript
const authData = JSON.parse(localStorage.getItem('auth-storage') || '{}');
console.log('Logged in:', authData.state?.isAuthenticated);
console.log('User:', authData.state?.user);
console.log('Token:', authData.state?.token?.substring(0, 50) + '...');
```

### Force navigation:
```javascript
window.location.href = '/wa/dashboard';
```

### Clear auth and retry:
```javascript
localStorage.removeItem('auth-storage');
location.reload();
```

---

## Expected Flow

1. User enters email & password
2. Clicks "Sign In" button
3. Console shows: `🔐 Attempting login...`
4. Request sent to `http://localhost:8080/api/v2/auth/login`
5. Backend responds with token and user data
6. Auth store updates with new data
7. Console shows: `✅ Login successful!`
8. Console shows: `🚀 Navigating to dashboard...`
9. Page redirects to `/wa/dashboard`

---

## Still Not Working?

1. **Clear browser cache**: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
2. **Hard refresh**: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
3. **Check for JavaScript errors** in console
4. **Try incognito/private mode** to rule out extensions
5. **Check if dashboard route exists** in your router

---

## Get More Info

Add this to your browser console while on the login page:
```javascript
// Monitor auth store changes
setInterval(() => {
  const auth = JSON.parse(localStorage.getItem('auth-storage') || '{}');
  if (auth.state?.isAuthenticated) {
    console.log('✅ User is logged in:', auth.state.user?.email);
    console.log('Token exists:', !!auth.state.token);
  }
}, 1000);
```

This will check every second if you're logged in.

---

## Success Checklist

After login, verify:
- ✅ Console shows success messages
- ✅ Network tab shows 200 OK response
- ✅ localStorage has auth data
- ✅ Page redirects to dashboard
- ✅ Dashboard shows user info

---

**Need more help? Check the browser console for error messages!**
