# What we need from the CRM API to run the landing page

This document describes the server-side requirements for the Meser Eser landing-page app. The browser app calls the CRM directly over HTTPS — there is no intermediate server on our side.

## TL;DR

| Need | Status / question |
|---|---|
| `CreateContact` function | ✅ Already documented and assumed available |
| Get-contact-by-id function | ❓ **Function name + payload shape needed** |
| `ApiKey` header support on both functions | Required |
| CORS headers on the JSON service for our origin | Required |
| `{ ErrorCode, Result }` envelope on every response | Already the convention |

## How the app calls the API

- **Base URL:** `https://heb.mesereser.com/Services/JsonServices.aspx?f=<FunctionName>`
- **Method:** `POST`
- **Headers:**
  - `Content-Type: application/json`
  - `ApiKey: <key>` — the customer's API key from the user-settings UI
- **Body:** JSON object with the function's parameters
- **Response envelope:**
  ```json
  { "ErrorCode": "0", "Result": { ... } }
  ```
  - `ErrorCode === "0"` means success; `Result` carries the payload (an object for reads, anything/empty for writes).
  - Any other `ErrorCode` is treated as failure and `Result` is shown to the user as the error message.

## Functions used

### 1. Get contact by id — **details TBD**

The app fetches one contact when the visitor opens `https://<our-domain>/landing?id=<contactId>` and renders the page from the response. We need:

- **Function name** (e.g. `GetContact`, `GetContactById`, …) — currently a placeholder in our code.
- **Request body shape**, e.g.:
  ```json
  { "Id": "12345" }
  ```
  Tell us the exact field name (`Id`, `ContactId`, `id`, …) and type.
- **Response `Result`** — must be a `CreateContact`-shaped object (see field map below). All fields can be empty strings; only the ones we read are listed.

### 2. CreateContact — already documented

Used by the lead form on the rendered landing page when a *visitor* submits their details. The app posts the standard `CreateContact` payload:

```json
{
  "Address": "",
  "City": "",
  "ContactListName": "",
  "CustomField1": "",
  "CustomField2": "",
  "CustomField3": "",
  "CustomField4": "",
  "CustomField5": "",
  "EMail": "",
  "FirstName": "",
  "LastName": "",
  "PhoneNo": "",
  "Zipcode": ""
}
```

In this direction the app fills `FirstName`, `LastName`, `EMail`, `PhoneNo`, and uses `CustomField1` for an optional free-text message. The other fields are sent as empty strings.

## Field map (Get-contact response → landing page UI)

The page renders these fields out of the contact JSON. Anything else in the JSON is ignored — no need to strip extras:

| JSON field | Used as |
|---|---|
| `CustomField1` | Banner name (top strip of the page) |
| `CustomField2` | Business description — expanded into headline, intro, benefits, and CTA |
| `CustomField3` | Hero image URL. If empty, we fall back to a generated image based on `CustomField2` and `CustomField4` |
| `CustomField4` | Image category key (one of: `business`, `restaurant`, `cafe`, `shop`, `fashion`, `tech`, `health`, `fitness`, `beauty`, `real_estate`, `education`, `travel`, `hotel`, `wedding`, `photography`, `default`) |
| `CustomField5` | Owner contact email shown in footer + mailto link |
| `FirstName` + `LastName` | Owner display name |
| `EMail` | Fallback for owner email when `CustomField5` is empty |

Fields that exist in the shape but the page does **not** display: `PhoneNo`, `Address`, `City`, `Zipcode`, `ContactListName`. They can be empty strings in the response.

## CORS — required

The browser calls `https://heb.mesereser.com/Services/JsonServices.aspx` directly. The server must answer CORS preflight (`OPTIONS`) and the actual `POST` with:

- `Access-Control-Allow-Origin: <our landing-page origin>` (or `*` if you accept all origins)
- `Access-Control-Allow-Methods: POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, ApiKey`

Without these headers the browser will block every call before it reaches our code, regardless of whether the API key is valid.

## Test scenarios we'll run together

1. **Happy path**: `GET .../<id>` returns a populated contact → page renders banner from `CustomField1`, hero text from expanded `CustomField2`, image from `CustomField3` (or fallback), footer from name + `CustomField5`.
2. **Bad id**: response has `ErrorCode: "1"` and `Result: "Contact not found"` → page shows the error message verbatim.
3. **Missing API key**: response should be a non-zero `ErrorCode` with a clear `Result` string (e.g. `"Invalid ApiKey"`).
4. **Lead submission**: visitor fills the on-page form → app POSTs `CreateContact` → contact appears in the CRM with `FirstName`, `LastName`, `EMail`, `PhoneNo` populated and `CustomField1` containing the visitor's free-text message.

## Open items the CRM dev needs to confirm

1. Exact function name and request body shape for the get-contact-by-id call.
2. CORS configuration for the landing-page origin (give us the production hostname when ready).
3. Whether the `ApiKey` is per-customer or shared, and how it's rotated.
