// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

// Returns the Ethereum balance of a given address.
async function getBalance(address) {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++
  }
}

//Logs the memos stored on-chain from tea purchases.
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
  }
}

async function main() {
  // Get example accounts.
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  // Get the contract to deploy & deploy.
  const BuyMeATea = await hre.ethers.getContractFactory("BuyMeATea");
  const buyMeATea = await BuyMeATea.deploy();
  await buyMeATea.deployed();
  console.log("BuyMeATea deployed to", buyMeATea.address);

  // Check balances before the tea purchase.
  const addresses = [owner.address, tipper.address, buyMeATea.address];
  console.log("== start ==");
  await printBalances(addresses);

  // Buy the owner a few teas.
  const tip = {value: hre.ethers.utils.parseEther("1.0")};
  await buyMeATea.connect(tipper).buyTea("Carolina", "Thanks for building this!", tip);
  await buyMeATea.connect(tipper2).buyTea("Vitto", "Amazing builder!", tip);
  await buyMeATea.connect(tipper3).buyTea("Katy", "Awesome", tip);

  // Check balances after tes purchase.
  console.log("== bought tea ==");
  await printBalances(addresses);

  // Withdraw funds.
  await buyMeATea.connect(owner).withDrawTips();

  // Check balances after withdraw.
  console.log("== withD rawTips ==");
  await printBalances(addresses);

  // Read all the memos left for the owner.
  console.log("== memos ==");
  const memos = await buyMeATea.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
