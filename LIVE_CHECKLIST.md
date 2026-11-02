# PRODUCTION DEPLOYMENT & VERIFICATION CHECKLIST (LIVE)

**Target Host**: Vercel (`https://codex-tech-4aic.vercel.app`)  
**Database**: Cloud MySQL (Serverless-compatible, e.g., TiDB Cloud / Aiven / PlanetScale / Railway)  
**Security Level**: High (Zero Demo Data, Non-Root Credentials, Parameterized Queries)  

---

## 1. Local vs. Live Databases: Fundamental Rule

> [!IMPORTANT]
> **Local and Live are completely separate databases.**
> - Your local machine connects to `mysql://root:@localhost:3306/codex_tech_it`.
> - The live Vercel deployment connects to a remote cloud MySQL instance via a secure connection string configured in Vercel Project Environment Variables.
> - **Live must only show real live candidate submissions.** Demo scripts (`npm run db:seed:demo`) are strictly prevented by code guards from running in production.

---

## 2. Cloud MySQL Setup & Connection Pooling

Because Vercel executes API endpoints as serverless functions (AWS Lambda), connections open and close rapidly. To prevent exhausting database connections:

1. **Create a Dedicated Database User (Not Root)**:
   ```sql
   CREATE USER 'codex_app'@'%' IDENTIFIED BY 'StrongRandomPassword2026!';
   GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, INDEX ON codex_production.* TO 'codex_app'@'%';
   FLUSH PRIVILEGES;
   ```
2. **Connection Pooling Parameters**:
   Append connection pool limits to your `DATABASE_URL`:
   ```
   mysql://codex_app:StrongRandomPassword2026!@your-cloud-db-host:3306/codex_production?connection_limit=10&sslaccept=strict
   ```

---

## 3. Required Environment Variables on Vercel

In your **Vercel Dashboard > Project Settings > Environment Variables**, ensure the following keys are present across **Production** and **Preview**:

| Environment Variable Name | Description |
| :--- | :--- |
| `DATABASE_URL` | Cloud MySQL connection string with SSL and pool limits |
| `JWT_SECRET` | 64+ character random cryptographic secret for admin JWT tokens |
| `ADMIN_EMAIL` | Production admin login email address |
| `ADMIN_PASSWORD` | Strong production admin password (distinct from local) |
| `SMTP_HOST` | Transactional email provider (e.g. `smtp.gmail.com` or `smtp.resend.com`) |
| `SMTP_PORT` | Port number (`587` or `465`) |
| `SMTP_USER` | Email service username |
| `SMTP_PASS` | Application-specific password |
| `SMTP_FROM` | Sender address (e.g. `Codex Tech-IT <contact@codextechit.com>`) |
| `NOTIFY_EMAIL` | Internal recipient email for candidate alerts |
| `NODE_ENV` | Must be explicitly set to `production` |

---

## 4. Safe Schema Migration (No Reset, No Data Loss)

> [!CAUTION]
> **Never run `prisma migrate reset` or `prisma db push --force-reset` on the live database.**

Run from your terminal pointing `DATABASE_URL` to the remote live database:

1. **Perform an Instant Cloud Backup**:
   Use your cloud provider's snapshot tool (e.g., TiDB Cloud Backup, Aiven Snapshot) or run:
   ```bash
   mysqldump -h your-cloud-host -u codex_app -p --single-transaction --routines --triggers codex_production > backup_codex_production_$(date +%F).sql
   ```
2. **Apply Schema Safely**:
   ```bash
   npx prisma migrate deploy
   ```
   *(Or for direct additive push without reset: `npx prisma db push --skip-generate`)*

---

## 5. Live Static Content Seeding (Zero Demo Data)

To populate only static marketing content (courses, FAQs, testimonials, live placement alumni, and the admin user):

```bash
# Set DATABASE_URL to your remote live database, then run:
npx tsx server/db/seed.ts
```
*Note*: `server/db/seed.ts` uses idempotent `upsert` queries. It is completely safe to run repeatedly and never inserts sample candidate submissions.

---

## 6. Live Verification Protocol (Single Test Form)

Once redeployed to Vercel:

1. **Verify Database Health Badge**:
   - Open `https://codex-tech-4aic.vercel.app/login`
   - Log in with your production admin credentials.
   - Verify that the header badge shows:
     `Production: codex_production (Connected)` with a green pulsing indicator.
2. **Submit ONE Real Test Form**:
   - Open an incognito browser to `https://codex-tech-4aic.vercel.app/contact`
   - Submit a test inquiry:
     - Name: `Production Verification Test`
     - Email: `verify.prod@example.com`
     - Phone: `5551234567`
     - Subject: `Live Site Form Sync Test`
     - Message: `Verifying live MySQL write path.`
3. **Verify Dashboard Count Increments**:
   - Return to `https://codex-tech-4aic.vercel.app/admin`
   - Click **Refresh Metrics**.
   - Confirm **Contact Messages** card increments by `1`.
   - Open **Inquiries & Submissions > Contacts** tab and confirm `Production Verification Test` is listed.
4. **Cleanup Test Row**:
   - In the Contacts tab, click the **Trash** icon next to `Production Verification Test` and confirm deletion.
   - Confirm count returns to clean state.

---

## 7. Status of Verification

| Item | Status | Verification Note |
| :--- | :---: | :--- |
| **Local Environment Fix & Real MySQL Data** | **VERIFIED** | 100% green via Playwright automated tests. Local cards show: 11 Leads, 3 Applications, 6 Employer Requests, 23 Contacts, 9 Subscribers, 12 Placements, 3 Referrals. |
| **Error Handling & No Silent Zeros** | **VERIFIED** | Intercepted 500 error confirmed; displays error banner & Retry button; 0 cards suppressed. |
| **Form Write Path & Real-Time Sync** | **VERIFIED** | Form submitted on `/contact`, verified count rose from 23 to 24, cleaned up. |
| **Live Vercel Database Connection** | `NOT VERIFIED` | Cloud MySQL credentials and Vercel environment deployment must be configured by you in the Vercel dashboard. |
| **Live Single-Row Form Submission** | `NOT VERIFIED` | Requires active remote cloud database deployment. |

