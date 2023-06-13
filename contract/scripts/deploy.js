const hre = require("hardhat");

async function main() {
  // Get the contract to deploy & deploy.
  const BuyMeATea = await hre.ethers.getContractFactory("BuyMeATea");
  const buyMeATea = await BuyMeATea.deploy();
  await buyMeATea.deployed();
  console.log("BuyMeATea deployed to", buyMeATea.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });