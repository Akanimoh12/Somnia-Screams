// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../utils/GameConstants.sol";
import "../utils/RandomGenerator.sol";
import "../utils/EventEmitter.sol";

/**
 * @title HauntedRooms
 * @notice Room exploration mechanics
 * @dev Manages 50+ haunted rooms with unique challenges
 */
contract HauntedRooms is GameConstants, RandomGenerator, EventEmitter {
    struct Room {
        uint8 difficulty;
        uint16 basePoints;
        uint16 soulCount;
        uint8 enemyType;
        bool hasChest;
        bool requiresPuzzle;
    }
    
    mapping(uint256 => Room) public rooms;
    mapping(address => mapping(uint256 => bool)) public roomsCompleted;
    mapping(address => uint256[]) public playerRoomHistory;
    
    constructor() {
        _initializeRooms();
    }
    
    function _initializeRooms() private {
        for (uint256 i = 1; i <= MAX_ROOMS; i++) {
            uint8 difficulty = uint8((i - 1) / 10) + 1;
            rooms[i] = Room({
                difficulty: difficulty,
                basePoints: uint16(ROOM_EXPLORATION_POINTS * difficulty),
                soulCount: uint16(3 + (difficulty * 2)),
                enemyType: uint8(i % 5),
                hasChest: i % 5 == 0,
                requiresPuzzle: i % 3 == 0
            });
        }
    }
    
    function enterRoom(address player, uint256 roomId) external returns (uint256 points) {
        require(roomId > 0 && roomId <= MAX_ROOMS, "Invalid room");
        
        Room memory room = rooms[roomId];
        points = room.basePoints;
        
        if (!roomsCompleted[player][roomId]) {
            points = points * 2;
            roomsCompleted[player][roomId] = true;
            playerRoomHistory[player].push(roomId);
            emit RoomCompleted(player, roomId, points);
        }
        
        return points;
    }
    
    function getRoomData(uint256 roomId) external view returns (Room memory) {
        require(roomId > 0 && roomId <= MAX_ROOMS, "Invalid room");
        return rooms[roomId];
    }
    
    function hasCompletedRoom(address player, uint256 roomId) external view returns (bool) {
        return roomsCompleted[player][roomId];
    }
    
    function getCompletedRoomCount(address player) external view returns (uint256) {
        return playerRoomHistory[player].length;
    }
    
    function getPlayerRoomHistory(address player) external view returns (uint256[] memory) {
        return playerRoomHistory[player];
    }
    
    function generateRandomRoom(address player) external returns (uint256) {
        return randomInRange(1, MAX_ROOMS, player);
    }
}
