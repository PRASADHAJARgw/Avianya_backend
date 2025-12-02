# Fix for Duplicate Messages (Same wa_message_id)

## Problem

The same WhatsApp message is being stored **twice** in the database with different IDs but the **same `wa_message_id`**:

```
ID: 512, wa_message_id: wamid.HBgMOTE3NzU1OTkxMDUxFQIAEhgUM0FFQTMzMzhCRUIyQzAxMTM5MDUA
ID: 513, wa_message_id: wamid.HBgMOTE3NzU1OTkxMDUxFQIAEhgUM0FFQTMzMzhCRUIyQzAxMTM5MDUA
```

### Root Cause

1. **WhatsApp sends webhooks twice** (reliability mechanism)
2. **Race condition**: Both webhooks arrive nearly simultaneously
3. Both threads check for duplicates → both find nothing → both insert
4. **No database constraint** prevents duplicate `wa_message_id`

## Solution

Two-part fix:

### 1. Database-Level Protection (UNIQUE Constraint)
Add a UNIQUE index on `wa_message_id` to prevent duplicates at the database level.

### 2. Application-Level Handling (ON CONFLICT)
Use PostgreSQL's `ON CONFLICT DO NOTHING` to gracefully handle duplicate attempts.

## Step-by-Step Fix

### Step 1: Apply Database Migration

Run the SQL migration to:
- Remove existing duplicates
- Add UNIQUE constraint on `wa_message_id`

```bash
cd /Users/prasadhajare/Prasad_dev/whats_app_dev/msg-canvas-flow-main/go_server/mongo_golang

# Connect to your database and run:
psql -h <host> -U <user> -d <database> -f fix_duplicate_messages.sql
```

Or manually execute:

```sql
-- Remove existing duplicates (keeps first occurrence)
DELETE FROM chat_messages
WHERE id IN (
    SELECT id
    FROM (
        SELECT id,
               ROW_NUMBER() OVER (PARTITION BY wa_message_id ORDER BY id ASC) as rn
        FROM chat_messages
        WHERE wa_message_id IS NOT NULL AND wa_message_id != ''
    ) t
    WHERE rn > 1
);

-- Add UNIQUE constraint
CREATE UNIQUE INDEX IF NOT EXISTS idx_chat_messages_wa_message_id_unique 
ON chat_messages(wa_message_id) 
WHERE wa_message_id IS NOT NULL AND wa_message_id != '';
```

### Step 2: Rebuild and Restart Backend

```bash
cd /Users/prasadhajare/Prasad_dev/whats_app_dev/msg-canvas-flow-main/go_server/mongo_golang

# Rebuild
go build -o backend

# Stop existing backend
pkill -f backend

# Start backend
./backend
```

### Step 3: Verify Fix

1. **Send a test message from WhatsApp**
2. **Check database** - should have only ONE entry:

```sql
SELECT id, wa_message_id, content, created_at
FROM chat_messages
WHERE wa_message_id = '<latest_message_id>'
ORDER BY id DESC;
```

Should return only 1 row.

3. **Check backend logs** - should see:

```
📥 WEBHOOK RECEIVED: (first webhook)
   ✅ Saved message to database: conversation_id=19, message_id=wamid...

📥 WEBHOOK RECEIVED: (second webhook - duplicate)
   ⚠️  Message already exists (duplicate webhook caught by DB): wa_message_id=wamid...
```

## What Changed

### Before (Vulnerable to Race Condition):

```go
// Check if exists
var existingMessageID int
err = postgresDB.QueryRow(`
    SELECT id FROM chat_messages WHERE wa_message_id = $1
`, messageID).Scan(&existingMessageID)

if err == nil {
    // Already exists, skip
    return
}

// Insert (RACE CONDITION: another thread might insert here!)
err = postgresDB.QueryRow(`
    INSERT INTO chat_messages (...)
    VALUES (...)
    RETURNING ...
`)
```

**Problem**: Between the SELECT and INSERT, another thread can insert the same message.

### After (Race Condition Safe):

```go
// Insert with ON CONFLICT (atomic operation)
err = postgresDB.QueryRow(`
    INSERT INTO chat_messages (...)
    VALUES (...)
    ON CONFLICT (wa_message_id) DO NOTHING
    RETURNING ...
`).Scan(...)

if err == sql.ErrNoRows {
    // Duplicate caught by database constraint
    log.Printf("⚠️  Message already exists (duplicate webhook caught by DB)")
    return
}
```

