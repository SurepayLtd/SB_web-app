# 2FA Mock Configuration Guide

## Overview

The Mock 2FA interceptor is **completely optional and tunable**. You can enable or disable it in multiple ways depending on your needs.

---

## Configuration Options

### Option 1: Direct Code Configuration (Recommended for Development)

**File**: `src/environments/environment.ts`

```typescript
export const environment = {
  // ...other config...
  
  // Enable mock 2FA
  mockTwoFactorAuth: true
  
  // OR disable mock 2FA (use real backend)
  mockTwoFactorAuth: false
};
```

**When to use**: Local development and testing

---

### Option 2: Environment Variable (Recommended for Docker/CI)

**File**: `.env` or Docker environment

```bash
# Enable mock 2FA
MOCK_TWO_FACTOR_AUTH=true

# Disable mock 2FA
MOCK_TWO_FACTOR_AUTH=false
```

**When to use**: Docker deployments, CI/CD pipelines, staging environments

---

### Option 3: Remove Mock Interceptor Entirely

If you never want mock 2FA, you can remove it completely:

**Step 1: Remove from app.module.ts**

Remove or comment out:
```typescript
// Remove these imports
import { MockTwoFactorInterceptor } from './core/authentication/mock-two-factor.interceptor';

// Remove this from providers
...(environment.mockTwoFactorAuth === true ? [{
  provide: HTTP_INTERCEPTORS,
  useClass: MockTwoFactorInterceptor,
  multi: true
}] : [])
```

**Step 2: Delete the mock interceptor file (optional)**
```bash
rm src/app/core/authentication/mock-two-factor.interceptor.ts
```

**When to use**: Production-only applications that will never use mock mode

---

## Configuration Scenarios

### Scenario 1: Development Testing (Mock Mode)

```typescript
// src/environments/environment.ts
mockTwoFactorAuth: true
```

✅ No backend needed  
✅ Test OTP: `123456`  
✅ Instant testing  

---

### Scenario 2: Staging/QA (Real Backend)

```typescript
// src/environments/environment.ts
mockTwoFactorAuth: false
```

✅ Tests real integration  
✅ Real SMS/Email  
✅ Full backend validation  

---

### Scenario 3: Production (Real Backend - Default)

```typescript
// src/environments/environment.prod.ts
mockTwoFactorAuth: false  // or omit entirely
```

✅ Real backend only  
✅ No mock code loaded  
✅ Production-ready  

---

### Scenario 4: CI/CD Pipeline Testing

```dockerfile
# Dockerfile or docker-compose.yml
environment:
  - MOCK_TWO_FACTOR_AUTH=true
```

```yaml
# docker-compose.yml
services:
  web-app:
    environment:
      - MOCK_TWO_FACTOR_AUTH=true
```

✅ Automated testing  
✅ No backend setup needed  
✅ Fast CI/CD  

---

## How It Works

### When `mockTwoFactorAuth: true`

```
┌─────────────────────────────────────┐
│  app.module.ts                      │
│                                     │
│  environment.mockTwoFactorAuth      │
│         === true?                   │
│            │                        │
│            ├──YES──> Load Mock      │
│            │         Interceptor    │
│            │         ✓ Enabled      │
│            │                        │
│  HTTP Requests                      │
│     └──> Mock Interceptor           │
│          (intercepts & returns      │
│           fake 2FA responses)       │
└─────────────────────────────────────┘
```

### When `mockTwoFactorAuth: false` or undefined

```
┌─────────────────────────────────────┐
│  app.module.ts                      │
│                                     │
│  environment.mockTwoFactorAuth      │
│         === true?                   │
│            │                        │
│            └──NO──> Skip Mock       │
│                    Interceptor      │
│                    ✗ Not loaded     │
│                                     │
│  HTTP Requests                      │
│     └──> Real Backend               │
│          (normal API calls)         │
└─────────────────────────────────────┘
```

---

## Verification Commands

### Check Current Configuration

```bash
# Check environment.ts
grep -n "mockTwoFactorAuth" src/environments/environment.ts

# Check if enabled
grep "mockTwoFactorAuth: true" src/environments/environment.ts && echo "ENABLED" || echo "DISABLED"
```

### Enable Mock Mode

```bash
# Using sed (Linux/Mac)
sed -i 's/mockTwoFactorAuth: false/mockTwoFactorAuth: true/' src/environments/environment.ts

# Or manually edit the file
nano src/environments/environment.ts
```

### Disable Mock Mode

