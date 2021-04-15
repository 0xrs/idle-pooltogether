const { expect } = require("chai");
const { chalk } = require('chalk');
const { ethers, waffle } = require("hardhat");
const hre = require("hardhat");
const toWei = ethers.utils.parseEther;
const { BigNumber } = require("ethers");
const { solidity } = require("ethereum-waffle");
const chai = require("chai");
chai.use(solidity);

const info = (message) => console.log(chalk.dim(message));
const success = (message) => console.log(chalk.green(message));

async function getEvents(contract, tx) {
  let receipt = await ethers.provider.getTransactionReceipt(tx.hash);
  return receipt.logs.reduce((parsedEvents, log) => {
    try {
      parsedEvents.push(contract.interface.parseLog(log));
    } catch (e) {}
    return parsedEvents;
  }, []);
}


describe("Idle Pooltogether integration", function() {
    // deploy all the pool together.
    const TicketProxyFactory = await ethers.getContractFactory(
      "TicketProxyFactory"
    );
    const ticketProxyFactory = await TicketProxyFactory.deploy({
      gasLimit: 20000000,
    });

    const ControlledTokenProxyFactory = await ethers.getContractFactory(
      "ControlledTokenProxyFactory"
    );
    const controlledTokenProxyFactory = await ControlledTokenProxyFactory.deploy(
      { gasLimit: 20000000 }
    );

    const ControlledTokenBuilder = await ethers.getContractFactory(
      "ControlledTokenBuilder"
    );
    const controlledTokenBuilder = await ControlledTokenBuilder.deploy(
      ticketProxyFactory.address,
      controlledTokenProxyFactory.address,
      { gasLimit: 20000000 }
    );

    const MultipleWinnersProxyFactory = await ethers.getContractFactory(
      "MultipleWinnersProxyFactory"
    );
    const multipleWinnersProxyFactory = await MultipleWinnersProxyFactory.deploy(
      { gasLimit: 20000000 }
    );

    const MultipleWinnersBuilder = await ethers.getContractFactory(
      "MultipleWinnersBuilder"
    );
    const multipleWinnersBuilder = await MultipleWinnersBuilder.deploy(
      multipleWinnersProxyFactory.address,
      controlledTokenBuilder.address,
      { gasLimit: 20000000 }
    );

    const StakePrizePoolProxyFactory = await ethers.getContractFactory(
      "StakePrizePoolProxyFactory"
    );
    const stakePrizePoolProxyFactory = await StakePrizePoolProxyFactory.deploy({
      gasLimit: 20000000,
    });

    const YieldSourcePrizePoolProxyFactory = await ethers.getContractFactory(
      "YieldSourcePrizePoolProxyFactory"
    );
    const yieldSourcePrizePoolProxyFactory = await YieldSourcePrizePoolProxyFactory.deploy(
      { gasLimit: 20000000 }
    );

    const CompoundPrizePoolProxyFactory = await ethers.getContractFactory(
      "CompoundPrizePoolProxyFactory"
    );
    const compoundPrizePoolProxyFactory = await CompoundPrizePoolProxyFactory.deploy(
      { gasLimit: 20000000 }
    );

    const Registry = await ethers.getContractFactory("Registry");
    const registry = await Registry.deploy({ gasLimit: 20000000 });

    const PoolWithMultipleWinnersBuilder = await ethers.getContractFactory(
      "PoolWithMultipleWinnersBuilder"
    );
    poolWithMultipleWinnersBuilder = await PoolWithMultipleWinnersBuilder.deploy(
      registry.address,
      compoundPrizePoolProxyFactory.address,
      yieldSourcePrizePoolProxyFactory.address,
      stakePrizePoolProxyFactory.address,
      multipleWinnersBuilder.address,
      { gasLimit: 9500000 }
    );
    before(async function () {
        
    });
    it("should be able to deposit", async function () {

    });
    it("should be able to redeem", async function () {

    });
    it("should receive governance tokens", async function () {

    });
});
