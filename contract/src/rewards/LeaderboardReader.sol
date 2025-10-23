// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LeaderboardReader
 * @notice Optimized read functions for UI
 * @dev Gas-efficient view functions for leaderboard queries
 */
contract LeaderboardReader {
    address public leaderboard;
    
    constructor(address _leaderboard) {
        leaderboard = _leaderboard;
    }
    
    function getPlayerRankAndScore(address player) external view returns (uint256 rank, uint256 score) {
        (bool success1, bytes memory data1) = leaderboard.staticcall(
            abi.encodeWithSignature("getPlayerRank(address)", player)
        );
        require(success1, "Get rank failed");
        rank = abi.decode(data1, (uint256));
        
        (bool success2, bytes memory data2) = leaderboard.staticcall(
            abi.encodeWithSignature("getPlayerScore(address)", player)
        );
        require(success2, "Get score failed");
        score = abi.decode(data2, (uint256));
        
        return (rank, score);
    }
    
    function getTopPlayersDetailed(uint256 count) external view returns (
        address[] memory players,
        uint256[] memory scores,
        uint256[] memory ranks
    ) {
        (bool success, bytes memory data) = leaderboard.staticcall(
            abi.encodeWithSignature("getTopPlayers(uint256)", count)
        );
        require(success, "Get top players failed");
        
        (players, scores) = abi.decode(data, (address[], uint256[]));
        ranks = new uint256[](players.length);
        
        for (uint256 i = 0; i < players.length; i++) {
            ranks[i] = i + 1;
        }
        
        return (players, scores, ranks);
    }
    
    function isInTopN(address player, uint256 n) external view returns (bool) {
        (bool success, bytes memory data) = leaderboard.staticcall(
            abi.encodeWithSignature("getPlayerRank(address)", player)
        );
        require(success, "Get rank failed");
        
        uint256 rank = abi.decode(data, (uint256));
        return rank > 0 && rank <= n;
    }
}
