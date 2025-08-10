const { ethers } = require("hardhat");

async function main() {
  const F = await ethers.getContractFactory("Adoption");
  const c = await F.deploy();
  await c.waitForDeployment();
  const addr = await c.getAddress();
  console.log("deployed:", addr);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