```bash
# Using sed (Linux/Mac)
sed -i 's/mockTwoFactorAuth: true/mockTwoFactorAuth: false/' src/environments/environment.ts

# Or manually edit the file
nano src/environments/environment.ts
```

---

## Build Impact

### Mock Enabled
- Mock interceptor code is included in bundle
- Adds ~6KB to final build
- Console logging included

### Mock Disabled (Default)
- Mock interceptor code is **NOT** included due to tree shaking
- No additional bundle size
- Production optimized

---

## Best Practices

### ✅ DO

- **Use `false` (or omit) in production**
  ```typescript
  mockTwoFactorAuth: false
  ```

- **Use `true` only for development/testing**
  ```typescript
  mockTwoFactorAuth: true
  ```

- **Use environment variables for Docker/CI**
  ```bash
  MOCK_TWO_FACTOR_AUTH=true
  ```

- **Document when mock mode is enabled**
  ```typescript
  // TODO: Disable before production deployment
  mockTwoFactorAuth: true
  ```

### ❌ DON'T

- **Don't enable in production builds**
  ```typescript
  // environment.prod.ts
  mockTwoFactorAuth: true  // ❌ NEVER DO THIS
  ```

- **Don't commit with mock enabled**
  ```typescript
  // Always commit with:
  mockTwoFactorAuth: false
  ```

- **Don't rely on mock for integration testing**
  - Use real backend for staging/QA
  - Mock only for unit/component testing

---

## Quick Toggle Script

Create a helper script: `scripts/toggle-mock-2fa.sh`

```bash
#!/bin/bash

CURRENT=$(grep "mockTwoFactorAuth:" src/environments/environment.ts)

if [[ $CURRENT == *"true"* ]]; then
  sed -i 's/mockTwoFactorAuth: true/mockTwoFactorAuth: false/' src/environments/environment.ts
  echo "✓ Mock 2FA DISABLED - Using real backend"
else
  sed -i 's/mockTwoFactorAuth: false/mockTwoFactorAuth: true/' src/environments/environment.ts
  echo "✓ Mock 2FA ENABLED - Using test OTP: 123456"
fi

grep "mockTwoFactorAuth:" src/environments/environment.ts
```

Usage:
```bash
chmod +x scripts/toggle-mock-2fa.sh
./scripts/toggle-mock-2fa.sh
```

---

## Configuration Examples

### Example 1: Local Development

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  mockTwoFactorAuth: true,  // ✓ Enable for testing
  // ...
};
```

### Example 2: Staging

```typescript
// src/environments/environment.staging.ts
export const environment = {
  production: false,
  mockTwoFactorAuth: false,  // ✓ Use real backend
  baseApiUrl: 'https://staging-api.example.com',
  // ...
};
```

### Example 3: Production

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  mockTwoFactorAuth: false,  // ✓ Always false in prod
  baseApiUrl: 'https://api.example.com',
  // ...
};
```

### Example 4: Docker Compose

```yaml
# docker-compose.yml
version: '3'
services:
  web-app:
    image: surepay-web-app
    environment:
      - MOCK_TWO_FACTOR_AUTH=true  # ✓ For testing
      - FINERACT_API_URL=http://backend:8080
    ports:
      - "4200:80"
```

---

## Troubleshooting

### Mock Mode Not Working

**Check 1: Is it enabled?**
```bash
grep "mockTwoFactorAuth" src/environments/environment.ts
# Should show: mockTwoFactorAuth: true
```

**Check 2: Did you restart the server?**
```bash
# Stop and restart
ng serve
```

**Check 3: Is mock interceptor imported?**
```bash
grep "MockTwoFactorInterceptor" src/app/app.module.ts
# Should show the import
```

### Mock Mode Interfering in Production

**Solution: Verify production config**
```bash
grep "mockTwoFactorAuth" src/environments/environment.prod.ts
# Should show: mockTwoFactorAuth: false
```

### Can't Disable Mock Mode

**Solution: Check all environment files**
```bash
find src/environments -name "*.ts" -exec grep -l "mockTwoFactorAuth" {} \;
# Set to false in all files
```

---

## Summary

| Configuration | Value | Use Case | Backend Required |
|--------------|-------|----------|------------------|
| **Mock Mode** | `true` | Development/Testing | ❌ No |
| **Real Mode** | `false` | Staging/Production | ✅ Yes |
| **Omit/Undefined** | - | Production (default) | ✅ Yes |

**Default Behavior**: When `mockTwoFactorAuth` is not defined or set to `false`, the application uses the real backend for 2FA.

**The configuration is completely optional and can be added or removed at any time without breaking the application.**

