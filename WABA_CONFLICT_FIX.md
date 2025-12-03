# ✅ WABA ON CONFLICT Fix - Multi-User Support

## Problem
The error `pq: there is no unique or exclusion constraint matching the ON CONFLICT specification` was occurring because the code used `ON CONFLICT (waba_id)` but the table didn't have a unique constraint on `waba_id` alone.

## Root Cause
```sql
-- Old: Code tried to use ON CONFLICT (waba_id)
-- But table only had: PRIMARY KEY (id)
-- No UNIQUE constraint on waba_id!
```

## Solution Implemented

### 1. Created Composite Unique Index ✅
```sql
CREATE UNIQUE INDEX waba_accounts_user_waba_unique 
ON waba_accounts (user_id, waba_id);
```

**Benefits:**
- ✅ Allows multiple users to access the same WABA
- ✅ Prevents duplicate WABA entries per user
- ✅ Enables multi-tenant WABA management
- ✅ Each user can have multiple WABAs
- ✅ Each WABA can be shared with multiple users

### 2. Updated SQL Queries ✅
Changed all `ON CONFLICT (waba_id)` to `ON CONFLICT (user_id, waba_id)`

#### Location 1: Webhook Handler (Line ~2265)
```go
// Before:
ON CONFLICT (waba_id) 
DO UPDATE SET 
    owner_business_id = $4,
    user_id = $3,          // ❌ This was trying to change user_id
    updated_at = NOW()

// After:
ON CONFLICT (user_id, waba_id) 
DO UPDATE SET 
    owner_business_id = $4,  // ✅ Only update business_id
    updated_at = NOW()       // ✅ Don't change user_id
```

#### Location 2: OAuth Callback (Line ~1089)
```go
// Before:
ON CONFLICT (waba_id) 
DO UPDATE SET 
    access_token = $5,
    owner_business_id = $4,
    user_id = $3,          // ❌ This was trying to change user_id
    updated_at = NOW()

// After:
ON CONFLICT (user_id, waba_id) 
DO UPDATE SET 
    access_token = $5,
    owner_business_id = $4,  // ✅ Only update token & business_id
    updated_at = NOW()       // ✅ Don't change user_id
```

## Database Schema

### Current Structure
```sql
waba_accounts (
    id VARCHAR(255) PRIMARY KEY,
    account_number SERIAL,
    waba_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    owner_business_id VARCHAR(255),
    access_token TEXT,
    token_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    owner_user_id UUID,
    
    -- Constraints:
    UNIQUE(user_id, waba_id),  -- ✅ New composite unique constraint
    FOREIGN KEY (user_id) REFERENCES users(id)
)
```

### Indexes
```
waba_accounts_pkey              -- PRIMARY KEY on id
waba_accounts_user_waba_unique  -- UNIQUE on (user_id, waba_id)
```

## Use Cases Now Supported

### 1. Single User, Multiple WABAs
```
User A -> WABA 1
User A -> WABA 2
User A -> WABA 3
```

### 2. Multiple Users, Same WABA (Multi-Tenant)
```
User A -> WABA 1
User B -> WABA 1
User C -> WABA 1
```

### 3. Multiple Users, Multiple WABAs
```
User A -> WABA 1, WABA 2
User B -> WABA 1, WABA 3
User C -> WABA 2, WABA 3
```

## Testing

### Test the Fix
1. **Try OAuth Flow:**
   - Go to Dashboard
   - Click "Connect WhatsApp Business"
   - Complete OAuth
   - Check logs for `✅ WABA stored in database for user: ...`

2. **Verify Database:**
   ```sql
   SELECT user_id, waba_id, owner_business_id, created_at 
   FROM waba_accounts 
   ORDER BY created_at DESC;
   ```

3. **Test Multi-User:**
   ```sql
   -- Same WABA, different users:
   INSERT INTO waba_accounts (id, waba_id, user_id, owner_business_id, created_at, updated_at)
   VALUES 
       ('user1-waba1', '811978564885194', 'user-1', '1786936435511275', NOW(), NOW()),
       ('user2-waba1', '811978564885194', 'user-2', '1786936435511275', NOW(), NOW());
   -- ✅ Should work now!
   ```

4. **Test Duplicate Prevention:**
   ```sql
   -- Try to insert same user+waba twice:
   INSERT INTO waba_accounts (id, waba_id, user_id, owner_business_id, created_at, updated_at)
   VALUES ('test', '811978564885194', 'user-1', '1786936435511275', NOW(), NOW())
   ON CONFLICT (user_id, waba_id) DO NOTHING;
   -- ✅ Should handle gracefully
   ```

## Expected Logs (After Fix)
```
2025/12/03 16:26:55 📱 Processing WhatsApp Business Account webhook
2025/12/03 16:26:55    ✅ WABA Installed!
2025/12/03 16:26:55       WABA ID: 811978564885194
2025/12/03 16:26:55    📝 Found user_id from recent OAuth state: 5f236975-5357-4758-8c14-da93339b1eb2
2025/12/03 16:26:55    ✅ WABA stored in database for user: 5f236975-5357-4758-8c14-da93339b1eb2!
```

**NOT:**
```
❌ Failed to store WABA: pq: there is no unique or exclusion constraint...
```

## Files Changed
- ✅ `go_server/mongo_golang/main.go` - Updated 2 SQL queries
- ✅ Database schema - Added composite unique index

## Rollback (If Needed)
```sql
-- Remove the composite unique index:
DROP INDEX IF EXISTS waba_accounts_user_waba_unique;

-- Revert code to use ON CONFLICT (waba_id)
-- (But you'll need a UNIQUE constraint on waba_id alone)
```

---

**Status:** ✅ Fixed and Deployed
**Date:** 2025-12-03
**Issue:** ON CONFLICT constraint mismatch
**Solution:** Composite unique index (user_id, waba_id)
