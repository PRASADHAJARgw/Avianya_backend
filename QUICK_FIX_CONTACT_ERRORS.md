# 🔧 URGENT FIX - Contact Upsert Errors

## Errors Found

1. ⚠️ **Foreign key constraint violation**: `tenant_id = 1` doesn't exist in `tenants` table
2. ⚠️ **Missing unique constraint**: `chat_messages` table has no unique constraint on `wa_message_id`

## Quick Fix

### Step 1: Apply Database Fixes

```bash
cd /Users/prasadhajare/Prasad_dev/whats_app_dev/msg-canvas-flow-main/go_server/mongo_golang

# Apply the fixes
psql -h 127.0.0.1 -p 5432 -U postgres -d whatsapp_saas -f fix_tenant_and_constraint.sql
```

### Step 2: Restart Backend

```bash
# Backend should still be running, but restart to ensure clean state
pkill -f backend
./backend
```

### Step 3: Test Again

Send another WhatsApp message from **+91 7755991051** and check logs.

---

## What the Fix Does

### Fix 1: Create Default Tenant
```sql
INSERT INTO tenants (id, name) VALUES (1, 'Default Tenant')
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();
```

This ensures `tenant_id = 1` exists so the foreign key constraint is satisfied.

### Fix 2: Add Unique Constraint on wa_message_id
```sql
-- Remove duplicates first
DELETE FROM chat_messages
WHERE id NOT IN (
    SELECT MIN(id)
    FROM chat_messages
    WHERE wa_message_id IS NOT NULL
    GROUP BY wa_message_id
);

-- Create unique index
CREATE UNIQUE INDEX idx_chat_messages_wa_message_id_unique 
ON chat_messages (wa_message_id) 
WHERE wa_message_id IS NOT NULL;
```

This allows the `ON CONFLICT (wa_message_id)` clause in your Go code to work properly.

---

## Expected Result

After applying fixes and sending a test message, you should see:

```
✅ Contact upserted successfully for 917755991051
✅ Saved message to database: conversation_id=19, message_id=...
```

**No errors!** 🎉

---

## Manual Alternative (If SQL File Fails)

If the SQL file fails, run these commands individually:

```bash
# Connect to database
psql -h 127.0.0.1 -p 5432 -U postgres -d whatsapp_saas
```

Then in psql:

```sql
-- Create tenant
INSERT INTO tenants (id, name, created_at, updated_at) 
VALUES (1, 'Default Tenant', NOW(), NOW()) 
ON CONFLICT (id) DO NOTHING;

-- Verify
SELECT * FROM tenants WHERE id = 1;

-- Remove duplicate messages
DELETE FROM chat_messages
WHERE id NOT IN (
    SELECT MIN(id)
    FROM chat_messages
    WHERE wa_message_id IS NOT NULL
    GROUP BY wa_message_id
);

-- Create unique index
CREATE UNIQUE INDEX idx_chat_messages_wa_message_id_unique 
ON chat_messages (wa_message_id) 
WHERE wa_message_id IS NOT NULL;

-- Verify index
\di idx_chat_messages_wa_message_id_unique

-- Exit
\q
```

---

## Verification

After applying fixes:

1. **Check tenant exists:**
   ```sql
   SELECT * FROM tenants WHERE id = 1;
   ```
   Expected: One row with `id=1, name='Default Tenant'`

2. **Check unique index exists:**
   ```sql
   SELECT indexname FROM pg_indexes 
   WHERE tablename = 'chat_messages' 
   AND indexname LIKE '%wa_message_id%';
   ```
   Expected: `idx_chat_messages_wa_message_id_unique`

3. **Send test WhatsApp message**
   - Phone: +91 7755991051
   - Message: "test contact upsert"
   
4. **Check logs for success:**
   ```
   📇 Upserting contact: phone=917755991051, name=Prasad Hajare, tenant_id=1
   ✅ Contact upserted successfully for 917755991051
   ✅ Saved message to database
   ```

5. **Verify in database:**
   ```sql
   -- Check contact was created
   SELECT * FROM contacts WHERE phone_number = '917755991051';
   
   -- Check message was saved
   SELECT * FROM chat_messages 
   WHERE wa_message_id LIKE '%3JCM0Q5NDQ0NEYyNEM5ODFBQ0YA%' 
   ORDER BY id DESC LIMIT 1;
   ```

---

## Status

⏳ **Action Required**: Run the SQL fix file  
📄 **Fix File**: `fix_tenant_and_constraint.sql`  
🎯 **After Fix**: Restart backend and test

---

Created: 30 November 2025 12:20 PM
