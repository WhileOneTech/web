# DNS records for whileone.se (GitHub Pages)

Set these at Loopia (or any registrar/DNS host).

## Required records

| Type | Host/Name | Value/Target |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | `whileonetech.github.io` |

## Optional IPv6 records (recommended)

| Type | Host/Name | Value/Target |
|---|---|---|
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |

## GitHub Pages settings checklist

1. Push this repo (including `index.html` and `CNAME`) to GitHub.
2. In repo settings, enable Pages from `main` branch root.
3. In Pages settings, set custom domain to `whileone.se`.
4. Wait for DNS to propagate, then enable `Enforce HTTPS`.

Notes:
- DNS changes can take from a few minutes up to 24-48 hours.
- If HTTPS is temporarily unavailable, wait for DNS + certificate provisioning to complete.
