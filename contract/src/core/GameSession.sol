// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../utils/GameConstants.sol";
import "../utils/EventEmitter.sol";

/**
 * @title GameSession
 * @notice Individual game session management (2-minute cycles)
 * @dev Manages single game session lifecycle
 */
contract GameSession is GameConstants, EventEmitter {
    struct Session {
        address player;
        uint256 startTime;
        uint256 endTime;
        uint256 points;
        uint256 soulsCollected;
        uint256 roomsVisited;
        uint256 battlesCompleted;
        bool active;
        bool rewarded;
    }
    
    mapping(uint256 => Session) public sessions;
    mapping(address => uint256) public activePlayerSessions;
    
    uint256 public sessionCounter;
    
    function createSession(address player) external returns (uint256 sessionId) {
        require(activePlayerSessions[player] == 0, "Already in session");
        
        sessionCounter++;
        sessionId = sessionCounter;
        
        sessions[sessionId] = Session({
            player: player,
            startTime: block.timestamp,
            endTime: block.timestamp + SESSION_DURATION,
            points: 0,
            soulsCollected: 0,
            roomsVisited: 0,
            battlesCompleted: 0,
            active: true,
            rewarded: false
        });
        
        activePlayerSessions[player] = sessionId;
        
        emit SessionStarted(sessionId, player, block.timestamp);
        
        return sessionId;
    }
    
    function endSession(uint256 sessionId) external {
        Session storage session = sessions[sessionId];
        require(session.active, "Session not active");
        
        session.active = false;
        session.endTime = block.timestamp;
        activePlayerSessions[session.player] = 0;
        
        emit SessionEnded(sessionId, session.player, session.points, session.soulsCollected);
    }
    
    function addPoints(uint256 sessionId, uint256 points) external {
        Session storage session = sessions[sessionId];
        require(session.active, "Session not active");
        
        session.points += points;
    }
    
    function addSouls(uint256 sessionId, uint256 souls) external {
        Session storage session = sessions[sessionId];
        require(session.active, "Session not active");
        
        session.soulsCollected += souls;
    }
    
    function incrementRoomsVisited(uint256 sessionId) external {
        Session storage session = sessions[sessionId];
        require(session.active, "Session not active");
        
        session.roomsVisited++;
    }
    
    function incrementBattlesCompleted(uint256 sessionId) external {
        Session storage session = sessions[sessionId];
        require(session.active, "Session not active");
        
        session.battlesCompleted++;
    }
    
    function markRewarded(uint256 sessionId) external {
        sessions[sessionId].rewarded = true;
    }
    
    function getSession(uint256 sessionId) external view returns (Session memory) {
        return sessions[sessionId];
    }
    
    function isSessionActive(uint256 sessionId) external view returns (bool) {
        Session storage session = sessions[sessionId];
        return session.active && block.timestamp < session.endTime;
    }
    
    function getPlayerActiveSession(address player) external view returns (uint256) {
        return activePlayerSessions[player];
    }
    
    function getSessionTimeRemaining(uint256 sessionId) external view returns (uint256) {
        Session storage session = sessions[sessionId];
        if (!session.active || block.timestamp >= session.endTime) {
            return 0;
        }
        return session.endTime - block.timestamp;
    }
}
