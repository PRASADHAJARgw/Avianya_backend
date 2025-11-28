# Supabase Storage Setup for Media Files

## Required Storage Bucket

The live chat feature requires a Supabase storage bucket to store media files (images, videos, documents) sent via WhatsApp.

### Setup Steps

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Navigate to Storage**: Click on "Storage" in the left sidebar
3. **Create a new bucket**:
   - Click "New Bucket"
   - Bucket name: `chat-media`
   - Make it **Public** (so WhatsApp can access the media URLs)
   - Click "Create bucket"

4. **Set up bucket policies** (if needed):
   - Click on the `chat-media` bucket
   - Go to "Policies" tab
   - Enable public access for reading files
   - You can restrict uploads to authenticated users only

### Bucket Configuration

- **Bucket name**: `chat-media`
- **Public**: Yes (required for WhatsApp to fetch media)
- **File path structure**: `whatsapp-media/{user_id}/{timestamp}-{random}.{ext}`
- **Supported file types**: All media types supported by WhatsApp

### Example Policy

If you need to create a custom policy:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'chat-media');

-- Allow public read access
CREATE POLICY "Public can read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'chat-media');

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'chat-media' AND (storage.foldername(name))[1] = auth.uid()::text);
```

### Testing

After setup, test by:
1. Opening the live chat interface
2. Clicking the paperclip icon
3. Selecting "Photos & videos" or "File"
4. Choosing a file and sending it
5. Verify the file appears in the Supabase Storage bucket
6. Verify the message is sent to WhatsApp with the media

## Troubleshooting

### Error: "Failed to upload file"
- Ensure the bucket exists and is named exactly `chat-media`
- Check that the bucket is public
- Verify your Supabase credentials in the frontend

### Error: "WhatsApp cannot access media"
- Make sure the bucket is set to **Public**
- Check the generated URL is accessible in a browser
- Verify WhatsApp's servers can reach your Supabase storage

### Error: "Storage quota exceeded"
- Check your Supabase plan limits
- Clean up old media files if needed
- Consider implementing automatic cleanup for old files
