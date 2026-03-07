#!/bin/bash

# 2FA Configuration Test Script
# This script verifies that the 2FA system is properly configured

echo "=============================================="
echo "2FA Configuration Test"
echo "=============================================="
echo ""

# Check if environment.ts exists
if [ -f "src/environments/environment.ts" ]; then
    echo "✓ Environment file found"
else
    echo "✗ Environment file not found!"
    exit 1
fi

# Check if mock interceptor exists
if [ -f "src/app/core/authentication/mock-two-factor.interceptor.ts" ]; then
    echo "✓ Mock 2FA interceptor found"
else
    echo "✗ Mock 2FA interceptor not found!"
    exit 1
fi

# Check if 2FA component exists
if [ -f "src/app/login/two-factor-authentication/two-factor-authentication.component.ts" ]; then
    echo "✓ 2FA component found"
else
    echo "✗ 2FA component not found!"
    exit 1
fi

# Check if authentication service has 2FA methods
if grep -q "getDeliveryMethods" "src/app/core/authentication/authentication.service.ts"; then
    echo "✓ Authentication service has 2FA methods"
else
    echo "✗ Authentication service missing 2FA methods!"
    exit 1
fi

# Check if app.module imports MockTwoFactorInterceptor
if grep -q "MockTwoFactorInterceptor" "src/app/app.module.ts"; then
    echo "✓ App module has Mock 2FA interceptor import"
else
    echo "✗ App module missing Mock 2FA interceptor import!"
    exit 1
fi

# Check if documentation exists
if [ -f "docs/two-factor-authentication.md" ]; then
    echo "✓ 2FA documentation found"
else
    echo "✗ 2FA documentation not found!"
    exit 1
fi

if [ -f "docs/2fa-quick-start.md" ]; then
    echo "✓ 2FA quick start guide found"
else
    echo "✗ 2FA quick start guide not found!"
    exit 1
fi

echo ""
echo "=============================================="
echo "All 2FA components are properly configured!"
echo "=============================================="
echo ""
echo "To enable mock 2FA for testing:"
echo "1. Edit src/environments/environment.ts"
echo "2. Set: mockTwoFactorAuth: true"
echo "3. Run: ng serve"
echo "4. Login and use OTP: 123456"
echo ""
echo "For more information, see:"
echo "- docs/2fa-quick-start.md"
echo "- docs/two-factor-authentication.md"
echo ""

