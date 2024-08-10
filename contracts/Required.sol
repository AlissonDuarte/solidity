// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Required {
    address public hvgateway;
    address public seller;
    address public buyer;
    uint256 public price;

    constructor(address _buyer, address _seller, uint256 _price) {
        // endereco do gateway | quem fez deploy
        hvgateway = msg.sender;
        buyer = _buyer;
        seller = _seller;
        price = _price;
    }

    function confimSell() public payable {
        require(msg.sender == buyer, "Only the buyer can confirm that operation");
        require(msg.value == price, "Incorrect amount sent");
        require(address(this).balance >= price, "Insuficient balance to complete the sell");
        
        makeTransfer();
    }

    function makeTransfer() private {
        uint256 sellerValues = (price * 98) / 100;
        uint256 hvgValues = (price * 2) / 100;
        
        payable(seller).transfer(sellerValues);
        payable(hvgateway).transfer(hvgValues);
    }

    function checkBuyerBalance() public view returns (uint256) {
        return buyer.balance;
    }
}
