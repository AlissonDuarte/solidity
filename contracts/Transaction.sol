// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Transaction {
    string public teste = "alo";
    uint256 public constant price = 100 ether; // 2 ETH
    address payable public constant sellerAddress = payable(0x114014b1277c6872E0E386c0560B92b3B93E9B04);
    address public constant buyerAddress = 0xC20E79db64b11A7f3d3954f6aD3c39f055EeC985;

    function getAddressAccountValues() public view returns (uint256) {
        return buyerAddress.balance;
    }

    function sendEther() public payable {
        require(msg.sender == buyerAddress, "Only the buyer can send Ether");
        require(msg.value == price, "Incorrect Ether value sent");

        // Transfer the ETH to the seller
        (bool sent, ) = sellerAddress.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }
    function setVariable(string calldata newValue) public returns (string memory) {
        teste = newValue;
        return teste;
    } 
}