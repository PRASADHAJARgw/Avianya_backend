# URGENT: Supabase Storage Setup Required for Media Messages

## Current Issue
✅ Image received from WhatsApp webhook
✅ Media downloaded from WhatsApp (87,345 bytes)
❌ **Upload to Supabase failed: credentials not configured**
⚠️ **WhatsApp media URLs expire after ~5 minutes**

The image was saved with the temporary WhatsApp URL which will expire soon!

## Quick Fix Steps

### 1. Get Your Supabase Credentials

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### 2. Update Your `.env` File

Open: `go_server/mongo_golang/.env`

Replace these lines:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

With your actual values:
```env
SUPABASE_URL=https://your-actual-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key...
```

### 3. Create Supabase Storage Bucket

In your Supabase dashboard:

1. Go to **Storage** in the left sidebar
2. Click **Create a new bucket**
3. Bucket name: `whatsapp-media`
4. Make it **Public** (check the "Public bucket" option)
5. Click **Create bucket**

### 4. Set Bucket Policies (Important!)

After creating the bucket, click on it and go to **Policies**:

#### Allow Public READ Access
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'whatsapp-media' );
```

#### Allow Authenticated UPLOAD
```sql
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'whatsapp-media' );
```

Or simply toggle "Public Access" ON for the bucket in the UI.

### 5. Restart Backend

After updating the `.env` file:

```bash
cd go_server/mongo_golang
pkill -f "backend"
go build -o backend .
./backend > backend.log 2>&1 &
```

### 6. Test Again

Send another image via WhatsApp and check the logs:

```bash
tail -f backend.log | grep -A 10 "Downloading media"
```

You should see:
```
✅ Downloaded media: XXX bytes
✅ Media uploaded to Supabase: https://xxx.supabase.co/storage/v1/object/public/whatsapp-media/...
```

## Alternative: Use Temporary WhatsApp URLs (Not Recommended)

If you can't set up Supabase immediately, you can modify the code to use WhatsApp's temporary URLs directly, but they expire in ~5 minutes!

### Temporary Fix (for testing only):

In `main.go`, comment out the Supabase upload check:

```go
// Step 3: Upload to Supabase storage
// supabaseURL := os.Getenv("SUPABASE_URL")
// supabaseKey := os.Getenv("SUPABASE_ANON_KEY")
// 
// if supabaseURL == "" || supabaseKey == "" {
// 	log.Printf("❌ Supabase credentials not configured")
// 	return ""
// }

// TEMPORARY: Return WhatsApp URL directly (expires in 5 minutes!)
log.Printf("⚠️ Using temporary WhatsApp URL (will expire!)")
return mediaInfo.URL
```

But this is **NOT recommended** for production because:
- URLs expire after ~5 minutes
- Old messages won't show images
- WhatsApp has rate limits on media access

## Why Supabase Storage?

1. ✅ **Permanent storage** - URLs never expire
2. ✅ **Fast CDN delivery** - Global edge network
3. ✅ **Scalable** - Handle millions of files
4. ✅ **Free tier** - 1GB storage included
5. ✅ **Access control** - Fine-grained permissions

## Current Status

```
📥 Media Download: ✅ Working (87KB downloaded)
💾 Supabase Upload: ❌ Missing credentials
💬 Chat Display: ⚠️ Using expired WhatsApp URL
```

## Next Steps

1. ⏰ **URGENT**: Add Supabase credentials to `.env`
2. 🪣 Create `whatsapp-media` storage bucket
3. 🔄 Restart backend
4. 📸 Test with new image

---

**Note**: The current image you sent is stored with a temporary WhatsApp URL that will expire. After setting up Supabase, send a new test image to see it working properly!
