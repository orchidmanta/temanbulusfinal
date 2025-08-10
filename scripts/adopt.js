const { ethers } = require("hardhat");

// paste the same deployed address
const CONTRACT = "0xE9D03cd2D4174e4CC15ab616f986501d7484f60b";

async function main() {
  const c = await ethers.getContractAt("Adoption", CONTRACT);
  const tx = await c.adoptPet("7429", { value: ethers.parseEther("0.000001") });
  console.log("adopt tx:", tx.hash);
  await tx.wait();
  console.log("confirmed — check internal txns on sepolia etherscan.");
}

main().catch((e) => { console.error(e); process.exit(1); });
