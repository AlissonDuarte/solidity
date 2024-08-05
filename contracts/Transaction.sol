// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Transaction {
    string public addrs;

    constructor(string memory _addrs) {
        addrs  = _addrs;
    }

    function readAddress() public view returns (string memory) {
        return addrs;
    }
}

