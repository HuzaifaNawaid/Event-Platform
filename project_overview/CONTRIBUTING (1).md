# CONTRIBUTING.md — Git Workflow Guide (AWS Student Builder Group)

> Read this before you start working on the repo. Every team member must follow this exact workflow.

---

## 1. Introduction

This document explains how our team will collaborate on GitHub for the **Dev Society Events Platform** project. Everyone — regardless of your module — follows the same process. This keeps the codebase clean, avoids conflicts, and makes review manageable for Huzaifa (Project Coordinator).

---

## 2. Golden Rules

- ❌ **No one pushes directly to `master`.** Not even a small fix.
- ✅ **All work happens on a feature branch.**
- ✅ **`master` is only updated through a Pull Request (PR)**, reviewed and merged by **Huzaifa or Waqas**.
- ✅ If two people are working on the same module (e.g. Laiba + Taha), they share **one branch** — not two separate ones.

---

## 3. One-Time Setup

Do this only once, when you first join the project:

```bash
git clone <repo-url>
cd aws-platform
bun install
```

Do **not** re-run the scaffold/generator command. It has already been run by Huzaifa.

---

## 4. Branch Naming Convention

Create your branch based on the module you're assigned to:

| Module | Owner(s) | Branch Name |
|---|---|---|
| Landing + Event Detail Pages | Laiba, Taha | `feature/landing-event-pages` |
| Auth Setup (Sign Up/In, Session) | Waleed, Sameer | `feature/auth-setup` |
| Registration Form Backend | Amaan | `feature/registration-backend` |
| User Dashboard + QR View | Waleed, Sameer | `feature/user-dashboard` |
| Admin Portal | Umer Gul, Bilal | `feature/admin-portal` |
| Payment OCR + Certificates | Umer Gul, Bilal, Waleed, Sameer | `feature/payment-certificates` |

> **Note on Admin Portal:** This module is large, so it can be split into 2 PRs from the same branch instead of one giant PR — e.g. "Applications view + Approve/Reject" as one PR, and "QR Scanner + Attendance" as a second PR. You still work on one branch (`feature/admin-portal`); you just open separate PRs at logical checkpoints instead of waiting for the whole module to finish.

If your module isn't listed here, ask Huzaifa for a branch name before starting.

---

## 5. Project Workflow — Step by Step

This is the exact process to follow every time you work on the project:

1. **If you haven't cloned the repo yet** → clone it (see Section 3).
2. **If you already have the repo cloned** → go to `master` and pull the latest changes:
   ```bash
   git checkout master
   git pull origin master
   ```
3. **Create your feature branch from `master`:**
   ```bash
   git checkout -b feature/your-branch-name
   ```
4. **Work on your branch.** As you complete chunks of work, commit and push regularly:
   ```bash
   git add .
   git commit -m "feat: short description of what you did"
   git push origin feature/your-branch-name
   ```
5. **Only open a Pull Request once your entire module/feature is complete** — not after every small commit. Small commits and pushes are fine and encouraged; the PR itself should represent finished, testable work.
6. **Huzaifa or Waqas reviews the PR** and merges it into `master` if everything looks good.

---

## 6. Two People Working on One Module

Example: **Laiba and Taha** are both working on Phase 1 (Landing + Event Detail pages).

- They **do not** create two separate branches. They share **one branch**: `feature/landing-event-pages`.
- Before starting work each time, both should pull the branch to get each other's latest changes:
  ```bash
  git checkout feature/landing-event-pages
  git pull origin feature/landing-event-pages
  ```
- Push your work often (at least once a day) so the other person always has your latest code to build on.
- Communicate directly with each other (WhatsApp/in-person) about who's working on which file/section to avoid stepping on each other's work.

---

## 7. How to Open a Pull Request

- Go to GitHub → your branch → **"Compare & Pull Request"**
- Base branch: `master` | Compare branch: `feature/your-branch-name`
- In the description, briefly summarize:
  - What module/feature this PR covers
  - What was implemented
  - Anything the reviewer should specifically check
- For large modules (like Admin Portal — see note in Section 4), it's okay to split into smaller PRs so review is easier.
- For smaller modules (e.g. Landing Page), one PR for the whole module is fine.

---

## 8. Commit Message Convention

Keep commit messages short and prefixed:

- `feat: add landing page hero section`
- `fix: correct registration form validation`
- `chore: update dependencies`
- `docs: update README`

---

## 9. Environment Variables / Secrets Rule

The `.env` file contains sensitive information — database URL, Resend API key, Cloudinary keys, etc. If this ever gets pushed to GitHub, anyone with repo access could misuse these credentials.

**Rule:**
- **Never** run `git add` or `git push` on your `.env` file. It is already listed in `.gitignore`, so Git will automatically ignore it — you don't need to do anything extra, just don't force-add it.

**Example:**
```
DATABASE_URL="postgres://user:pass123@neon.tech/db"
RESEND_API_KEY="re_abc123xyz"
```
This stays only in your local project folder. Even if you accidentally type `git add .`, `.gitignore` will prevent it from being pushed.

---

## 10. Questions / Confusion?

Contact **Huzaifa** or **Waqas** before making assumptions about the stack, workflow, or merging into `master`.
