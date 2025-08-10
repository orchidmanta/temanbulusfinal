const { ethers } = require("hardhat");

// set in your terminal: CONTRACT=0x... npx hardhat run ...
const CONTRACT = process.env.CONTRACT;

// edit your full pet list here
const PETS = ["7429", "3856", "9182", "5673", "2947", "8314"];

// single shelter for all (you can map per-pet if needed)
const SHELTER = "0xcbD24c6609b68954C0b5a406604fD0E4D5ef5e7e";

async function main() {
  if (!CONTRACT) throw new Error("missing CONTRACT env var");

  const [signer] = await ethers.getSigners();
  const net = await ethers.provider.getNetwork();
  const code = await ethers.provider.getCode(CONTRACT);

  console.log("chain:", net.chainId.toString(), "(11155111 = sepolia)");
  console.log("signer:", await signer.getAddress());
  console.log("contract:", CONTRACT);
  console.log("bytecode length:", code.length, code === "0x" ? "❌ no contract" : "✅ contract detected");

  const c = await ethers.getContractAt("Adoption", CONTRACT);
  const owner = await c.owner();
  const isOwner = owner.toLowerCase() === (await signer.getAddress()).toLowerCase();
  console.log("owner on-chain:", owner, isOwner ? "✅ you are owner" : "⚠️ not owner (setPetShelter will fail)");

  for (const id of PETS) {
    try {
      const before = await c.getPetInfo(id);
      const infoB = {
        pid: before[0],
        bal: before[1].toString(),
        adopter: before[2],
        shelter: before[3],
        active: before[4],
      };
      console.log(`\n${id} BEFORE:`, infoB);

      // need seeding if inactive or no shelter
      const needsSeed =
        !infoB.active || infoB.shelter === ethers.ZeroAddress || infoB.pid === "";

      if (needsSeed) {
        if (!isOwner) {
          console.log(`⚠️  skip ${id}: not owner; cannot call setPetShelter`);
          continue;
        }
        const tx = await c.setPetShelter(id, SHELTER);
        console.log(`setPetShelter(${id}) tx:`, tx.hash);
        await tx.wait();
      } else {
        console.log(`✅ ${id} already active & has shelter`);
      }

      const after = await c.getPetInfo(id);
      const infoA = {
        pid: after[0],
        bal: after[1].toString(),
        adopter: after[2],
        shelter: after[3],
        active: after[4],
      };
      console.log(`${id} AFTER:`, infoA);
    } catch (e) {
      console.error(`❌ error on ${id}:`, e.shortMessage || e.message || e);
    }
  }

  console.log("\nall done.");
}

main().catch((e) => { console.error(e); process.exit(1); });
