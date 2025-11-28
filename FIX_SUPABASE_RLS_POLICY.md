# 🔐 Fix Supabase Storage Security Policy

## The Issue
```
❌ Failed to upload to Supabase (status 400): 
{"statusCode":"403","error":"Unauthorized","message":"new row violates row-level security policy"}
```

**What happened:**
- ✅ Image downloaded from WhatsApp
- ❌ Supabase blocked the upload due to RLS (Row-Level Security) policy

## Quick Fix (2 minutes)

### Option 1: Disable RLS for Storage (Recommended for Development)

1. **Go to Supabase Dashboard**
   - URL: https://app.supabase.com/project/ucqnbhbluzqtnarcogrm

2. **Navigate to Storage → Policies**
   - Click **Storage** in left sidebar
   - Click on the `whatsapp-media` bucket
   - Click the **Policies** tab

3. **Add INSERT Policy**
   Click **"New Policy"** → **"For full customization"**
   
   **Policy Name:** `Allow all inserts`
   
   **Policy Command:** `INSERT`
   
   **Target Roles:** Select `public` and `anon`
   
   **Using Expression:** `true`
   
   **With Check Expression:** `true`
   
   Click **Save Policy**

4. **Add SELECT Policy** (so images can be viewed)
   Click **"New Policy"** again
   
   **Policy Name:** `Allow public read`
   
   **Policy Command:** `SELECT`
   
   **Target Roles:** Select `public` and `anon`
   
   **Using Expression:** `true`
   
   Click **Save Policy**

### Option 2: Use SQL (Faster)

1. **Go to SQL Editor**
   - Click **SQL Editor** in left sidebar

2. **Run this SQL:**
```sql
-- Allow anyone to upload to whatsapp-media bucket
CREATE POLICY "Allow all uploads to whatsapp-media"
ON storage.objects FOR INSERT
TO public, anon
WITH CHECK (bucket_id = 'whatsapp-media');

-- Allow anyone to read from whatsapp-media bucket
CREATE POLICY "Allow public read from whatsapp-media"
ON storage.objects FOR SELECT
TO public, anon
USING (bucket_id = 'whatsapp-media');
```

3. Click **Run** (or press Cmd+Enter)

### Option 3: Simplest - Use Supabase Service Role Key

This bypasses RLS completely (good for backend services):

1. **Get Service Role Key**
   - Go to **Settings** → **API**
   - Copy the **service_role** key (starts with `eyJ...`)
   - ⚠️ **Warning:** This key has full access - keep it secret!

2. **Update .env**
   Open: `go_server/mongo_golang/.env`
   
   Change from:
   ```env
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   
   To:
   ```env
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0...
   ```
   (Use your actual service_role key)

3. **Restart Backend**
   ```bash
   cd go_server/mongo_golang
   pkill -f backend
   ./backend > backend.log 2>&1 &
   ```

## Which Option Should I Use?

| Option | Security | Ease | Best For |
|--------|----------|------|----------|
| **Option 1** (Policies) | ✅ Good | Medium | Production with auth |
| **Option 2** (SQL) | ✅ Good | Easy | Production with auth |
| **Option 3** (Service Key) | ⚠️ Backend only | Easiest | Backend services |

**Recommendation:** Use **Option 3** (Service Role Key) since this is a backend service that needs to upload on behalf of users.

## Step-by-Step for Option 3 (Recommended)

### 1. Get Service Role Key

```bash
# Go to Supabase Dashboard
open https://app.supabase.com/project/ucqnbhbluzqtnarcogrm/settings/api
```

Look for **Project API keys** section:
- Find `service_role` row
- Click the eye icon 👁️ to reveal the key
- Click to copy the key

### 2. Update .env File

The key will look like this (but longer):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjcW5iaGJsdXpxdG5hcmNvZ3JtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzY0MDYzNSwiZXhwIjoyMDc5MjE2NjM1fQ.XXX-your-signature-XXX
```

Replace in `.env`:
```env
SUPABASE_ANON_KEY=<paste-your-service-role-key-here>
```

### 3. Restart Backend

```bash
cd /Users/prasadhajare/Prasad_dev/whats_app_dev/msg-canvas-flow-main/go_server/mongo_golang
pkill -f backend
sleep 2
./backend > backend.log 2>&1 &
```

### 4. Test Again

Send another image via WhatsApp and you should see:
```
✅ Media uploaded to Supabase: https://ucqnbhbluzqtnarcogrm.supabase.co/storage/v1/object/public/whatsapp-media/...
```

## Current Status

```
✅ Backend running
✅ Supabase credentials configured
✅ Storage bucket created
✅ Image received from WhatsApp
✅ Image downloaded (working!)
❌ Upload blocked by RLS policy ← FIX THIS NOW
```

## After Fixing

You should see in logs:
```
2025/11/28 23:XX:XX 📥 Downloading media from WhatsApp: media_id=XXXXXXX
2025/11/28 23:XX:XX ✅ Got media URL: https://lookaside.fbsbx.com/...
2025/11/28 23:XX:XX ✅ Downloaded media: XXXXX bytes
2025/11/28 23:XX:XX ✅ Media uploaded to Supabase: https://ucqnbhbluzqtnarcogrm.supabase.co/storage/v1/object/public/whatsapp-media/whatsapp_media/917755991051_1764354006.jpg
```

---

**Choose your fix method above and apply it now!** 🚀
