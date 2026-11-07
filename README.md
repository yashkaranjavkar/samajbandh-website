## Run Locally

1. Download pgAdmin/Postgre: `https://www.postgresql.org/download/`
2. For email service:
   + Enable 2-Step Verification     
      • Google Account.    
      • Click on Security in the left menu.     
      • Scroll down to How you sign in to Google and select 2-Step Verification.    
      • Follow the steps to turn it on (using your phone number or an authenticator app).    
   + Generate the App Password      
      • Go directly to the [Google App Passwords Page](https://myaccount.google.com/apppasswords). (Note: Google removed the public menu shortcut, so you must use this direct link).   
      • Under Select app, choose Other (Custom name).    
      • Type a recognizable name for your app or device (such as "WordPress SMTP" or "Samajbandh").    
      • Click Generate.    
      • Copy the 16-character password that appears on the screen (make sure to remove any spaces). Click Done. (Save it immediately, as Google will not show it to you again).     
3. Download Nods.js latest LTS version: `https://nodejs.org/en/download`


**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`


## Application form email + PostgreSQL setup

1. Rename `.env_sample` to `.env` and set `DATABASE_URL` to your PostgreSQL connection string. 
2. Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `MAIL_FROM`. Use an SMTP app password or your organization's SMTP credentials; never commit real credentials.
3. Set `APPLICATION_NOTIFY_EMAIL` to the staff inbox that should receive new application alerts. Applicants receive a confirmation email at the email address entered in the form.

If PostgreSQL or SMTP variables are not configured, the server logs that the relevant integration is unavailable; email delivery is not falsely reported as successful. Configure both integrations in your hosting provider's environment settings for production.


## Admin console security

- `/admin` displays a username/password sign-in page before rendering the dashboard.
- Configure `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and a random `ADMIN_SESSION_SECRET` (at least 32 characters) in the server environment. Do not commit real credentials.
- Admin data API endpoints are protected server-side with a signed, HttpOnly, SameSite=Strict cookie; sessions expire after 8 hours. The frontend gate is not the only security layer.
- Rotate credentials/secrets if they are exposed. For public production deployments, also add rate limiting / lockout and audit logging at the reverse proxy or API layer.
