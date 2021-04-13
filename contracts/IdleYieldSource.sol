// SPDX-License-Identifier: MIT
pragma solidity 0.6.9;

import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";
import { IYieldSource } from "./interfaces/IYieldSource.sol";

/// @title An pooltogether yield source for idle finance
/// @author 0xrs
contract IdleYieldSource is IYieldSource {
    using SafeMath for uint256;
    address public idleToken;
    address public underlyingToken;

    constructor(address idleToken_, address underlyingToken_) {
        idleToken = idleToken_;
        underlyingToken = underlyingToken_;
    }

    function depositToken() public view override returns (address) {
        return underlyingToken;
    }

    function balanceOfToken(address addr) external override returns (uint256) {

    }

    function supplyTokenTo(uint256 amount, address to) external override {

    }

    function redeemToken(uint256 amount) external returns (uint256) {

    }


}
