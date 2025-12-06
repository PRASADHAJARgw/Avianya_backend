# Campaign Counter Duplicate Prevention - FIXED ✅

## Issues Found

### Incorrect Campaign Statistics

**Problem:** Campaign showed inflated numbers:
- Total recipients: **2** ✅ Correct
- Sent: **6** ❌ Should be 2
- Delivered: **8** ❌ Should be 1  
- Success Rate: **400%** ❌ Should be 50%

**Root Cause:**
- WhatsApp webhooks can arrive **multiple times** (duplicate webhooks)
- System was incrementing counters **every time** without checking if already counted
- Result: Each status update counted 3-4 times

### How It Happened

```
Message lifecycle:
1. pending → sent (increment sent +1)
2. sent → delivered (increment delivered +1) 
3. delivered → delivered (duplicate webhook, increment delivered +1 again!) ❌
4. delivered → delivered (another duplicate, increment delivered +1 again!) ❌
```

## Fix Applied

### Duplicate Prevention Logic

**Principle:** Only increment counters when status **actually changes**.

### 1. Fixed "sent" Status

**Before:**
```go
// Always increment, even if already sent
UPDATE campaign_recipients SET status = 'sent' WHERE id = $1
UPDATE campaigns SET sent = sent + 1  // Always runs!
```

**After:**
```go
// Only update if currently 'pending'
UPDATE campaign_recipients 
SET status = 'sent', sent_at = $1
WHERE id = $2 AND status = 'pending'  // ✅ Condition added!

// Only increment if row was actually updated
rowsAffected, _ := result.RowsAffected()
if rowsAffected > 0 {
    UPDATE campaigns SET sent = sent + 1
}
```

**Result:** 
- First "sent" webhook: Updates from pending → sent, increments counter ✅
- Duplicate "sent" webhook: No update (already sent), counter stays same ✅

### 2. Fixed "delivered" Status

**Before:**
```go
// Always increment, even if already delivered
UPDATE campaign_recipients SET status = 'delivered' WHERE id = $1
UPDATE campaigns SET delivered = delivered + 1  // Always runs!
```

**After:**
```go
// Only update if NOT already delivered or read
UPDATE campaign_recipients 
SET status = 'delivered', delivered_at = $1
WHERE id = $2 AND status NOT IN ('delivered', 'read')  // ✅ Condition added!

// Only increment if row was actually updated
rowsAffected, _ := result.RowsAffected()
if rowsAffected > 0 {
    UPDATE campaigns SET delivered = delivered + 1
}
```

**Result:**
- First "delivered" webhook: Updates sent → delivered, increments counter ✅
- Duplicate "delivered" webhook: No update, counter stays same ✅

### 3. Fixed "read" Status (with smart counting)

**Challenge:** When message goes from "delivered" → "read":
- Need to **increment** read count
- Need to **decrement** delivered count (no longer just delivered, now read)

**Solution:**
```go
// Check current status first
var currentStatus string
db.QueryRow(`SELECT status FROM campaign_recipients WHERE id = $1`, recipientID).Scan(&currentStatus)

// Update to 'read'
UPDATE campaign_recipients SET status = 'read', read_at = $1 WHERE id = $2

// Update counters based on transition
if currentStatus == "delivered" {
    // Was delivered, now read: 
    // delivered - 1, read + 1
    UPDATE campaigns 
    SET delivered = GREATEST(0, delivered - 1), 
        read = read + 1
} else if currentStatus != "read" {
    // Was sent (or other), now read:
    // Just increment read
    UPDATE campaigns SET read = read + 1
}
```

**Result:**
- delivered → read: delivered decreases, read increases ✅
- Duplicate "read" webhook: No change (already read) ✅

## How It Works

### Status Transition Rules

```
pending → sent      ✅ Allowed (increment sent)
sent → sent         ❌ Blocked (no change)
sent → delivered    ✅ Allowed (increment delivered)
delivered → delivered ❌ Blocked (no change)  
delivered → read    ✅ Allowed (delivered -1, read +1)
read → read         ❌ Blocked (no change)
```

