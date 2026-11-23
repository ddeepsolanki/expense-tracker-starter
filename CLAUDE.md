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
- `src/main.jsx` mounts `<App />` in `StrictMode`. `App` owns the transactions list (seeded with hardcoded sample data) and the categories array, and composes three children from `src/`: `Summary` (totals cards), `TransactionForm` (add form) and `TransactionList` (filters + table).
- State lives in the component that uses it: `TransactionForm` keeps its own field state and calls `onAdd(transaction)` on submit; `TransactionList` keeps the type/category filter state, filters on render, and calls `onDelete(id)` after a `window.confirm`; `Summary` derives totals from `transactions`. There is no persistence, so data resets on reload.
- Transaction shape: `{ id, description, amount, type: "income" | "expense", category, date: "YYYY-MM-DD" }`. `amount` must be a number (the form input yields a string, so `handleSubmit` parses it); totals are computed with `reduce` and break if strings slip in. Categories are a hardcoded array in `App.jsx`, shared by the add form and the filter.
- Styling is plain CSS: global styles in `src/index.css`, component styles in `src/App.css`.

## Lint config notes

ESLint flat config (`eslint.config.js`) uses `react-hooks` and `react-refresh` (Vite preset); `no-unused-vars` ignores names matching `^[A-Z_]`.
