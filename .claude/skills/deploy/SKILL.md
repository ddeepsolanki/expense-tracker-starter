---
name: deploy
description: Deploy the expense tracker to staging. Runs the checks (lint, plus tests once they exist), builds the production bundle, then pushes the current commit to the `develop` branch on `origin`, which is the staging branch. Use when the user types /deploy or asks to deploy or ship to staging.
disable-model-invocation: true
---

# Deploy to staging

Staging for this project is the **`develop` branch on `origin`** (the user's fork). Deploying means pushing the current commit there, but only after it passes the checks and builds cleanly. A broken commit on staging blocks everyone testing there, so each step is a gate: if a step fails, stop, show the output and don't go on to the next one.

Run every command from the repo root.

## 1. Preflight

- Run `git status --porcelain`. If there are uncommitted changes, stop and tell the user. A deploy pushes commits, not the working tree, so uncommitted work would be left out without anyone noticing. Ask whether they want to commit first. Don't commit or stash for them unless they say so.
- Note the current branch and `git rev-parse --short HEAD`, so you can name exactly what got deployed.

## 2. Run the checks

- `npm run lint`: any ESLint error fails the deploy.
- Tests: the project has no test suite yet. If `package.json` has a `test` script, run it as `CI=true npm test` so runners like Vitest or Jest run once and don't sit in watch mode. If there's no `test` script, skip this and say in the final report that no tests ran. Don't claim tests passed when none exist.

## 3. Build the production bundle

- `npm run build`: a non-zero exit fails the deploy.
- Vite's "Some chunks are larger than 500 kB" message is a warning, not a failure. Mention it in the report but carry on.
- `dist/` is gitignored, so it isn't pushed. The build is here to prove the commit builds before it reaches staging.

## 4. Push to staging

1. `git fetch origin develop`
2. Check that the push will be a fast-forward: `git merge-base --is-ancestor origin/develop HEAD`.
   - If that fails, `develop` has commits that HEAD doesn't have. Stop and tell the user, listing those commits with `git log --oneline HEAD..origin/develop`. **Never force-push**, because that would wipe whatever is already on staging. Let the user decide whether to merge or rebase.
3. `git push origin HEAD:develop`

Only ever push to `origin develop`. Don't push to `main`, and never push to the `upstream` remote, which is the course author's repository.

## 5. Report

Keep it short:

- **Deployed:** `<sha>` from `<branch>` → `origin/develop` (or **Not deployed** and the step that stopped it)
- **Lint:** passed / failed
- **Tests:** passed / failed / none configured
- **Build:** passed, with any warnings
- If something failed: the relevant lines of output and a suggested fix
