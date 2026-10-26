---
category: OSWA Web App Pentesting
order: 8
summary: Login brute-force/lockout considerations, session token analysis, JWT attacks, and common authentication-bypass logic flaws.
---
# Authentication & Session Attacks

## Definition
Weaknesses in how identity is verified or sessions are maintained: weak credentials, broken session tokens, flawed MFA/reset logic.

## Where it shows up
Login, password reset, "remember me", session cookies, MFA flow, JWTs.

## Detection
- Manual indicators: predictable session tokens, no lockout, weak reset tokens.
- Tools: Burp Sequencer (token randomness), Hydra (brute force), jwt_tool.

## Exploitation steps
1. Test for account lockout / rate limiting on login.
2. Analyze session token structure/entropy.
3. Test password reset token predictability/expiry.
4. Test JWT (alg confusion, `none` algorithm, weak secret).

## Quick payloads
```
JWT alg:none bypass
Brute force: hydra -l admin -P rockyou.txt target http-post-form
```

## Bypasses / edge cases
- 2FA bypass via response manipulation.
- Session fixation.

## Reference links
- [PortSwigger — Authentication](https://portswigger.net/web-security/authentication)
- [PortSwigger — JWT attacks](https://portswigger.net/web-security/jwt)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [HackTricks — JWT vulnerabilities](https://hacktricks.wiki/en/pentesting-web/hacking-jwt-json-web-tokens.html)
