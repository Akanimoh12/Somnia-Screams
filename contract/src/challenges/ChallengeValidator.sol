// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../utils/GameConstants.sol";

/**
 * @title ChallengeValidator
 * @notice Validate challenge completion
 * @dev Central validation logic for all challenge types
 */
contract ChallengeValidator is GameConstants {
    struct ChallengeRequirement {
        ChallengeType challengeType;
        uint256 minimumLevel;
        uint256 requiredRooms;
        uint256 requiredBattles;
        uint256 requiredSouls;
    }
    
    mapping(uint256 => ChallengeRequirement) public requirements;
    
    function setRequirement(
        uint256 challengeId,
        ChallengeType challengeType,
        uint256 minimumLevel,
        uint256 requiredRooms,
        uint256 requiredBattles,
        uint256 requiredSouls
    ) external {
        requirements[challengeId] = ChallengeRequirement({
            challengeType: challengeType,
            minimumLevel: minimumLevel,
            requiredRooms: requiredRooms,
            requiredBattles: requiredBattles,
            requiredSouls: requiredSouls
        });
    }
    
    function validateChallenge(
        uint256 challengeId,
        uint256 playerLevel,
        uint256 roomsExplored,
        uint256 battlesWon,
        uint256 soulsCollected
    ) external view returns (bool valid, string memory reason) {
        ChallengeRequirement storage req = requirements[challengeId];
        
        if (playerLevel < req.minimumLevel) {
            return (false, "Level too low");
        }
        
        if (roomsExplored < req.requiredRooms) {
            return (false, "Insufficient rooms explored");
        }
        
        if (battlesWon < req.requiredBattles) {
            return (false, "Insufficient battles won");
        }
        
        if (soulsCollected < req.requiredSouls) {
            return (false, "Insufficient souls collected");
        }
        
        return (true, "Valid");
    }
    
    function getRequirement(uint256 challengeId) external view returns (ChallengeRequirement memory) {
        return requirements[challengeId];
    }
}
