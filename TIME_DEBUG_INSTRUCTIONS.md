# Time Display Debug Instructions

## Step 1: Hard Refresh Browser
Do a **hard refresh** to load the new code with debug logging:
- **Mac Chrome**: `Cmd + Shift + R`
- **Windows Chrome**: `Ctrl + Shift + R`

## Step 2: Open Browser Console
1. Press `F12` or right-click → "Inspect"
2. Go to the "Console" tab
3. Clear any old messages

## Step 3: Load Messages
Navigate to a chat with messages

## Step 4: Check Debug Logs

Look for these logs in the console:

### 1. Backend Timestamp
```
📨 Message from backend: {id: "123", created_at_raw: "...", created_at_type: "string"}
```
**Copy the `created_at_raw` value** - this is what the backend sent

### 2. Parsed Date
```
🕐 Parsed date: {iso: "...", local: "...", valid: true}
```
**Copy the `iso` value** - this is how JavaScript parsed it

### 3. Formatted Time
```
⏰ formatTimeIST input: "2025-11-28T23:08:08.000Z" → output: "11:08 pm"
```
**Copy both values** - this shows the conversion to IST

### 4. Formatted Date
```
📅 formatDateIST input: "2025-11-28T23:08:08.000Z" → output: "28/11/2025"
```

## Step 5: Share Results

Send me:
1. The `created_at_raw` value from backend
2. What time is displayed in the UI
3. What time **should** be displayed (in IST)
4. Screenshot of the console logs

## Common Issues

### Issue 1: Backend sends wrong timezone
**If backend sends**: `2025-11-28T23:08:08+05:30`
**JavaScript sees**: Already in IST, no conversion needed
**Result**: Shows wrong time (converts IST to IST again)

**Fix**: Backend should send UTC time without timezone offset

### Issue 2: Missing timezone info
**If backend sends**: `2025-11-28T23:08:08`
**JavaScript sees**: No timezone, assumes local
**Result**: Depends on your computer's timezone

**Fix**: Backend should send UTC with Z suffix: `2025-11-28T23:08:08Z`

### Issue 3: Database stores wrong time
**If database has**: Wrong timestamp
**Result**: Will always show wrong time
**Fix**: Need to fix the time when inserting to database

---

## Quick Test

If current time is **11:30 PM IST (28 Nov 2025)**:
- ISO format: `2025-11-28T18:00:00Z` (UTC)
- Should display: `11:30 pm` and `28/11/2025`

---

**Do the steps above and share the console logs!** 🔍
