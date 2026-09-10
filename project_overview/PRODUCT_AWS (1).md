# PRODUCT.md — Dev Society Events Platform

> What we're building and why. Read this alongside `AGENTS.md` (setup, stack, boundaries) before starting any feature work.

---

## 1. Overview

A platform for the dev society to run its events end-to-end: **event listing → registration + payment proof → admin approval → QR-based attendance → certificate issuance with public verification.**

Two user roles:
- **Applicant** — society member/student applying to attend an event
- **Admin** — society organizer managing events, approvals, attendance, and certificates

---

## 2. Core User Flow (Applicant)

1. **Browse events** — a list of upcoming events (hackathons, workshops, etc.) shown on the landing page.
2. **Click on a specific event** — a new page opens showing that event's details, with an Apply/Register button.
3. **Click Register** — requires the applicant to first **sign up / log in** to the portal (Better Auth).
4. **Land in the User Portal** — after sign up/login, the applicant is taken **directly to the User Portal home/dashboard**, which shows the list of events available inside the portal.
5. **Register from the portal** — the applicant clicks Register on an event from the User Portal dashboard, which opens the **actual application form**:
   - Personal info (name, email, etc.)
   - University name
   - (Event-specific fields as needed)
6. **Payment** — portal shows the account number to send payment to. Applicant uploads a **screenshot of the payment** as proof, as part of the same application.
7. **Submit** — on submission, the applicant stays on / returns to their **User Portal dashboard**, which shows the application status (`pending`), and a **submission confirmation email** (via Resend) is sent immediately: "Your application has been received, confirmation shortly."
8. **Approval** — admin reviews the application + payment screenshot and clicks Approve.
9. **Approval email** (via Resend) — sent on approval, containing:
   - Confirmation that registration is successful
   - A **QR code** unique to that user+event, to be scanned at the event for attendance
10. **Attendance** — at the event, admin scans the applicant's QR code with an admin-side scanner; scan verifies the ID and marks attendance.
11. **Post-event: Certificates** — after the event concludes, the applicant sees their **certificate with their name** on their portal dashboard, plus a **public verification link** anyone can use to confirm the certificate is authentic.

---

## 3. Core Admin Flow

- **Applications view** — all applications across all events, with applicant data, university, uploaded payment screenshot, and status.
- **Approve action** — one click per application:
  - Flips status to approved
  - Triggers the approval email + QR code generation/send
- **Registered users table** — every approved user, with their info + the event they're registered for, in one table.
  - **One-click export/download** of this table (e.g. CSV) — needed for offline processing, printing lists, etc.
- **Event logging** — every event and every state change on an application (submitted → approved / attended / certificate issued) must be **persisted correctly to Postgres**, not just held in UI state. This is the audit trail admins rely on.
- **QR attendance scanner** — admin-facing scanner (camera-based) that reads a user's QR code and verifies/marks them present for that event. Needs a clear valid/invalid/already-scanned result state.
- **Certificate issuance** — admin triggers certificate generation for attendees post-event (per event, likely bulk).

---

## 4. Data Model (high-level)

- **User** — account/auth info
- **Event** — name, description, date, account number for payment, status (upcoming/active/closed)
- **Application** — user ↔ event join, submitted form fields (incl. university), payment screenshot reference, status (`pending` / `approved` / `rejected`), timestamps
- **Attendance** — application ↔ event, QR token, scanned status, scanned timestamp, scanned-by (admin)
- **Certificate** — application ↔ event, applicant name as printed, unique public verification ID/slug, issued timestamp

All of the above are persisted in **PostgreSQL** (Neon) via Prisma — nothing event/registration-related should live only in client state.

---

## 5. Key System Requirements

- **Email delivery:** Resend, for both the "application received" and "approved + QR code" emails.
- **Payment proof:** file upload (screenshot) stored and attached to the application record, visible to admin during review.
- **QR codes:** generated per approved application, unique/verifiable, embedded in or attached to the approval email, scannable by an admin tool for attendance.
- **Certificate verification:** each certificate has a **public** link (no login required) that confirms authenticity — this is what makes certificates trustworthy outside the platform.
- **Correct persistence & logging:** application status changes, attendance scans, and certificate issuance are all durable DB events, not just transient UI actions — admins need to trust the data trail.
- **Bulk export:** registered users + their event data must be downloadable in one click for admin ops.

---

## 6. UI

- All UI blocks built around **shadcn/ui**, using the **zinc** theme as the base neutral palette.
- Layered with the black + AWS-yellow design system from `AGENTS.md` — zinc for structure/surfaces, yellow reserved for primary actions and key states (e.g. "Approve," QR scan success).

---

## 7. Decisions

- **File storage:** Cloudinary — used for payment screenshots and certificate images/assets.
- **QR scanning:** Browser webcam-based scanner (no dedicated hardware device). Admin scan UI needs camera permission handling + a clear valid/invalid/already-scanned state.
- **Rejection flow:** Rejected applicants also receive an email via Resend, including the **reason for rejection** written by the admin. Rejection should be a required-reason action in the admin UI, not a bare status flip.

## 8. Open Items (to confirm before build)

- [ ] Exact application form fields beyond name/university (per-event custom fields?)
- [ ] Certificate template/design + PDF vs image generation approach.
