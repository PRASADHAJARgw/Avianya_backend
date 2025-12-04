# Template Status Update Fix

## Problem
The WhatsApp template approval webhook was receiving status updates from Meta (e.g., "APPROVED") and updating the database correctly, but the frontend UI was still showing the old status (`pending_meta_submission`).

## Root Cause
The database has two separate status columns:
- `status` - The initial status when template is created
- `meta_status` - The status updated by Meta webhooks

The webhook handler (`handleTemplateStatusUpdate`) was correctly updating the `meta_status` column when Meta approved/rejected templates, but the `/templates` API endpoint was only reading and returning the `status` column.

## Solution
Updated two API endpoints in `go_server/mongo_golang/main.go`:

### 1. `/templates` endpoint (handleTemplates function)
- **Added** `meta_status` to the SELECT query
- **Modified** the row scanning to include `meta_status`
- **Implemented** logic to use `meta_status` if available, falling back to `status` if not
- This ensures the API returns the latest status from Meta

### 2. `/template/:id` endpoint (handleTemplateByID function)
- **Applied the same fix** as above for consistency
- Ensures single template retrieval also shows correct status

## Code Changes

### Query Updates
```go
// Before
SELECT id, name, category, status, language, lang_code, ...

// After
SELECT id, name, category, status, meta_status, language, lang_code, ...
```

### Status Priority Logic
```go
// Use meta_status if available, otherwise fall back to status
finalStatus := status
if metaStatus.Valid && metaStatus.String != "" {
    finalStatus = metaStatus.String
}
```

## Testing
Verified the fix works:
```bash
curl -s http://localhost:8080/templates \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"user_id":"3f947ab3-f228-4d1c-9c2f-5bfb5f8a5fd5"}' \
  | jq -r '.[0] | "ID: \(.id), Name: \(.name), Status: \(.status)"'
```

Result: `ID: 24, Name: tabel_booking, Status: approved` ✅

## Impact
- Frontend now correctly displays template approval status
- No database migration needed (columns already exist)
- Backward compatible (falls back to `status` if `meta_status` is null)
- All template APIs now consistent

## Next Steps
1. Refresh the frontend browser to see the updated status
2. The template with ID 24 (`tabel_booking`) should now show `approved` status
3. Future webhook updates will automatically reflect in the UI

---
**Fixed on:** December 5, 2025
**Backend Server:** Running on port 8080
