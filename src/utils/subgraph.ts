import { formatEther } from "ethers";

// Helper function to convert wei to ETH
const eth = (wei: string) => formatEther(BigInt(wei));

// GraphQL fetch helper
export async function gql(query: string, variables?: any) {
  const res = await fetch(import.meta.env.VITE_SUBGRAPH_URL!, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

// Get recent fund forwards
export async function getRecentForwards(n = 10) {
  return gql(`
    query($n:Int!){
      fundsForwardeds(first:$n, orderBy:blockTimestamp, orderDirection:desc){
        petId shelter amount blockTimestamp transactionHash
      }
    }`, { n });
}

// Get shelter activity (both forwards and adoptions)
export async function getShelterActivity(addr: string) {
  return gql(`
    query($shelter: Bytes!){
      fundsForwardeds(first:20, orderBy:blockTimestamp, orderDirection:desc, where:{shelter:$shelter}){
        petId amount blockTimestamp transactionHash
      }
      petAdopteds(first:20, orderBy:blockTimestamp, orderDirection:desc, where:{shelter:$shelter}){
        petId amount adopter blockTimestamp transactionHash
      }
    }`, { shelter: addr });
}

// Get unique shelters from recent forwards
export async function getUniqueShelters(n = 50) {
  const data = await gql(`
    query($n:Int!){
      fundsForwardeds(first:$n, orderBy:blockTimestamp, orderDirection:desc){
        shelter amount blockTimestamp
      }
    }`, { n });
  
  // Group by shelter and calculate totals
  const shelterMap = new Map();
  
  data.fundsForwardeds.forEach((forward: any) => {
    const shelter = forward.shelter;
    if (!shelterMap.has(shelter)) {
      shelterMap.set(shelter, {
        address: shelter,
        totalAmount: BigInt(0),
        transactionCount: 0,
        lastActivity: forward.blockTimestamp
      });
    }
    
    const shelterData = shelterMap.get(shelter);
    shelterData.totalAmount += BigInt(forward.amount);
    shelterData.transactionCount += 1;
    
    // Keep the most recent timestamp
    if (forward.blockTimestamp > shelterData.lastActivity) {
      shelterData.lastActivity = forward.blockTimestamp;
    }
  });
  
  // Convert to array and format amounts
  return Array.from(shelterMap.values()).map(shelter => ({
    ...shelter,
    totalAmount: eth(shelter.totalAmount.toString()),
    formattedAmount: parseFloat(eth(shelter.totalAmount.toString())).toFixed(6)
  })).sort((a, b) => b.lastActivity - a.lastActivity);
}

// Get adoption history for a specific adopter
export async function getAdopterHistory(adopter: string) {
  return gql(`
    query($adopter: Bytes!){
      petAdopteds(first:20, orderBy:blockTimestamp, orderDirection:desc, where:{adopter:$adopter}){
        petId amount shelter blockTimestamp transactionHash
      }
    }`, { adopter });
}

// Export the eth helper for use in components
export { eth };
