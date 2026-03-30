# Security Vulnerabilities

If the security audit workflow fails, you can try and fix it yourself, but this can quickly become a pain. Instead:

1. Copy the output from `bun audit` on the relevant branch
2. Paste it into Claude and ask it to fix it
3. Make a PR

This is a dead simple issue that Claude can almost always handle. Double check the diff and make sure that there aren't any major issues, and you're probably good.

## Severity Levels

The automated workflow only picks up on high or critical vulnerabilities.

| Level    | CVSS    | Response Time | Examples                            |
| -------- | ------- | ------------- | ----------------------------------- |
| Critical | 9.0+    | 24-48 hrs     | Auth bypass, code execution         |
| High     | 7.0-8.9 | 1 week        | Privilege escalation, SQL injection |
| Medium   | 4.0-6.9 | 2-4 weeks     | Missing validation, weak crypto     |
| Low      | 0.1-3.9 | Next release  | Minor info disclosure               |

## Workflow

1. **Receive report** → Acknowledge within 24 hours
2. **Verify** → Reproduce issue
3. **Fix** → Develop patch
4. **Test** → Thorough testing
5. **Release** → Deploy fix (hotfix for critical)
6. **Disclose** → Public advisory after deployment

## Automated Scanning

### Dependency Vulnerabilities

```bash
bun audit --audit-level=high
```

- Runs on every PR/push
- Blocks high/critical vulnerabilities
- Dependabot provides alerts

**Fix**: `bun add package@latest` and test

### Secret Detection

ESLint plugin catches hardcoded credentials.

**False positive?** Use:

```typescript
// eslint-disable-next-line no-secrets/no-secrets
const value = 'false-positive';
```

## Prevention Checklist

- ✅ Validate all user input (server-side)
- ✅ Use parameterized queries (Drizzle handles this)
- ✅ Never commit `.env` files
- ✅ Use GitHub Secrets for sensitive data
- ✅ Implement HTTPS only
- ✅ Sanitize error messages
- ✅ Review PRs for security issues
- ✅ Keep dependencies updated

## Incident Response

If vulnerability is exploited:

1. **Assess** - What happened, scope
2. **Contain** - Stop attack if possible
3. **Notify** - Alert leadership
4. **Fix** - Develop patch
5. **Communicate** - Notify affected users
6. **Learn** - Post-mortem
