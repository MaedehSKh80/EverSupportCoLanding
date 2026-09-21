# Google Apps Script setup

Use this `Code.gs` in the Apps Script project connected to your lead Google Sheet.

```javascript
const SHEET_NAME = "Sheet1";

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      ok: true,
      message: "EverSupportCo lead endpoint is running."
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error(`Sheet "${SHEET_NAME}" not found.`);

    const data = JSON.parse(e.postData.contents || "{}");

    const fullName = String(data.fullName || "").trim();
    const phone = String(data.phone || "").trim();
    const email = String(data.email || "").trim();
    const title = String(data.title || "").trim();
    const description = String(data.description || "").trim();

    if (!fullName || !phone || !email) {
      throw new Error("Required fields are missing.");
    }

    const id = Utilities.getUuid();
    const timestamp = new Date();

    // Columns:
    // A id
    // B تاریخ
    // C نام و نام خانوادگی
    // D شماره تماس
    // E ایمیل
    // F تایتل
    // G توضیحات
    // H دپارتمان بررسی
    // I وضعیت
    sheet.appendRow([
      id,
      timestamp,
      fullName,
      phone,
      email,
      title,
      description,
      "",
      ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        ok: true,
        id: id
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        ok: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}
```

<!-- ## Deployment

1. Open the Google Sheet.
2. Go to **Extensions → Apps Script**.
3. Paste the code into `Code.gs`.
4. Change `SHEET_NAME` if your sheet tab is not named `Sheet1`.
5. Click **Deploy → New deployment**.
6. Select **Web app**.
7. Set **Execute as:** Me.
8. Set **Who has access:** Anyone.
9. Deploy and authorize the project.
10. Copy the generated Web App URL ending in `/exec`.
11. Put that URL into `script.js`:
    `const GOOGLE_SCRIPT_URL = "YOUR_EXEC_URL";`
12. Upload/redeploy your landing page.

## Important note about CORS / no-cors

The provided front-end uses a simple POST request with `mode: "no-cors"` so a static landing page can submit to Apps Script without requiring a separate backend.

Because `no-cors` does not expose the server response to the browser, the UI treats a completed network request as submitted. The Apps Script itself validates the required fields and appends the row.

For production, consider adding:
- spam protection / rate limiting
- server-side email validation
- duplicate lead detection
- notification email or Telegram integration
- a controlled review workflow for status/department

## Suggested sheet formatting

- Format column B as date/time.
- Freeze row 1.
- Add dropdown validation to `دپارتمان بررسی`.
- Add dropdown validation to `وضعیت`.
- Keep H and I blank for the reviewer to fill. -->
