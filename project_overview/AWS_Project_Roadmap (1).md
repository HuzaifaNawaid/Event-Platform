# AWS Student Builder Group — Dev Society Events Platform
## Project Roadmap & Team Assignment

---

## Project Overview

A full-stack platform for the dev society to manage events end-to-end: event listing → registration with payment proof → admin approval → QR-based attendance → certificate issuance with public verification. Built on a Turborepo monorepo (React Router + Hono/tRPC + Prisma + PostgreSQL on Neon), with two roles — **Applicant** and **Admin**. Estimated total build time: **5–6 weeks**.

---

## 1. Team Assignment Table

| # | Team Member(s) | Module | Type | Portal | Phase |
|---|---|---|---|---|---|
| 0 | **Huzaifa Nawaid** | Project scaffold, repo push, Prisma schema + basic tables on Neon DB | Setup (one-time) | — | Phase 0 |
| 1 | **Laiba, Taha** | Landing page, Event detail page, Registration form (UI only) | Frontend | Landing & Event Pages | Phase 1 + 3 |
| 2 | **Amaan, Sameer** | Sign Up/Sign In, Session handling, User Profile, Dashboard (shell: events list + Register entry point → later: status + QR + certificate view) | Frontend + Backend | User Portal | Phase 1 + 2 + 5 |
| 3 | **Waleed** | Registration form backend logic, DB save, Cloudinary upload handling, confirmation email (Resend) | Backend | User Portal | Phase 3 |
| 4 | **Umer Gul + Muhammad Bilal** | Admin Portal — Applications view, Approve/Reject logic, QR code generation for attendance, certificate bulk generation trigger, payment proof OCR/bank statement matching | Frontend + Backend | Admin Portal | Phase 4, 5 |

---

## 2. Roadmap — Phase Wise

### Phase 1 — Public Pages + Auth Foundation (Parallel) — **5 days**
**These two run in parallel since they don't depend on each other:**

**Laiba, Taha (Frontend):**
- [ ] Landing page — events list (next/prev navigation)
- [ ] Event detail page (click event → details + Register button)

**Amaan, Sameer (Frontend + Backend):**
- [ ] Better Auth setup — Sign Up / Sign In
- [ ] Session handling / protected routes

> 🔗 This phase must be fully complete before Phase 2 (Portal Dashboard Shell) starts, since the dashboard needs a working session to know who's logged in, and needs the Event data model to list events.

---

### Phase 2 — User Portal Dashboard Shell — **3 days**
**Owner: Amaan, Sameer**

- [ ] Dashboard/home page — shows the **events list** inside the portal (same event data as the landing page), each with a Register button
- [ ] Routing: after sign-in/sign-up (new or returning user) → redirect **directly here**, not to a form
- [ ] Basic User Profile page shell

> 🔗 This is a prerequisite for Phase 3 — the registration form is opened from this dashboard, so the shell has to exist before Laiba/Taha and Waleed can wire up the registration flow. Status view, QR view, and certificate view are built later, in Phase 5, once there's real approved/attended data to show.

---

### Phase 3 — Registration Flow (Sign-In + Dashboard Gated) — Sequential, after Phase 2 — **7 days**
**Owners: Laiba, Taha (Frontend) + Waleed (Backend)**

Frontend (Laiba, Taha):
- [ ] Register button **on the Phase 2 dashboard shell** (not the public event detail page) opens the registration form
- [ ] Registration form UI (name, email, university, event-specific fields, screenshot upload)
- [ ] On submit → stay on / return to the dashboard, which shows the application status as `pending`

Backend (Waleed):
- [ ] Form submission API (tRPC procedure) — link application to signed-in user's id
- [ ] Payment screenshot upload to Cloudinary
- [ ] Save application record to Postgres (status: `pending`)
- [ ] Confirmation email via Resend ("application received")

> 🔗 Note: Laiba/Taha and Waleed need to sync field names (form fields = backend expected fields). Fully testable only once Phase 2's dashboard shell is in place to host the Register trigger.

---

### Phase 4 — Admin Portal — **9 days**
**Owner: Umer Gul + Muhammad Bilal**
- [ ] Admin login
- [ ] Applications list view (all applications + screenshot + status)
- [ ] Approve action (status flip + trigger QR + approval email)
- [ ] Reject action (mandatory reason field + rejection email)
- [ ] Registered users table
- [ ] CSV export (one-click)
- [ ] QR code generation per approved application (unique token) + sent in approval email
- [ ] Admin-side camera scanner (webcam-based) for attendance
- [ ] Scan states: valid / invalid / already-scanned
- [ ] Attendance record saved to Postgres (scanned status, timestamp, scanned-by)

> ⚠️ Note: UI can be built in parallel with Phase 3, but fully testing Approve/Reject and QR logic requires real registration data from Phase 3.

---

### Phase 5 — Dashboard Completion + Payment Proof + Certificates — **8 days**
**Owners: Amaan, Sameer (dashboard: status, QR view, certificate view) | Umer Gul, Bilal (payment OCR, certificate generation)**

Dashboard completion (Amaan, Sameer):
- [ ] Full status states on dashboard (pending/approved/rejected, incl. rejection reason)
- [ ] QR code view on dashboard, shown once application is approved
- [ ] Certificate view on dashboard, once issued

Payment Proof Module:
- [ ] Payment proof module (match screenshot to bank statement via OCR/Python) — **Umer Gul and Muhammad Bilal to decide and implement together**

Certificates:
- [ ] Decide: PDF vs image generation (open item — confirm with team)
- [ ] Certificate template/design
- [ ] Certificate bulk generation trigger (Umer Gul, post-event)
- [ ] Public verification page (no login required)

> 🔗 The QR view and certificate view genuinely can't be tested until Phase 4's Approve/QR-generation and scanner logic exist — this is why they're placed after Admin Portal, not alongside the Phase 2 dashboard shell.

---

### Phase 6 — Polish + QA (Everyone) — **3-4 days**
- [ ] Full audit/polish on every UI surface before PR
- [ ] Design consistency check (black + AWS yellow, zinc theme)
- [ ] End-to-end test: sign in → land on dashboard → apply → payment → approve → QR → attendance → certificate
- [ ] Docker deployment test (web + server)

---

## 3. Total Estimated Timeline

| Phase | Duration |
|---|---|
| Phase 0 — Setup | 1–2 days |
| Phase 1 — Public Pages + Auth | 5 days |
| Phase 2 — Portal Dashboard Shell | 2 days |
| Phase 3 — Registration Flow | 7 days |
| Phase 4 — Admin Portal | 9 days |
| Phase 5 — Dashboard Completion + Payment Proof + Certificates | 8 days |
| Phase 6 — Polish + QA | 3-4 days |
| **Total** | **35-37 days (5 weeks)** |

---

## 4. Open Items — To Confirm With Team

- [ ] Exact fields for the registration form (beyond university, what else is needed)
- [ ] Certificate design and format — PDF or image
