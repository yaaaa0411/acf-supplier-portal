# Ambuja Cement Foundation — Management Portal

A production-ready web application for managing supplier records, regional administration, and user access at Ambuja Cement Foundation.

## Tech Stack

| Layer          | Technology              |
|----------------|------------------------|
| Frontend       | React + TypeScript     |
| Styling        | Bootstrap 5 + Bootstrap Icons |
| Backend        | Supabase               |
| Database       | Supabase PostgreSQL    |
| Authentication | Supabase Auth (Google) |
| Storage        | Supabase Storage       |
| Deployment     | Render                 |

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- A Supabase project with Google Auth enabled

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd AmbujaCementFoundation
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Set Up Database

Run the SQL migration files in order in the **Supabase SQL Editor**:

1. `supabase/migrations/001_create_roles_and_permissions.sql`
2. `supabase/migrations/002_create_user_profiles.sql`
3. `supabase/migrations/003_create_geography.sql`
4. `supabase/migrations/004_create_supplier_records.sql`
5. `supabase/migrations/005_create_remarks.sql`
6. `supabase/migrations/006_create_notifications.sql`
7. `supabase/migrations/007_rls_policies.sql`
8. `supabase/migrations/008_seed_data.sql`

### 4. Seed First Admin

After your first Google login, insert an admin profile via the Supabase SQL Editor:

```sql
INSERT INTO public.user_profiles (id, email, full_name, avatar_url, role_id)
SELECT
  auth.uid(),
  'your-email@gmail.com',
  'Your Name',
  NULL,
  r.id
FROM public.roles r
WHERE r.name = 'admin';
```

> Replace the values with the actual auth user's UUID and details from the `auth.users` table.

### 5. Run Development Server

```bash
npm run dev
```

### 6. Build for Production

```bash
npm run build
```

## User Roles

| Role     | Access                                                       |
|----------|--------------------------------------------------------------|
| Admin    | Full system access, manage users, edit/delete records        |
| Subadmin | Regional access, view records in assigned district           |
| Supplier | Submit entry once (read-only after), add remarks anytime     |

## Project Structure

```
src/
├── components/
│   ├── common/       # Loader, ProtectedRoute, ErrorBoundary
│   └── layout/       # Navbar, Sidebar, Footer, AppLayout
├── config/           # Supabase client
├── contexts/         # AuthContext (session + profile + permissions)
├── hooks/            # useAuth
├── pages/
│   ├── admin/        # Admin dashboard
│   ├── auth/         # Login page
│   ├── subadmin/     # Subadmin dashboard
│   └── supplier/     # Supplier dashboard + entry form
├── services/         # Supabase query functions
├── styles/           # Custom CSS
├── types/            # TypeScript interfaces
└── utils/            # Helper functions
```

## Deployment (Render)

The `render.yaml` blueprint is included. Connect your Git repo to Render and set the environment variables in the Render dashboard.

## License

Private — Ambuja Cement Foundation
