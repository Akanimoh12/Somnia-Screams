// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../utils/GameConstants.sol";
import "../utils/EventEmitter.sol";

/**
 * @title SoulCollector
 * @notice Soul gathering with batch collection
 * @dev Efficient soul collection with batching support
 */
contract SoulCollector is GameConstants, EventEmitter {
    struct CollectionSession {
        uint256 soulsCollected;
        uint256 lastCollectionTime;
        uint256[] pendingBatch;
    }
    
    mapping(address => mapping(uint256 => CollectionSession)) public sessions;
    
    function collectSoul(address player, uint256 sessionId, uint256 points) external {
        CollectionSession storage session = sessions[player][sessionId];
        session.soulsCollected++;
        session.lastCollectionTime = block.timestamp;
        session.pendingBatch.push(points);
        
        emit SoulCollected(player, sessionId, 1);
        
        if (session.pendingBatch.length >= BATCH_SOUL_LIMIT) {
            _processBatch(player, sessionId);
        }
    }
    
    function batchCollectSouls(address player, uint256 sessionId, uint256 count) external returns (uint256 totalPoints) {
        require(count <= BATCH_SOUL_LIMIT, "Exceeds batch limit");
        
        CollectionSession storage session = sessions[player][sessionId];
        
        for (uint256 i = 0; i < count; i++) {
            session.soulsCollected++;
            session.pendingBatch.push(SOUL_BASE_POINTS);
            totalPoints += SOUL_BASE_POINTS;
        }
        
        session.lastCollectionTime = block.timestamp;
        
        emit SoulsBatchCollected(player, sessionId, count);
        
        return totalPoints;
    }
    
    function _processBatch(address player, uint256 sessionId) private returns (uint256 totalPoints) {
        CollectionSession storage session = sessions[player][sessionId];
        
        for (uint256 i = 0; i < session.pendingBatch.length; i++) {
            totalPoints += session.pendingBatch[i];
        }
        
        delete session.pendingBatch;
        
        emit SoulsBatchCollected(player, sessionId, totalPoints);
        
        return totalPoints;
    }
    
    function forceBatchProcess(address player, uint256 sessionId) external returns (uint256) {
        return _processBatch(player, sessionId);
    }
    
    function getCollectionData(address player, uint256 sessionId) external view returns (
        uint256 soulsCollected,
        uint256 pendingBatchSize,
        uint256 lastCollectionTime
    ) {
        CollectionSession storage session = sessions[player][sessionId];
        return (
            session.soulsCollected,
            session.pendingBatch.length,
            session.lastCollectionTime
        );
    }
    
    function getPendingBatchPoints(address player, uint256 sessionId) external view returns (uint256 totalPoints) {
        CollectionSession storage session = sessions[player][sessionId];
        for (uint256 i = 0; i < session.pendingBatch.length; i++) {
            totalPoints += session.pendingBatch[i];
        }
        return totalPoints;
    }
    
    function resetSession(address player, uint256 sessionId) external {
        delete sessions[player][sessionId];
    }
}
