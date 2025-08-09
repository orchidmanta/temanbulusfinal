import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, ExternalLink, Shield, Activity, TrendingUp, Clock } from 'lucide-react'
import { getUniqueShelters, getShelterActivity, eth } from '../utils/subgraph'

interface Shelter {
  address: string
  totalAmount: string
  formattedAmount: string
  transactionCount: number
  lastActivity: number
}

interface ShelterActivity {
  fundsForwardeds: Array<{
    petId: string
    amount: string
    blockTimestamp: number
    transactionHash: string
  }>
  petAdopteds: Array<{
    petId: string
    amount: string
    adopter: string
    blockTimestamp: number
    transactionHash: string
  }>
}

const TrustedShelters: React.FC = () => {
  const [shelters, setShelters] = useState<Shelter[]>([])
  const [loading, setLoading] = useState(true)
  const [searchAddress, setSearchAddress] = useState('')
  const [searchResult, setSearchResult] = useState<ShelterActivity | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Trusted shelter allowlist (you can expand this)
  const trustedAddresses = new Set([
    '0xD1B2A0692031082D16916454CFAbaae94E2Ee366', // APUshelter
    // Add more trusted addresses here
  ])

  useEffect(() => {
    loadShelters()
  }, [])

  const loadShelters = async () => {
    try {
      setLoading(true)
      const shelterData = await getUniqueShelters(100)
      setShelters(shelterData)
    } catch (err: any) {
      console.error('Error loading shelters:', err)
      setError(err.message || 'Failed to load shelters')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchAddress.trim()) return
    
    try {
      setSearchLoading(true)
      setError(null)
      const activity = await getShelterActivity(searchAddress.trim())
      setSearchResult(activity)
    } catch (err: any) {
      console.error('Error searching shelter:', err)
      setError(err.message || 'Failed to search shelter')
      setSearchResult(null)
    } finally {
      setSearchLoading(false)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  const isTrusted = (address: string) => {
    return trustedAddresses.has(address)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-4 bounce-animation">🏛️</div>
        <h2 className="text-3xl pixel-title text-gray-800 mb-2">
          Trusted Shelters
        </h2>
        <p className="cute-text text-gray-600">
          Verified shelters and their blockchain activity! 🔍✨
        </p>
      </div>

      {/* Search Bar */}
      <div className="cute-card p-6 border-4 border-blue-300">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2 float-animation">🔍</div>
          <h3 className="text-xl cute-text font-bold text-gray-800">
            Search Shelter Activity
          </h3>
        </div>
        
        <div className="flex space-x-3 max-w-2xl mx-auto">
          <input
            type="text"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            placeholder="Enter shelter address (0x...)"
            className="flex-1 cute-input"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={searchLoading || !searchAddress.trim()}
            className="pixel-btn pixel-btn-blue flex items-center space-x-2"
          >
            {searchLoading ? (
              <div className="cute-spinner w-4 h-4"></div>
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Search Results */}
      {searchResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cute-card p-6 border-4 border-green-300"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="text-4xl heartbeat">📊</div>
              <div>
                <h3 className="text-xl cute-text font-bold text-gray-800">
                  Shelter Activity
                </h3>
                <p className="cute-text text-gray-600">
                  {formatAddress(searchAddress)}
                  {isTrusted(searchAddress) && (
                    <span className="ml-2 inline-flex items-center space-x-1 text-green-600">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-bold">✅ Trusted</span>
                    </span>
                  )}
                </p>
              </div>
            </div>
            <a
              href={`https://sepolia.etherscan.io/address/${searchAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-btn pixel-btn-green text-sm"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              View
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Funds Forwarded */}
            <div className="cute-card bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-2 border-blue-200">
              <div className="flex items-center space-x-2 mb-3">
                <div className="text-2xl">💰</div>
                <h4 className="cute-text font-bold text-gray-800">
                  Funds Received ({searchResult.fundsForwardeds.length})
                </h4>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {searchResult.fundsForwardeds.map((forward, index) => (
                  <div key={index} className="cute-card bg-white p-3 border border-blue-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="cute-text text-sm font-bold text-gray-800">
                          Pet #{forward.petId}
                        </p>
                        <p className="cute-text text-xs text-gray-600">
                          {formatDate(forward.blockTimestamp)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="cute-text text-sm font-bold text-green-600">
                          {parseFloat(eth(forward.amount)).toFixed(6)} ETH
                        </p>
                        <a
                          href={`https://sepolia.etherscan.io/tx/${forward.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pet Adoptions */}
            <div className="cute-card bg-gradient-to-r from-pink-50 to-yellow-50 p-4 border-2 border-pink-200">
              <div className="flex items-center space-x-2 mb-3">
                <div className="text-2xl">🐾</div>
                <h4 className="cute-text font-bold text-gray-800">
                  Pet Adoptions ({searchResult.petAdopteds.length})
                </h4>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {searchResult.petAdopteds.map((adoption, index) => (
                  <div key={index} className="cute-card bg-white p-3 border border-pink-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="cute-text text-sm font-bold text-gray-800">
                          Pet #{adoption.petId}
                        </p>
                        <p className="cute-text text-xs text-gray-600">
                          {formatAddress(adoption.adopter)}
                        </p>
                        <p className="cute-text text-xs text-gray-600">
                          {formatDate(adoption.blockTimestamp)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="cute-text text-sm font-bold text-pink-600">
                          {parseFloat(eth(adoption.amount)).toFixed(6)} ETH
                        </p>
                        <a
                          href={`https://sepolia.etherscan.io/tx/${adoption.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="cute-card p-6 border-4 border-red-300"
        >
          <div className="flex items-center space-x-4">
            <div className="text-3xl">⚠️</div>
            <div>
              <p className="cute-text font-bold text-red-600">Error</p>
              <p className="cute-text text-gray-700">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Shelters List */}
      <div className="cute-card p-6 border-4 border-purple-300">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2 heartbeat">🏠</div>
          <h3 className="text-2xl cute-text font-bold text-gray-800">
            Recent Active Shelters
          </h3>
          <p className="cute-text text-gray-600">
            Shelters that have received donations recently 📈
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="cute-spinner mx-auto mb-4"></div>
            <p className="cute-text text-gray-600">Loading shelters... 🏠</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shelters.map((shelter, index) => (
              <motion.div
                key={shelter.address}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="cute-card bg-gradient-to-r from-green-50 to-blue-50 p-6 border-2 border-green-200 pet-card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="text-3xl bounce-animation">🏛️</div>
                    {isTrusted(shelter.address) && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <Shield className="w-4 h-4" />
                        <span className="cute-text text-xs font-bold">Trusted</span>
                      </div>
                    )}
                  </div>
                  <a
                    href={`https://sepolia.etherscan.io/address/${shelter.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="cute-text text-xs text-gray-600 mb-1">Address</p>
                    <code className="cute-text text-sm font-bold text-gray-800">
                      {formatAddress(shelter.address)}
                    </code>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="cute-text text-xs text-gray-600 mb-1">Total Received</p>
                      <p className="cute-text text-sm font-bold text-green-600">
                        {shelter.formattedAmount} ETH
                      </p>
                    </div>
                    <div>
                      <p className="cute-text text-xs text-gray-600 mb-1">Transactions</p>
                      <p className="cute-text text-sm font-bold text-blue-600">
                        {shelter.transactionCount}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="cute-text text-xs text-gray-600 mb-1">Last Activity</p>
                    <p className="cute-text text-sm text-gray-700">
                      {formatDate(shelter.lastActivity)}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSearchAddress(shelter.address)
                      handleSearch()
                    }}
                    className="w-full pixel-btn pixel-btn-blue text-sm py-2 flex items-center justify-center space-x-2"
                  >
                    <Activity className="w-4 h-4" />
                    <span>View Activity</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TrustedShelters
