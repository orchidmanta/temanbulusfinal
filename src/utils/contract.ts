import { ethers } from 'ethers'

// Updated Contract ABI with enhanced pet info structure
const ADOPTION_CONTRACT_ABI = [
  "function owner() view returns (address)",
  "function getPetInfo(string petId) view returns (string,uint256,address,address,bool)",
  "function setPetShelter(string petId, address shelter)",
  "function adoptPet(string petId) payable",
  "function feedPet(string petId) payable",
  "event PetAdopted(address indexed adopter, string petId, uint256 amount, address shelter)",
  "event PetFed(address indexed feeder, string petId, uint256 amount, address shelter)",
  "event FundsForwarded(string indexed petId, address indexed shelter, uint256 amount)",
  "event ShelterSet(string indexed petId, address indexed shelter)"
]

// Contract address on Sepolia testnet - UPDATED
const CONTRACT_ADDRESS = "0xE9D03cd2D4174e4CC15ab616f986501d7484f60b"

// APUshelter address - UPDATED
const APUSHELTER_ADDRESS = "0xD1B2A0692031082D16916454CFAbaae94E2Ee366"

export const getReadContract = (provider: ethers.Provider) =>
  new ethers.Contract(CONTRACT_ADDRESS, ADOPTION_CONTRACT_ABI, provider)

export const getWriteContract = (signer: ethers.Signer) =>
  new ethers.Contract(CONTRACT_ADDRESS, ADOPTION_CONTRACT_ABI, signer)

export const getContract = (signer: ethers.Signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, ADOPTION_CONTRACT_ABI, signer)
}

export const getPetInfo = async (provider: ethers.Provider, petId: string) => {
  try {
    const contract = getReadContract(provider)
    const info = await contract.getPetInfo(petId)
    console.log(`Pet ${petId} info:`, {
      petId: info[0],
      balance: ethers.formatEther(info[1]),
      adopter: info[2],
      shelter: info[3],
      active: info[4]
    })
    return info // [petId, balance, adopter, shelter, active]
  } catch (error) {
    console.error('Error getting pet info:', error)
    throw error
  }
}

export const adoptPet = async (signer: ethers.Signer, petId: string, amount: string) => {
  try {
    console.log('Starting adoption process...')
    console.log('Pet ID:', petId)
    console.log('Amount:', amount, 'ETH')
    console.log('Contract Address:', CONTRACT_ADDRESS)
    console.log('APUshelter Address:', APUSHELTER_ADDRESS)
    
    const provider = signer.provider!
    const contract = getWriteContract(signer)
    const signerAddress = await signer.getAddress()
    console.log('Signer address:', signerAddress)
    
    // Check balance
    const balance = await provider.getBalance(signerAddress)
    console.log('Account balance:', ethers.formatEther(balance), 'ETH')
    
    // Check shelter balance before
    const shelterBalanceBefore = await provider.getBalance(APUSHELTER_ADDRESS)
    console.log('Shelter balance before:', ethers.formatEther(shelterBalanceBefore), 'ETH')
    
    // Preflight check - avoid "pet inactive" error
    console.log('Checking pet status...')
    const info = await contract.getPetInfo(petId)
    const active = info[4]
    const shelter = info[3]
    
    console.log('Pet info:', {
      petId: info[0],
      balance: ethers.formatEther(info[1]),
      adopter: info[2],
      shelter: info[3],
      active: info[4]
    })
    
    if (!active || shelter === ethers.ZeroAddress) {
      throw new Error(`Pet ${petId} not seeded on this contract (inactive or no shelter assigned)`)
    }
    
    const value = ethers.parseEther(amount)
    
    // Surface revert reason first with staticCall
    console.log('Testing transaction with staticCall...')
    await contract.adoptPet.staticCall(petId, { value })
    
    // Estimate gas
    console.log('Estimating gas...')
    const gasEstimate = await contract.adoptPet.estimateGas(petId, { value }).catch(() => null)
    console.log('Gas estimate:', gasEstimate?.toString() || 'failed, using default')
    
    // Send transaction
    console.log('Sending adoption transaction...')
    const tx = await contract.adoptPet(petId, gasEstimate ? { 
      value, 
      gasLimit: gasEstimate * 2n 
    } : { value })
    
    console.log('Transaction sent:', tx.hash)
    console.log('Etherscan URL:', `https://sepolia.etherscan.io/tx/${tx.hash}`)
    console.log('Waiting for confirmation...')
    
    const receipt = await tx.wait()
    console.log('Transaction confirmed in block:', receipt.blockNumber)
    
    // Check shelter balance after
    const shelterBalanceAfter = await provider.getBalance(APUSHELTER_ADDRESS)
    console.log('Shelter balance after:', ethers.formatEther(shelterBalanceAfter), 'ETH')
    
    // Parse events
    for (const log of receipt.logs) {
      try {
        const parsed = contract.interface.parseLog(log)
        if (parsed?.name === 'FundsForwarded') {
          console.log('Funds forwarded event:', parsed.args)
          console.log('Amount forwarded to shelter:', ethers.formatEther(parsed.args[2]), 'ETH')
        } else if (parsed?.name === 'PetAdopted') {
          console.log('Pet adopted event:', parsed.args)
        }
      } catch (e) {
        // Ignore parsing errors for non-contract logs
      }
    }
    
    return tx
  } catch (error: any) {
    console.error('Detailed adoption error:', error)
    
    // Parse different error types
    if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
      throw new Error('Contract call failed - the contract may not exist or the function may revert')
    } else if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error('Insufficient funds for transaction')
    } else if (error.code === 'USER_REJECTED') {
      throw new Error('Transaction rejected by user')
    } else if (error.reason) {
      throw new Error(`Contract error: ${error.reason}`)
    } else if (error.message) {
      throw new Error(error.message)
    } else {
      throw new Error('Unknown error occurred during adoption')
    }
  }
}

