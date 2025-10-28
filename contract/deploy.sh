#!/bin/bash

# 🎃 Somnia Screams - Quick Deployment Script
# This script helps deploy all contracts to Somnia Testnet

set -e  # Exit on error

echo "🎃 Somnia Screams - Contract Deployment"
echo "========================================"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo ""
    echo "Please create a .env file from .env.example:"
    echo "  cp .env.example .env"
    echo ""
    echo "Then edit .env and add your private key:"
    echo "  nano .env"
    echo ""
    exit 1
fi

# Load environment variables
source .env

# Check if private key is set
if [ "$PRIVATE_KEY" = "your_private_key_here" ] || [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: PRIVATE_KEY not configured in .env file!"
    echo ""
    echo "Please edit .env and add your actual private key:"
    echo "  nano .env"
    echo ""
    echo "⚠️  SECURITY WARNING: Never commit your private key!"
    echo ""
    exit 1
fi

# Check if RPC URL is set
if [ -z "$SOMNIA_RPC_URL" ]; then
    echo "❌ Error: SOMNIA_RPC_URL not set in .env file!"
    exit 1
fi

echo "📋 Deployment Configuration:"
echo "  Network: Somnia Devnet"
echo "  RPC URL: $SOMNIA_RPC_URL"
echo "  Chain ID: 50311"
echo ""

# Ask for confirmation
read -p "🤔 Do you want to proceed with deployment? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo "Deployment cancelled."
    exit 0
fi

echo ""
echo "🔨 Step 1: Compiling contracts..."
forge build

if [ $? -ne 0 ]; then
    echo "❌ Compilation failed!"
    exit 1
fi

echo "✅ Compilation successful!"
echo ""

# Ask if user wants to do a dry run first
read -p "🧪 Do you want to do a dry run first? (yes/no): " DRY_RUN
echo ""

if [ "$DRY_RUN" = "yes" ]; then
    echo "🧪 Running deployment simulation (dry run)..."
    echo ""
    forge script script/DeployAndVerify.s.sol:DeployAndVerify \
      --rpc-url $SOMNIA_RPC_URL \
      --private-key $PRIVATE_KEY \
      --legacy
    
    if [ $? -ne 0 ]; then
        echo "❌ Dry run failed! Please fix errors before deploying."
        exit 1
    fi
    
    echo ""
    echo "✅ Dry run successful!"
    echo ""
    read -p "🚀 Proceed with actual deployment? (yes/no): " DEPLOY
    
    if [ "$DEPLOY" != "yes" ]; then
        echo "Deployment cancelled."
        exit 0
    fi
fi

echo ""
echo "🚀 Step 2: Deploying contracts to Somnia Testnet..."
echo "⏳ This may take several minutes..."
echo ""

forge script script/DeployAndVerify.s.sol:DeployAndVerify \
  --rpc-url $SOMNIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --legacy \
  -vvvv

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Deployment failed!"
    echo ""
    echo "Common issues:"
    echo "  1. Insufficient STT tokens - Get more from: https://devnet.somnia.network/"
    echo "  2. Network issues - Check your internet connection"
    echo "  3. RPC endpoint issues - Verify RPC URL is correct"
    echo ""
    exit 1
fi

echo ""
echo "🎉 Deployment successful!"
echo ""
echo "📋 Next steps:"
echo "  1. Check deployed-addresses.json for contract addresses"
echo "  2. Verify contracts on Somnia Explorer: https://somnia-devnet.socialscan.io/"
echo "  3. Update frontend/src/contracts/addresses.ts with new addresses"
echo "  4. Test frontend connection"
echo ""
echo "📚 For more details, see DEPLOYMENT_GUIDE.md"
echo ""
