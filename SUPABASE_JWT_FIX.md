# Supabase JWT Token Validation Fix

## Problem
The backend is rejecting Supabase JWT tokens with "Invalid or expired token" error because it's trying to validate them with the wrong JWT secret.

## Root Cause
- **Frontend**: Uses Supabase authentication and sends Supabase JWT tokens (access_token from Supabase session)
- **Backend**: Was only validating tokens with its own JWT_SECRET, not the Supabase JWT secret
- **Result**: All API calls fail with "Invalid or expired token"

## Solution Implemented

### 1. Backend Changes (Go Server)

#### Added Supabase JWT Secret Support
- Added `supabaseJWTSecret` variable to store Supabase's JWT secret
- Modified `validateToken()` function to try BOTH secrets:
  1. First tries backend's JWT_SECRET (for legacy tokens)
  2. If that fails, tries Supabase JWT secret
  3. Extracts user_id from 'sub' claim for Supabase tokens

#### Files Modified
- `go_server/mongo_golang/main.go` - Added supabaseJWTSecret variable and initialization
- `go_server/mongo_golang/auth_handlers.go` - Updated validateToken() to handle both token types

### 2. Configuration Required

#### Get Supabase JWT Secret
1. Go to your Supabase project dashboard: https://app.supabase.com/
2. Navigate to: **Settings** → **API** → **JWT Settings**
3. Look for **JWT Secret** (it's a long base64-encoded string)
4. Copy this secret

#### Update .env File
Add the Supabase JWT secret to `/go_server/mongo_golang/.env`:

```env
# Supabase JWT Secret - For validating Supabase access tokens
# Get this from: Supabase Dashboard → Settings → API → JWT Settings → JWT Secret
SUPABASE_JWT_SECRET=your-actual-supabase-jwt-secret-here
```

**Important**: Replace `your-actual-supabase-jwt-secret-here` with the actual JWT secret from your Supabase dashboard.

### 3. Restart Backend
After updating the .env file, restart the Go backend:

```bash
cd /Users/prasadhajare/Prasad_dev/whats_app_dev/msg-canvas-flow-main/go_server/mongo_golang
pkill -f mongo_golang  # Stop existing process
./mongo_golang         # Start with new config
```

You should see:
```
✅ Supabase JWT secret loaded successfully
```

## Testing

### 1. Check Logs
The backend will now log which secret validated the token:
- `✅ Token validated with backend JWT secret` - Legacy token
- `✅ Token validated with Supabase JWT secret` - Supabase token
- `✅ Extracted user_id from 'sub' claim: <user_id>` - User ID extraction

### 2. Frontend Test
1. Login to the frontend
2. The Header component should now successfully fetch WABA status
3. Check browser console for:
   - `✅ WABA status data: {...}`
   - Should NOT see "Invalid or expired token"

### 3. API Test
Test the API directly with a Supabase token:

```bash
# Get token from browser console or Supabase client
TOKEN="your-supabase-access-token"

# Test WABA status endpoint
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/waba/status?user_id=<user_id>"
```

Expected response:
```json
{
  "success": true,
  "connected": true/false,
  "accounts": [...]
}
```

## Verification Steps

1. ✅ Backend code updated to support both JWT secrets
2. ⏳ Need to add Supabase JWT secret to .env file
3. ⏳ Need to restart backend server
4. ⏳ Test authentication and WABA status API

## Additional Notes

### Token Flow
1. User logs in via Supabase → Gets access_token
2. Frontend stores token in Supabase session
3. Frontend sends token in Authorization header: `Bearer <token>`
4. Backend validates token with Supabase JWT secret
5. Backend extracts user_id from token's 'sub' claim
6. Backend processes request with user_id

### Security
- Both secrets are stored securely in .env file
- Never commit secrets to git
- The SUPABASE_JWT_SECRET is different from:
  - SUPABASE_ANON_KEY (public key for client-side)
  - SUPABASE_SERVICE_ROLE_KEY (admin key for server-side operations)

### Fallback Behavior
The backend will:
1. Try backend JWT_SECRET first (for backward compatibility)
2. Fall back to Supabase JWT secret if first validation fails
3. This allows both types of tokens to work simultaneously

## Next Steps

1. **IMMEDIATE**: Add Supabase JWT secret to .env file
2. Restart backend server
3. Test authentication flow
4. Verify WABA status API works
5. Remove debug logging once confirmed working

## Common Issues

### "Warning: SUPABASE_JWT_SECRET not set"
- Solution: Add the JWT secret to .env file

### Still getting "Invalid or expired token"
- Check if JWT secret is correct (copy from Supabase dashboard)
- Verify .env file has no extra spaces or quotes
- Restart backend after updating .env
- Check token is being sent correctly from frontend

### "User not found" after successful token validation
- The user_id from Supabase token must exist in your users table
- Check if user was created during signup/login
- Verify user_id format matches between Supabase and your database
