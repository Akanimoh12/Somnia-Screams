// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/core/SomniaScreams.sol";
import "../src/core/GameState.sol";
import "../src/core/GameSession.sol";
import "../src/core/BatchProcessor.sol";
import "../src/player/PlayerRegistry.sol";
import "../src/player/PlayerProfile.sol";
import "../src/player/PlayerInventory.sol";
import "../src/player/PlayerActions.sol";
import "../src/challenges/HauntedRooms.sol";
import "../src/challenges/SpectralBattles.sol";
import "../src/challenges/SoulCollector.sol";
import "../src/challenges/DailyQuests.sol";
import "../src/rewards/PointsSystem.sol";
import "../src/rewards/Leaderboard.sol";
import "../src/rewards/LeaderboardReader.sol";
import "../src/rewards/NFTRewards.sol";
import "../src/rewards/SeasonalRewards.sol";
import "../src/nft/HalloweenNFT.sol";
import "../src/nft/NFTTiers.sol";
import "../src/nft/NFTMetadata.sol";

contract DeployAndVerify is Script {
    struct Contracts {
        address playerRegistry;
        address playerProfile;
        address playerInventory;
        address playerActions;
        address gameSession;
        address gameState;
        address soulCollector;
        address hauntedRooms;
        address spectralBattles;
        address dailyQuests;
        address leaderboard;
        address leaderboardReader;
        address pointsSystem;
        address halloweenNFT;
        address nftRewards;
        address nftTiers;
        address seasonalRewards;
        address batchProcessor;
        address somniaScreams;
    }
    
    function run() external {
        vm.startBroadcast();
        
        console.log("=== Starting Somnia Screams Deployment ===");
        console.log("Deployer:", msg.sender);
        console.log("Chain ID:", block.chainid);
        
        Contracts memory c = deployAllContracts();
        initializeContracts(c);
        
        vm.stopBroadcast();
        
    logDeployedAddresses(c);
    saveDeploymentAddresses(c);
    }
    
    function deployAllContracts() private returns (Contracts memory c) {
        console.log("\n=== Deploying Player System ===");
        c.playerRegistry = address(new PlayerRegistry());
        console.log("PlayerRegistry:", c.playerRegistry);
        
        c.playerProfile = address(new PlayerProfile());
        console.log("PlayerProfile:", c.playerProfile);
        
        c.playerInventory = address(new PlayerInventory());
        console.log("PlayerInventory:", c.playerInventory);
        
        c.playerActions = address(new PlayerActions());
        console.log("PlayerActions:", c.playerActions);
        
        console.log("\n=== Deploying Challenge System ===");
        c.hauntedRooms = address(new HauntedRooms());
        console.log("HauntedRooms:", c.hauntedRooms);
        
        c.spectralBattles = address(new SpectralBattles());
        console.log("SpectralBattles:", c.spectralBattles);
        
        c.soulCollector = address(new SoulCollector());
        console.log("SoulCollector:", c.soulCollector);
        
        c.dailyQuests = address(new DailyQuests());
        console.log("DailyQuests:", c.dailyQuests);
        
        console.log("\n=== Deploying Rewards System ===");
        c.pointsSystem = address(new PointsSystem());
        console.log("PointsSystem:", c.pointsSystem);
        
        c.leaderboard = address(new Leaderboard());
        console.log("Leaderboard:", c.leaderboard);
        
        c.leaderboardReader = address(new LeaderboardReader(c.leaderboard));
        console.log("LeaderboardReader:", c.leaderboardReader);
        
        c.nftRewards = address(new NFTRewards());
        console.log("NFTRewards:", c.nftRewards);
        
        c.seasonalRewards = address(new SeasonalRewards());
        console.log("SeasonalRewards:", c.seasonalRewards);
        
        console.log("\n=== Deploying NFT System ===");
        c.halloweenNFT = address(new HalloweenNFT());
        console.log("HalloweenNFT:", c.halloweenNFT);
        
        c.nftTiers = address(new NFTTiers());
        console.log("NFTTiers:", c.nftTiers);
        
        address nftMetadata = address(new NFTMetadata());
        console.log("NFTMetadata:", nftMetadata);
        
        console.log("\n=== Deploying Core System ===");
        c.gameState = address(new GameState());
        console.log("GameState:", c.gameState);
        
        c.gameSession = address(new GameSession());
        console.log("GameSession:", c.gameSession);
        
        c.batchProcessor = address(new BatchProcessor());
        console.log("BatchProcessor:", c.batchProcessor);
        
        c.somniaScreams = address(new SomniaScreams());
        console.log("SomniaScreams:", c.somniaScreams);
    }
    
    function initializeContracts(Contracts memory c) private {
        console.log("\n=== Initializing Contracts ===");
        
        PointsSystem(c.pointsSystem).setPlayerProfile(c.playerProfile);
        console.log("PointsSystem initialized");
        
        PlayerActions(c.playerActions).setGameCore(c.somniaScreams);
        PlayerActions(c.playerActions).setPlayerProfile(c.playerProfile);
        PlayerActions(c.playerActions).setPlayerInventory(c.playerInventory);
        console.log("PlayerActions initialized");
        
        BatchProcessor(c.batchProcessor).setContracts(c.somniaScreams, c.soulCollector);
        console.log("BatchProcessor initialized");
        
        NFTRewards(c.nftRewards).setContracts(c.halloweenNFT, c.playerProfile, c.leaderboard);
        console.log("NFTRewards initialized");
        
        SomniaScreams(c.somniaScreams).initialize(
            c.gameSession,
            c.gameState,
            c.playerRegistry,
            c.playerProfile,
            c.playerActions,
            c.soulCollector,
            c.hauntedRooms,
            c.spectralBattles,
            c.leaderboard,
            c.pointsSystem
        );
        console.log("SomniaScreams initialized");
        
        HalloweenNFT(c.halloweenNFT).addOperator(c.nftRewards);
        console.log("HalloweenNFT operator added");
    }
    
    function logDeployedAddresses(Contracts memory c) private view {
        console.log("\n=== DEPLOYMENT COMPLETE ===");
        console.log("\nMain Contracts:");
        console.log("SomniaScreams:", c.somniaScreams);
        console.log("HalloweenNFT:", c.halloweenNFT);
        console.log("Leaderboard:", c.leaderboard);
        console.log("\nPlayer System:");
        console.log("PlayerRegistry:", c.playerRegistry);
        console.log("PlayerProfile:", c.playerProfile);
        console.log("\nChallenge System:");
        console.log("HauntedRooms:", c.hauntedRooms);
        console.log("SpectralBattles:", c.spectralBattles);
        console.log("SoulCollector:", c.soulCollector);
        console.log("\nRewards:");
        console.log("NFTRewards:", c.nftRewards);
        console.log("PointsSystem:", c.pointsSystem);
    }
    
    function saveDeploymentAddresses(Contracts memory c) private {
        console.log("\nNOTE: Copy the above addresses into contract/deployments/somnia-testnet.json manually.");
    }
}
