# SFS College Student Registration

Responsive student registration form for St. Francis de Sales College, Nagpur.

## Features

- Responsive campus-image layout
- Student, academic, nominee, and photo-upload fields
- Science and Arts subject options
- Inline validation and progress tracking
- Photo preview and drag-and-drop upload
- Success screen after submission
- Local Node proxy and Vercel serverless proxy

## Local development

1. Make sure `.env` contains the Google Apps Script URL:

   ```env
   SCRIPT_URL=https://script.google.com/macros/s/your-script-id/exec
   ```

2. Start the local server:

   ```bash
   npm start
   ```

3. Open:

   ```text
   http://localhost:5500
   ```

Local development uses `server.js`; no Vercel CLI is required.

## Vercel deployment

Vercel automatically detects `api/register.js` as the production serverless function.

1. Push the project to GitHub and import it into Vercel.
2. Set the framework preset to **Other**.
3. Leave Build Command and Output Directory empty.
4. Add `SCRIPT_URL` under **Project → Settings → Environment Variables**.
5. Redeploy after adding the variable.

The local `.env` file is git-ignored and is never deployed.

## Submission flow

```text
Browser → POST /api/register → server.js locally
                           → api/register.js on Vercel
                           → Google Apps Script → Google Sheet
```

## Google Apps Script

Copy [code.gs](code.gs) into the Apps Script editor attached to the destination Google Sheet. Deployment instructions are in [GOOGLE_APPS_SCRIPT_SETUP.md](GOOGLE_APPS_SCRIPT_SETUP.md).

Required sheet column order:

```text
Timestamp, Name, Email, Mobile, APAAR ID, DOB, Aadhaar, Stream,
Subject 1, Subject 2, Subject 3, Nominee Name, Nominee DOB,
Nominee Mobile, Nominee Aadhaar, Photo URL
```

## Project structure

```text
index.html                 Registration form
style.css                  Styling and responsive layout
script.js                  Frontend validation and submission
sfs.jpg                    College campus image
code.gs                    Google Apps Script source
server.js                  Local development proxy
api/register.js            Vercel production proxy
package.json               Local start script
.env                       Local environment file, git-ignored
```
