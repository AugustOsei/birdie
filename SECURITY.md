# Security Policy

## Supported Versions

This project is community-maintained; security fixes are applied to the default branch when available.

## Reporting a Vulnerability

Please **do not** open public issues for security reports.

Email: **security@augustwheel.com**

Include:
- steps to reproduce
- impact and affected endpoints
- any logs/screenshot evidence (redact secrets)

## Operational Notes (High level)

- Admin endpoints are protected by an API key stored in server-side environment variables.
- **Never** put secrets in URLs, markdown files, or client-side code.
- Rotate any leaked key immediately and assume it’s compromised.
