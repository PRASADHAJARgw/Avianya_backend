# ✅ FINAL FIX: Dashboard OAuth Now Passes User ID

## The Problem
The Dashboard's "Connect WABA" button was **not passing the user_id** to the OAuth flow, causing it to default to `"default_user"`.

## The Solution
Updated `src/pages/whatsapp/Dashboard.tsx` to follow the **EXACT SAME PATTERN** as TemplateCreator.

## Code Changes

### Before ❌
```typescript
// Dashboard.tsx - OLD CODE
import React, { useState } from 'react';

const handleConnectWABA = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
  window.location.href = `${backendUrl}/auth/facebook`; // ❌ No user_id!
};
```

### After ✅
```typescript
// Dashboard.tsx - NEW CODE
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { user } = useAuth(); // ✅ Get authenticated user
  const { toast } = useToast();

  const handleConnectWABA = () => {
    // ✅ Check authentication
    if (!user || !user.id) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to connect your WhatsApp Business Account',
        variant: 'destructive',
      });
      return;
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
    const userId = user.id; // ✅ Get Supabase user ID
    
    // ✅ Pass user_id in OAuth URL
    window.location.href = `${backendUrl}/auth/facebook?user_id=${userId}`;
    
    console.log('Initiating WABA OAuth for user:', userId);
  };
}
```

## Consistent Pattern Across All Components

### 1️⃣ TemplateCreator.tsx ✅
```typescript
import { useAuth } from '@/contexts/AuthContext';

const { user } = useAuth();

const handleSubmit = async () => {
  const userId = user?.id || 'anonymous';
  const combinedPayload = { 
    template: templateJson,
    user_id: userId,  // ✅ Passes user ID
    user_email: user?.email,
    user_role: user?.user_metadata?.role
  };
  
  await fetch('http://localhost:8080/template', {
    method: 'POST',
    body: JSON.stringify(combinedPayload)
  });
};
```

### 2️⃣ Dashboard.tsx ✅ (NOW FIXED)
```typescript
import { useAuth } from '@/contexts/AuthContext';

const { user } = useAuth();

const handleConnectWABA = () => {
  if (!user?.id) {
    toast({ title: 'Please log in' });
    return;
  }
  
  const userId = user.id; // ✅ Passes user ID
  window.location.href = `${backendUrl}/auth/facebook?user_id=${userId}`;
};
```

### 3️⃣ FacebookAuthButton.tsx ✅ (Already Correct)
```typescript
import { useAuth } from '@/contexts/AuthContext';

const { user } = useAuth();

const handleFacebookAuth = async () => {
  const userId = user.id; // ✅ Passes user ID
  
  window.open(
    `${backendUrl}/auth/facebook?user_id=${userId}`,
    'facebook-oauth',
    'width=600,height=800'
  );
};
```

### 4️⃣ Sidebar.tsx ✅ (Already Fixed)
```typescript
import { useAuth } from '@/contexts/AuthContext';

const { user } = useAuth();

// ✅ Display actual user data
const userName = user?.user_metadata?.name || user?.email?.split('@')[0];
const userEmail = user?.email;
const userPhoto = user?.user_metadata?.avatar_url;
```

## Backend Flow (Already Implemented)

