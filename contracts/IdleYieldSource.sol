// SPDX-License-Identifier: MIT
pragma solidity 0.7.3;

import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";
import { IYieldSource } from "./interfaces/IYieldSource.sol";
import { IIdleToken } from "./interfaces/IIdleToken.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";
/// @title An pooltogether yield source for idle finance
/// @author 0xrs
contract IdleYieldSource is IYieldSource {

    using SafeMath for uint256;
    address public idleToken;
    address public underlyingToken;
    address public referral;

    mapping(address => uint256) public balances;
    uint256 private constant MAX_UINT256 = uint256(-1);

    constructor(address _idleToken) {
        idleToken = _idleToken;
        underlyingToken = IIdleToken(idleToken).token();

        //approve
        IERC20(underlyingToken).approve(idleToken, MAX_UINT256);
    }

    function depositToken() public view override returns (address) {
        return underlyingToken;
    }

    function balanceOf(address addr) external view returns (uint256) {
        return balances[addr];
    }

    function balanceOfToken(address addr) external override returns (uint256) {
        if (balances[addr] == 0) {
            return 0;
        }
        uint256 poolIdleBalance = IERC20(idleToken).balanceOf(address(this));
        uint256 idlePrice = IIdleToken(idleToken).tokenPrice();
        uint256 poolUnderlyingBalance = poolIdleBalance.mul(idlePrice).div(10**ERC20(underlyingToken).decimals());
        return balances[addr].mul(poolUnderlyingBalance).div(poolIdleBalance);
    }

    function supplyTokenTo(uint256 amount, address to) external override {
        IERC20(underlyingToken).transferFrom(msg.sender, address(this), amount);
        uint256 mintedTokens = IIdleToken(idleToken).mintIdleToken(amount, false, referral);
        balances[to] = balances[to].add(mintedTokens);
    }

    function redeemToken(uint256 amount) external override returns (uint256) {
        uint256 idleTokensToRedeem = amount.mul(10**ERC20(underlyingToken).decimals()).div(IIdleToken(idleToken).tokenPrice());
        uint256 redeemedUnderlying = IIdleToken(idleToken).redeemIdleToken(idleTokensToRedeem);
        balances[msg.sender] = balances[msg.sender].sub(idleTokensToRedeem);
        IERC20(underlyingToken).transfer(msg.sender, redeemedUnderlying);
        return redeemedUnderlying;
    }
}
