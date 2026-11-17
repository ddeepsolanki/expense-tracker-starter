# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

Starter project for a Claude Code course. Per the README, it **intentionally** ships with a bug, poor UI, and messy code that get fixed over the course. Treat these as known issues to fix when asked, not as patterns to preserve or imitate.

## Commands

```bash
npm install       # install dependencies
npm run dev       # Vite dev server at http://localhost:5173
npm run build     # production build to dist/
npm run preview   # serve the production build
npm run lint      # ESLint over the whole repo
```

There is no test runner or test suite configured.

## Architecture

- React 19 + Vite 7, plain JavaScript (JSX), no TypeScript, no router, no state library.
- `src/main.jsx` mounts `<App />` in `StrictMode`; nearly all the app lives in a single component, `src/App.jsx`.
- `App` holds all state with `useState`: the transactions list (seeded with hardcoded sample data), the add-form fields, and the type/category filters. Totals and the filtered list are derived on every render; there is no persistence, so data resets on reload.
- Transaction shape: `{ id, description, amount, type: "income" | "expense", category, date: "YYYY-MM-DD" }`. Categories are a hardcoded array in `App.jsx`, shared by the add form and the filter.
- Styling is plain CSS: global styles in `src/index.css`, component styles in `src/App.css`.

## Known issues (from the course setup)

- `amount` is stored as a string (in both seed data and new transactions), so the `reduce` totals concatenate strings instead of summing.
- The "Freelance Work" seed entry has `type: "expense"` with category `salary`.

## Lint config notes

ESLint flat config (`eslint.config.js`) uses `react-hooks` and `react-refresh` (Vite preset); `no-unused-vars` ignores names matching `^[A-Z_]`.