**Benefits**:
- **Atomic**: Check and insert happen in single database operation
- **Race-safe**: Database enforces uniqueness
- **Clean**: ON CONFLICT handles duplicates gracefully

## Verification Queries

### 1. Check if UNIQUE index exists:

```sql
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'chat_messages' 
AND indexname = 'idx_chat_messages_wa_message_id_unique';
```

Should return 1 row showing the index definition.

### 2. Check for any remaining duplicates:

```sql
SELECT wa_message_id, COUNT(*) as count
FROM chat_messages
WHERE wa_message_id IS NOT NULL AND wa_message_id != ''
GROUP BY wa_message_id
HAVING COUNT(*) > 1
ORDER BY count DESC;
```

Should return **0 rows** (no duplicates).

### 3. Count duplicates that were removed:

```sql
-- Check total messages before and after
SELECT COUNT(*) as total_messages FROM chat_messages;
```

### 4. View recent messages to verify no duplicates:

```sql
SELECT id, conversation_id, wa_message_id, content, created_at
FROM chat_messages
ORDER BY id DESC
LIMIT 20;
```

## Testing the Fix

### Test Case 1: Send Text Message

1. Send "Test message 1" from WhatsApp
2. Wait 5 seconds
3. Check database:
   ```sql
   SELECT COUNT(*) FROM chat_messages 
   WHERE content = 'Test message 1';
   ```
   **Expected**: 1 (not 2)

### Test Case 2: Send Image

1. Send an image from WhatsApp
2. Check database:
   ```sql
   SELECT COUNT(*) FROM chat_messages 
   WHERE message_type = 'image' 
   AND created_at > NOW() - INTERVAL '1 minute';
   ```
   **Expected**: 1 (not 2)

### Test Case 3: Check Backend Logs

```bash
tail -f /Users/prasadhajare/Prasad_dev/whats_app_dev/msg-canvas-flow-main/go_server/mongo_golang/backend.log
```

Look for:
- First webhook: `✅ Saved message to database`
- Second webhook: `⚠️  Message already exists (duplicate webhook caught by DB)`

## Troubleshooting

### Issue: "index already exists" error

If you get an error when creating the index:

```sql
-- Drop and recreate
DROP INDEX IF EXISTS idx_chat_messages_wa_message_id_unique;
CREATE UNIQUE INDEX idx_chat_messages_wa_message_id_unique 
ON chat_messages(wa_message_id) 
WHERE wa_message_id IS NOT NULL AND wa_message_id != '';
```

### Issue: "duplicate key value violates unique constraint"

This means a duplicate exists BEFORE you added the constraint. Run the cleanup query first:

```sql
-- Remove duplicates first
DELETE FROM chat_messages
WHERE id IN (
    SELECT id
    FROM (
        SELECT id,
               ROW_NUMBER() OVER (PARTITION BY wa_message_id ORDER BY id ASC) as rn
        FROM chat_messages
        WHERE wa_message_id IS NOT NULL AND wa_message_id != ''
    ) t
    WHERE rn > 1
);
```

### Issue: Still seeing duplicates

1. **Verify index exists**:
   ```sql
   SELECT * FROM pg_indexes WHERE indexname LIKE '%wa_message_id%';
   ```

2. **Check Go code is updated**:
   ```bash
   grep -n "ON CONFLICT" /Users/prasadhajare/Prasad_dev/whats_app_dev/msg-canvas-flow-main/go_server/mongo_golang/main.go
   ```
   Should show the line with ON CONFLICT

3. **Verify backend was rebuilt**:
   ```bash
   ls -lh /Users/prasadhajare/Prasad_dev/whats_app_dev/msg-canvas-flow-main/go_server/mongo_golang/backend
   ```
   Check the timestamp - should be recent

## Summary

✅ **Database Level**: UNIQUE constraint on `wa_message_id` prevents duplicates  
✅ **Application Level**: `ON CONFLICT DO NOTHING` handles race conditions gracefully  
✅ **Race Condition Safe**: Database atomically enforces uniqueness  
✅ **Existing Duplicates**: SQL migration removes them  

**Files Modified:**
- `go_server/mongo_golang/main.go` - Added ON CONFLICT handling
- `go_server/mongo_golang/fix_duplicate_messages.sql` - Database migration

**Result**: Each WhatsApp message is stored **exactly once**, even when WhatsApp sends the webhook twice! 🎉
