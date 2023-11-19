// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract Login {
    event LoginRequest(address user, string challengeString);

    function login(string memory challengeString) public {
        emit LoginRequest(msg.sender, challengeString);
    }
}