```go
// 1. OAuth Initiation
func handleFacebookAuth(w http.ResponseWriter, r *http.Request) {
    userID := r.URL.Query().Get("user_id") // ✅ Gets user_id from URL
    state := fmt.Sprintf("%d:%s", time.Now().UnixNano(), userID)
    // Redirect to Facebook with state
}

// 2. OAuth Callback
func handleOAuthRedirect(w http.ResponseWriter, r *http.Request) {
    state := r.URL.Query().Get("state")
    userID := extractFromState(state) // ✅ Extracts user_id
    
    wabaData := fetchWABAData(accessToken, userID)
    storeWABAData(wabaData, accessToken, userID) // ✅ Stores with user_id
}

// 3. Store WABA with Session Mapping
func storeWABAData(wabaData, accessToken, userID string) {
    businessID := wabaData["business_id"]
    
    // ✅ Store mapping for webhook lookup
    oauthSessionsMu.Lock()
    oauthSessions[businessID] = userID
    oauthSessionsMu.Unlock()
    
    // ✅ Store in database
    postgresDB.Exec(`INSERT INTO waba_accounts (..., user_id) VALUES (..., $1)`, userID)
}

// 4. Webhook Handler
func handleAccountUpdate(value map[string]interface{}) {
    businessID := value["owner_business_id"]
    
    // ✅ Look up user_id from session mapping
    oauthSessionsMu.RLock()
    userID, found := oauthSessions[businessID]
    oauthSessionsMu.RUnlock()
    
    if !found {
        // Fallback: check database
        postgresDB.QueryRow(`SELECT user_id FROM waba_accounts WHERE business_id = $1`, businessID)
    }
    
    // ✅ Store with authenticated user_id
    postgresDB.Exec(`INSERT INTO waba_accounts (..., user_id) VALUES (..., $1)`, userID)
}
```

## Testing Instructions

### 1. Test Dashboard OAuth Flow

```bash
# 1. Start backend
cd go_server/mongo_golang
go run .

# 2. Start frontend (new terminal)
npm run dev

# 3. Login to the app
# Navigate to http://localhost:3000/login
# Login with: test@example.com / password123

# 4. Go to Dashboard
# Click "Connect WABA" button

# 5. Check backend logs - should see:
# ✅ user_id=9332986b-424b-4d83-9559-f7c9a0e16e55 (your Supabase UUID)
# NOT ❌ user_id=default_user
```

### 2. Verify in Database

```sql
-- Check WABA is saved with correct user_id
SELECT waba_id, user_id, owner_business_id, created_at 
FROM waba_accounts 
ORDER BY created_at DESC 
LIMIT 1;

-- Expected result:
-- user_id should be your Supabase UUID, NOT "default_user"
```

## Expected Backend Logs (Success)

```
✅ OAuth initiated for user: 9332986b-424b-4d83-9559-f7c9a0e16e55
🔗 Redirecting to Facebook OAuth: user_id=9332986b-424b-4d83-9559-f7c9a0e16e55
✅ OAuth callback received: state=1764097189:9332986b-424b-4d83-9559-f7c9a0e16e55
📝 Extracted user_id from state: 9332986b-424b-4d83-9559-f7c9a0e16e55
✅ Access token obtained for user: 9332986b-424b-4d83-9559-f7c9a0e16e55
📝 Stored OAuth session mapping: business_id=1786936435511275 -> user_id=9332986b-424b-4d83-9559-f7c9a0e16e55
✅ Stored WABA account: 811978564885194 for user: 9332986b-424b-4d83-9559-f7c9a0e16e55
📱 Webhook received...
📝 Found user_id from OAuth session: 9332986b-424b-4d83-9559-f7c9a0e16e55
✅ WABA stored in database for user: 9332986b-424b-4d83-9559-f7c9a0e16e55!
```

## Summary of All Changes

| File | Status | What Changed |
|------|--------|-------------|
| **Backend: main.go** | ✅ Done | Added OAuth session tracking, webhook user lookup |
| **Frontend: Dashboard.tsx** | ✅ JUST FIXED | Now uses useAuth() and passes user.id |
| **Frontend: TemplateCreator.tsx** | ✅ Already Working | Uses useAuth() and passes user.id |
| **Frontend: FacebookAuthButton.tsx** | ✅ Already Working | Uses useAuth() and passes user.id |
| **Frontend: Sidebar.tsx** | ✅ Already Fixed | Uses useAuth() to display user info |

## 🎯 Key Takeaway

**Every component that needs user context must:**

1. Import useAuth from AuthContext
2. Get the user object: `const { user } = useAuth()`
3. Use user.id when making API calls or redirects
4. Handle the case where user is null (not logged in)

This is now **consistent across the entire application**! 🎉

---
**Date**: November 26, 2025  
**Status**: ✅ COMPLETE - Ready to Test
