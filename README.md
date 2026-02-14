# 🔖 Smart Bookmark App

A production-ready, real-time bookmark manager built with Next.js (App Router), Supabase, and Tailwind CSS.
Users can securely sign in with Google, save private bookmarks, and see updates instantly across multiple tabs without refreshing the page.

---

## 🚀 Live Demo

👉 [🔖 Smart Bookmark](https://smart-bookmark-website.vercel.app/)

---

# 🏗️ Architecture Overview

## Frontend

* **Next.js (App Router)** for routing and hybrid server/client rendering
* **React + TypeScript** for scalable and type-safe UI
* **Tailwind CSS** for responsive design and glassmorphism UI
* Client-side Supabase SDK for realtime and bookmark operations

## Backend (Supabase - BaaS)

* **Supabase Auth** → Google OAuth authentication
* **Supabase Postgres Database** → Stores user bookmarks
* **Supabase Realtime** → Instant multi-tab synchronization
* **Row Level Security (RLS)** → Ensures bookmarks are private per user

## Data Flow

1. User signs in via Google OAuth (Supabase Auth)
2. OAuth callback exchanges code for session (server route)
3. Session is stored using cookies (SSR compatible)
4. Dashboard fetches user session
5. Bookmarks are saved with `user_id`
6. Realtime channel listens for database changes and updates UI instantly

---

# ⚙️ Setup Instructions (Step-by-Step)

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Sahil0p/Smart-Bookmark-Website
cd Smart-Bookmark-Website
```

## 2️⃣ Install Dependencies

```bash
npm install
```

## 3️⃣ Create a Supabase Project

1. Go to https://supabase.com
2. Create a new project
3. Wait for the database to initialize

---

## 4️⃣ Enable Google OAuth in Supabase

* Go to: **Authentication → Providers → Google**
* Enable Google Provider
* Add your Google Client ID & Secret
* Save changes

Then configure redirect URLs:

```
http://localhost:3000/auth/callback
https://your-vercel-domain.vercel.app/auth/callback
```

---

## 5️⃣ Create Database Table (Bookmarks)

Run this SQL in Supabase SQL Editor:

```sql
create table bookmarks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  user_id uuid not null,
  created_at timestamp with time zone default now()
);
```

### Enable Row Level Security (IMPORTANT)

```sql
alter table bookmarks enable row level security;
```

### Add RLS Policy (User can only access their own bookmarks)

```sql
create policy "Users can manage their own bookmarks"
on bookmarks
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

---

## 6️⃣ Configure Environment Variables

Create a file named:

```
.env.local
```

Add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these in:
Supabase Dashboard → Settings → API

---

# ▶️ How to Run the Project Locally

## Start Development Server

```bash
npm run dev
```

Then open:

```
http://localhost:3000
```

## Build for Production (Optional Test)

```bash
npm run build
npm start
```

---

# 🚀 Deployment (Vercel)

