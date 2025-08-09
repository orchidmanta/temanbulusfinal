import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useWallet } from '../contexts/WalletContext'
import { ExternalLink, Copy, Check } from 'lucide-react'
import VirtualPetRoom from '../components/VirtualPetRoom'
import ShelterRegistration from '../components/ShelterRegistration'
import TrustedShelters from '../components/TrustedShelters'
import { getAdopterHistory, eth } from '../utils/subgraph'

interface Adoption {
  petId: string
  amount: string
  shelter: string
  blockTimestamp: number
  transactionHash: string
}

const ProfilePage: React.FC = () => {
  const { account, provider } = useWallet()
  const [balance, setBalance] = useState<string>('0')
  const [copied, setCopied] = useState(false)
  const [adoptions, setAdoptions] = useState<Adoption[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'shelters'>('profile')

  useEffect(() => {
    const getBalance = async () => {
      if (account && provider) {
        try {
          const bal = await provider.getBalance(account)
          setBalance((Number(bal) / 1e18).toFixed(4))
        } catch (error) {
          console.error('Error getting balance:', error)
        }
      }
    }

    getBalance()
  }, [account, provider])

  useEffect(() => {
    const loadAdoptions = async () => {
      if (account) {
        try {
          setLoading(true)
          const data = await getAdopterHistory(account)
          setAdoptions(data.petAdopteds.map((adoption: any) => ({
            ...adoption,
            amount: parseFloat(eth(adoption.amount)).toFixed(6)
          })))
        } catch (error) {
          console.error('Error loading adoptions:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    loadAdoptions()
  }, [account])

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`
  }

  if (!account) {
    return (
      <div className="min-h-screen pixel-bg pixel-grid flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="cute-card p-12 text-center max-w-md"
        >
          <div className="text-8xl mb-6 bounce-animation">👛</div>
          <h2 className="text-2xl pixel-title text-gray-800 mb-4">
            Connect Your Wallet
          </h2>
          <p className="cute-text text-gray-600 mb-6">
            Please connect your wallet to view your profile and adopted pets! 🐾
          </p>
          <div className="text-4xl heartbeat">💖</div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pixel-bg pixel-grid py-12">
      <div className="container mx-auto px-4">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="cute-card p-3 flex space-x-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pixel-btn flex items-center space-x-2 ${
                activeTab === 'profile' ? 'pixel-btn-pink' : 'pixel-btn-blue'
              }`}
            >
              <span className="text-lg">👤</span>
              <span>My Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('shelters')}
              className={`pixel-btn flex items-center space-x-2 ${
                activeTab === 'shelters' ? 'pixel-btn-pink' : 'pixel-btn-blue'
              }`}
            >
              <span className="text-lg">🏛️</span>
              <span>Trusted Shelters</span>
            </button>
          </div>
        </div>

        {activeTab === 'profile' ? (
          <>
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="cute-card p-8 mb-8 text-center"
            >
              <div className="text-8xl mb-6 heartbeat">👤</div>
              <h1 className="text-3xl pixel-title text-gray-800 mb-4">
                Your Pet Profile! 🌟
              </h1>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {/* Wallet Info */}
                <div className="cute-card bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-4 border-blue-200">
                  <div className="text-4xl mb-3 bounce-animation">👛</div>
                  <h3 className="cute-text font-bold text-gray-800 mb-2">Wallet Address</h3>
                  <div className="flex items-center justify-center space-x-2">
                    <code className="cute-text text-sm text-gray-600">
                      {formatAddress(account)}
                    </code>
                    <button
                      onClick={copyAddress}
                      className="pixel-btn pixel-btn-blue text-xs py-1 px-2"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <a
                    href={`https://sepolia.etherscan.io/address/${account}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-blue-500 hover:text-blue-700 mt-2"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span className="cute-text text-xs">View on Etherscan</span>
                  </a>
                </div>

                {/* Balance Info */}
                <div className="cute-card bg-gradient-to-r from-green-50 to-yellow-50 p-6 border-4 border-green-200">
                  <div className="text-4xl mb-3 float-animation">💰</div>
                  <h3 className="cute-text font-bold text-gray-800 mb-2">ETH Balance</h3>
                  <div className="text-2xl cute-text font-bold text-green-600">
                    {balance} ETH
                  </div>
                  <p className="cute-text text-xs text-gray-600 mt-1">
                    Sepolia Testnet
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Adoption History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="cute-card p-8 mb-8"
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4 heartbeat">📜</div>
                <h2 className="text-2xl pixel-title text-gray-800 mb-2">
                  Adoption History
                </h2>
                <p className="cute-text text-gray-600">
                  Your blockchain-verified pet adoptions! ✨
                </p>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="cute-spinner mx-auto mb-4"></div>
                  <p className="cute-text text-gray-600">Loading your adoptions... 🐾</p>
                </div>
              ) : adoptions.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {adoptions.map((adoption, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="cute-card bg-gradient-to-r from-pink-50 to-purple-50 p-6 border-4 border-pink-200"
                    >
                      <div className="text-4xl mb-3 bounce-animation">🎉</div>
                      <h3 className="cute-text font-bold text-gray-800 mb-2">
                        Pet ID: {adoption.petId}
                      </h3>
                      <div className="space-y-2 cute-text text-sm text-gray-600">
                        <p>💰 Amount: {adoption.amount} ETH</p>
                        <p>🏠 Shelter: {formatAddress(adoption.shelter)}</p>
                        <p>📅 Date: {new Date(adoption.blockTimestamp * 1000).toLocaleDateString()}</p>
                      </div>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${adoption.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-blue-500 hover:text-blue-700 mt-3"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="cute-text text-xs">View Transaction</span>
                      </a>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 float-animation">🐾</div>
                  <p className="cute-text text-gray-600 mb-4">
                    No adoptions yet! Start by adopting your first virtual pet 💖
                  </p>
                  <button
                    onClick={() => window.location.href = '/adopt'}
                    className="pixel-btn pixel-btn-pink text-lg px-6 py-3"
                  >
                    <span className="mr-2">🚀</span>
                    Adopt Now
                    <span className="ml-2">💖</span>
                  </button>
                </div>
              )}
            </motion.div>

            {/* Virtual Pet Room */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <VirtualPetRoom />
            </motion.div>

            {/* Shelter Registration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <ShelterRegistration />
            </motion.div>

            {/* Fun Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="cute-card p-8 text-center"
            >
              <div className="text-6xl mb-6 heartbeat">🏆</div>
              <h2 className="text-2xl pixel-title text-gray-800 mb-6">
                Your Impact! 🌟
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-4xl mb-2 bounce-animation">💖</div>
                  <div className="text-3xl cute-text font-bold text-pink-500">
                    {adoptions.length}
                  </div>
                  <div className="cute-text text-gray-600">Pets Adopted</div>
                </div>
                <div>
                  <div className="text-4xl mb-2 float-animation">💰</div>
                  <div className="text-3xl cute-text font-bold text-green-500">
                    {adoptions.reduce((sum, a) => sum + parseFloat(a.amount), 0).toFixed(6)}
                  </div>
                  <div className="cute-text text-gray-600">ETH Donated</div>
                </div>
                <div>
                  <div className="text-4xl mb-2 heartbeat">🌟</div>
                  <div className="text-3xl cute-text font-bold text-blue-500">
                    {adoptions.length > 0 ? 'Hero' : 'Newbie'}
                  </div>
                  <div className="cute-text text-gray-600">Status Level</div>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          /* Trusted Shelters Tab */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <TrustedShelters />
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
