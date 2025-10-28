#!/bin/bash
set -e

# Load environment variables
source .env

# Contract addresses
SOMNIA_SCREAMS="0x1742620cc894C1eCf53D7e7ECBa2244229CD811C"
PLAYER_REGISTRY="0xC1d8C25d95ff764ef7ac0Ef0720F76fAC0d2DF9B"
PLAYER_PROFILE="0xB74598f486B1f8eF4dd559E189FE8930A7858Ca3"
PLAYER_INVENTORY="0x75DFEaa721D7b5D1F508a6CA3575228634e4d70B"
PLAYER_ACTIONS="0x9A4DF0980190d24abf73A23098CD9A036f70B197"
HAUNTED_ROOMS="0xf12940401250F5f6368bC7F168014Cb3111584dd"
SPECTRAL_BATTLES="0x322AcEB7806c45D92Da7103889C6e2a5ce14bF28"
SOUL_COLLECTOR="0x55807aafc9115d6150C6f631FFdf3bCc46A965eA"
DAILY_QUESTS="0x7409e710F05AB90AdD03040aBbD9109F16381325"
POINTS_SYSTEM="0xD47d026bE59700C1157246cd1A2c6176DB4D93Ef"
LEADERBOARD="0xcB64AE889514696a996584bb75C91b92BC7976ac"
NFT_REWARDS="0x1060B1111199d8Fb324bfd02494D16B87587A0A1"
HALLOWEEN_NFT="0x6DB4Aa66D172dE108471bD6fd4138D1131EF4dC1"
GAME_STATE="0xB5D141FcAc6afECD8f123b506A91f535299853E4"
GAME_SESSION="0xD15028FC729fceEC2b0AaCB0CD5e4398E399238D"
BATCH_PROCESSOR="0xB9464Df652988De8762CcF9A6e681fc3c2385950"

echo "🎃 Initializing Somnia Screams Contracts..."
echo "==========================================="
echo ""

# 1. PointsSystem.setPlayerProfile
echo "1️⃣  Setting PlayerProfile on PointsSystem..."
cast send $POINTS_SYSTEM "setPlayerProfile(address)" $PLAYER_PROFILE \
  --rpc-url $SOMNIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --legacy
sleep 2

# 2. PlayerActions.setGameCore
echo "2️⃣  Setting GameCore on PlayerActions..."
cast send $PLAYER_ACTIONS "setGameCore(address)" $SOMNIA_SCREAMS \
  --rpc-url $SOMNIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --legacy
sleep 2

# 3. PlayerActions.setPlayerProfile
echo "3️⃣  Setting PlayerProfile on PlayerActions..."
cast send $PLAYER_ACTIONS "setPlayerProfile(address)" $PLAYER_PROFILE \
  --rpc-url $SOMNIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --legacy
sleep 2

# 4. PlayerActions.setPlayerInventory
echo "4️⃣  Setting PlayerInventory on PlayerActions..."
cast send $PLAYER_ACTIONS "setPlayerInventory(address)" $PLAYER_INVENTORY \
  --rpc-url $SOMNIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --legacy
sleep 2

# 5. BatchProcessor.setContracts
echo "5️⃣  Setting contracts on BatchProcessor..."
cast send $BATCH_PROCESSOR "setContracts(address,address)" $SOMNIA_SCREAMS $SOUL_COLLECTOR \
  --rpc-url $SOMNIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --legacy
sleep 2

# 6. NFTRewards.setContracts
echo "6️⃣  Setting contracts on NFTRewards..."
cast send $NFT_REWARDS "setContracts(address,address,address)" $HALLOWEEN_NFT $PLAYER_PROFILE $LEADERBOARD \
  --rpc-url $SOMNIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --legacy
sleep 2

# 7. SomniaScreams.initialize (Main initialization - 10 parameters)
echo "7️⃣  Initializing SomniaScreams main contract..."
cast send $SOMNIA_SCREAMS \
  "initialize(address,address,address,address,address,address,address,address,address,address)" \
  $GAME_SESSION \
  $GAME_STATE \
  $PLAYER_REGISTRY \
  $PLAYER_PROFILE \
  $PLAYER_ACTIONS \
  $SOUL_COLLECTOR \
  $HAUNTED_ROOMS \
  $SPECTRAL_BATTLES \
  $LEADERBOARD \
  $POINTS_SYSTEM \
  --rpc-url $SOMNIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --legacy
sleep 2

# 8. HalloweenNFT.addOperator
echo "8️⃣  Adding NFTRewards as operator on HalloweenNFT..."
cast send $HALLOWEEN_NFT "addOperator(address)" $NFT_REWARDS \
  --rpc-url $SOMNIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --legacy

echo ""
echo "✅ All contracts initialized successfully!"
echo "==========================================="
echo ""
echo "📝 Summary:"
echo "  - PointsSystem: Connected to PlayerProfile"
echo "  - PlayerActions: Connected to GameCore, PlayerProfile, PlayerInventory"
echo "  - BatchProcessor: Connected to SomniaScreams, SoulCollector"
echo "  - NFTRewards: Connected to HalloweenNFT, PlayerProfile, Leaderboard"
echo "  - SomniaScreams: Fully initialized with all game contracts"
echo "  - HalloweenNFT: NFTRewards added as operator"
echo ""
echo "🎮 Ready to play Somnia Screams!"
