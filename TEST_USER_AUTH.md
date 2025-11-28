# User Authentication Testing Guide

## Overview
This guide will help you verify that both **Templates** and **WABA** are correctly saved with the authenticated user's ID from Supabase.

## ✅ What Was Fixed

### 1. **Sidebar User Display**
- **Before**: Showed hardcoded `"User"` and `"user@example.com"`
- **After**: Shows actual Supabase user's name and email
- **Location**: `src/components/whatsapp/Sidebar.tsx`

### 2. **WABA Registration**
- **Before**: All WABA connections saved as `"default_user"`
- **After**: WABA saved with actual Supabase user ID
- **Location**: `go_server/mongo_golang/main.go`

### 3. **Template Saving**
- **Already Working**: Templates save with authenticated user ID
- **Location**: `src/components/whatsapp/TemplateCreator.tsx`

## 🧪 Testing Steps

### Part 1: Verify User Display in Sidebar

1. **Start the backend**:
   ```bash
   cd go_server/mongo_golang
   go run .
   ```

2. **Start the frontend**:
   ```bash
   npm run dev
   ```

3. **Login to the application**:
   - Navigate to `http://localhost:3000/login`
   - Login with your Supabase credentials
   - Example: `test@example.com` / `password123`

4. **Check the sidebar**:
   - ✅ Your email should appear at the bottom (not "user@example.com")
   - ✅ Your user avatar/initials should show
   - ✅ Click the avatar to see your profile dropdown

### Part 2: Verify Template Saving with User ID

1. **Create a new template**:
   - Navigate to **Templates** → **Create New**
   - Fill in template details:
     ```
     Template Name: test_user_template
     Category: MARKETING
     Body: Hello {{1}}, this is a test!
     Sample: John
     ```

2. **Submit the template**

3. **Verify in database**:
   ```sql
   -- Check the template was saved with your user_id
   SELECT id, name, user_id, created_at 
   FROM templates 
   WHERE name = 'test_user_template'
   ORDER BY created_at DESC 
   LIMIT 1;
   ```

   **Expected Result**:
   ```
   id  | name                | user_id                              | created_at
   ----+---------------------+--------------------------------------+------------
   123 | test_user_template  | a1b2c3d4-e5f6-7890-abcd-ef1234567890 | 2025-11-26...
   ```

   ✅ The `user_id` should match your Supabase user UUID, **not** "default_user" or "anonymous"

### Part 3: Verify WABA Registration with User ID

1. **Connect WhatsApp Business Account**:
   - Navigate to **Dashboard**
   - Click **"Connect WhatsApp Business"** button
   - Complete Facebook OAuth flow
   - Allow permissions for WhatsApp Business

2. **Wait for webhook** (check backend logs):
   ```
   📝 Stored OAuth session mapping: business_id=1786936435511275 -> user_id=a1b2c3d4...
   ✅ WABA stored in database for user: a1b2c3d4-e5f6-7890-abcd-ef1234567890!
   ```

3. **Verify in database**:
   ```sql
   -- Check WABA was saved with your user_id
   SELECT waba_id, user_id, owner_business_id, created_at 
   FROM waba_accounts 
   ORDER BY created_at DESC 
   LIMIT 1;
   ```

   **Expected Result**:
   ```
   waba_id          | user_id                              | owner_business_id   | created_at
   -----------------+--------------------------------------+---------------------+------------
   811978564885194  | a1b2c3d4-e5f6-7890-abcd-ef1234567890 | 1786936435511275    | 2025-11-26...
   ```

   ✅ The `user_id` should match your Supabase user UUID, **not** "default_user"

4. **Check phone numbers**:
   ```sql
   -- Verify phone numbers are associated with the WABA
   SELECT phone_number_id, waba_id, display_phone_number, is_registered 
   FROM phone_numbers 
   WHERE waba_id = '811978564885194';
   ```

### Part 4: Multi-User Testing

Test with two different users to verify isolation:

#### User 1 (test1@example.com):
1. Login as User 1
2. Connect WABA
3. Create a template named "user1_template"

#### User 2 (test2@example.com):
1. Logout from User 1
2. Login as User 2
3. Connect WABA (different account)
4. Create a template named "user2_template"

