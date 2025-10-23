// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../utils/EventEmitter.sol";
import "../utils/AccessControl.sol";
import "../interfaces/INFTSystem.sol";

/**
 * @title HalloweenNFT
 * @notice Base ERC721 NFT contract
 * @dev Halloween-themed NFT implementation
 */
contract HalloweenNFT is AccessControl, EventEmitter, INFTSystem {
    string public name = "Somnia Screams NFT";
    string public symbol = "SCREAMS";
    
    uint256 private _tokenIdCounter;
    
    mapping(uint256 => address) public ownerOf;
    mapping(address => uint256) public balanceOf;
    mapping(uint256 => address) public getApproved;
    mapping(address => mapping(address => bool)) public isApprovedForAll;
    mapping(uint256 => uint8) public tokenTier;
    mapping(address => uint256[]) private _ownedTokens;
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    
    function mintNFT(address player, uint8 tier) external override onlyOperator returns (uint256 tokenId) {
        _tokenIdCounter++;
        tokenId = _tokenIdCounter;
        
        ownerOf[tokenId] = player;
        balanceOf[player]++;
        tokenTier[tokenId] = tier;
        _ownedTokens[player].push(tokenId);
        
        emit Transfer(address(0), player, tokenId);
        emit NFTMinted(player, tokenId, tier, block.timestamp);
        
        return tokenId;
    }
    
    function checkEligibility(address player, uint8 tier) external view override returns (bool) {
        return true;
    }
    
    function getPlayerNFTs(address player) external view override returns (uint256[] memory) {
        return _ownedTokens[player];
    }
    
    function getNFTTier(uint256 tokenId) external view override returns (uint8) {
        require(ownerOf[tokenId] != address(0), "Token does not exist");
        return tokenTier[tokenId];
    }
    
    function upgradeNFT(uint256 tokenId, uint8 newTier) external override onlyOperator {
        require(ownerOf[tokenId] != address(0), "Token does not exist");
        require(newTier > tokenTier[tokenId], "Invalid tier upgrade");
        
        tokenTier[tokenId] = newTier;
        emit NFTTierUpgraded(ownerOf[tokenId], tokenId, newTier);
    }
    
    function approve(address to, uint256 tokenId) external {
        address tokenOwner = ownerOf[tokenId];
        require(msg.sender == tokenOwner || isApprovedForAll[tokenOwner][msg.sender], "Not authorized");
        
        getApproved[tokenId] = to;
        emit Approval(tokenOwner, to, tokenId);
    }
    
    function setApprovalForAll(address operator, bool approved) external {
        isApprovedForAll[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }
    
    function transferFrom(address from, address to, uint256 tokenId) external {
        require(ownerOf[tokenId] == from, "Not owner");
        require(
            msg.sender == from ||
            getApproved[tokenId] == msg.sender ||
            isApprovedForAll[from][msg.sender],
            "Not authorized"
        );
        require(to != address(0), "Invalid recipient");
        
        delete getApproved[tokenId];
        
        balanceOf[from]--;
        balanceOf[to]++;
        ownerOf[tokenId] = to;
        
        _removeFromOwnedTokens(from, tokenId);
        _ownedTokens[to].push(tokenId);
        
        emit Transfer(from, to, tokenId);
    }
    
    function _removeFromOwnedTokens(address owner, uint256 tokenId) private {
        uint256[] storage tokens = _ownedTokens[owner];
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == tokenId) {
                tokens[i] = tokens[tokens.length - 1];
                tokens.pop();
                break;
            }
        }
    }
    
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }
    
    function tokenURI(uint256 tokenId) external view returns (string memory) {
        require(ownerOf[tokenId] != address(0), "Token does not exist");
        return string(abi.encodePacked("https://somnia-screams.io/nft/", _toString(tokenId)));
    }
    
    function _toString(uint256 value) private pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
