# ✅ FIXED: Campaign Creation Database Error

## Issue

When creating a campaign, got error:
```
📥 Server response: 500 Database error
❌ Create campaign error: Error: Database error
```

## Root Cause

**PostgreSQL JSONB Scanning Error**

The Go code was trying to scan a PostgreSQL JSONB column directly into a `map[string]interface{}`:

```go
// BEFORE (BROKEN):
err := db.QueryRow(`
    SELECT id, name, language, category, status, payload
    FROM templates
    WHERE id = $1 AND user_id = $2
`, req.TemplateID, req.UserID).Scan(
    &template.ID,
    &template.Name,
    &template.Language,
    &template.Category,
    &template.Status,
    &template.Payload,  // ❌ Can't scan JSONB directly into map
)
```

**Error Message** (from server logs):
```
sql: Scan error on column index 5, name "payload": 
unsupported Scan, storing driver.Value type []uint8 into type *map[string]interface {}
```

## Solution

**Two-Step Process**: Scan into byte slice first, then unmarshal JSON

```go
// AFTER (FIXED):
var template Template
var payloadBytes []byte  // ✅ Step 1: Scan into byte slice

err := db.QueryRow(`
    SELECT id, name, language, category, status, payload
    FROM templates
    WHERE id = $1 AND user_id = $2
`, req.TemplateID, req.UserID).Scan(
    &template.ID,
    &template.Name,
    &template.Language,
    &template.Category,
    &template.Status,
    &payloadBytes,  // ✅ Scan JSONB as bytes
)

// ✅ Step 2: Unmarshal JSON bytes into map
if len(payloadBytes) > 0 {
    if err := json.Unmarshal(payloadBytes, &template.Payload); err != nil {
        log.Printf("Error unmarshaling template payload: %v", err)
        http.Error(w, "Invalid template payload", http.StatusInternalServerError)
        return
    }
}
```

## Why This Happened

- PostgreSQL JSONB columns return data as `[]byte` (byte array)
- Go's `database/sql` package doesn't automatically unmarshal JSON
- Need to manually unmarshal the bytes into the target struct

## Files Modified

**File**: `go_server/mongo_golang/campaign_handlers.go`
- **Lines**: 396-423 (approximately)
- **Function**: `handleCreateCampaign()`
- **Change**: Added byte slice intermediary and JSON unmarshal step

## Testing

1. **Server restarted** with the fix
2. **Try creating a campaign** again:
   - Enter campaign name
   - Select template (e.g., "tabel_booking")
   - Upload Excel file with columns:
     - `country_code`
     - `phone_number`
     - Any template parameters
   - Click "Create Campaign"

3. **Expected result**: ✅ Campaign created successfully

## Console Output

After fix, you should see:
```
📤 Creating campaign with data: {...}
✅ Campaign created: {...}
```

Instead of:
```
📥 Server response: 500 Database error
❌ Create campaign error: Error: Database error
```

## Server Status

✅ **Fixed code applied**
✅ **Server restarted** (PID: 96755)
✅ **Running on port 8080**
✅ **Campaign routes registered**

---

## Technical Notes

### PostgreSQL JSONB in Go

When working with JSONB columns in PostgreSQL from Go:

**Option 1**: Use byte slice (used in this fix)
```go
var jsonBytes []byte
db.QueryRow("SELECT json_column FROM table").Scan(&jsonBytes)
json.Unmarshal(jsonBytes, &targetStruct)
```

**Option 2**: Use `database/sql/driver.Valuer` interface
```go
type JSONMap map[string]interface{}

func (j *JSONMap) Scan(value interface{}) error {
    bytes, ok := value.([]byte)
    if !ok {
        return errors.New("type assertion to []byte failed")
    }
    return json.Unmarshal(bytes, j)
}
```

**Option 3**: Use `lib/pq` specific types
```go
import "github.com/lib/pq"
// But we're not using this package in this project
```

We used **Option 1** as it's the simplest and doesn't require custom types.

---

**Date**: December 5, 2025  
**Status**: ✅ FIXED  
**Action**: Refresh browser and try creating campaign again!
