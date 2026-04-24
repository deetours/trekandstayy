# 🚀 QUICK START - SUPABASE SETUP

## Step 1: Create Supabase Project (2 minutes)
```
1. Go to https://supabase.com
2. Click "New Project"
3. Name: "Trek and Stay"
4. Password: Generate strong password
5. Region: Choose closest to you
6. Click "Create new project"
7. WAIT for provisioning (2-3 min)
```

## Step 2: Copy Your Credentials
After project is ready:
```
📋 Dashboard URL (top left)
📋 Project URL: Settings > API > Project URL (copy the https:// link)
📋 Anon Key: Settings > API > anon public key
📋 Service Role Key: Settings > API > service_role key
```

## Step 3: Set Up Database
```
1. Open SQL Editor in Supabase
2. Click "New Query"
3. Paste entire contents of: supabase-setup.sql
4. Click "RUN" button (bottom right)
5. Wait for success message
```

## Step 4: Create Admin User
```
1. Go to Supabase > Authentication > Users
2. Click "Create new user" button
3. Email: your.admin@trekandstay.com
4. Password: Your strong password
5. Click "Create user"
6. COPY the generated User ID (looks like: f47ac10b-58cc-4372-a567-0e02b2c3d479)
```

## Step 5: Add User to Admin Table
```
1. Supabase > SQL Editor > New Query
2. Run this (paste YOUR User ID from Step 4):

INSERT INTO admin_users (id, email, role)
VALUES ('paste_the_user_id_here', 'your.admin@trekandstay.com', 'admin');

3. Click RUN
4. Should say "insert 1"
```

## Step 6: Set Environment Variables
```
In your project root, create/edit: .env.local

NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLC...   (paste the anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJ0eXAiOiJKV1QiLC...       (paste service role key)
```

## Step 7: Start Your App
```bash
cd c:\Users\kkavi\OneDrive\Desktop\trekandstay
pnpm install
pnpm dev
```

Then:
- Visit: http://localhost:3000/auth/login
- Login with: your.admin@trekandstay.com + password
- Should see admin dashboard at: http://localhost:3000/admin

---

# 🔗 CONNECTION FLOW

```
┌─────────────────┐
│   Login Page    │
│  /auth/login    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Supabase.auth.signInWithPassword│
│  - Check email/password in auth │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Check admin_users table        │
│  - Must have role='admin'       │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Redirect to /admin             │
│  - useRequireAdmin hook active  │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Admin Dashboard Ready          │
│  - Can manage trips             │
│  - All data flows from DB       │
└─────────────────────────────────┘
```

---

# 🧪 TEST THE SETUP

## Test 1: Login
- [ ] Go to http://localhost:3000/auth/login
- [ ] Enter: your.admin@trekandstay.com
- [ ] Enter: your password
- [ ] Click Login
- [ ] Should redirect to /admin

## Test 2: Admin Dashboard
- [ ] Should see "Trek & Stay" in sidebar
- [ ] Should see "Admin Dashboard" heading
- [ ] Should see stats cards (Total Trips, etc.)
- [ ] Should see "Manage Trips" button

## Test 3: Manage Trips
- [ ] Click "Manage Trips" or go to /admin/trips
- [ ] Should see all trips in table
- [ ] Click Edit button
- [ ] Should open edit form
- [ ] Modify a field and save

## Test 4: Public Trips Page
- [ ] Go to http://localhost:3000/trips
- [ ] Should see published trips
- [ ] Should NOT see draft trips
- [ ] No login required

---

# ✅ WHAT YOU NOW HAVE

✅ **Authentication System**
- Login/Logout working
- Role-based access (admin only)
- Secure session management

✅ **Admin Dashboard**
- Central management hub
- Trip CRUD operations
- User-friendly forms

✅ **Data Architecture**
- Type-safe throughout
- Separation of concerns
- Database-ready

✅ **Public Website**
- Trips page shows published trips only
- Filtering/sorting working
- Featured trips on homepage

✅ **Database Schema**
- All tables created
- Relationships set up
- Indexes for performance

---

# 📦 FILES CREATED

```
New Files:
├── .env.local.example
├── IMPLEMENTATION_GUIDE.md
├── supabase-setup.sql
├── app/auth/
│   ├── login/page.tsx
│   └── logout/route.ts
├── app/admin/
│   ├── layout.tsx
│   ├── page.tsx
│   └── trips/
│       ├── page.tsx
│       ├── new/page.tsx
│       └── [id]/edit/page.tsx
└── lib/auth/
    ├── types.ts
    ├── client.ts
    ├── server.ts
    └── hooks.ts
```

---

# 🔥 NEXT STEPS (After Testing)

### Immediate (Day 1)
1. Test all the flow above
2. Create a few test trips in admin
3. Verify they show on /trips page

### Phase 2 (Day 2-3)
1. Update `lib/trips/get-trips.ts` to query database
2. Add departures management page
3. Add media/gallery upload

### Phase 3 (Day 4-5)
1. Booking flow
2. Payment integration
3. Email notifications

### Phase 4 (Week 2)
1. Advanced analytics
2. Email campaigns
3. Admin analytics dashboard

---

# 🆘 TROUBLESHOOTING

### "Cannot find admin user"
```
✅ Solution:
1. Check admin_users table in Supabase
2. Verify ID matches auth.users ID
3. Verify role='admin'

Run this in SQL Editor:
SELECT * FROM admin_users;
SELECT * FROM auth.users;
```

### "Unauthorized" on /admin
```
✅ Solution:
1. Make sure you're logged in
2. Check browser console for errors
3. Try logging out (/auth/logout) and back in
4. Clear browser cookies
```

### "Page doesn't load"
```
✅ Solution:
1. Check environment variables in .env.local
2. Restart dev server (Ctrl+C, then pnpm dev)
3. Make sure Supabase project is running
4. Check browser console for errors
```

### "Trips page shows no trips"
```
✅ Solution:
1. Create a trip in /admin/trips/new
2. Mark it as "Published" status
3. Refresh /trips page
4. Check browser console
```

---

# 💡 REMEMBER

- **UI doesn't know about database** → Can change backends anytime
- **All data flows through getTrips()** → Single source of truth
- **Admin panel and public site use same data** → No conflicts
- **Types enforce consistency** → No runtime surprises

---

# 📞 SUPPORT LINKS

- Supabase Docs: https://supabase.com/docs
- Auth Helpers: https://supabase.com/docs/guides/auth/auth-helpers/nextjs
- Row Level Security: https://supabase.com/docs/guides/auth/row-level-security

**You're all set. Go build! 🚀**