## 1. Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Smart Bookmark App"
git branch -M main
git remote add origin https://github.com/your-username/smart-bookmark-app.git
git push -u origin main
```

## 2. Deploy on Vercel

1. Go to https://vercel.com
2. Import your GitHub repository
3. Select the project
4. Add Environment Variables:

   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**

## 3. Update Supabase Redirect URLs (CRITICAL)

After deployment, add:

```
https://your-app-name.vercel.app/auth/callback
```

in:
Supabase → Authentication → URL Configuration

---

## ⚙️ Key Technical Challenges & How I Solved Them

### 1. Google OAuth Redirect Loop (Hardest Issue)

**Problem:**
After signing in with Google, the app kept redirecting back to the login page because the session was not being persisted correctly in Next.js App Router.

**Root Cause:**
Improper session exchange and cookie handling in the OAuth callback route.

**Solution:**

* Implemented a dedicated `/auth/callback` route
* Used `exchangeCodeForSession()` on the server
* Switched from `getUser()` to `getSession()` for reliable client session detection
* Properly configured Supabase redirect URLs for both localhost and production (Vercel)

This stabilized authentication and removed the login loop completely.

---

### 2. Realtime Sync Without Performance Issues

**Problem:**
Bookmarks needed to update in real-time across multiple tabs without page refresh, but naive state updates inside `useEffect` caused ESLint warnings and potential re-render issues.

**Solution:**

* Used Supabase Realtime channels filtered by `user_id`
* Memoized fetch function using `useCallback`
* Safe async bootstrap with `Promise.resolve().then(fetchBookmarks)`
* Proper channel cleanup on unmount to avoid memory leaks

Result: Instant, efficient multi-tab synchronization.

---

### 3. SSR Cookies & Supabase in Next.js App Router

**Problem:**
Handling authentication sessions in a hybrid server/client environment (Next.js 14+/16) is tricky due to async cookies and SSR behavior.

**Solution:**

* Created a dedicated `supabaseServerClient`
* Used async `cookies()` API correctly
* Separated browser and server Supabase clients
* Ensured secure session exchange during OAuth callback

This made auth production-safe and Vercel-compatible.

---

### 4. Mobile Responsiveness & Overflow Issues

**Problem:**
Glass UI cards and thumbnails caused horizontal scroll and oversized layouts on small screens.

**Solution:**

* Added responsive padding and grid controls
* Ensured cards use `min-w-0` and flexible layouts
* Made bookmark cards compact in mobile view
* Hid long URLs on mobile for cleaner UX

---

## ✨ Features (Production-Grade UX)

### 🔐 Authentication

* Google OAuth only (secure and simple)
* Persistent sessions
* Protected dashboard routes

### 📌 Bookmark Management

* Add bookmarks (title + URL)
* Delete bookmarks
* Private per-user data (RLS enforced)
* Clean form validation and URL formatting

### ⚡ Realtime Capabilities

* Instant sync across multiple tabs
* No page refresh required
* Live updates using Supabase Realtime channels

### 🎨 Premium UI/UX

* Glassmorphism dashboard (SaaS-style)
* Animated gradient background
* Dark mode support with theme toggle
* Responsive mobile-first layout
* Skeleton loading shimmer
* Toast notifications for actions (Add/Delete)

### 🖼️ Smart Visual Enhancements

* Automatic video thumbnail detection (YouTube links)
* Favicon fallback for non-video URLs
* Fully clickable preview cards (Notion/YouTube style)
* Mobile-optimized card view (title + thumbnail only)

### 🔍 Productivity Features

* Live search & filter bookmarks
* Total bookmarks counter (stats panel)
* Optimized rendering with memoization

---

## 🧪 Problems I Ran Into (Honest Reflection)

* OAuth redirect not working on deployment due to missing Supabase redirect URLs
* Next.js App Router + Supabase SSR cookie handling confusion
* ESLint strict rules around `useEffect` and state updates
* Next/Image hostname restrictions for dynamic favicons
* Mobile layout overflow caused by glass cards and thumbnails

Each issue required debugging documentation, environment configs, and careful React optimization.

---

## 🚀 Deployment

* Hosted on **Vercel**
* Environment variables configured for Supabase
* Google OAuth redirect URLs updated for production domain
* Fully tested with different Google accounts and multiple tabs

---

## 📦 Tech Stack

* Next.js (App Router)
* TypeScript
* Supabase (Auth, Database, Realtime)
* Tailwind CSS
* Sonner (Toast Notifications)
* Vercel (Deployment)

---

## 📌 Final Thoughts

This project was focused not just on functionality, but on building a realistic, production-grade web application with secure authentication, realtime data flow, and polished UX.
The biggest learning came from integrating Supabase Auth with Next.js App Router and making realtime features stable, scalable, and user-friendly.

Overall, the challenge helped strengthen my understanding of modern full-stack architecture, authentication flows, and responsive UI design in a real-world deployment scenario.
