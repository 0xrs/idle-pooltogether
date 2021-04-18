
const { expect } = require("chai");
const { BigNumber, Wallet } = require("ethers");
const { formatEther, parseEther } =require('@ethersproject/units')
const daiAbi = require('../abis/daiAbi.json');
const IIdleTokenAbi = require('../abis/IIdleToken.json');
const IIdleTokenHelperAbi = require('../abis/IIdleTokenHelper.json');

const { ethers } = require("hardhat");

// // Mainnet Fork and test case for mainnet with hardhat network by impersonate account from mainnet
describe("deployed Contract on Mainnet fork", function() {
  it("hardhat_impersonateAccount and transfer balance to our account", async function() {
    const accounts = await ethers.getSigners();
    
    // Mainnet addresses
    const accountToImpersonate = '0x1759f4f92af1100105e405fca66abba49d5f924e'
    const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    const idleToken = '0x3fE7940616e5Bc47b0775a0dccf6237893353bB4'
    const iIdleTokenHelper = '0x04Ce60ed10F6D2CfF3AA015fc7b950D13c113be5'
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [accountToImpersonate]
    })
    let signer = await ethers.provider.getSigner(accountToImpersonate)
    let daiContract = new ethers.Contract(daiAddress, daiAbi, signer)

    await daiContract.transfer(accounts[0].address, daiContract.balanceOf(accountToImpersonate))

    signer = await ethers.provider.getSigner(accounts[0].address)
    daiContract = new ethers.Contract(daiAddress, daiAbi, signer)

    const IdleYieldSource = await ethers.getContractFactory('IdleYieldSource', signer);
    const IdleYieldSource_Instance = await IdleYieldSource.deploy(idleToken, daiAddress, iIdleTokenHelper);
    console.log(IdleYieldSource_Instance.address)

    const dpositToken = await IdleYieldSource_Instance.depositToken()

    const balanceOfToken1 = await IdleYieldSource_Instance.balanceOfToken(accounts[0].address)
    console.log('balanceOfToken1: ', balanceOfToken1.toString())

    await daiContract.approve(IdleYieldSource_Instance.address, '10000000000000000000000000')

    const bal0 = await daiContract.balanceOf(accounts[0].address)
    console.log('bal0: ', bal0.toString())

    await IdleYieldSource_Instance.supplyTokenTo(
      '1000000000000000000000',
      accounts[0].address
    )
  
    const bal1 = await daiContract.balanceOf(accounts[0].address)
    console.log('bal1: ', bal1.toString())

    const balanceOfToken2 = await IdleYieldSource_Instance.balanceOfToken(accounts[0].address)
    console.log('balanceOfToken2: ', balanceOfToken2.toString())

    // await network.provider.send("evm_increaseTime", [3600])
    await network.provider.send("evm_setNextBlockTimestamp", [1622057600])
    await network.provider.send("evm_mine")

    await IdleYieldSource_Instance.redeemToken(
      balanceOfToken2.toString()
    )
    
    const bal3 = await daiContract.balanceOf(accounts[0].address)
    console.log('bal3: ', bal3.toString())

    const balanceOfToken3 = await IdleYieldSource_Instance.balanceOfToken(accounts[0].address)
    console.log('balanceOfToken3: ', balanceOfToken3.toString())

  });
})