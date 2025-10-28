#!/bin/bash

# 🎃 Somnia Screams - Individual Contract Deployment
# Deploys each contract separately and saves addresses

set -e

echo "🎃 Somnia Screams - Sequential Deployment"
echo "=========================================="
echo ""

# Load environment
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    exit 1
fi

source .env

# Create deployment file
DEPLOY_FILE="deployed-contracts.txt"
echo "# Somnia Screams - Deployed Contracts" > $DEPLOY_FILE
echo "# Deployed on: $(date)" >> $DEPLOY_FILE
echo "# Network: Somnia Devnet (Chain ID: 50312)" >> $DEPLOY_FILE
echo "# Deployer: $(cast wallet address $PRIVATE_KEY)" >> $DEPLOY_FILE
echo "" >> $DEPLOY_FILE

# Function to deploy contract
deploy_contract() {
    local CONTRACT_PATH=$1
    local CONTRACT_NAME=$2
    
    echo "📦 Deploying $CONTRACT_NAME..."
    
    RESULT=$(forge create --rpc-url $SOMNIA_RPC_URL \
        --private-key $PRIVATE_KEY \
        --legacy \
        --broadcast \
        $CONTRACT_PATH 2>&1)
    
    ADDRESS=$(echo "$RESULT" | grep "Deployed to:" | awk '{print $3}')
    TX_HASH=$(echo "$RESULT" | grep "Transaction hash:" | awk '{print $3}')
    
    if [ -z "$ADDRESS" ]; then
        echo "❌ Failed to deploy $CONTRACT_NAME"
        echo "$RESULT"
        return 1
    fi
    
    echo "✅ $CONTRACT_NAME: $ADDRESS"
    echo "$CONTRACT_NAME=$ADDRESS" >> $DEPLOY_FILE
    echo "  TX: https://explorer.somnia.network/tx/$TX_HASH"
    echo ""
    
    # Store in variable for later use
    eval "${CONTRACT_NAME^^}_ADDRESS=$ADDRESS"
    
    sleep 2
}

echo "=== Player System ==="
deploy_contract "src/player/PlayerRegistry.sol:PlayerRegistry" "PlayerRegistry"
deploy_contract "src/player/PlayerProfile.sol:PlayerProfile" "PlayerProfile"
deploy_contract "src/player/PlayerInventory.sol:PlayerInventory" "PlayerInventory"
deploy_contract "src/player/PlayerActions.sol:PlayerActions" "PlayerActions"

echo "=== Challenge System ==="
deploy_contract "src/challenges/HauntedRooms.sol:HauntedRooms" "HauntedRooms"
deploy_contract "src/challenges/SpectralBattles.sol:SpectralBattles" "SpectralBattles"
deploy_contract "src/challenges/SoulCollector.sol:SoulCollector" "SoulCollector"
deploy_contract "src/challenges/DailyQuests.sol:DailyQuests" "DailyQuests"

echo "=== Rewards System ==="
deploy_contract "src/rewards/PointsSystem.sol:PointsSystem" "PointsSystem"
deploy_contract "src/rewards/Leaderboard.sol:Leaderboard" "Leaderboard"
deploy_contract "src/rewards/LeaderboardReader.sol:LeaderboardReader" "LeaderboardReader"
deploy_contract "src/rewards/NFTRewards.sol:NFTRewards" "NFTRewards"
deploy_contract "src/rewards/SeasonalRewards.sol:SeasonalRewards" "SeasonalRewards"

echo "=== NFT System ==="
deploy_contract "src/nft/HalloweenNFT.sol:HalloweenNFT" "HalloweenNFT"
deploy_contract "src/nft/NFTTiers.sol:NFTTiers" "NFTTiers"
deploy_contract "src/nft/NFTMetadata.sol:NFTMetadata" "NFTMetadata"

echo "=== Core System ==="
deploy_contract "src/core/GameState.sol:GameState" "GameState"
deploy_contract "src/core/GameSession.sol:GameSession" "GameSession"
deploy_contract "src/core/BatchProcessor.sol:BatchProcessor" "BatchProcessor"
deploy_contract "src/core/SomniaScreams.sol:SomniaScreams" "SomniaScreams"

echo ""
echo "🎉 All contracts deployed!"
echo ""
echo "📋 Deployment Summary saved to: $DEPLOY_FILE"
cat $DEPLOY_FILE

echo ""
echo "🔧 Next: Initialize contracts with addresses"
echo "   Edit the addresses and run initialization script"
