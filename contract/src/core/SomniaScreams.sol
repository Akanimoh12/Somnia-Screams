// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../utils/EmergencyPause.sol";
import "../utils/GameConstants.sol";
import "../interfaces/IGameCore.sol";

/**
 * @title SomniaScreams
 * @notice Main game controller with session pooling
 * @dev Central contract orchestrating all game systems
 */
contract SomniaScreams is EmergencyPause, GameConstants, IGameCore {
    address public gameSession;
    address public gameState;
    address public playerRegistry;
    address public playerProfile;
    address public playerActions;
    address public soulCollector;
    address public hauntedRooms;
    address public spectralBattles;
    address public leaderboard;
    address public pointsSystem;
    
    bool private initialized;
    
    event ContractsInitialized();
    
    function initialize(
        address _gameSession,
        address _gameState,
        address _playerRegistry,
        address _playerProfile,
        address _playerActions,
        address _soulCollector,
        address _hauntedRooms,
        address _spectralBattles,
        address _leaderboard,
        address _pointsSystem
    ) external onlyOwner {
        require(!initialized, "Already initialized");
        
        gameSession = _gameSession;
        gameState = _gameState;
        playerRegistry = _playerRegistry;
        playerProfile = _playerProfile;
        playerActions = _playerActions;
        soulCollector = _soulCollector;
        hauntedRooms = _hauntedRooms;
        spectralBattles = _spectralBattles;
        leaderboard = _leaderboard;
        pointsSystem = _pointsSystem;
        
        initialized = true;
        emit ContractsInitialized();
    }
    
    function startGameSession() external override whenNotPaused returns (uint256 sessionId) {
        _ensureRegistered(msg.sender);
        
        (bool success, bytes memory data) = gameSession.call(
            abi.encodeWithSignature("createSession(address)", msg.sender)
        );
        require(success, "Session creation failed");
        
        sessionId = abi.decode(data, (uint256));
        
        (success,) = gameState.call(
            abi.encodeWithSignature("incrementTotalSessions()")
        );
        require(success, "State update failed");
        
        (success,) = gameState.call(
            abi.encodeWithSignature("incrementActiveSessions()")
        );
        require(success, "State update failed");
        
        (success,) = gameState.call(
            abi.encodeWithSignature("setSessionStartTime(uint256,uint256)", sessionId, block.timestamp)
        );
        require(success, "State update failed");
        
        return sessionId;
    }
    
    function joinActiveSession(uint256 sessionId) external override whenNotPaused {
        (bool success, bytes memory data) = gameSession.staticcall(
            abi.encodeWithSignature("isSessionActive(uint256)", sessionId)
        );
        require(success && abi.decode(data, (bool)), "Session not active");
    }
    
    function exitSession(uint256 sessionId) external override whenNotPaused {
        (bool success,) = gameSession.call(
            abi.encodeWithSignature("endSession(uint256)", sessionId)
        );
        require(success, "End session failed");
        
        (success,) = gameState.call(
            abi.encodeWithSignature("decrementActiveSessions()")
        );
        require(success, "State update failed");
    }
    
    function claimSessionRewards(uint256 sessionId) external override whenNotPaused {
        (bool success, bytes memory data) = gameSession.staticcall(
            abi.encodeWithSignature("getSession(uint256)", sessionId)
        );
        require(success, "Get session failed");
        
        (address player,,,uint256 points, uint256 souls,,,bool active, bool rewarded) = abi.decode(
            data,
            (address, uint256, uint256, uint256, uint256, uint256, uint256, bool, bool)
        );
        
        require(player == msg.sender, "Not your session");
        require(!active, "Session still active");
        require(!rewarded, "Already rewarded");
        
        (success,) = gameSession.call(
            abi.encodeWithSignature("markRewarded(uint256)", sessionId)
        );
        require(success, "Mark rewarded failed");
        
        uint256 xp = points / 2;
        
        (success,) = playerProfile.call(
            abi.encodeWithSignature("addPoints(address,uint256)", player, points)
        );
        require(success, "Add points failed");
        
        (success,) = playerProfile.call(
            abi.encodeWithSignature("addExperience(address,uint256)", player, xp)
        );
        require(success, "Add XP failed");
        
        (success,) = leaderboard.call(
            abi.encodeWithSignature("updatePlayerScore(address,uint256)", player, points)
        );
        require(success, "Leaderboard update failed");
    }
    
    function getCurrentPhase(uint256 sessionId) external view override returns (uint8) {
        (bool success, bytes memory data) = gameState.staticcall(
            abi.encodeWithSignature("getCurrentPhase(uint256)", sessionId)
        );
        require(success, "Get phase failed");
        
        GamePhase phase = abi.decode(data, (GamePhase));
        return uint8(phase);
    }
    
    function getSessionData(uint256 sessionId) external view override returns (
        address player,
        uint256 startTime,
        uint256 points,
        uint256 soulsCollected,
        bool active
    ) {
        (bool success, bytes memory data) = gameSession.staticcall(
            abi.encodeWithSignature("getSession(uint256)", sessionId)
        );
        require(success, "Get session failed");
        
        (player, startTime,, points, soulsCollected,,,active,) = abi.decode(
            data,
            (address, uint256, uint256, uint256, uint256, uint256, uint256, bool, bool)
        );
        
        return (player, startTime, points, soulsCollected, active);
    }
    
    function _ensureRegistered(address player) private {
        (bool success, bytes memory data) = playerRegistry.staticcall(
            abi.encodeWithSignature("checkRegistration(address)", player)
        );
        
        if (!success || !abi.decode(data, (bool))) {
            (success,) = playerRegistry.call(
                abi.encodeWithSignature("register()")
            );
            require(success, "Registration failed");
            
            (success,) = playerProfile.call(
                abi.encodeWithSignature("createProfile(address)", player)
            );
            require(success, "Profile creation failed");
            
            (success,) = gameState.call(
                abi.encodeWithSignature("incrementTotalPlayers()")
            );
            require(success, "State update failed");
        }
    }
    
    function getGlobalStats() external view returns (
        uint256 totalSessions,
        uint256 activeSessions,
        uint256 totalPlayers,
        uint256 totalSoulsCollected
    ) {
        (bool success, bytes memory data) = gameState.staticcall(
            abi.encodeWithSignature("getGlobalState()")
        );
        require(success, "Get state failed");
        
        (totalSessions, activeSessions, totalPlayers, totalSoulsCollected,,) = abi.decode(
            data,
            (uint256, uint256, uint256, uint256, uint256, bool)
        );
        
        return (totalSessions, activeSessions, totalPlayers, totalSoulsCollected);
    }
}
