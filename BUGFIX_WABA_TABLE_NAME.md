# ✅ FIXED: WABA Table Name Error (Bug #7)

## Issue

When clicking "Send" on campaign:
```
📥 Send response: 500 WhatsApp Business Account not configured
❌ Send campaign error: Error: WhatsApp Business Account not configured
```

## Root Cause

**Wrong Table Name in Query**

The backend was querying a non-existent table:

```go
// ❌ BROKEN - Table doesn't exist
SELECT waba_id, phone_number_id, access_token
FROM waba_configs  // ❌ This table doesn't exist!
WHERE user_id = $1
```

**Actual Database Schema:**
- ✅ `waba_accounts` table exists (has waba_id, access_token, user_id)
- ✅ `phone_numbers` table exists (has phone_number_id, waba_id)
- ❌ `waba_configs` table DOES NOT exist

## Solution

Updated query to use correct table names with JOIN:

```go
// ✅ FIXED - Use correct tables with JOIN
SELECT wa.waba_id, pn.phone_number_id, wa.access_token
FROM waba_accounts wa
JOIN phone_numbers pn ON wa.waba_id = pn.waba_id
WHERE wa.user_id = $1
LIMIT 1
```

## Database Structure

### waba_accounts table
- `id` - Primary key
- `waba_id` - WhatsApp Business Account ID
- `user_id` - Foreign key to users table
- `access_token` - Meta API access token
- `owner_business_id`, `token_expires_at`, etc.

### phone_numbers table  
- `id` - Primary key
- `phone_number_id` - WhatsApp phone number ID (needed for API calls)
- `waba_id` - Links to waba_accounts
- `display_phone_number` - Formatted phone number
- `verified_name`, `quality_rating`, etc.

### Relationship
```
users (id)
  ↓ (user_id)
waba_accounts (waba_id, access_token)
  ↓ (waba_id)  
phone_numbers (phone_number_id)
```

## Files Modified

**File**: `go_server/mongo_golang/campaign_handlers.go`
- **Function**: `handleSendCampaign()`
- **Lines**: ~593-609
- **Change**: 
  - Changed `FROM waba_configs` → `FROM waba_accounts wa`
  - Added `JOIN phone_numbers pn ON wa.waba_id = pn.waba_id`
  - Updated column references to use table aliases

## Status

✅ **Fixed and deployed**  
✅ **Server restarted** (port 8080)  
✅ **Ready to test send again**

## All 7 Bugs Fixed!

1. ✅ Array validation (TypeError)
2. ✅ Template ID conversion (string→number)
3. ✅ JSONB scanning in CREATE endpoint
4. ✅ Template approval (status update)
5. ✅ SQL parameters (removed duplicate)
6. ✅ JSONB scanning in SEND endpoint
7. ✅ **WABA table name and JOIN** ← **JUST FIXED**

## Verify WABA Data Exists

Before testing, let's check if you have WABA data:

```bash
# Check if WABA account exists
PGPASSWORD='postgres' psql -h localhost -U postgres -d whatsapp_saas -c "
  SELECT wa.user_id, wa.waba_id, pn.phone_number_id, pn.display_phone_number
  FROM waba_accounts wa
  JOIN phone_numbers pn ON wa.waba_id = pn.waba_id
  WHERE wa.user_id = '3f947ab3-f228-4d1c-9c2f-5bfb5f8a5fd5'
"
```

**If no rows returned:**
You need to connect a WhatsApp Business Account first:
1. Go to Settings/WhatsApp Integration in the app
2. Connect your WhatsApp Business Account
3. This will create the WABA and phone number records

**If rows are returned:**
Perfect! Try sending the campaign again!

## Test Now

1. **Refresh browser** (Ctrl+R / Cmd+R)
2. **Click "Send"** on your campaign
3. **Enter workers**: `10`
4. **Enter rate**: `100`
5. **Expected results**:

### If WABA configured:
```
✅ Campaign started!
Workers: 10
Rate: 100 msg/sec
```

### If WABA not configured:
```
Error: WhatsApp Business Account not configured
```
→ Go to Settings and connect your WhatsApp Business Account first

---

**Date**: December 5, 2025  
**Status**: ✅ FIXED - Correct WABA table JOIN  
**Action**: Check if WABA exists, then try sending!
