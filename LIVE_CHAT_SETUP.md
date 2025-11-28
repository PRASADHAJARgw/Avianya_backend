# Live Chat Integration Setup Guide

## Overview
This project now includes an integrated live chat system with Supabase authentication. The live chat components have been adapted from Next.js to work with Vite + React Router.

## What Was Integrated

### 1. Authentication System
- **Supabase Client**: Browser-based Supabase client (`src/lib/supabase/client.ts`)
- **Auth Context**: React Context for authentication state management (`src/contexts/AuthContext.tsx`)
- **Protected Routes**: Route wrapper for authenticated pages (`src/components/ProtectedRoute.tsx`)

### 2. Login & Password Reset
- **Login Page**: `/wa/live-chat/login` - User authentication interface
- **Forgot Password**: `/wa/live-chat/forgot-password` - Password reset functionality
- Located in: `src/pages/whatsapp/LiveChatLogin.tsx` and `src/pages/whatsapp/ForgotPassword.tsx`

### 3. Chat Panel
- **Live Chat Panel**: `/wa/live-chat/chats` - Main authenticated chat interface
- Features:
  - User authentication display
  - Sign out functionality
  - Integration with existing ChatList and ChatWindow components
  - Full-screen mode support
- Located in: `src/pages/whatsapp/LiveChatPanel.tsx`

### 4. Routes Added
```
/wa/live-chat/login           - Login page (public)
/wa/live-chat/forgot-password - Password reset (public)
/wa/live-chat/chats           - Chat panel (protected)
```

## Setup Instructions

### 1. Install Dependencies
Dependencies have already been installed:
```bash
npm install @supabase/supabase-js
```

### 2. Configure Supabase

#### A. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to be provisioned

#### B. Get Your Credentials
1. Go to Project Settings → API
2. Copy your project URL and anon/public key

#### C. Create Environment File
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 3. Setup Authentication in Supabase

#### Enable Email Authentication
1. Go to Authentication → Providers in your Supabase dashboard
2. Enable "Email" provider
3. Configure email templates if desired

#### Create Test User (Optional)
1. Go to Authentication → Users
2. Click "Add user"
3. Create a test account with email/password

### 4. Database Schema (If Using Real Chat Data)
If you want to connect the chat to real data, create these tables in Supabase:

```sql
-- Chats table
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  avatar_url TEXT,
  last_message TEXT,
  last_message_time TIMESTAMP WITH TIME ZONE,
  unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID REFERENCES chats(id),
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  sender TEXT NOT NULL,
  status TEXT,
  media_url TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Run the Application
```bash
npm run dev
```

## Usage

### For Users
1. Navigate to `/wa/live-chat/login`
2. Log in with your credentials
3. You'll be redirected to `/wa/live-chat/chats`
4. Start chatting!

### For Developers

#### Using Authentication Context
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, signIn, signOut, loading } = useAuth();
  
  // Check if user is authenticated
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;
  
  return <div>Welcome, {user.email}!</div>;
}
```

#### Creating Protected Routes
```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

<Route 
  path="/protected-page" 
  element={
    <ProtectedRoute>
      <YourComponent />
    </ProtectedRoute>
  } 
/>
```

## File Structure

```
src/
├── lib/
│   └── supabase/
│       └── client.ts              # Supabase client initialization
├── contexts/
│   └── AuthContext.tsx            # Authentication context & hooks
├── components/
│   └── ProtectedRoute.tsx         # Protected route wrapper
├── pages/
│   └── whatsapp/
│       ├── LiveChatLogin.tsx      # Login page
│       ├── ForgotPassword.tsx     # Password reset page
│       └── LiveChatPanel.tsx      # Main chat interface
└── App.tsx                        # Updated with new routes
```

## Migration from Next.js Components

The following Next.js patterns were converted:

1. **Server Components** → Client Components with hooks
2. **`'use server'` actions** → Client-side API calls
3. **`redirect()` from Next.js** → `useNavigate()` from React Router
4. **Next.js middleware** → `ProtectedRoute` component
5. **`createClient()` from `@/utils/supabase-server`** → Browser client from `@/lib/supabase/client`

## Original Next.js Components

The original Next.js components are preserved in:
```
src/components/whatsapp/live_chat/
├── (authorized)/    # Protected routes
├── api/             # API routes
├── auth/            # Auth components
├── login/           # Login components
├── layout.tsx       # Next.js layout
└── page.tsx         # Next.js page
```

These are kept for reference but are not actively used in the Vite/React Router setup.

## Troubleshooting

### "Supabase credentials not found" warning
- Make sure you created a `.env` file with valid credentials
- Restart your dev server after adding environment variables

### Authentication not working
- Check your Supabase project's authentication settings
- Verify email provider is enabled
- Check browser console for specific errors

### Protected routes not redirecting
- Ensure `AuthProvider` wraps your routes in `App.tsx`
- Check that the Supabase client is properly initialized

## Next Steps

1. **Connect to Real Data**: Replace mock data with Supabase queries
2. **Real-time Updates**: Add Supabase real-time subscriptions for live chat
3. **File Uploads**: Integrate Supabase Storage for media messages
4. **User Profiles**: Add user profile management
5. **Notifications**: Add push notifications for new messages

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Use environment variables for all sensitive credentials
- Regularly rotate your Supabase keys in production

## Support

For issues related to:
- **Supabase**: [Supabase Documentation](https://supabase.com/docs)
- **React Router**: [React Router Documentation](https://reactrouter.com)
- **This Integration**: Check the code comments and this guide
