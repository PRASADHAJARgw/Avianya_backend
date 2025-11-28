# 🎯 Quick Fix Guide - 3 Simple Steps

## Current Problem
```
❌ Backend JWT validation failed: token signature is invalid
❌ Supabase JWT validation failed: token signature is invalid
```

## Why?
The `.env` file has a placeholder JWT secret instead of your actual Supabase JWT secret.

---

## 🔧 THE FIX (Do These 3 Things)

### 1️⃣ GET YOUR JWT SECRET

Open this URL:
```
https://app.supabase.com/project/ucqnbhbluzqtnarcogrm/settings/api
```

Scroll down → Find "JWT Settings" → Copy the "JWT Secret"

It looks like this:
```
super-secret-jwt-token-with-at-least-32-characters-long
```

---

### 2️⃣ UPDATE THE .ENV FILE

```bash
cd /Users/prasadhajare/Prasad_dev/whats_app_dev/msg-canvas-flow-main/go_server/mongo_golang
nano .env
```

Find line 50:
```bash
SUPABASE_JWT_SECRET=your-supabase-jwt-secret-here
```

Replace with:
```bash
SUPABASE_JWT_SECRET=<paste-your-actual-secret-here>
```

Save: `Ctrl+O`, `Enter`, `Ctrl+X`

---

### 3️⃣ RESTART BACKEND

```bash
# Stop current backend (Ctrl+C in the terminal running go)
# OR:
pkill -f "go run"

# Start again:
cd /Users/prasadhajare/Prasad_dev/whats_app_dev/msg-canvas-flow-main/go_server/mongo_golang
go run .
```

---

## ✅ Success Looks Like This

After restart, you'll see:
```
✅ Supabase JWT secret loaded successfully
✅ Token validated with Supabase JWT secret
```

And in browser console:
```
✅ WABA status data: {success: true, ...}
```

**NOT:**
```
❌ WABA status data: {message: 'Invalid or expired token', success: false}
```

---

## 📝 Important Notes

- The JWT Secret is NOT the same as SUPABASE_ANON_KEY
- The JWT Secret is NOT the same as SUPABASE_SERVICE_ROLE_KEY
- It's a separate secret specifically for validating JWT tokens
- You can only get it from the Supabase dashboard

---

## ❓ Need Help?

See detailed guides:
- `ACTION_REQUIRED_JWT_SECRET.md` - Complete step-by-step guide
- `GET_SUPABASE_JWT_SECRET.md` - Multiple ways to get the secret
- `SUPABASE_JWT_FIX.md` - Technical explanation

Or run:
```bash
./get_supabase_jwt_secret.sh
```

---

**That's it! Just 3 steps and you're done! 🎉**
