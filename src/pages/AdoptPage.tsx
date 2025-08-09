import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useWallet } from '../contexts/WalletContext'
import { AlertTriangle, Loader, Bug, Info } from 'lucide-react'
import AdoptionCard from '../components/AdoptionCard'
import { adoptPet, checkContract, debugPetInfo } from '../utils/contract'

interface Pet {
  id: string
  name: string
  type: string
  location: string
  organization: string
  description: string
  adoptionFee: string
  image: string
  emoji: string
}

const AdoptPage: React.FC = () => {
  const { account, signer, provider, connectWallet } = useWallet()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isAdopting, setIsAdopting] = useState<string | null>(null)
  const [contractExists, setContractExists] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const pets: Pet[] = [
    {
      id: '7429',
      name: 'Mittens',
      type: 'cat',
      location: 'APUshelter',
      organization: 'APUshelter',
      description: 'A playful tabby cat looking for a loving home! Loves cuddles and treats 🥰',
      adoptionFee: '0.000001',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
      emoji: '🐱'
    },
    {
      id: '3856',
      name: 'Bruno',
      type: 'dog',
      location: 'APUshelter',
      organization: 'APUshelter',
      description: 'Friendly golden retriever mix, great with kids! Loves playing fetch 🎾',
      adoptionFee: '0.000001',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
      emoji: '🐶'
    },
    {
      id: '9182',
      name: 'Sunny',
      type: 'sunbear',
      location: 'APUshelter',
      organization: 'APUshelter',
      description: 'Help support Sunny\'s rehabilitation and care! A gentle giant 🍯',
      adoptionFee: '0.000001',
      image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&h=400&fit=crop',
      emoji: '🐻'
    },
    {
      id: '5673',
      name: 'Coco',
      type: 'rabbit',
      location: 'APUshelter',
      organization: 'APUshelter',
      description: 'Adorable dwarf rabbit needs a caring family! Loves carrots 🥕',
      adoptionFee: '0.000001',
      image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=400&fit=crop',
      emoji: '🐰'
    },
    {
      id: '2947',
      name: 'Kiki', // Changed to cat
      type: 'cat',
      location: 'APUshelter',
      organization: 'APUshelter',
      description: 'Sweet little kitten who loves to purr and play! Very affectionate 😻',
      adoptionFee: '0.000001',
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop',
      emoji: '😻'
    },
    {
      id: '8314',
      name: 'Raja', // Changed to dog
      type: 'dog',
      location: 'APUshelter',
      organization: 'APUshelter',
      description: 'Loyal and brave dog who loves adventures! Perfect companion 🦮',
      adoptionFee: '0.000001',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
      emoji: '🦮'
    }
  ]

  const categories = [
    { id: 'all', label: 'All Pets', emoji: '🌟' },
    { id: 'cats', label: 'Cats', emoji: '🐱' },
    { id: 'dogs', label: 'Dogs', emoji: '🐶' },
    { id: 'wildlife', label: 'Wildlife', emoji: '🐻' }
  ]

  const filteredPets = selectedCategory === 'all' 
    ? pets 
    : pets.filter(pet => {
        if (selectedCategory === 'cats') return pet.type === 'cat'
        if (selectedCategory === 'dogs') return pet.type === 'dog'
        if (selectedCategory === 'wildlife') return ['sunbear', 'rabbit'].includes(pet.type)
        return true
      })

  // Check contract on load
  useEffect(() => {
    const checkContractStatus = async () => {
      if (provider) {
        try {
          const exists = await checkContract(provider)
          setContractExists(exists)
          if (!exists) {
            setError('Smart contract not found on Sepolia testnet')
          } else {
            // Debug pet info for pet ID 7429
            try {
              const info = await debugPetInfo(provider, '7429')
              setDebugInfo(info)
            } catch (debugError) {
              console.error('Debug error:', debugError)
            }
          }
        } catch (err) {
          console.error('Error checking contract:', err)
          setError('Failed to verify contract status')
        }
      }
    }

    checkContractStatus()
  }, [provider])

  const handleDebugPet = async (petId: string) => {
    if (!provider) return
    
    try {
      console.log(`=== DEBUGGING PET ${petId} ===`)
      const info = await debugPetInfo(provider, petId)
      setDebugInfo(info)
      alert(`Pet ${petId} debug info logged to console! 🐾`)
    } catch (error) {
      console.error('Debug failed:', error)
      alert(`Debug failed for pet ${petId} 😿`)
    }
  }

  const handleAdopt = async (pet: Pet) => {
    if (!account) {
      await connectWallet()
      return
    }

    if (!signer) {
      setError('Wallet not properly connected')
      return
    }

    if (contractExists === false) {
      setError('Smart contract not available')
      return
    }

    setIsAdopting(pet.id)
    setError(null)
    
    try {
      console.log(`Attempting to adopt ${pet.name} (ID: ${pet.id})`)
      await adoptPet(signer, pet.id, pet.adoptionFee)
      alert(`Successfully adopted ${pet.name}! 🎉💖`)
    } catch (error: any) {
      console.error('Adoption failed:', error)
      setError(error.message || 'Adoption failed. Please try again.')
    } finally {
      setIsAdopting(null)
    }
  }

  return (
    <div className="min-h-screen pixel-bg pixel-grid py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-8xl mb-6 heartbeat">🐾</div>
          <h1 className="text-4xl md:text-5xl pixel-title mb-4">
            Adopt a Virtual Pet!
          </h1>
          <div className="cute-card p-6 max-w-2xl mx-auto">
            <p className="text-xl cute-text font-medium text-gray-700">
              Choose a pet to support from APUshelter and receive an NFT certificate! ✨
            </p>
          </div>
        </motion.div>

        {/* Debug Info */}
        {debugInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="cute-card p-6 mb-8 border-4 border-blue-300"
          >
            <div className="flex items-start space-x-4">
              <div className="text-3xl bounce-animation">🔍</div>
              <div className="flex-1">
                <p className="cute-text font-bold text-blue-600 mb-2">Pet Debug Info (ID: 7429)</p>
                <div className="cute-text text-gray-700 space-y-1">
                  <p>Active: {debugInfo[4] ? '✅ Yes' : '❌ No'}</p>
                  <p>Shelter: {debugInfo[3]}</p>
                  <p>Balance: {debugInfo[1] ? `${(Number(debugInfo[1]) / 1e18).toFixed(6)} ETH` : '0 ETH'}</p>
                  <p>Adopter: {debugInfo[2]}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <div className="cute-card p-3 flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`pixel-btn flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? 'pixel-btn-pink'
                    : 'pixel-btn-blue'
                }`}
              >
                <span className="text-lg">{category.emoji}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="cute-card p-6 mb-8 border-4 border-red-300"
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl">⚠️</div>
              <div>
                <p className="cute-text font-bold text-red-600">Oops! Something went wrong</p>
                <p className="cute-text text-gray-700">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Contract Status */}
        {contractExists === false && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="cute-card p-6 mb-8 border-4 border-yellow-300"
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl bounce-animation">🚧</div>
              <div>
                <p className="cute-text font-bold text-yellow-600">Contract Not Found</p>
                <p className="cute-text text-gray-700">The smart contract is not deployed on Sepolia testnet.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Info Banner */}
        {!account && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="cute-card p-6 mb-8 border-4 border-blue-300"
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl float-animation">💡</div>
              <p className="cute-text text-gray-700">
                Connect your wallet to start adopting pets! All transactions are on Sepolia testnet 🔗
              </p>
            </div>
          </motion.div>
        )}

        {/* Pet Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPets.map((pet, index) => (
            <motion.div
              key={pet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AdoptionCard
                pet={pet}
                onAdopt={() => handleAdopt(pet)}
                onDebug={() => handleDebugPet(pet.id)}
                isAdopting={isAdopting === pet.id}
              />
            </motion.div>
          ))}
        </div>

        {/* Fun Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="cute-card p-8">
            <h3 className="text-2xl pixel-title mb-6 text-gray-800">
              TemanBulus Impact! 📊
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-4xl mb-2 heartbeat">💖</div>
                <div className="text-3xl cute-text font-bold text-pink-500">50+</div>
                <div className="cute-text text-gray-600">Pets Helped</div>
              </div>
              <div>
                <div className="text-4xl mb-2 bounce-animation">🏠</div>
                <div className="text-3xl cute-text font-bold text-blue-500">5</div>
                <div className="cute-text text-gray-600">Partner Shelters</div>
              </div>
              <div>
                <div className="text-4xl mb-2 float-animation">🌟</div>
                <div className="text-3xl cute-text font-bold text-green-500">100+</div>
                <div className="cute-text text-gray-600">Happy Adopters</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdoptPage
