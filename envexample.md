```sh
# Copyright Todd Agriscience, Inc. All rights reserved.
# Environment Variables Example
# Copy this file to .env.local for local development

# Production domain (required for production)
NEXT_PUBLIC_PRODUCTION_DOMAIN=toddagriscience.com

# Base URL for canonical links and metadata (optional, auto-detected)
NEXT_PUBLIC_BASE_URL=https://toddagriscience.com

# Locale detection settings
NEXT_LOCALE=en  # Force default locale (optional)

# Other environment variables
NODE_ENV=development

# The URL/IP for the backend
BACKEND_HOST="http://localhost:8080"

# Both of these keys are real and appropriate to be public.
SUPABASE_PROJECT_ID="pexzjinboynpudrgsbve"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBleHpqaW5ib3lucHVkcmdzYnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNjkzODksImV4cCI6MjA3Nzg0NTM4OX0.n-ikH7U_r8zOFd3LnM62GIefOyngrSRWLlHqjgL7YeM"

# Enable debug logging
DEBUG=true

# Disable telemetry (Next.js)
NEXT_TELEMETRY_DISABLED=1
```
