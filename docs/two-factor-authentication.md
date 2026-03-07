# Two-Factor Authentication (2FA) Setup Guide

## Overview

This application includes a complete Two-Factor Authentication (2FA) system that works after basic authentication. The 2FA flow is triggered automatically when the backend indicates that 2FA is required for a user.

## Architecture

### Frontend Components

The 2FA system consists of the following components:

1. **Login Flow Components:**
   - `LoginFormComponent` - Handles initial username/password authentication
   - `TwoFactorAuthenticationComponent` - Handles OTP delivery method selection and validation
   - `ResetPasswordComponent` - Handles password reset if required

2. **Services:**
   - `AuthenticationService` - Manages the complete authentication flow including 2FA
   - `AlertService` - Coordinates state transitions between different authentication states

3. **Models:**
   - `Credentials` - Contains `isTwoFactorAuthenticationRequired` flag
   - `LoginContext` - Login parameters including remember me option

## How It Works

### Authentication Flow

1. **Initial Login:**
   - User enters username and password
   - POST request to `/authentication` endpoint
   - Backend responds with credentials object

2. **2FA Check:**
   - If `credentials.isTwoFactorAuthenticationRequired === true`:
     - System shows 2FA component
     - Basic auth token is set in the authorization header
   - If false, user is logged in directly

3. **OTP Delivery:**
   - System fetches available delivery methods via GET `/twofactor`
   - User selects delivery method (SMS, Email, etc.)
   - System requests OTP via POST `/twofactor?deliveryMethod={method}&extendedToken={rememberMe}`

4. **OTP Validation:**
   - User enters received OTP
   - System validates via POST `/twofactor/validate?token={otp}`
   - On success, 2FA token is stored and user is logged in

5. **Session Management:**
   - 2FA tokens have expiration time
   - Token validity is checked via `twoFactorAccessTokenIsValid()`
   - On logout, token is invalidated via POST `/twofactor/invalidate`

## Backend Configuration

### Enabling 2FA for Users

The backend must be configured to require 2FA for specific users. This is typically done through the Fineract backend administration.

#### Backend Requirements:

1. **User Configuration:**
   - Users must have 2FA enabled in their profile
   - Delivery methods must be configured (phone number for SMS, email for email OTP)

2. **API Endpoints Required:**
   ```
   POST   /authentication                    - Initial authentication
   GET    /twofactor                         - Get delivery methods
   POST   /twofactor                         - Request OTP
   POST   /twofactor/validate                - Validate OTP
   POST   /twofactor/invalidate              - Invalidate token on logout
   ```

