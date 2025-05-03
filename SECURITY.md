# Security Policy

## Supported Versions

Currently, we actively support these versions of the PluralKit Discord Overlay with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of the PluralKit Discord Overlay seriously, especially since it handles sensitive information like system tokens. Here's how to report security vulnerabilities:

### How to Report

If you discover a security vulnerability, please send an email to admin@clovetwilight3.co.uk with:

- A description of the vulnerability
- Steps to reproduce the issue
- Potential impact of the vulnerability
- Any suggestions for mitigation

### What to Expect

After you report a vulnerability:

1. You'll receive confirmation of your report within 48 hours
2. We'll investigate and determine the impact and severity of the issue
3. We'll work on a fix and keep you updated on our progress
4. Once fixed, we'll publicly acknowledge your report (unless you request anonymity)

### Safe Harbor

We support responsible disclosure practices and won't take legal action against you if you:

- Report the vulnerability promptly
- Make a good faith effort to avoid privacy violations, destruction of data, and disruption of services
- Don't exploit the vulnerability beyond what is necessary to demonstrate the issue
- Provide us reasonable time to address the issue before any public disclosure

## Security Considerations

### System Token Security

The PluralKit Discord Overlay stores your system token locally with basic encryption. Please be aware of these security limitations:

1. The token is stored on your local device
2. The encryption is meant to prevent casual visibility but is not enterprise-grade
3. Anyone with full access to your computer could potentially access your token

### Best Practices

1. Never share your system token with anyone
2. Use unique tokens for different applications when possible (regenerate your token with `pk;token refresh` after giving it to another application)
3. Regularly review which applications have your token
4. If you suspect your token has been compromised, regenerate it immediately with `pk;token refresh`

### Data Handling

The PluralKit Discord Overlay:
- Never sends your system token to any server except the official PluralKit API
- Doesn't collect analytics or telemetry
- Stores all configuration locally on your device
- Respects PluralKit's privacy settings