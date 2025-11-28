# How to Get Your Supabase JWT Secret

## Quick Steps

### Method 1: Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Open: https://app.supabase.com/project/ucqnbhbluzqtnarcogrm/settings/api
   - (Replace `ucqnbhbluzqtnarcogrm` with your project reference if different)

2. **Find JWT Settings Section**
   - Scroll down to "JWT Settings"
   - Look for "JWT Secret"
   - It's a long base64-encoded string (different from anon and service_role keys)

3. **Copy the Secret**
   - Click the copy icon next to JWT Secret
   - It should look like: `your-long-base64-string-here==`

4. **Add to Backend .env**
   ```bash
   cd /Users/prasadhajare/Prasad_dev/whats_app_dev/msg-canvas-flow-main/go_server/mongo_golang
   nano .env
   ```
   
   Add or update:
   ```
   SUPABASE_JWT_SECRET=your-actual-jwt-secret-from-dashboard
   ```

### Method 2: Using Supabase CLI (If you have it installed)

```bash
# Login to Supabase CLI
supabase login

# Get project settings (will include JWT secret)
supabase projects get-config --project-id ucqnbhbluzqtnarcogrm
```

### Method 3: Check Existing Environment

The JWT secret might already be in your Supabase project files:

```bash
# Check if it's in any config files
cd /Users/prasadhajare/Prasad_dev/whats_app_dev/msg-canvas-flow-main
grep -r "jwt" . --include="*.env*" 2>/dev/null
```

## After Getting the Secret

1. **Update the .env file**:
   ```bash
   cd go_server/mongo_golang
   # Edit .env file and add:
   # SUPABASE_JWT_SECRET=your-actual-secret-here
   ```

2. **Restart the backend**:
   ```bash
   # Kill existing process
   pkill -f mongo_golang
   
   # Start backend
   ./mongo_golang
   ```

3. **Verify it loaded**:
   Look for this in the logs:
   ```
   ✅ Supabase JWT secret loaded successfully
   ```

## Quick Test

Once configured, test the authentication:

```bash
# 1. Login to the frontend (http://localhost:3000)
# 2. Open browser console and run:
supabase.auth.getSession().then(({ data: { session } }) => {
  console.log('Token:', session.access_token);
  
  // Test API call
  fetch('http://localhost:8080/api/waba/status?user_id=' + session.user.id, {
    headers: {
      'Authorization': 'Bearer ' + session.access_token
    }
  })
  .then(r => r.json())
  .then(console.log);
});
```

Expected result: Should see WABA status without "Invalid or expired token" error.

## Troubleshooting

### Can't find JWT Secret in dashboard
- Make sure you're logged into the correct Supabase account
- The JWT Secret is in Settings → API → JWT Settings (scroll down)
- It's different from anon_key and service_role_key

### Still getting "Invalid or expired token"
1. Verify the JWT secret has no extra spaces or newlines
2. Make sure you restarted the backend after updating .env
3. Check the backend logs for "Supabase JWT secret loaded"
4. Try getting a fresh token from the frontend

### "Warning: SUPABASE_JWT_SECRET not set"
- The .env file update didn't work
- Check the file path: `go_server/mongo_golang/.env`
- Make sure there's no typo in the variable name