3. **Response Format:**

   **POST /authentication response:**
   ```json
   {
     "username": "user123",
     "userId": 1,
     "base64EncodedAuthenticationKey": "dXNlcjEyMzpwYXNzd29yZA==",
     "authenticated": true,
     "officeId": 1,
     "officeName": "Head Office",
     "roles": [...],
     "permissions": [...],
     "shouldRenewPassword": false,
     "isTwoFactorAuthenticationRequired": true
   }
   ```

   **GET /twofactor response:**
   ```json
   [
     {
       "id": 1,
       "name": "SMS",
       "target": "+1234567890"
     },
     {
       "id": 2,
       "name": "Email",
       "target": "user@example.com"
     }
   ]
   ```

   **POST /twofactor response:**
   ```json
   {
     "tokenLiveTimeInSec": 300,
     "deliveryMethod": "SMS"
   }
   ```

   **POST /twofactor/validate response:**
   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "validTo": 1678234567890
   }
   ```

## Frontend Configuration

### Environment Variables

No special environment configuration is needed for 2FA. The system automatically detects when 2FA is required based on the backend response.

### Storage

The system stores the following in browser storage (localStorage or sessionStorage based on "Remember Me"):

- `mifosXCredentials` - User credentials
- `mifosXTwoFactorAuthenticationToken` - 2FA token with validity timestamp
- `mifosXOAuthTokenDetails` - OAuth token details (if OAuth is enabled)

## Testing 2FA

### Mock Backend Setup

For testing without a full backend, you can create a mock interceptor:

```typescript
// Add to app.module.ts providers
{
  provide: HTTP_INTERCEPTORS,
  useClass: MockTwoFactorInterceptor,
  multi: true
}
```

### Manual Testing Steps

1. **Enable 2FA on backend:**
   - Configure a test user with 2FA enabled
   - Set up delivery methods (phone/email)

2. **Test the flow:**
   ```
   a. Navigate to login page
   b. Enter username and password
   c. Click Login
   d. 2FA component should appear
   e. Select delivery method
   f. Click "Request OTP"
   g. Check delivery method for OTP
   h. Enter OTP
   i. Click "Validate OTP"
   j. Should navigate to home page
   ```

3. **Test Resend OTP:**
   - After requesting OTP, click "Resend OTP"
   - New OTP should be sent

4. **Test Remember Me:**
   - Login with "Remember Me" checked
   - 2FA token should persist across browser sessions
   - Close and reopen browser - should remain logged in

5. **Test Token Expiration:**
   - Wait for 2FA token to expire (check `tokenLiveTimeInSec`)
   - Should be required to re-authenticate

## Security Considerations

1. **Token Storage:**
   - 2FA tokens are stored in browser storage
   - Use HTTPS in production
   - Consider using sessionStorage for sensitive environments

2. **Token Validity:**
   - Tokens expire based on backend configuration
   - Frontend checks validity before each request
   - Expired tokens trigger re-authentication

3. **OTP Delivery:**
   - OTPs should be time-limited (typically 5-10 minutes)
   - Backend should limit OTP request frequency
   - Implement rate limiting to prevent abuse

4. **Remember Me:**
   - Extended tokens should have longer validity
   - Users should be warned about using on shared computers

## Troubleshooting

### 2FA Component Not Showing

**Issue:** After login, redirected to home instead of 2FA screen

**Solution:** Check that backend returns `isTwoFactorAuthenticationRequired: true`

### No Delivery Methods Available

**Issue:** 2FA component shows but no delivery methods

**Solution:** 
- Check that user has phone/email configured on backend
- Verify GET `/twofactor` endpoint returns delivery methods

### OTP Not Received

**Issue:** OTP requested but not received

**Solution:**
- Check backend SMS/Email service configuration
- Verify delivery method target (phone/email) is correct
- Check backend logs for delivery errors

### Token Invalid Error

**Issue:** "Token is invalid" error when validating OTP

**Solution:**
- Check OTP was entered correctly
- Verify OTP hasn't expired
- Try resending OTP

### Stuck on 2FA Screen After Successful Validation

**Issue:** OTP validated but still on 2FA screen

**Solution:**
- Check browser console for JavaScript errors
- Verify POST `/twofactor/validate` returns valid token
- Check that `AlertService` is emitting "Authentication Success" event

## Customization

### Custom Delivery Methods

To add custom delivery methods, update the backend to return additional methods in GET `/twofactor` response. The frontend will automatically display them.

### Custom OTP Input

To customize the OTP input field, edit:
```
src/app/login/two-factor-authentication/two-factor-authentication.component.html
```

### Custom Styling

To customize 2FA component appearance, edit:
```
src/app/login/two-factor-authentication/two-factor-authentication.component.scss
```

### Token Validity Display

The component displays token validity in minutes. To change the display format, modify the template:
```html
<mat-hint align="end">
  <strong>{{ 'labels.inputs.Validity' | translate }}:</strong> {{ tokenValidityTime / 60 }}
  {{ 'labels.inputs.mins' | translate }}
</mat-hint>
```

## API Reference

### AuthenticationService Methods

```typescript
// Get available delivery methods
getDeliveryMethods(): Observable<any>

// Request OTP via delivery method
requestOTP(deliveryMethod: any): Observable<any>

// Validate OTP token
validateOTP(otp: string): Observable<any>

// Check if 2FA token is still valid
twoFactorAccessTokenIsValid(): boolean

// Logout and invalidate 2FA token
logout(): Observable<boolean>
```

## Related Files

- `src/app/login/login-form/login-form.component.ts` - Basic auth
- `src/app/login/two-factor-authentication/two-factor-authentication.component.ts` - 2FA
- `src/app/login/login.component.ts` - Main login orchestrator
- `src/app/core/authentication/authentication.service.ts` - Authentication logic
- `src/app/core/authentication/credentials.model.ts` - Credentials model
- `src/app/core/authentication/authentication.interceptor.ts` - HTTP interceptor

## Support

For issues or questions:
1. Check this documentation
2. Review the code comments in the authentication service
3. Check backend logs for API errors
4. Refer to Fineract documentation for backend configuration

