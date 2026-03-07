#!/bin/bash

# 2FA Mock Mode Toggle Script
# Quickly enable or disable mock 2FA for testing

set -e

ENV_FILE="src/environments/environment.ts"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║   2FA Mock Mode Toggle                     ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Check if environment file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE not found!"
    exit 1
fi

# Check current status
CURRENT=$(grep "mockTwoFactorAuth:" "$ENV_FILE" | head -1)

if [[ $CURRENT == *"true"* ]]; then
    echo "Current status: ${YELLOW}ENABLED${NC} (Mock Mode)"
    echo ""
    echo "Switching to: ${BLUE}DISABLED${NC} (Real Backend)"

    # Disable mock mode
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' 's/mockTwoFactorAuth: loadedEnv\[.mockTwoFactorAuth.\] === .true. || true/mockTwoFactorAuth: loadedEnv\["mockTwoFactorAuth"\] === "true" || false/' "$ENV_FILE"
    else
        # Linux
        sed -i "s/mockTwoFactorAuth: loadedEnv\['mockTwoFactorAuth'\] === 'true' || true/mockTwoFactorAuth: loadedEnv['mockTwoFactorAuth'] === 'true' || false/" "$ENV_FILE"
    fi

    echo ""
    echo "${GREEN}✓ Mock 2FA DISABLED${NC}"
    echo ""
    echo "Now using: Real Backend"
    echo "Backend 2FA configuration required"

else
    echo "Current status: ${BLUE}DISABLED${NC} (Real Backend)"
    echo ""
    echo "Switching to: ${YELLOW}ENABLED${NC} (Mock Mode)"

    # Enable mock mode
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' 's/mockTwoFactorAuth: loadedEnv\[.mockTwoFactorAuth.\] === .true. || false/mockTwoFactorAuth: loadedEnv\["mockTwoFactorAuth"\] === "true" || true/' "$ENV_FILE"
    else
        # Linux
        sed -i "s/mockTwoFactorAuth: loadedEnv\['mockTwoFactorAuth'\] === 'true' || false/mockTwoFactorAuth: loadedEnv['mockTwoFactorAuth'] === 'true' || true/" "$ENV_FILE"
    fi

    echo ""
    echo "${GREEN}✓ Mock 2FA ENABLED${NC}"
    echo ""
    echo "Now using: Mock Backend"
    echo "Test OTP: ${GREEN}123456${NC}"
    echo "No backend configuration needed"
fi

echo ""
echo "──────────────────────────────────────────────"
echo ""
echo "Current configuration:"
grep "mockTwoFactorAuth:" "$ENV_FILE" | head -1
echo ""
echo "──────────────────────────────────────────────"
echo ""
echo "${YELLOW}Note:${NC} Restart the dev server if it's running:"
echo "  1. Stop: Ctrl+C"
echo "  2. Start: ng serve"
echo ""

