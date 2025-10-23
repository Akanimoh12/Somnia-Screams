// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AccessControl
 * @notice Admin and permission management
 * @dev Role-based access control for game operations
 */
contract AccessControl {
    address public owner;
    mapping(address => bool) public admins;
    mapping(address => bool) public operators;
    
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    event OperatorAdded(address indexed operator);
    event OperatorRemoved(address indexed operator);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier onlyAdmin() {
        require(admins[msg.sender] || msg.sender == owner, "Not admin");
        _;
    }
    
    modifier onlyOperator() {
        require(operators[msg.sender] || admins[msg.sender] || msg.sender == owner, "Not operator");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true;
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
    
    function addAdmin(address admin) external onlyOwner {
        require(admin != address(0), "Invalid address");
        admins[admin] = true;
        emit AdminAdded(admin);
    }
    
    function removeAdmin(address admin) external onlyOwner {
        admins[admin] = false;
        emit AdminRemoved(admin);
    }
    
    function addOperator(address operator) external onlyAdmin {
        require(operator != address(0), "Invalid address");
        operators[operator] = true;
        emit OperatorAdded(operator);
    }
    
    function removeOperator(address operator) external onlyAdmin {
        operators[operator] = false;
        emit OperatorRemoved(operator);
    }
}
