<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

This is a front-end-only Next.js 16.2.6 portfolio site (no backend, database, auth, or env vars required).

- **Package manager:** npm (`package-lock.json`). Run `npm install` to refresh dependencies.
- **Dev server:** `npm run dev` → http://localhost:3000
- **Lint / Build / Start:** see `scripts` in `package.json` (`npm run lint`, `npm run build`, `npm start`).
- **Tailwind CSS v4** is used with `@tailwindcss/postcss`; styles live in `app/globals.css`.
- **Framer Motion** handles scroll-triggered animations — the site is animation-heavy, so visual testing is important for UI changes.
- The `node_modules/next/dist/docs/` path referenced in the nextjs-agent-rules block above does not exist in this version; rely on official Next.js 16 docs or source code instead.
