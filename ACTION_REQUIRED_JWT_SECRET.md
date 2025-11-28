# 🚨 ACTION REQUIRED: Add Supabase JWT Secret

## Current Status

✅ **Fixed**: Backend code now supports Supabase JWT tokens
✅ **Loading**: Backend successfully loads SUPABASE_JWT_SECRET from .env
❌ **Problem**: The JWT secret value is a placeholder, not the actual secret

## What's Happening

Your logs show:
```
✅ Supabase JWT secret loaded successfully
❌ Backend JWT validation failed: token signature is invalid
❌ Supabase JWT validation failed: token signature is invalid
```

This means:
1. ✅ The backend is loading the SUPABASE_JWT_SECRET variable
2. ❌ But the value is wrong (it's still `your-supabase-jwt-secret-here`)
3. ❌ So token validation fails with "signature is invalid"

## How to Fix (3 Steps)

### Step 1: Get Your Supabase JWT Secret

**Option A: From Supabase Dashboard (Recommended)**

1. Open this URL in your browser:
   ```
   https://app.supabase.com/project/ucqnbhbluzqtnarcogrm/settings/api
   ```

2. Scroll down to find "**JWT Settings**" section

3. Look for "**JWT Secret**" - it's a long string that looks like:
   ```
   super-secret-jwt-token-with-at-least-32-characters-long
   ```

4. Click the copy icon to copy it

**Option B: Using Browser Console**

1. Go to the Supabase API settings page (link above)
2. Open browser console (Press F12)
3. Run this command:
   ```javascript
   // This will find and copy the JWT secret
   const jwtSecret = document.querySelector('[data-test="jwt-secret"]')?.textContent;
   if (jwtSecret) {
     navigator.clipboard.writeText(jwtSecret);
     console.log('✅ JWT Secret copied to clipboard!');
     console.log('Secret:', jwtSecret);
   } else {
     console.log('❌ Could not find JWT secret, copy it manually from the page');
   }
   ```

### Step 2: Update the .env File

1. **Open the .env file**:
   ```bash
   cd /Users/prasadhajare/Prasad_dev/whats_app_dev/msg-canvas-flow-main/go_server/mongo_golang
   nano .env
   ```

2. **Find this line** (around line 50):
   ```bash
   SUPABASE_JWT_SECRET=your-supabase-jwt-secret-here
   ```

3. **Replace with your actual secret**:
   ```bash
   SUPABASE_JWT_SECRET=<paste-your-actual-jwt-secret-here>
   ```

4. **Save and exit**: 
   - Press `Ctrl+O` to save
   - Press `Enter` to confirm
   - Press `Ctrl+X` to exit

### Step 3: Restart the Backend

1. **Stop the current backend** (if running):
   ```bash
   # In the terminal where go run . is running, press Ctrl+C
   # OR run this command:
   pkill -f "go run"
   ```

2. **Start the backend again**:
   ```bash
   cd /Users/prasadhajare/Prasad_dev/whats_app_dev/msg-canvas-flow-main/go_server/mongo_golang
   go run .
   ```

3. **Check the logs** - you should see:
   ```
   ✅ Supabase JWT secret loaded successfully
   ✅ Token validated with Supabase JWT secret
   ✅ Extracted user_id from 'sub' claim: <user-id>
   ```

4. **NO MORE** "signature is invalid" errors!

## Verify It Works

### Test 1: Check Backend Logs
After restarting, when you login to the frontend, you should see:
```
✅ Token validated with Supabase JWT secret
✅ Extracted user_id from 'sub' claim: 9332986b-424b-4d83-9559-f7c9a0e16e55
```

### Test 2: Check Frontend Console
In browser console, you should see:
```
✅ WABA status data: {success: true, connected: true/false, accounts: [...]}
```

NOT:
```
❌ WABA status data: {message: 'Invalid or expired token', success: false}
```

### Test 3: Manual API Test
```bash
# Get your token from browser console
# Run: supabase.auth.getSession().then(({data}) => console.log(data.session.access_token))

TOKEN="<your-token-here>"
USER_ID="9332986b-424b-4d83-9559-f7c9a0e16e55"

curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/waba/status?user_id=$USER_ID"
```

Expected response:
```json
{
  "success": true,
  "connected": true,
  "accounts": [...]
}
```

## Important Notes

### ⚠️ JWT Secret vs API Keys

The Supabase JWT Secret is **DIFFERENT** from:

- ❌ `SUPABASE_ANON_KEY` - This is for client-side API calls
- ❌ `SUPABASE_SERVICE_ROLE_KEY` - This is for server-side admin operations
- ✅ `SUPABASE_JWT_SECRET` - This is for **validating JWT tokens**

### 🔐 Security

- Keep the JWT secret secure
- Don't commit it to git
- It's already in `.gitignore` via `.env`

### 🐛 Troubleshooting

**Still getting "signature is invalid"?**
1. Make sure you copied the entire JWT secret (no spaces at start/end)
2. Make sure it's the JWT Secret, not the anon key
3. Restart the backend after updating .env
4. Check for typos in the .env file

**Can't find JWT Secret in dashboard?**
1. Make sure you're logged into the correct Supabase account
2. Look for "JWT Settings" section (scroll down on API settings page)
3. The secret is usually labeled "JWT Secret" or "JWT Signing Secret"

**Backend still says "Warning: SUPABASE_JWT_SECRET not set"?**
1. Check the file path: `go_server/mongo_golang/.env`
2. Make sure the variable name is exactly: `SUPABASE_JWT_SECRET`
3. No quotes needed around the value
4. Restart the backend after updating

## Quick Reference

### File to Edit
```
/Users/prasadhajare/Prasad_dev/whats_app_dev/msg-canvas-flow-main/go_server/mongo_golang/.env
```

### Line to Change (around line 50)
```bash
# Before:
SUPABASE_JWT_SECRET=your-supabase-jwt-secret-here

# After:
SUPABASE_JWT_SECRET=<your-actual-jwt-secret-from-dashboard>
```

### Commands to Run
```bash
# Edit .env
cd /Users/prasadhajare/Prasad_dev/whats_app_dev/msg-canvas-flow-main/go_server/mongo_golang
nano .env

# Restart backend
pkill -f "go run"
go run .
```

---

**Once you complete these 3 steps, the "Invalid or expired token" error will be gone! 🎉**