#### Verify Isolation:
```sql
-- Check templates are separated by user
SELECT id, name, user_id 
FROM templates 
WHERE name IN ('user1_template', 'user2_template')
ORDER BY name;

-- Check WABAs are separated by user
SELECT waba_id, user_id 
FROM waba_accounts 
ORDER BY user_id;
```

**Expected**: Each user should only see their own templates and WABA accounts.

## 🔍 Debugging

### Backend Logs to Watch

When OAuth completes successfully:
```
✅ Access token obtained for user: a1b2c3d4-e5f6-7890-abcd-ef1234567890
📝 Stored OAuth session mapping: business_id=1786936435511275 -> user_id=a1b2c3d4...
✅ Stored WABA account: 811978564885194 for user: a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

When webhook arrives:
```
📱 Processing WhatsApp Business Account webhook
📊 Account Event: PARTNER_APP_INSTALLED
📝 Found user_id from OAuth session: a1b2c3d4-e5f6-7890-abcd-ef1234567890
✅ WABA stored in database for user: a1b2c3d4-e5f6-7890-abcd-ef1234567890!
```

### Common Issues

#### Issue 1: Still seeing "default_user"
**Cause**: OAuth session mapping not found, falling back to default
**Solution**: 
- Ensure you complete the full OAuth flow
- Check backend logs for session storage confirmation
- Verify `oauthSessions` map is populated

#### Issue 2: User email not showing in sidebar
**Cause**: Supabase user not loaded
**Solution**:
- Check if logged in (localStorage should have supabase auth tokens)
- Verify AuthContext is properly wrapped around App
- Check browser console for auth errors

#### Issue 3: Templates saving as "anonymous"
**Cause**: User object is null when submitting
**Solution**:
- Ensure user is logged in before creating template
- Check `useAuth()` returns valid user object
- Verify JWT token is valid

## 📊 Database Schema

### users table:
```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255),
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### templates table:
```sql
-- Key columns:
id SERIAL PRIMARY KEY,
name VARCHAR(255),
user_id VARCHAR(255), -- Supabase user UUID
tenant_id BIGINT,
...
```

### waba_accounts table:
```sql
-- Key columns:
id VARCHAR(255) PRIMARY KEY,
waba_id VARCHAR(255) UNIQUE,
user_id VARCHAR(255), -- Supabase user UUID
owner_business_id VARCHAR(255),
access_token TEXT,
...
```

## ✨ Success Criteria

All tests pass when:

✅ Sidebar shows your actual email (not "user@example.com")  
✅ Templates save with your Supabase user UUID  
✅ WABA saves with your Supabase user UUID  
✅ Phone numbers link correctly to WABA  
✅ Different users see only their own data  
✅ No "default_user" or "anonymous" values in production use  

## 🚀 Next Steps

After confirming everything works:

1. **Deploy to production** with proper environment variables
2. **Set up monitoring** for user-related errors
3. **Document** the authentication flow for new developers
4. **Consider** adding user management UI (admin panel)
5. **Implement** proper role-based access control (RBAC)

## 📝 Summary of Changes

| Component | Before | After |
|-----------|--------|-------|
| **Sidebar** | Hardcoded mock user | Real Supabase user data |
| **Templates** | ✅ Already using user_id | ✅ No changes needed |
| **WABA** | `default_user` hardcoded | Real Supabase user_id from OAuth |
| **Phone Numbers** | ✅ Linked to WABA | ✅ Indirectly linked to user |

## 🔗 Related Files

- Frontend:
  - `src/components/whatsapp/Sidebar.tsx` - User display
  - `src/components/whatsapp/TemplateCreator.tsx` - Template submission
  - `src/components/whatsapp/FacebookAuthButton.tsx` - OAuth initiation
  - `src/contexts/AuthContext.tsx` - Supabase authentication

- Backend:
  - `go_server/mongo_golang/main.go` - All user auth logic
  - `go_server/mongo_golang/WABA_USER_AUTH_FIX.md` - Detailed implementation docs

---

**Last Updated**: November 26, 2025  
**Status**: ✅ Ready for Testing
