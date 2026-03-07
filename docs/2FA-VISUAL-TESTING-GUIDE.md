# 2FA Visual Testing Guide

## How to Enable and Test 2FA in 5 Minutes

### Step 1: Enable Mock 2FA Mode

Open `src/environments/environment.ts` and set:

```typescript
mockTwoFactorAuth: true  // Change from false to true
```

**Visual Location:**
```
src/
└── environments/
    └── environment.ts  <-- Edit this file
        Line ~58: mockTwoFactorAuth: true
```

### Step 2: Start the Application

```bash
ng serve
```

Wait for compilation to complete, then open: **http://localhost:4200/login**

### Step 3: Login with Default Credentials

![Login Screen]

```
Username: mifos
Password: password
☐ Remember me (optional)
```

Click **[Login]** button

### Step 4: 2FA Screen Appears

You should now see the **Two Factor Authentication** screen:

```
════════════════════════════════════════════
  Two Factor Authentication
════════════════════════════════════════════

Please select a delivery method:

○ Send SMS to +1234567890
○ Send Email to user@example.com

        [Request OTP]
════════════════════════════════════════════
```

### Step 5: Select Delivery Method and Request OTP

1. Select either **SMS** or **Email** radio button
2. Click **[Request OTP]** button
3. **Important**: Open Browser Developer Console (F12)
4. Look for the OTP in the console:

```
==============================================
MOCK 2FA: OTP has been sent!
Delivery Method: SMS
Your OTP is: 123456
Valid for: 5 minutes
==============================================
```

### Step 6: Enter and Validate OTP

The screen will change to show OTP input:

```
════════════════════════════════════════════
  Two Factor Authentication
════════════════════════════════════════════

Please enter the OTP:

🔒 [______]  (Enter OTP here)

Delivery Method: SMS
Validity: 5 mins

        [Validate OTP]
        
        [Resend OTP]
════════════════════════════════════════════
```

**Enter OTP:** `123456`

Click **[Validate OTP]** button

### Step 7: Success!

You should be:
- ✅ Logged in successfully
- ✅ Redirected to the home/dashboard page
- ✅ See user menu in the navigation bar

## What You Should See in Browser Console

Throughout the process, you'll see these console messages:

1. **After clicking "Request OTP":**
```
MOCK 2FA: OTP has been sent!
Delivery Method: SMS
Your OTP is: 123456
Valid for: 5 minutes
```

2. **After entering correct OTP:**
```
MOCK 2FA: OTP validated successfully!
```

3. **After logout:**
```
MOCK 2FA: Token invalidated
```

## Testing Different Scenarios

### Scenario 1: Invalid OTP
- Enter wrong OTP (e.g., `999999`)
- Click Validate
- **Expected**: Error message "Invalid OTP. Please try again."

### Scenario 2: Resend OTP
- Request OTP
- Click **[Resend OTP]** button
- **Expected**: New OTP request in console (same OTP in mock mode)

### Scenario 3: Remember Me
- Check "Remember me" during login
- Complete 2FA
- Close browser completely
- Reopen and navigate to app
- **Expected**: Still logged in (token persisted)

### Scenario 4: OTP Expiration
- Request OTP
- Wait 5 minutes (or modify `OTP_VALIDITY_SECONDS` in mock-two-factor.interceptor.ts)
- Try to validate
- **Expected**: "OTP has expired. Please request a new one."

## Troubleshooting Visual Checklist

| Issue | Check | Solution |
|-------|-------|----------|
| 2FA screen doesn't appear | ✓ `mockTwoFactorAuth: true` in environment.ts | Enable it and restart |
| No OTP in console | ✓ Developer Console is open (F12) | Open Console tab |
| Invalid OTP error | ✓ Entered exactly `123456` | Check for typos |
| Stuck after validation | ✓ Check browser console for errors | Look for JavaScript errors |
| Can't find environment.ts | ✓ Navigate to `src/environments/` | File should exist |

## Screenshots Reference

### 1. Normal Login Screen
```
┌─────────────────────────────────────┐
│   [Logo]                            │
│                                     │
│   👤 Username: [_____________]     │
│   🔒 Password: [_____________]     │
│   ☐ Remember me                    │
│                                     │
│          [Login]                    │
│                                     │
│      Forgot Password?               │
└─────────────────────────────────────┘
```

### 2. 2FA Delivery Selection
```
┌─────────────────────────────────────┐
│   Two Factor Authentication         │
│   ───────────────────────────────   │
│                                     │
│   Please select a delivery method:  │
│                                     │
│   ○ Send SMS to +1234567890        │
│   ○ Send Email to user@example.com │
│                                     │
│          [Request OTP]              │
└─────────────────────────────────────┘
```

### 3. OTP Input Screen
```
┌─────────────────────────────────────┐
│   Two Factor Authentication         │
│   ───────────────────────────────   │
│                                     │
│   Please enter the OTP:             │
│                                     │
│   🔒 [______]                       │
│   Delivery: SMS  Validity: 5 mins   │
│                                     │
│          [Validate OTP]             │
│          [Resend OTP]               │
└─────────────────────────────────────┘
```

## Quick Commands Reference

```bash
# Enable mock 2FA and test
sed -i 's/mockTwoFactorAuth: false/mockTwoFactorAuth: true/' src/environments/environment.ts
ng serve

# Run verification script
./scripts/test-2fa-setup.sh

# Check configuration
grep -n "mockTwoFactorAuth" src/environments/environment.ts

# View console logs while testing
# Open browser DevTools > Console tab
```

## Production Mode (Real Backend)

To switch to production mode with real backend:

1. **Disable Mock Mode**
   ```typescript
   // src/environments/environment.ts
   mockTwoFactorAuth: false
   ```

2. **Configure Backend**
   - User must have 2FA enabled on Fineract backend
   - Phone/Email must be configured
   - SMS/Email services must be set up

3. **Test**
   - Login with 2FA-enabled user
   - Receive **real** OTP via SMS or Email
   - Enter the received OTP

## Success Indicators

You'll know 2FA is working when:

- ✅ Login redirects to 2FA screen (not directly to home)
- ✅ Delivery methods are displayed
- ✅ OTP appears in console (mock mode)
- ✅ Resend OTP button works
- ✅ Invalid OTP shows error
- ✅ Correct OTP logs you in
- ✅ Redirected to home page after validation

## Need Help?

1. **Run Test Script**: `./scripts/test-2fa-setup.sh`
2. **Check Documentation**: 
   - Quick Start: `docs/2fa-quick-start.md`
   - Full Docs: `docs/two-factor-authentication.md`
   - Summary: `docs/2FA-IMPLEMENTATION-SUMMARY.md`
3. **Check Console**: Always keep browser DevTools open during testing
4. **Verify Build**: Run `npm run build` to check for errors

## Video Walkthrough Steps

If creating a video demo, follow this sequence:

1. **Show environment.ts** - Point to `mockTwoFactorAuth: true`
2. **Start app** - `ng serve` in terminal
3. **Open browser** - Navigate to login page
4. **Open DevTools** - Press F12, switch to Console tab
5. **Login** - Enter credentials, click Login
6. **2FA appears** - Show the 2FA screen
7. **Select method** - Click SMS or Email radio button
8. **Request OTP** - Click button, show console output
9. **Point to OTP** - Highlight "123456" in console
10. **Enter OTP** - Type in the input field
11. **Validate** - Click validate button
12. **Success** - Show home page

## Complete! 🎉

Your 2FA system is fully configured and ready to use!

