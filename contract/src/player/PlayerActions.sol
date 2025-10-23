// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../utils/GameConstants.sol";
import "../utils/EventEmitter.sol";
import "../interfaces/IPlayerActions.sol";

/**
 * @title PlayerActions
 * @notice Movement, interactions, combat actions
 * @dev Handles all player action validations and executions
 */
contract PlayerActions is GameConstants, EventEmitter, IPlayerActions {
    struct ActionState {
        uint256 currentRoom;
        uint256 lastActionTime;
        uint256 actionCount;
        bool inBattle;
    }
    
    mapping(address => mapping(uint256 => ActionState)) public playerSessionActions;
    
    address public gameCore;
    address public playerProfile;
    address public playerInventory;
    
    modifier onlyGameCore() {
        require(msg.sender == gameCore, "Only game core");
        _;
    }
    
    function setGameCore(address _gameCore) external {
        require(gameCore == address(0), "Already set");
        gameCore = _gameCore;
    }
    
    function setPlayerProfile(address _playerProfile) external {
        require(playerProfile == address(0), "Already set");
        playerProfile = _playerProfile;
    }
    
    function setPlayerInventory(address _playerInventory) external {
        require(playerInventory == address(0), "Already set");
        playerInventory = _playerInventory;
    }
    
    function moveToRoom(uint256 sessionId, uint256 roomId) external override {
        require(roomId > 0 && roomId <= MAX_ROOMS, "Invalid room");
        ActionState storage state = playerSessionActions[msg.sender][sessionId];
        require(!state.inBattle, "Cannot move during battle");
        
        state.currentRoom = roomId;
        state.lastActionTime = block.timestamp;
        state.actionCount++;
        
        emit RoomEntered(msg.sender, roomId, block.timestamp);
    }
    
    function collectSoul(uint256 sessionId) external override {
        ActionState storage state = playerSessionActions[msg.sender][sessionId];
        state.lastActionTime = block.timestamp;
        state.actionCount++;
        
        emit SoulCollected(msg.sender, sessionId, 1);
    }
    
    function triggerBattle(uint256 sessionId) external override {
        ActionState storage state = playerSessionActions[msg.sender][sessionId];
        require(!state.inBattle, "Already in battle");
        require(state.currentRoom > 0, "Not in a room");
        
        state.inBattle = true;
        state.lastActionTime = block.timestamp;
        
        uint256 battleId = uint256(keccak256(abi.encodePacked(sessionId, msg.sender, block.timestamp)));
        emit BattleStarted(battleId, msg.sender, state.currentRoom);
    }
    
    function endBattle(address player, uint256 sessionId, bool victory) external onlyGameCore {
        ActionState storage state = playerSessionActions[player][sessionId];
        state.inBattle = false;
        
        uint256 battleId = uint256(keccak256(abi.encodePacked(sessionId, player, state.lastActionTime)));
        emit BattleEnded(battleId, player, victory, 0);
    }
    
    function usePowerUp(uint256 sessionId, uint256 powerUpId) external override {
        ActionState storage state = playerSessionActions[msg.sender][sessionId];
        state.lastActionTime = block.timestamp;
        
        emit PowerUpActivated(msg.sender, powerUpId, POWER_UP_DURATION);
    }
    
    function solvePuzzle(uint256 sessionId, uint256 puzzleId, bytes32 solution) external override {
        ActionState storage state = playerSessionActions[msg.sender][sessionId];
        state.lastActionTime = block.timestamp;
        state.actionCount++;
    }
    
    function getActionState(address player, uint256 sessionId) external view returns (ActionState memory) {
        return playerSessionActions[player][sessionId];
    }
    
    function resetActionState(address player, uint256 sessionId) external onlyGameCore {
        delete playerSessionActions[player][sessionId];
    }
}
