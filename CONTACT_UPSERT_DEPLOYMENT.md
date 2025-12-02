# 🚀 Contact Auto-Upsert Deployment Checklist

## Pre-Deployment Verification

### ✅ Step 1: Verify Database Schema
Ensure the `contacts` table has the unique index:

```sql
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'contacts' 
AND indexname = 'contacts_tenant_id_phone_number_key';
```

**Expected result:** Should return the unique index on `(tenant_id, phone_number)`

**If not found:** Apply the DDL from `contacts_ddl.sql`

---

### ✅ Step 2: Verify Tenant Exists
Ensure tenant_id = 1 exists in the tenants table:

```sql
SELECT id, name FROM tenants WHERE id = 1;
```

**If not found:**
```sql
INSERT INTO tenants (id, name) VALUES (1, 'Default Tenant')
ON CONFLICT (id) DO NOTHING;
```

---

## Deployment Steps

### 🔨 Step 3: Rebuild Backend

```bash
cd /Users/prasadhajare/Prasad_dev/whats_app_dev/msg-canvas-flow-main/go_server/mongo_golang

# Build
go build -o backend
```

**Expected:** No errors, `backend` binary created

---

### 🔄 Step 4: Restart Backend

```bash
# Stop existing backend
pkill -f backend

# Start new backend (choose one method):

# Option A: Foreground (see logs in terminal)
./backend

# Option B: Background with log file
nohup ./backend > backend.log 2>&1 &

# Option C: Using screen/tmux (recommended)
screen -S backend
./backend
# Press Ctrl+A then D to detach
```

**Verify backend is running:**
```bash
ps aux | grep backend
```

---

## Testing

### 🧪 Step 5: Run Automated Test

```bash
cd /Users/prasadhajare/Prasad_dev/whats_app_dev/msg-canvas-flow-main

# Run test with default phone number
./test_contact_upsert.sh

# Or specify custom phone number
./test_contact_upsert.sh 919876543210
```

**The script will:**
1. Check if contact exists before test
2. Prompt you to send a WhatsApp message
3. Verify backend logs for upsert activity
4. Check database for contact creation/update
5. Verify no duplicates
6. Confirm message was also saved

---

### 📱 Step 6: Manual Test (Alternative)

**Send a test message:**
1. Send WhatsApp message from phone: `+91 7775599105`
2. Message content: `Hello, testing contact upsert`

**Check backend logs:**
```bash
tail -f backend.log | grep "📇"
```

**Expected log output:**
```
📇 Upserting contact: phone=917775599105, name=John Doe, tenant_id=1
✅ Contact upserted successfully for 917775599105
```

**Verify in database:**
```sql
SELECT id, tenant_id, phone_number, name, created_at, updated_at 
FROM contacts 
WHERE tenant_id = 1 AND phone_number = '917775599105';
```

---

## Verification Checklist

After deployment, verify:

- [ ] Backend compiles without errors
- [ ] Backend starts successfully
- [ ] No errors in backend logs
- [ ] WhatsApp webhook receives messages
- [ ] Backend logs show `📇 Upserting contact` message
- [ ] Backend logs show `✅ Contact upserted successfully`
- [ ] Contact appears in `contacts` table
- [ ] No duplicate contacts (run query below)
- [ ] Message also appears in `chat_messages` table
- [ ] Contact name is extracted from WhatsApp profile (not phone number)

**Check for duplicates:**
```sql
SELECT phone_number, COUNT(*) as count
FROM contacts
WHERE tenant_id = 1
GROUP BY phone_number
HAVING COUNT(*) > 1;
```

**Expected:** No results (empty set = no duplicates)

---

## Monitoring

### 📊 View Contact Creation Activity

**Recent contacts created:**
```sql
SELECT id, phone_number, name, created_at 
FROM contacts 
WHERE tenant_id = 1
AND created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

**Contact update activity:**
```sql
SELECT id, phone_number, name, created_at, updated_at 
FROM contacts 
WHERE tenant_id = 1
AND updated_at > created_at + INTERVAL '1 minute'
ORDER BY updated_at DESC
LIMIT 20;
```

### 📈 Contact Statistics

```sql
-- Total contacts
SELECT COUNT(*) as total_contacts FROM contacts WHERE tenant_id = 1;

