# WhatsApp Media Messages Webhook Implementation

## Summary
Updated the webhook handler to properly process incoming media messages (images, videos, documents, audio) from WhatsApp and store them in Supabase storage.

## Changes Made

### 1. Enhanced Webhook Message Handler (`main.go`)
Updated `handleMessagesWebhook` function to extract media messages:

- **Image Messages**: Extracts media ID, URL, caption, mime type, and SHA256
- **Video Messages**: Extracts media ID, URL, caption, and mime type
- **Document Messages**: Extracts media ID, URL, filename, and mime type
- **Audio Messages**: Extracts media ID, URL, and mime type

### 2. New Media Download Function
Created `downloadAndStoreWhatsAppMedia()` that:

1. **Gets Access Token**: Retrieves WhatsApp access token from database (phone_numbers + waba_accounts join)
2. **Fetches Media Info**: Calls WhatsApp API to get media URL and metadata
   ```
   GET https://graph.facebook.com/v19.0/{media_id}
   ```
3. **Downloads Media**: Downloads the actual media file from WhatsApp
4. **Uploads to Supabase**: Stores media in Supabase Storage bucket `whatsapp-media`
5. **Returns Public URL**: Returns the public Supabase URL for the media

### 3. Updated Database Save Function
Modified `saveIncomingMessageToDB()` to:
- Accept `mediaURL` and `mediaCaption` parameters
- Store media information in the `chat_messages` table
- Handle SQL NULL values properly for optional media fields

### 4. Removed Deprecated Function
Removed unused `getWhatsAppMediaURL()` function that was replaced by the new comprehensive media handler.

## Media Flow

```
WhatsApp → Webhook → Extract Media ID → Download from WhatsApp → Upload to Supabase → Save URL in DB → Broadcast to Frontend
```

## Database Schema Support
The implementation uses these fields in `chat_messages`:
- `content`: Message text or placeholder (e.g., "[Image]", "[Video]")
- `message_type`: "text", "image", "video", "document", "audio"
- `media_url`: Supabase public URL for the media
- `media_caption`: Optional caption for image/video

## Webhook Event Example

```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "field": "messages",
      "value": {
        "messages": [{
          "from": "917755991051",
          "id": "wamid.xxx",
          "type": "image",
          "timestamp": "1764353094",
          "image": {
            "id": "1598877961477642",
            "mime_type": "image/jpeg",
            "sha256": "d07IM7o/1fOtXU0F6AKYJx51q3szLdObgKTwHPxjuWc=",
            "url": "https://lookaside.fbsbx.com/whatsapp_business/attachments/..."
          }
        }]
      }
    }]
  }]
}
```

## Environment Variables Required
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anon key for storage uploads
- `WA_TOKEN`: Fallback WhatsApp access token (if not in database)

## Supabase Storage Setup
Ensure the `whatsapp-media` storage bucket exists and has:
- Public read access
- Appropriate file size limits
- MIME type restrictions if needed

## File Organization
Media files are stored with the pattern:
```
whatsapp_media/{customer_phone}_{timestamp}.{extension}
```

Example: `whatsapp_media/917755991051_1764353094.jpg`

## Supported Media Types
- **Images**: .jpg, .png
- **Videos**: .mp4
- **Documents**: .pdf and others
- **Audio**: .mp3

## Testing
1. Send an image via WhatsApp to your business number
2. Check webhook logs for media download progress
3. Verify media appears in Supabase Storage
4. Confirm frontend displays the image in chat

## Next Steps
- Add error handling for Supabase storage failures
- Implement retry logic for failed downloads
- Add media file validation (size, type)
- Consider CDN caching for frequently accessed media
- Add cleanup job for old media files

## Backend Restart
After making these changes, restart the backend:
```bash
cd go_server/mongo_golang
pkill -f "backend"
go build -o backend .
./backend > backend.log 2>&1 &
```

## Status
✅ Backend code updated
✅ Media download and storage implemented
✅ Database integration complete
✅ Backend rebuilt and restarted
⏳ Ready for testing with WhatsApp media messages
