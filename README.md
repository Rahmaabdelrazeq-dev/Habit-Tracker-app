## Habit Tracker

A simple, beautiful habit tracking app built with React, Vite, Tailwind, shadcn/ui, and Supabase.

### Quick start
- Requirements: Node 18+ and npm

```bash
npm i
npm run dev
```

The app will start on http://localhost:5173.

### Environment
Create a file named `.env.local` in the project root with your Supabase credentials:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

You can find these in your Supabase project under Settings → API.

### Scripts
- `npm run dev`: start the Vite dev server
- `npm run build`: create a production build
- `npm run preview`: preview the production build locally
- `npm run lint`: run ESLint

### Tech stack
- React + TypeScript (Vite)
- Tailwind CSS
- shadcn/ui (Radix UI)
- Supabase (auth and database)

### Deploy
Any static host works (e.g., Vercel, Netlify). Build with `npm run build` and deploy the `dist/` folder. Remember to set the same environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) in your hosting provider.
