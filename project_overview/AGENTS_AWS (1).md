# AGENTS.md — Project Setup & System Boundaries

> This file is the single source of truth for how this project gets set up, who does what, and what "correct" looks like. Read it before touching the repo.

---

## 1. Ownership & Boundaries

| Responsibility | Owner |
|---|---|
| Initial project scaffold (one-time setup command below) | **Huzaifa Nawaid** (Project Coordinator) — ONLY |
| Everyone else | Clone after scaffold is pushed, run `bun install`, start working inside your assigned module |

**Rule:** No one other than Huzaifa runs the scaffold command. If the stack needs to change (frontend, DB, auth, etc.), that's a coordinator-level decision — raise it, don't re-run the generator yourself. Re-running it against an existing repo will create conflicting/duplicate config.

---

## 2. One-Time Project Scaffold (Coordinator Only)

```bash
bun create better-t-stack@latest aws-platform \
  --frontend react-router \
  --backend hono \
  --runtime bun \
  --api trpc \
  --auth better-auth \
  --payments none \
  --database postgres \
  --orm prisma \
  --db-setup neon \
  --package-manager bun \
  --git \
  --web-deploy docker \
  --server-deploy docker \
  --install \
  --addons biome turborepo \
  --examples none
```

This generates a Turborepo monorepo:

```
aws-platform/
├── apps/
│   ├── web/      # React Router frontend
│   └── server/   # Hono backend (tRPC API)
├── packages/     # Shared code (types, config, etc.)
└── README.md
```

- **Frontend:** React Router (SPA/framework mode)
- **Backend:** Hono, exposing a **tRPC** API (fully typed client → server, no manual REST contracts)
- **Auth:** Better Auth
- **Database:** PostgreSQL, provisioned on **Neon**
- **ORM:** Prisma
- **Package manager / runtime:** Bun, for everything
- **Linting/formatting:** Biome (replaces ESLint + Prettier)
- **Monorepo tooling:** Turborepo
- **Deploy target (both web + server):** Docker

After scaffolding, Huzaifa pushes the repo. Everyone else clones and runs:

```bash
bun install
```

Do not re-run `bun create` inside an existing clone.

---

## 3. Mandatory Frontend Tooling — Impeccable

Every frontend contributor installs **Impeccable** before writing UI code. It's a design-quality skill/CLI for AI coding agents that catches generic "AI slop" UI and enforces a real design vocabulary.

```bash
npx impeccable install
```

Then, inside your AI coding tool:

```
/impeccable init
```

This scans the repo's tokens, components, and Tailwind config so the agent has real project context instead of guessing.

**Rule for anyone using an AI agent to write frontend code in this repo:** Impeccable must be installed and initialized first. Run `/impeccable audit` or `/impeccable polish` before opening a PR for any new UI surface. `npx impeccable detect src/` can be wired into CI later to block obvious anti-patterns automatically.

---

## 4. Design System

- **Palette:** Black (primary/background) + AWS Yellow (`#FF9900`) as the sole accent
- **Usage principle:** Black carries structure and hierarchy; yellow is used sparingly for primary actions, key highlights, and states that need attention (CTAs, active nav, alerts) — not decoratively.
- No secondary accent colors without coordinator sign-off. Keep the palette disciplined.
- Typography/spacing/component decisions are governed by Impeccable's design vocabulary (Section 3) — don't default to generic Inter-on-dark templates.

---

## 5. Design Principles

1. **Type safety end-to-end** — tRPC + Prisma means the client, API, and DB schema should never silently drift. If you're writing an `any`, stop.
2. **No parallel patterns** — one way to fetch data, one way to handle auth, one way to style a component. Match existing conventions in `apps/web` and `apps/server` rather than introducing a new pattern per feature.
3. **Small, typed, composable modules** — shared logic goes in `packages/`, not duplicated across `apps/web` and `apps/server`.
4. **Docker-first** — anything you build should run cleanly in the Docker deploy target; don't rely on local-machine-only setup.
5. **Formatting/linting is not optional** — Biome runs pre-commit/CI. Don't fight it, don't disable rules without discussion.

---

## 6. System Boundaries

- **Frontend (`apps/web`)** owns: UI, client-side routing (React Router), presentation logic, calling the API only via the generated tRPC client. It does **not** talk to the database directly.
- **Backend (`apps/server`)** owns: all business logic, Prisma/DB access, auth (Better Auth), and the tRPC router definitions that the frontend consumes.
- **Database (Neon Postgres)** is only ever accessed through Prisma, only from `apps/server`.
- **Shared packages** hold types/utilities used by both sides — if you find yourself copy-pasting a type between `web` and `server`, it belongs in `packages/`.
- **Deployment** is Docker for both web and server — environment-specific config lives in env files, never hardcoded.

---

## 7. Open Items (fill in before kickoff)

- [ ] Assign module owners per team member
- [ ] Confirm Neon project + env vars are shared securely (not in the repo)
