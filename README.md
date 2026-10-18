# Portfolio CMS

Your portfolio with a built-in editor. After it's set up, you never touch code:
open **`/admin`**, sign in, change anything, press **Save & publish**. The change is live immediately (no redeploy).

- **3 layouts**: Terminal, Neon and Clean, switchable from the editor
- **6 color palettes**, custom accent colors, light/dark mode, 6 font pairings
- Edit profile, photo, resume, about, skills, projects, achievements, education, contact links
- Reorder, rename or hide sections
- Live preview (desktop and phone) before publishing
- Backup/restore as a JSON file

---

## Setup (one time, about 15 minutes)

### 1. Create a Supabase project (free)
1. Go to <https://supabase.com>, sign in and click **New project**. Any name and region (Singapore is close to Bangladesh).
2. When it's ready, open **SQL Editor → New query**, paste everything from [`supabase/setup.sql`](supabase/setup.sql),
   **change the email on the last line** to the email you want to log in with, then click **Run**.

### 2. Create your login
1. **Authentication → Users → Add user → Create new user**.
2. Enter the *same* email as in the SQL, choose a password, and tick **Auto Confirm User**.
3. **Authentication → Sign In / Providers → Email**: turn **off** “Allow new users to sign up”.
   (Only emails in the `admins` table can edit anyway, but this keeps strangers from creating accounts.)
4. **Authentication → URL Configuration**: set **Site URL** to your live site address once you have it
   (needed for “Forgot password” emails).

### 3. Connect the site to Supabase
In Supabase, click **Connect** (top bar) or go to **Project Settings → API**, and copy the **Project URL** and the
**anon / publishable key**. Then copy `.env.example` to `.env.local` and paste them in:

```
VITE_SUPABASE_URL=https://abcd1234.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...   (or sb_publishable_...)
```

These two values are safe to be public. **Never** use the `service_role` / secret key here.

### 4. Try it locally
```
npm install
npm run dev
```
Open <http://localhost:5173/admin>, sign in, and press **Save & publish** once. That stores your content in Supabase.
Then <http://localhost:5173> shows the live site.

### 5. Put it online (Vercel, free)
1. Push this folder to a GitHub repo.
2. On <https://vercel.com> → **Add New → Project** → import the repo. Vercel detects Vite automatically.
3. Under **Environment Variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (same values as `.env.local`).
4. Deploy. Your site is at `https://<name>.vercel.app` and the editor is at `https://<name>.vercel.app/admin`.

Netlify works too: build command `npm run build`, publish directory `dist`, same two environment variables.
(`public/_redirects` and `vercel.json` already make `/admin` work on both.)

After this, you only redeploy if you change the code itself. Content and theme changes go live on Save.

---

## Using the editor

| Tab | What you can change |
| --- | --- |
| **Theme** | Layout, colors, dark/light default, accent colors, fonts, effects (background, animations, cat, visitor light/dark switch) |
| **Profile** | Name, logo text, intro, photo and resume upload, typing roles, hero stats |
| **About / Skills / Projects / Achievements / Education / Contact** | The content of each section. Use the arrows to reorder and the bin to delete |
| **Sections** | Order, nav labels, headings, show or hide |
| **Site & backup** | Page title and description for Google, footer, download/import backup, change password |

- **Ctrl + S** saves. **Discard** undoes everything since the last save.
- In text, `**bold**` makes words bold and `[text](https://link)` makes a link.
- Some fields only appear in certain layouts. The hint under each field says where it's used.
- Without Supabase connected, `/admin` opens in *offline mode*: you can try things out, but you can't publish.

## Project structure

```
src/lib/defaults.ts      starter content (used until the first save)
src/lib/theme.ts         palettes, fonts, layouts
src/site/layouts/        Terminal.tsx, Neon.tsx, Clean.tsx
src/admin/               the /admin editor
supabase/setup.sql       database, permissions and file storage
```
