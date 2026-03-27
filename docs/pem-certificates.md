# PEM Certificates

SSL certificates for secure database connections to staging/production. You won't have to manually deal with most of the things in this document - generally speaking, you can download the PEM certificate from DigitalOcean and directly paste it into the `DATABASE_PEM_CERT` environment variable. Drizzle should handle the rest from there.

## Format

Text file starting/ending with:

```
-----BEGIN CERTIFICATE-----
(base64 content)
-----END CERTIFICATE-----
```

## Storage

**Never commit** to repository. Store in:

- GitHub Secrets: `DATABASE_PEM_CERT`
- Vercel Environment Variables: `DATABASE_PEM_CERT`
- Local: Not needed (local Docker DB doesn't use SSL)

## Using in CI/CD

From workflow files:

```bash
# Extract and format certificate
printf '%s\n' "$DATABASE_PEM_CERT" | sed -e 's/\r$//' > /tmp/cert.pem

# Validate it
openssl x509 -in /tmp/cert.pem -noout -subject

# Use with database connection
PGPASSWORD="$PASSWORD" pg_dump \
  "host=$HOST \
   port=$PORT \
   user=$USER \
   dbname=$DB \
   sslmode=verify-ca \
   sslrootcert=/tmp/cert.pem"
```

## Setting Up

### Obtain Certificate

1. Download from database provider dashboard
2. Usually provided as `.pem` file

### Add to GitHub Secrets

1. Go to repo Settings → Secrets and variables → Actions
2. Create new secret: `DATABASE_PEM_CERT`
3. Paste entire certificate (including BEGIN/END lines)

### Add to Vercel

1. Go to project Settings → Environment Variables
2. Add: `DATABASE_PEM_CERT` = (paste certificate)
3. Apply to production/preview as needed

## Troubleshooting

**"certificate verify failed"**

- Check cert is valid: `openssl x509 -in cert.pem -noout`
- Check expiration: `openssl x509 -in cert.pem -noout -dates`
- Ensure formatting correct (must have BEGIN/END)

**"no certificate found"**

- Verify environment variable is set
- Local database doesn't need SSL
- Production/staging requires certificate

**"Wrong version number"**

- Certificate formatting issue
- Ensure newlines are real (not `\n` escaped)
- Use proper sed command to format

**Certificate expired**

- Get new certificate from provider
- Update GitHub secret and Vercel
- Redeploy applications

## Checking Certificate

```bash
# Subject/hostname
openssl x509 -in cert.pem -noout -subject

# Validity dates
openssl x509 -in cert.pem -noout -dates

# Full details
openssl x509 -in cert.pem -noout -text
```

## Rotation

1. Get new certificate
2. Update GitHub secret
3. Update Vercel environment
4. Redeploy applications
5. Monitor for connection errors
