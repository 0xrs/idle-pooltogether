const hre = require("hardhat");
const { BigNumber, Contract } = require('ethers');
const { chalk } = require('chalk');

const info = (message) => console.log(chalk.dim(message));
const success = (message) => console.log(chalk.green(message));

const erc20abi = require("./abis/erc20abi.json");
const idleTokenAbi = require("./abis/idletokenabi.json");

const IDLE_DAI_CONTRACT = "0x3fe7940616e5bc47b0775a0dccf6237893353bb4";
const IDLE_GOV_TOKEN = "0x875773784Af8135eA0ef43b5a374AaD105c5D39e";
const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";
const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
const BINANCE = '0xf977814e90da44bfa03b6295a0616a897441acec';


async function main() {
    const [deployerSign, ...signers] = (await ethers.getSigners());

    //deploy idle yield source
    const IdleYieldSource = await ethers.getContractFactory("IdleYieldSource");
    const idleYieldSource = await IdleYieldSource.deploy(IDLE_DAI_CONTRACT);
    await idleYieldSource.deployed();

    //send DAI to 5 accounts from dai millionaire
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [BINANCE]}
    )
    let binanceSigner = await ethers.provider.getSigner(BINANCE);
    let daiContract = new ethers.Contract(DAI_ADDRESS, erc20abi);
    let idleGovContract = new ethers.Contract(IDLE_GOV_TOKEN, erc20abi);

    console.log("Transfer DAI from binance to 5 user accounts...");

    for (var i=0; i<5; i++) {
        await daiContract.connect(binanceSigner).transfer(signers[i].address, ethers.utils.parseEther('10000'));
        await daiContract.connect(signers[i]).approve(idleYieldSource.address, ethers.utils.parseEther('10000'));
        console.log(`Transferred to Signer ${i} and approved idleYieldSource to spend DAI`);
    }

    for (var i=0; i<5; i++) {
        await idleYieldSource.connect(signers[i]).supplyTokenTo(ethers.utils.parseEther('1000'), signers[i].address);
        var bal = ethers.utils.formatEther(await idleYieldSource.connect(signers[i]).balanceOf(signers[i].address));
        var daiBal = ethers.utils.formatEther(await daiContract.connect(signers[i]).balanceOf(signers[i].address));
        console.log(`Balance of Signer ${i} : ${bal}` );
        console.log(`Dai balance of Signer ${i} : ${daiBal}` );
    }

    for (var i=0; i<5; i++) {
        await idleYieldSource.connect(signers[i]).redeemToken(ethers.utils.parseEther('1000'));
        var bal = ethers.utils.formatEther(await idleYieldSource.connect(signers[i]).balanceOf(signers[i].address));
        var daiBal = ethers.utils.formatEther(await daiContract.connect(signers[i]).balanceOf(signers[i].address));
        console.log(`Balance of Signer ${i} : ${bal}` );
        console.log(`Dai balance of Signer ${i} : ${daiBal}` );
    }
    var idleGovBal = ethers.utils.formatEther(await idleGovContract.connect(deployerSign).balanceOf(signers[i].address));
    console.log(`IdleGovToken balance of pool: ${idleGovBal}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