export const feedPet = async (signer: ethers.Signer, petId: string, amount: string) => {
  try {
    console.log('Feeding pet:', petId, 'with', amount, 'ETH')
    const contract = getWriteContract(signer)
    const value = ethers.parseEther(amount)
    
    // Check shelter balance before
    const provider = signer.provider
    if (provider) {
      const shelterBalanceBefore = await provider.getBalance(APUSHELTER_ADDRESS)
      console.log('Shelter balance before feeding:', ethers.formatEther(shelterBalanceBefore), 'ETH')
    }
    
    // Surface revert reason first
    await contract.feedPet.staticCall(petId, { value })
    
    const tx = await contract.feedPet(petId, { value })
    
    console.log('Feed transaction sent:', tx.hash)
    console.log('Etherscan URL:', `https://sepolia.etherscan.io/tx/${tx.hash}`)
    
    const receipt = await tx.wait()
    console.log('Pet fed successfully in block:', receipt.blockNumber)
    
    // Check shelter balance after
    if (provider) {
      const shelterBalanceAfter = await provider.getBalance(APUSHELTER_ADDRESS)
      console.log('Shelter balance after feeding:', ethers.formatEther(shelterBalanceAfter), 'ETH')
    }
    
    return receipt
  } catch (error) {
    console.error('Error feeding pet:', error)
    throw error
  }
}

export const getAdopterPets = async (provider: ethers.Provider, address: string) => {
  try {
    // This function may not exist in the new contract, implement if needed
    console.log('getAdopterPets not implemented in current contract')
    return []
  } catch (error) {
    console.error('Error getting adopter pets:', error)
    throw error
  }
}

// Helper function to check if contract exists
export const checkContract = async (provider: ethers.Provider) => {
  try {
    const code = await provider.getCode(CONTRACT_ADDRESS)
    console.log('Contract code length:', code.length)
    return code !== '0x'
  } catch (error) {
    console.error('Error checking contract:', error)
    return false
  }
}

// Helper function to check shelter balance
export const checkShelterBalance = async (provider: ethers.Provider) => {
  try {
    const balance = await provider.getBalance(APUSHELTER_ADDRESS)
    console.log('APUshelter balance:', ethers.formatEther(balance), 'ETH')
    return ethers.formatEther(balance)
  } catch (error) {
    console.error('Error checking shelter balance:', error)
    throw error
  }
}

// Get shelter address (returns the hardcoded APUshelter address)
export const getShelterAddress = async (provider: ethers.Provider) => {
  try {
    // For this simplified version, we return the hardcoded shelter address
    // In a more complex system, this might query the contract for registered shelters
    return APUSHELTER_ADDRESS
  } catch (error) {
    console.error('Error getting shelter address:', error)
    throw error
  }
}

// Register shelter function (simplified for this implementation)
export const registerShelter = async (signer: ethers.Signer) => {
  try {
    console.log('Registering APUshelter...')
    const contract = getWriteContract(signer)
    
    // For this implementation, we'll use setPetShelter for a test pet
    // In a real system, this would be a proper shelter registration function
    const tx = await contract.setPetShelter("7429", APUSHELTER_ADDRESS)
    
    console.log('Shelter registration transaction sent:', tx.hash)
    const receipt = await tx.wait()
    console.log('Shelter registered successfully in block:', receipt.blockNumber)
    
    return tx
  } catch (error) {
    console.error('Error registering shelter:', error)
    throw error
  }
}

// Debug function to test pet info
export const debugPetInfo = async (provider: ethers.Provider, petId: string = "7429") => {
  try {
    console.log('=== DEBUG PET INFO ===')
    const contract = getReadContract(provider)
    const info = await contract.getPetInfo(petId)
    
    console.log(`Pet ${petId} details:`)
    console.log('- Pet ID:', info[0])
    console.log('- Balance:', ethers.formatEther(info[1]), 'ETH')
    console.log('- Adopter:', info[2])
    console.log('- Shelter:', info[3])
    console.log('- Active:', info[4])
    console.log('- Expected Shelter:', APUSHELTER_ADDRESS)
    console.log('- Shelter Match:', info[3].toLowerCase() === APUSHELTER_ADDRESS.toLowerCase())
    
    return info
  } catch (error) {
    console.error('Debug pet info error:', error)
    throw error
  }
}
