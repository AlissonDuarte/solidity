// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

contract GetVariable {
    int number;

    function getNumber() public view returns (int) {
        return number;
    }
    
    function changeNumber() public {
        number = 10;
    }

}
