<!-- <div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/089b164d-5abc-4a5e-b056-01457f8a0ab7 -->

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`


## Application form email + PostgreSQL setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` to your PostgreSQL connection string. `PGSSL=true` is commonly needed for hosted PostgreSQL providers.
2. Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `MAIL_FROM`. Use an SMTP app password or your organization's SMTP credentials; never commit real credentials.
3. Set `APPLICATION_NOTIFY_EMAIL` to the staff inbox that should receive new application alerts. Applicants receive a confirmation email at the email address entered in the form.
4. Run `npm install`, then `npm run dev`. On the first valid application, the server creates the `volunteer_applications` table and writes the application to PostgreSQL as well as the existing local JSON store.

If PostgreSQL or SMTP variables are not configured, the server logs that the relevant integration is unavailable; email delivery is not falsely reported as successful. Configure both integrations in your hosting provider's environment settings for production.


## Admin console security

- `/admin` displays a username/password sign-in page before rendering the dashboard.
- Configure `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and a random `ADMIN_SESSION_SECRET` (at least 32 characters) in the server environment. Do not commit real credentials.
- Admin data API endpoints are protected server-side with a signed, HttpOnly, SameSite=Strict cookie; sessions expire after 8 hours. The frontend gate is not the only security layer.
- Use HTTPS in production. The session cookie is marked `Secure` when `NODE_ENV=production`.
- Rotate credentials/secrets if they are exposed. For public production deployments, also add rate limiting / lockout and audit logging at the reverse proxy or API layer.
