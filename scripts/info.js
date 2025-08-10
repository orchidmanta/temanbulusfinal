// scripts/info.js
const { ethers } = require("hardhat");
const CONTRACT = process.env.CONTRACT;

async function main() {
  const c = await ethers.getContractAt("Adoption", CONTRACT);
  for (const id of ["7429","3856","9182","5673","2947","8314"]) {
    const [pid, bal, adopter, shelter, active] = await c.getPetInfo(id);
    console.log(id, { pid, bal: bal.toString(), adopter, shelter, active });
  }
}
main().catch(console.error);
