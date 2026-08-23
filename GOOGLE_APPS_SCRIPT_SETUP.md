# Google Apps Script setup

The [`code.gs`](code.gs) file is the Google Apps Script Web App source for this project.

1. Create or open the Google Sheet that should receive registrations.
2. Open **Extensions → Apps Script**.
3. Copy the contents of `code.gs` into the Apps Script editor.
4. Save the project and allow the requested Google Drive and Sheets permissions.
5. Select **Deploy → New deployment**.
6. Choose **Web app** as the deployment type.
7. Set **Execute as** to your account.
8. Set access to **Anyone** so the backend proxy can submit registrations.
9. Deploy and copy the Web App URL into the server-only `.env` file as `SCRIPT_URL`.

The Google Sheet headers must be ordered as follows:

```text
Timestamp, Name, Email, Mobile, APAAR ID, DOB, Aadhaar, Stream,
Subject 1, Subject 2, Subject 3, Nominee Name, Nominee DOB,
Nominee Mobile, Nominee Aadhaar, Photo URL
```

After changing `code.gs`, create a new deployment version so the Web App uses the updated code.