-- Contacts created today
SELECT COUNT(*) as today_contacts 
FROM contacts 
WHERE tenant_id = 1 
AND created_at::date = CURRENT_DATE;

-- Contacts with real names vs phone numbers
SELECT 
    COUNT(CASE WHEN name ~ '^[0-9]+$' THEN 1 END) as phone_only,
    COUNT(CASE WHEN name !~ '^[0-9]+$' THEN 1 END) as real_names,
    COUNT(*) as total
FROM contacts 
WHERE tenant_id = 1;
```

---

## Troubleshooting

### ❌ Issue: "Error upserting contact: duplicate key"

**Cause:** Unique constraint violation (shouldn't happen with ON CONFLICT)

**Fix:**
```sql
-- Check for existing duplicates
SELECT phone_number, COUNT(*) 
FROM contacts 
WHERE tenant_id = 1
GROUP BY phone_number 
HAVING COUNT(*) > 1;

-- Remove duplicates (keeps oldest)
DELETE FROM contacts
WHERE id NOT IN (
    SELECT MIN(id)
    FROM contacts
    WHERE tenant_id = 1
    GROUP BY tenant_id, phone_number
);
```

---

### ❌ Issue: "Error upserting contact: foreign key constraint"

**Cause:** `tenant_id = 1` doesn't exist in `tenants` table

**Fix:**
```sql
INSERT INTO tenants (id, name) VALUES (1, 'Default Tenant')
ON CONFLICT (id) DO NOTHING;
```

---

### ❌ Issue: "Contact not being created"

**Possible causes:**
1. Backend not running → `ps aux | grep backend`
2. Webhook not configured → Check WhatsApp webhook settings
3. Database connection error → Check `postgresDB` logs
4. `contacts` table doesn't exist → Apply `contacts_ddl.sql`

**Debug:**
```bash
# Check backend logs
tail -50 backend.log

# Check for errors
grep -i "error" backend.log | tail -20

# Check for contact upsert attempts
grep "Upserting contact" backend.log | tail -10
```

---

### ❌ Issue: "Contact name is always phone number"

**Cause:** WhatsApp webhook not providing contact profile

**Check webhook payload:**
- Webhook should include `contacts` array with `profile.name`
- If missing, WhatsApp may not be sending profile data

**Temporary workaround:**
Manually update contact names in database:
```sql
UPDATE contacts 
SET name = 'Actual Name' 
WHERE phone_number = '917775599105' AND tenant_id = 1;
```

---

## Rollback (If Needed)

If issues occur, rollback to previous version:

```bash
cd /Users/prasadhajare/Prasad_dev/whats_app_dev/msg-canvas-flow-main/go_server/mongo_golang

# Stop current backend
pkill -f backend

# Restore from git (if committed)
git checkout HEAD~1 main.go

# Or manually remove the upsertContact() function and webhook call

# Rebuild and restart
go build -o backend
./backend
```

---

## Success Criteria

✅ **Deployment successful if:**

1. Backend starts without errors
2. Test message creates contact in database
3. No duplicate contacts after multiple messages
4. Contact names extracted from WhatsApp profiles
5. Backend logs show successful upsert operations
6. Messages continue to save to `chat_messages` table
7. No performance degradation

---

## Next Steps

After successful deployment:

1. **Monitor for 24 hours** - Watch logs and database for issues
2. **Document any issues** - Note edge cases or unexpected behavior
3. **Consider enhancements:**
   - Extract tenant_id from JWT token (remove hardcoded value)
   - Add email field extraction (if available from WhatsApp Business API)
   - Implement profile picture download and storage
   - Add contact metadata (first message time, total messages, etc.)

---

## Documentation

📄 **Full documentation:** `CONTACT_AUTO_UPSERT.md`  
📋 **Quick summary:** `CONTACT_AUTO_UPSERT_SUMMARY.md`  
🧪 **Test script:** `test_contact_upsert.sh`

---

## Support

If you encounter issues:

1. Check `backend.log` for errors
2. Review `CONTACT_AUTO_UPSERT.md` troubleshooting section
3. Verify database schema with `contacts_ddl.sql`
4. Run automated test: `./test_contact_upsert.sh`

---

**Deployment Date:** 30 November 2025  
**Feature:** Contact Auto-Upsert  
**Status:** ✅ Ready for Production
