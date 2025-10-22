## Habit Tracker

A simple, beautiful habit tracking app.

### Quick start
- Requirements: Node 18+ and npm

```bash
npm i
npm run dev
```

The app will start on http://localhost:5173.

### Environment
Create `.env.local` in the project root with your Supabase credentials:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### Scripts
- `npm run dev`: start the dev server
- `npm run build`: production build
- `npm run preview`: preview the build
- `npm run lint`: lint the code

### Main technologies
- React + TypeScript (Vite)
- Tailwind CSS
- shadcn/ui (Radix UI)
- Supabase (auth and database)

### Features
- Create and manage habits
- One-tap daily check-ins and streaks
- Authenticated dashboard with progress stats

### Deploy
Build with `npm run build` and deploy the `dist/` folder to any static host (e.g., Vercel, Netlify). Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in your host's environment variables.
