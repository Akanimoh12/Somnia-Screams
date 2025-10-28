#!/bin/bash
# Quick verification script for deployed contracts

source .env

echo "🎃 Somnia Screams - Contract Verification"
echo "========================================"
echo ""

# Main contract address
SOMNIA_SCREAMS="0x1742620cc894C1eCf53D7e7ECBa2244229CD811C"
PLAYER_REGISTRY="0xC1d8C25d95ff764ef7ac0Ef0720F76fAC0d2DF9B"
LEADERBOARD="0xcB64AE889514696a996584bb75C91b92BC7976ac"

# Check owner
echo "✓ Checking contract owner..."
OWNER=$(cast call $SOMNIA_SCREAMS "owner()" --rpc-url $SOMNIA_RPC_URL)
echo "  Owner: $OWNER"
echo ""

# Check if contract has bytecode
echo "✓ Checking contract deployment..."
CODE=$(cast code $SOMNIA_SCREAMS --rpc-url $SOMNIA_RPC_URL)
if [ ${#CODE} -gt 10 ]; then
  echo "  ✅ Contract deployed successfully"
else
  echo "  ❌ Contract not found"
  exit 1
fi
echo ""

# Check PlayerRegistry
echo "✓ Checking PlayerRegistry..."
REGISTRY_CODE=$(cast code $PLAYER_REGISTRY --rpc-url $SOMNIA_RPC_URL)
if [ ${#REGISTRY_CODE} -gt 10 ]; then
  echo "  ✅ PlayerRegistry deployed"
else
  echo "  ❌ PlayerRegistry not found"
fi
echo ""

# Check Leaderboard
echo "✓ Checking Leaderboard..."
LEADERBOARD_CODE=$(cast code $LEADERBOARD --rpc-url $SOMNIA_RPC_URL)
if [ ${#LEADERBOARD_CODE} -gt 10 ]; then
  echo "  ✅ Leaderboard deployed"
else
  echo "  ❌ Leaderboard not found"
fi
echo ""

echo "========================================"
echo "✅ All critical contracts verified!"
echo ""
echo "📝 Contract Addresses:"
echo "  Main Contract: $SOMNIA_SCREAMS"
echo "  PlayerRegistry: $PLAYER_REGISTRY"
echo "  Leaderboard: $LEADERBOARD"
echo ""
echo "🌐 Network: Somnia Devnet (Chain ID: 50312)"
echo "🔗 Explorer: https://explorer.somnia.network"
echo ""
echo "🎮 Ready to play Somnia Screams!"
