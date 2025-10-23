// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/core/SomniaScreams.sol";
import "../src/core/GameState.sol";
import "../src/core/GameSession.sol";
import "../src/player/PlayerRegistry.sol";
import "../src/player/PlayerProfile.sol";
import "../src/player/PlayerActions.sol";
import "../src/challenges/HauntedRooms.sol";
import "../src/challenges/SpectralBattles.sol";
import "../src/challenges/SoulCollector.sol";
import "../src/rewards/Leaderboard.sol";
import "../src/rewards/PointsSystem.sol";
import "../src/rewards/NFTRewards.sol";
import "../src/nft/HalloweenNFT.sol";

contract SomniaScreamsTest is Test {
    SomniaScreams public game;
    GameState public gameState;
    GameSession public gameSession;
    PlayerRegistry public playerRegistry;
    PlayerProfile public playerProfile;
    PlayerActions public playerActions;
    HauntedRooms public hauntedRooms;
    SpectralBattles public spectralBattles;
    SoulCollector public soulCollector;
    Leaderboard public leaderboard;
    PointsSystem public pointsSystem;
    HalloweenNFT public halloweenNFT;
    NFTRewards public nftRewards;
    
    address public player1 = address(0x1);
    address public player2 = address(0x2);
    
    function setUp() public {
        // Deploy all contracts
        gameState = new GameState();
        gameSession = new GameSession();
        playerRegistry = new PlayerRegistry();
        playerProfile = new PlayerProfile();
        playerActions = new PlayerActions();
        hauntedRooms = new HauntedRooms();
        spectralBattles = new SpectralBattles();
        soulCollector = new SoulCollector();
        leaderboard = new Leaderboard();
        pointsSystem = new PointsSystem();
        halloweenNFT = new HalloweenNFT();
        nftRewards = new NFTRewards();
        game = new SomniaScreams();
        
        // Initialize connections
        pointsSystem.setPlayerProfile(address(playerProfile));
        playerActions.setGameCore(address(game));
        playerActions.setPlayerProfile(address(playerProfile));
        
        nftRewards.setContracts(
            address(halloweenNFT),
            address(playerProfile),
            address(leaderboard)
        );
        
        // Initialize main game
        game.initialize(
            address(gameSession),
            address(gameState),
            address(playerRegistry),
            address(playerProfile),
            address(playerActions),
            address(soulCollector),
            address(hauntedRooms),
            address(spectralBattles),
            address(leaderboard),
            address(pointsSystem)
        );
        
        halloweenNFT.addOperator(address(nftRewards));
    }
    
    function testStartSession() public {
        vm.prank(player1);
        uint256 sessionId = game.startGameSession();
        
        assertEq(sessionId, 1);
        
        (address player, uint256 startTime, uint256 points, uint256 souls, bool active) = game.getSessionData(sessionId);
        
        assertEq(player, player1);
        assertEq(points, 0);
        assertEq(souls, 0);
        assertTrue(active);
    }
    
    function testPlayerRegistration() public {
        vm.prank(player1);
        game.startGameSession();
        
        assertTrue(playerRegistry.isRegistered(player1));
    }
    
    function testGlobalStats() public {
        vm.prank(player1);
        game.startGameSession();
        
        (uint256 totalSessions, uint256 activeSessions, uint256 totalPlayers,) = game.getGlobalStats();
        
        assertEq(totalSessions, 1);
        assertEq(activeSessions, 1);
        assertEq(totalPlayers, 1);
    }
    
    function testRoomExploration() public {
        uint256 points = hauntedRooms.enterRoom(player1, 1);
        assertTrue(points > 0);
        assertTrue(hauntedRooms.hasCompletedRoom(player1, 1));
    }
    
    function testLeaderboardUpdate() public {
        leaderboard.updatePlayerScore(player1, 100);
        leaderboard.updatePlayerScore(player2, 200);
        
        assertEq(leaderboard.getPlayerRank(player2), 1);
        assertEq(leaderboard.getPlayerRank(player1), 2);
        assertEq(leaderboard.getPlayerScore(player1), 100);
        assertEq(leaderboard.getPlayerScore(player2), 200);
    }
    
    function testNFTMinting() public {
        halloweenNFT.addOperator(address(this));
        
        uint256 tokenId = halloweenNFT.mintNFT(player1, 1);
        
        assertEq(tokenId, 1);
        assertEq(halloweenNFT.ownerOf(tokenId), player1);
        assertEq(halloweenNFT.getNFTTier(tokenId), 1);
    }
}