### Database-Level Protection

```sql
-- Uses WHERE clause to prevent duplicate updates
WHERE status = 'pending'           -- Only update if pending
WHERE status NOT IN ('delivered', 'read')  -- Don't update if already done
```

### Application-Level Protection

```go
// Check rows affected before incrementing counters
rowsAffected, _ := result.RowsAffected()
if rowsAffected > 0 {
    // Only increment if database actually changed something
    UPDATE campaigns SET sent = sent + 1
}
```

## Testing

### Test Duplicate Webhooks

1. **Create new campaign** with 2 recipients
2. **Send campaign**
3. **Manually trigger duplicate webhooks** (or wait for WhatsApp to send them)
4. **Check counters:**
   ```sql
   SELECT sent, delivered, failed, total_recipients 
   FROM campaigns 
   WHERE id = '<campaign_id>';
   ```
5. ✅ **Expected:** Numbers match actual recipient statuses
6. ❌ **Before:** Numbers would be 3-4x actual values

### Test Status Transitions

1. Send to 3 recipients:
   - Recipient A: pending → sent → delivered → read
   - Recipient B: pending → sent → delivered
   - Recipient C: pending → sent → failed

2. **Expected Counts:**
   ```
   total: 3
   sent: 3
   delivered: 1  (only B is still in delivered state)
   read: 1       (A moved to read)
   failed: 1     (C failed)
   ```

3. **Success Rate:** 66.7% (2 successful out of 3)

## Files Modified

**File:** `go_server/mongo_golang/campaign_handlers.go`

**Changes:**
1. **Lines 1056-1074:** Added duplicate prevention for "sent" status
   - Added `WHERE status = 'pending'` condition
   - Check `RowsAffected()` before incrementing

2. **Lines 1076-1094:** Added duplicate prevention for "delivered" status
   - Added `WHERE status NOT IN ('delivered', 'read')` condition
   - Check `RowsAffected()` before incrementing

3. **Lines 1096-1127:** Smart counting for "read" status
   - Check current status before updating
   - Decrement delivered if transitioning from delivered → read
   - Only increment read if not already read

## Important Notes

### For Existing Campaigns

This fix only applies to **new webhook events**. Existing campaigns with inflated counters will **not be automatically corrected**.

**To fix existing campaign:**
```sql
-- Recalculate from recipients table
UPDATE campaigns c
SET 
  sent = (SELECT COUNT(*) FROM campaign_recipients WHERE campaign_id = c.id AND status IN ('sent', 'delivered', 'read')),
  delivered = (SELECT COUNT(*) FROM campaign_recipients WHERE campaign_id = c.id AND status = 'delivered'),
  read = (SELECT COUNT(*) FROM campaign_recipients WHERE campaign_id = c.id AND status = 'read'),
  failed = (SELECT COUNT(*) FROM campaign_recipients WHERE campaign_id = c.id AND status = 'failed'),
  pending = (SELECT COUNT(*) FROM campaign_recipients WHERE campaign_id = c.id AND status = 'pending')
WHERE id = '<campaign_id>';
```

### For New Campaigns

✅ All new campaigns will have accurate counters
✅ Duplicate webhooks will be ignored
✅ Success rates will be correct

## Success Rate Calculation

**Formula:**
```
Success Rate = (delivered + read) / total_recipients * 100
```

**Example:**
- Total: 2
- Sent: 2
- Delivered: 1
- Read: 1
- Failed: 0

**Calculation:**
```
Success = (1 delivered + 1 read) / 2 total * 100 = 100%
```

**Before Fix:**
- Delivered: 8 (inflated)
- Success: 8/2 * 100 = 400% ❌

**After Fix:**
- Delivered: 1 (correct)
- Read: 1 (correct)
- Success: 2/2 * 100 = 100% ✅

---

**The fix is live! New campaigns will have accurate statistics.** 🚀
