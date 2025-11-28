# WABA User Mapping Fix - Summary

## Problem Identified

The WABA (WhatsApp Business Account) webhook events were being assigned to `default_user` instead of the authenticated user who initiated the OAuth flow. This happened because:

1. **Timing Issue**: The webhook (`PARTNER_APP_INSTALLED`) arrives almost immediately after Facebook OAuth approval, often **before** the OAuth callback completes
2. **Missing Mapping**: The `business_id -> user_id` mapping was only stored **after** fetching business data from the API, which was too late
3. **Empty Businesses API**: The `/me/businesses` endpoint returns empty data for newly authorized apps

## Root Cause

```
User initiates OAuth → Facebook redirects → Webhook fires → OAuth callback processes
                                              ↓
                                    Webhook can't find user_id mapping
                                              ↓
                                    Falls back to "default_user"
```

## Solution Implemented

### 1. **Early State-Based Mapping** (Line ~268)
Store a temporary `state:timestamp:user_id -> user_id` mapping immediately when OAuth callback is received:

```go
// Store temporary state-based mapping for webhooks that arrive before we get business_id
oauthSessionsMu.Lock()
oauthSessions["state:"+state] = userID
oauthSessionsMu.Unlock()
log.Printf("📝 Stored temporary OAuth session: state:%s -> user_id:%s", state, userID)
```

### 2. **Multi-Strategy User Lookup** (Line ~1873)
Enhanced webhook handler to find user_id using multiple strategies:

```go
// Strategy to find user_id (in order of preference):
// 1. Check OAuth sessions by business_id
// 2. Check OAuth sessions by state (for recent auth flows)
// 3. Check database for existing WABA with this ID
// 4. Look for most recent waba_account with default_user and reassign it
// 5. Fallback to default_user (should be rare)
```

This handles the race condition where webhook arrives before business_id is known.

### 3. **Cleanup Temporary Mappings** (Line ~892)
Once we have the permanent `business_id -> user_id` mapping, clean up temporary state-based sessions:

```go
// Clean up any temporary state-based sessions for this user
// since we now have the permanent business_id mapping
for key := range oauthSessions {
    if strings.HasPrefix(key, "state:") && oauthSessions[key] == userID {
        delete(oauthSessions, key)
        log.Printf("🧹 Cleaned up temporary OAuth state: %s", key)
    }
}
```

### 4. **Fix Orphan WABAs Endpoint** (Line ~765)
Added new endpoint `/api/waba/fix-orphans` to reassign existing WABA accounts from `default_user` to the correct user:

```bash
POST /api/waba/fix-orphans
{
  "user_id": "9332986b-424b-4d83-9559-f7c9a0e16e55"
}
```

This endpoint:
- Finds all WABA accounts with `user_id = 'default_user'`
- Reassigns them to the requesting user
- Updates OAuth session mappings
- Returns list of fixed WABAs

## How to Apply the Fix

### Step 1: Restart the Go Server
```bash
# Terminal: go
cd go_server/mongo_golang
# Stop current server (Ctrl+C)
go run main.go
```

### Step 2: Fix Existing Orphan WABAs
Use the new endpoint to reassign existing WABAs:

```bash
# Get your user_id from the frontend (logged in user)
# Then call:
curl -X POST http://localhost:8080/api/waba/fix-orphans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"user_id": "9332986b-424b-4d83-9559-f7c9a0e16e55"}'
```

### Step 3: Test New OAuth Flow
1. Disconnect any existing WABA (if needed)
2. Click "Connect WABA" button
3. Complete Facebook OAuth
4. Check logs - should now show correct user_id instead of `default_user`

## Expected Log Output (After Fix)

```
2025/11/26 00:XX:XX 📝 OAuth initiated for user: 9332986b-424b-4d83-9559-f7c9a0e16e55
2025/11/26 00:XX:XX 🔗 Redirecting to Facebook OAuth...
2025/11/26 00:XX:XX ✅ OAuth callback received...
2025/11/26 00:XX:XX 📝 Extracted user_id from state: 9332986b-424b-4d83-9559-f7c9a0e16e55
2025/11/26 00:XX:XX 📝 Stored temporary OAuth session: state:... -> user_id:9332986b-424b-4d83-9559-f7c9a0e16e55

[Webhook arrives]
2025/11/26 00:XX:XX 📱 Processing WhatsApp Business Account webhook
2025/11/26 00:XX:XX    ✅ WABA Installed!
2025/11/26 00:XX:XX    📝 Found user_id from recent OAuth state: 9332986b-424b-4d83-9559-f7c9a0e16e55  ← FIXED!
2025/11/26 00:XX:XX    ✅ WABA stored in database for user: 9332986b-424b-4d83-9559-f7c9a0e16e55!  ← FIXED!
```

## Testing Checklist

- [ ] Restart Go server with new code
- [ ] Fix existing orphan WABAs using `/api/waba/fix-orphans` endpoint
- [ ] Test new OAuth flow - verify correct user_id in logs
- [ ] Verify WABA appears in user's dashboard
- [ ] Confirm phone numbers are linked to correct WABA

## Database Verification

Check current WABA assignments:
```sql
SELECT waba_id, user_id, owner_business_id, created_at 
FROM waba_accounts 
ORDER BY created_at DESC;
```

Should show:
- `user_id` = actual UUID (e.g., `9332986b-424b-4d83-9559-f7c9a0e16e55`)
- NOT `default_user`

## Files Modified

1. `go_server/mongo_golang/main.go`:
   - `handleOAuthRedirect()` - Added early state-based mapping
   - `handleAccountUpdate()` - Enhanced user lookup with multiple strategies
   - `storeWABAData()` - Added cleanup of temporary mappings
   - `handleFixOrphanWABAs()` - New endpoint to fix existing orphan WABAs

## Rollback Plan

If issues occur, revert changes to `main.go` using git:
```bash
cd go_server/mongo_golang
git checkout main.go
go run main.go
```

## Next Steps

1. **Immediate**: Restart server and fix orphan WABAs
2. **Testing**: Complete OAuth flow end-to-end
3. **Monitoring**: Watch logs for correct user_id assignments
4. **Cleanup**: After confirming fix works, can add cleanup job to remove old state-based mappings after 1 hour

## Notes

- The fix maintains backward compatibility
- Multiple fallback strategies ensure robustness
- State-based sessions are temporary and cleaned up automatically
- The `/api/waba/fix-orphans` endpoint is safe to call multiple times
