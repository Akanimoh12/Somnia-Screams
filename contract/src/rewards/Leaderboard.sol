// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../utils/EventEmitter.sol";
import "../interfaces/ILeaderboard.sol";

/**
 * @title Leaderboard
 * @notice Efficient point tracking and rankings
 * @dev Optimized leaderboard with sorted player scores
 */
contract Leaderboard is EventEmitter, ILeaderboard {
    struct PlayerScore {
        address player;
        uint256 score;
    }
    
    mapping(address => uint256) public playerScores;
    address[] public rankedPlayers;
    
    function updatePlayerScore(address player, uint256 points) external override {
        uint256 oldScore = playerScores[player];
        playerScores[player] += points;
        
        if (oldScore == 0) {
            rankedPlayers.push(player);
        }
        
        _updateRanking(player);
        
        emit LeaderboardUpdated(player, getPlayerRank(player), playerScores[player]);
    }
    
    function _updateRanking(address player) private {
        uint256 playerScore = playerScores[player];
        uint256 currentIndex = _findPlayerIndex(player);
        
        if (currentIndex == 0) return;
        
        for (uint256 i = currentIndex; i > 0; i--) {
            if (playerScores[rankedPlayers[i - 1]] >= playerScore) {
                break;
            }
            
            rankedPlayers[i] = rankedPlayers[i - 1];
            rankedPlayers[i - 1] = player;
        }
    }
    
    function _findPlayerIndex(address player) private view returns (uint256) {
        for (uint256 i = 0; i < rankedPlayers.length; i++) {
            if (rankedPlayers[i] == player) {
                return i;
            }
        }
        return 0;
    }
    
    function getPlayerRank(address player) public view override returns (uint256) {
        for (uint256 i = 0; i < rankedPlayers.length; i++) {
            if (rankedPlayers[i] == player) {
                return i + 1;
            }
        }
        return 0;
    }
    
    function getTopPlayers(uint256 count) external view override returns (address[] memory, uint256[] memory) {
        uint256 length = count > rankedPlayers.length ? rankedPlayers.length : count;
        address[] memory players = new address[](length);
        uint256[] memory scores = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            players[i] = rankedPlayers[i];
            scores[i] = playerScores[rankedPlayers[i]];
        }
        
        return (players, scores);
    }
    
    function getLeaderboardPage(uint256 offset, uint256 limit) external view override returns (address[] memory, uint256[] memory) {
        require(offset < rankedPlayers.length, "Offset out of bounds");
        
        uint256 end = offset + limit;
        if (end > rankedPlayers.length) {
            end = rankedPlayers.length;
        }
        
        uint256 length = end - offset;
        address[] memory players = new address[](length);
        uint256[] memory scores = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            players[i] = rankedPlayers[offset + i];
            scores[i] = playerScores[rankedPlayers[offset + i]];
        }
        
        return (players, scores);
    }
    
    function getTotalPlayers() external view returns (uint256) {
        return rankedPlayers.length;
    }
    
    function getPlayerScore(address player) external view returns (uint256) {
        return playerScores[player];
    }
}
