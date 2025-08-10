const { ethers } = require("hardhat");

// paste your deployed address
const CONTRACT = process.env.CONTRACT || "0xE9D03cd2D4174e4CC15ab616f986501d7484f60b";

// change these as you like
const SEED = [
  { petId: "7429", shelter: "0xD1B2A0692031082D16916454CFAbaae94E2Ee366" },
  { petId: "3856", shelter: "0xD1B2A0692031082D16916454CFAbaae94E2Ee366" },
  { petId: "9182", shelter: "0xD1B2A0692031082D16916454CFAbaae94E2Ee366" },
  { petId: "5673", shelter: "0xD1B2A0692031082D16916454CFAbaae94E2Ee366" },
  { petId: "2947", shelter: "0xD1B2A0692031082D16916454CFAbaae94E2Ee366" },
  { petId: "8314", shelter: "0xD1B2A0692031082D16916454CFAbaae94E2Ee366" }
];

async function main() {
  if (CONTRACT.startsWith("PASTE_")) throw new Error("set CONTRACT env or replace the placeholder");

  const c = await ethers.getContractAt("Adoption", CONTRACT);
  for (const s of SEED) {
    const tx = await c.setPetShelter(s.petId, s.shelter);
    console.log("setPetShelter", s.petId, "→", s.shelter, "tx:", tx.hash);
    await tx.wait();
  }
  console.log("seed done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
