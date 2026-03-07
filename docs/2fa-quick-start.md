# Quick Start: Enabling 2FA

## Option 1: Testing with Mock Backend (Recommended for Development)

This option allows you to test 2FA functionality without requiring backend configuration.

### Steps:

1. **Enable Mock 2FA in Environment**
   
   Edit `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     // ...other config...
     mockTwoFactorAuth: true  // Change this to true
   };
   ```

2. **Start the Application**
   ```bash
   ng serve
   ```

3. **Test the Flow**
   - Navigate to `http://localhost:4200/login`
   - Enter credentials:
     - Username: `mifos`
     - Password: `password`
   - Click "Login"
   - You should see the 2FA screen with delivery methods
   - Select either "SMS" or "Email"
   - Click "Request OTP"
   - Check the browser console - the OTP will be displayed: **123456**
   - Enter OTP: `123456`
   - Click "Validate OTP"
   - You should be logged in and redirected to the home page

### Mock 2FA Features:
- ✅ OTP is always: `123456`
- ✅ OTP valid for 5 minutes
- ✅ Can test SMS and Email delivery methods
- ✅ OTP expiration validation
- ✅ Resend OTP functionality
- ✅ Console logs for debugging

---

## Option 2: Using Real Backend

### Prerequisites:
- Fineract backend running and accessible
- Admin access to configure users

### Backend Configuration:

1. **Enable 2FA for a User**
   
   Via Fineract Admin Interface or API:
   ```bash
   POST /users/{userId}
   {
     "isTwoFactorAuthenticationRequired": true,
     "phone": "+1234567890",  # For SMS
     "email": "user@example.com"  # For Email
   }
   ```

2. **Configure Delivery Methods**
   
   Ensure the backend has:
   - SMS gateway configured (e.g., Twilio)
   - Email service configured (SMTP)

3. **Verify Endpoints**
   
   Test that these endpoints are working:
   - `GET /api/v1/twofactor`
   - `POST /api/v1/twofactor`
   - `POST /api/v1/twofactor/validate`
   - `POST /api/v1/twofactor/invalidate`

### Frontend Configuration:

1. **Ensure Mock 2FA is Disabled**
   
   Edit `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     // ...other config...
     mockTwoFactorAuth: false  // Must be false
   };
   ```

2. **Configure Backend URL**
   
   Edit `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     // ...other config...
     baseApiUrl: 'http://your-backend-server:8443',
     fineractPlatformTenantId: 'default'
   };
   ```

3. **Start the Application**
   ```bash
   ng serve
   ```

4. **Test the Flow**
   - Navigate to `http://localhost:4200/login`
   - Login with 2FA-enabled user credentials
   - Select delivery method (SMS or Email)
   - Receive real OTP via selected method
   - Enter OTP and validate

---

## Environment Variables (Docker/Production)

When deploying with Docker or in production, use environment variables:

```bash
# Enable mock 2FA for testing
MOCK_TWO_FACTOR_AUTH=true

# Or use with Docker Compose
docker-compose up -d
```

Add to `docker-compose.yml`:
```yaml
services:
  web-app:
    environment:
      - MOCK_TWO_FACTOR_AUTH=true
```

---

## Troubleshooting

### 2FA Screen Not Appearing
**Issue:** After login, redirected directly to home

**Solution:**
- Check that `mockTwoFactorAuth: true` in environment.ts (for mock mode)
- Or verify backend returns `isTwoFactorAuthenticationRequired: true` (for real backend)
- Clear browser cache and cookies
- Check browser console for errors

### OTP Not Displayed in Console (Mock Mode)
**Issue:** Console doesn't show OTP

**Solution:**
- Verify mock interceptor is loaded (check Network tab in DevTools)
- Check that `mockTwoFactorAuth: true` in environment
- Restart the dev server (`ng serve`)

### Invalid OTP Error (Mock Mode)
**Issue:** OTP validation fails

**Solution:**
- The mock OTP is always: `123456`
- OTP expires after 5 minutes - request a new one
- Check console logs for detailed error messages

### Backend 2FA Not Working
**Issue:** Errors when using real backend

**Solution:**
- Check Network tab for API errors
- Verify backend endpoints are accessible
- Check that user has 2FA enabled on backend
- Verify delivery methods are configured (phone/email)
- Check backend logs for errors

---

## Testing Checklist

Use this checklist to verify 2FA is working correctly:

### Basic Flow
- [ ] Login with credentials
- [ ] 2FA screen appears
- [ ] Delivery methods are displayed
- [ ] Can select a delivery method
- [ ] Click "Request OTP" - no errors
- [ ] OTP input field appears
- [ ] Enter OTP and validate
- [ ] Successfully logged in
- [ ] Redirected to home page

### Advanced Features
- [ ] "Resend OTP" button works
- [ ] OTP expires after validity period
- [ ] Invalid OTP shows error message
- [ ] Can try again after invalid OTP
- [ ] "Remember Me" persists 2FA token
- [ ] Logout invalidates 2FA token
- [ ] Token expiration triggers re-authentication

### Edge Cases
- [ ] Network errors are handled gracefully
- [ ] Multiple OTP requests work correctly
- [ ] Page refresh during 2FA flow
- [ ] Browser back button behavior
- [ ] Expired OTP handling
- [ ] Invalid credentials before 2FA

---

## Security Best Practices

When implementing 2FA in production:

1. **Always use HTTPS** - Never transmit OTPs over HTTP
2. **Rate Limiting** - Limit OTP requests per user (backend)
3. **OTP Expiry** - Keep OTP validity short (5-10 minutes)
4. **Attempt Limiting** - Lock account after failed attempts (backend)
5. **Secure Storage** - Use sessionStorage for sensitive environments
6. **Token Rotation** - Rotate 2FA tokens regularly
7. **Audit Logging** - Log all 2FA attempts (backend)

---

## Next Steps

- Read full documentation: `docs/two-factor-authentication.md`
- Configure backend 2FA settings
- Customize OTP delivery messages (backend)
- Set up SMS/Email gateways (backend)
- Configure token expiry times (backend)
- Add custom styling to 2FA component
- Implement backup authentication methods

