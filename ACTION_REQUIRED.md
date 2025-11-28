# 🚀 IMMEDIATE ACTION REQUIRED - Fix WABA User Mapping

## ⚠️ Current Status
Your Go server is **still running the OLD code**. The webhook is assigning WABAs to `default_user` instead of your authenticated user (`9332986b-424b-4d83-9559-f7c9a0e16e55`).

## ✅ What I Fixed (Code Changes Complete)

I've updated `go_server/mongo_golang/main.go` with the following improvements:

1. **Early user mapping** - Stores user_id immediately when OAuth callback arrives
2. **Multi-strategy user lookup** - Webhook tries 5 different ways to find the correct user
3. **Automatic cleanup** - Removes temporary session mappings once permanent ones are set
4. **Fix orphan endpoint** - New API to reassign existing WABAs from `default_user` to real users

## 🔧 What You Need to Do NOW

### Step 1: Restart the Go Server (REQUIRED!)

**In the `go` terminal:**

```bash
# Press Ctrl+C to stop the current server
# Then restart:
cd go_server/mongo_golang
go run main.go
```

You should see:
```
Starting server on :8080
Successfully connected to PostgreSQL database...
```

### Step 2: Fix Your Existing WABA

Your WABA (ID: `811978564885194`) is currently assigned to `default_user`. We need to reassign it to you.

**Option A: Use the script I created**
```bash
# In a new terminal at the project root:
./FIX_WABA_MAPPING.sh 9332986b-424b-4d83-9559-f7c9a0e16e55
```

**Option B: Manual curl (if you have your JWT token)**
```bash
curl -X POST http://localhost:8080/api/waba/fix-orphans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{"user_id": "9332986b-424b-4d83-9559-f7c9a0e16e55"}'
```

Expected response:
```json
{
  "success": true,
  "user_id": "9332986b-424b-4d83-9559-f7c9a0e16e55",
  "fixed_count": 1,
  "fixed_wabas": ["811978564885194"],
  "message": "Fixed 1 orphan WABA(s)"
}
```

### Step 3: Test the OAuth Flow Again

1. **Go to your dashboard**: http://localhost:3000/wa/dashboard
2. **Click "Connect WABA"** button
3. **Watch the Go server logs** - you should now see:
   ```
   📝 Extracted user_id from state: 9332986b-424b-4d83-9559-f7c9a0e16e55
   📝 Stored temporary OAuth session: state:... -> user_id:9332986b-424b-4d83-9559-f7c9a0e16e55
   
   [When webhook arrives]
   📝 Found user_id from recent OAuth state: 9332986b-424b-4d83-9559-f7c9a0e16e55
   ✅ WABA stored in database for user: 9332986b-424b-4d83-9559-f7c9a0e16e55!
   ```

4. **Verify in dashboard** - Your WABA should now appear

## 🔍 How to Verify It's Working

### Check the Logs
After restarting and completing OAuth, look for these **SUCCESS INDICATORS**:

✅ `Extracted user_id from state: 9332986b-...` (NOT default_user)
✅ `Stored temporary OAuth session: state:...`
✅ `Found user_id from recent OAuth state: 9332986b-...`
✅ `WABA stored in database for user: 9332986b-...` (NOT default_user)

### Check the Database
```sql
-- Connect to your PostgreSQL database
SELECT waba_id, user_id, owner_business_id, created_at 
FROM waba_accounts 
ORDER BY created_at DESC
LIMIT 5;
```

You should see:
- `waba_id`: `811978564885194`
- `user_id`: `9332986b-424b-4d83-9559-f7c9a0e16e55` ✅ (NOT `default_user` ❌)

## 📊 Quick Status Check

Run this to see current WABA assignments:
```bash
# If you have psql installed:
psql $DATABASE_URL -c "SELECT waba_id, user_id FROM waba_accounts;"
```

## 🐛 If You See Issues

### Issue: "undefined: handleFixOrphanWABAs"
**Solution**: The server hasn't been restarted with new code. Stop and restart it.

### Issue: Still seeing "default_user" in logs
**Solution**: 
1. Make sure you restarted the Go server
2. Check that `main.go` has the latest changes (look for "Stored temporary OAuth session" in the code)
3. Try `git status` to see if changes are saved

### Issue: "Failed to fetch WABA data"
**Solution**: This is normal - Facebook's `/me/businesses` endpoint returns empty. The fix handles this by:
1. Using the temporary state-based session mapping
2. Falling back to database lookup
3. The webhook will still assign the correct user

## 📝 Summary of Changes Made

| File | Lines | What Changed |
|------|-------|--------------|
| `main.go` | ~268 | Added temporary state-based OAuth session storage |
| `main.go` | ~1873 | Enhanced webhook with 5-strategy user lookup |
| `main.go` | ~892 | Added cleanup of temporary sessions |
| `main.go` | ~765 | New `/api/waba/fix-orphans` endpoint |
| `WABA_USER_MAPPING_FIX.md` | - | Detailed technical documentation |
| `FIX_WABA_MAPPING.sh` | - | Quick fix script |

## 🎯 Next Steps After Fix

1. ✅ Restart Go server
2. ✅ Fix existing orphan WABA
3. ✅ Test OAuth flow end-to-end
4. ✅ Verify in database
5. 📱 Use your WABA for messaging!

## ❓ Questions?

If you encounter any issues:
1. Check the Go server logs for error messages
2. Verify the database with the SQL queries above
3. Make sure the changes to `main.go` are present
4. Try the OAuth flow again after server restart

---

**TL;DR:**
1. **Restart Go server** (Ctrl+C, then `go run main.go`)
2. **Run fix script**: `./FIX_WABA_MAPPING.sh 9332986b-424b-4d83-9559-f7c9a0e16e55`
3. **Test OAuth again** - should now work correctly!
