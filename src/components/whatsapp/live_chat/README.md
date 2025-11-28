# Original Next.js Live Chat Components

## 📁 Directory Structure

This directory contains the **original Next.js live chat implementation** from your previous setup. These components use Next.js-specific features like:

- Server Components (`'use server'`)
- Next.js routing (App Router)
- `next/navigation` (redirect, useRouter)
- Server-side authentication

## 🚫 Not Currently Used

These components are **NOT actively used** in the current Vite + React Router application. They are kept here for:

1. **Reference** - To understand the original implementation
2. **Future migration** - If you need to port more features
3. **Backup** - Original code preservation

## ✅ What's Actually Running

The **active live chat system** uses adapted React Router components located in:

```
src/
├── lib/supabase/client.ts          # Supabase client
├── contexts/AuthContext.tsx         # Auth state management
├── components/ProtectedRoute.tsx    # Route protection
└── pages/whatsapp/
    ├── LiveChatLogin.tsx            # Login page (ACTIVE)
    ├── ForgotPassword.tsx           # Password reset (ACTIVE)
    └── LiveChatPanel.tsx            # Chat interface (ACTIVE)
```

### Active Routes:
- `/wa/live-chat/login` → Login page
- `/wa/live-chat/forgot-password` → Password reset
- `/wa/live-chat/chats` → Authenticated chat panel

## 📝 Component Mapping

| Next.js (Original) | React Router (Active) | Status |
|-------------------|----------------------|--------|
| `login/page.tsx` | `src/pages/whatsapp/LiveChatLogin.tsx` | ✅ Adapted |
| `login/forgot-password/` | `src/pages/whatsapp/ForgotPassword.tsx` | ✅ Adapted |
| `(authorized)/(panel)/chats/` | `src/pages/whatsapp/LiveChatPanel.tsx` | ✅ Adapted |
| `layout.tsx` | `src/contexts/AuthContext.tsx` | ✅ Replaced |
| `page.tsx` | N/A (handled by routing) | ✅ Replaced |
| `@/utils/supabase-server` | `src/lib/supabase/client.ts` | ✅ Replaced |

## 🔄 If You Need to Port More Features

If you want to use features from these original components:

1. **Identify the feature** in the Next.js component
2. **Extract the logic** (remove Next.js-specific code)
3. **Convert to React hooks**:
   - Replace `'use server'` with client-side API calls
   - Replace `redirect()` with `useNavigate()`
   - Replace server components with client components
4. **Test in the active React Router version**

## 📚 Key Differences

### Next.js (Original)
```tsx
'use server'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase-server'

export default async function Page() {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user) redirect('/login')
  // ...
}
```

### React Router (Active)
```tsx
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function Page() {
  const { user } = useAuth()
  // Protected by <ProtectedRoute> wrapper
  // ...
}
```

## ⚠️ Do Not Use Directly

**Do not import or use these components directly** in the Vite application. They will cause errors due to Next.js dependencies.

## 🗂️ Original Structure

```
live_chat/
├── (authorized)/          # Protected routes (Next.js App Router)
│   ├── layout.tsx
│   ├── (panel)/
│   │   ├── chats/         # Chat interface
│   │   ├── contacts/      # Contact management
│   │   └── users/         # User management
│   └── post-login/        # Post-login flow
├── api/                   # API routes (Next.js)
├── auth/                  # Auth callbacks
├── login/                 # Login pages
│   ├── page.tsx
│   ├── LoginClientComponent.tsx
│   ├── LoginWrapper.tsx
│   └── action.ts          # Server actions
├── webhook/               # Webhook handlers
├── layout.tsx             # Root layout (Next.js)
├── page.tsx               # Home redirect logic
└── globals.css            # Styles
```

## 📖 See Also

- [LIVE_CHAT_SETUP.md](../../../LIVE_CHAT_SETUP.md) - Full setup guide
- [INTEGRATION_SUMMARY.md](../../../INTEGRATION_SUMMARY.md) - Quick reference
- [Copilot Instructions](../.github/copilot-instructions.md) - Project conventions

---

**Last Updated**: November 21, 2025  
**Status**: Preserved for reference - Not in active use
