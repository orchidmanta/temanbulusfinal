import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useWallet } from '../contexts/WalletContext'
import { Building2, CheckCircle, AlertTriangle, Loader, ExternalLink, Wallet } from 'lucide-react'
import { registerShelter, getShelterAddress, checkShelterBalance } from '../utils/contract'

const ShelterRegistration: React.FC = () => {
  const { account, signer, provider } = useWallet()
  const [isRegistering, setIsRegistering] = useState(false)
  const [registeredAddress, setRegisteredAddress] = useState<string | null>(null)
  const [shelterBalance, setShelterBalance] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const APUSHELTER_ADDRESS = "0xD1B2A0692031082D16916454CFAbaae94E2Ee366"

  useEffect(() => {
    const checkRegistration = async () => {
      if (provider) {
        try {
          const address = await getShelterAddress(provider)
          setRegisteredAddress(address)
          
          // Check shelter balance
          const balance = await checkShelterBalance(provider)
          setShelterBalance(balance)
        } catch (err) {
          console.log('No shelter registered yet or error checking balance')
        }
      }
    }

    checkRegistration()
  }, [provider])

  const handleRegister = async () => {
    if (!signer) {
      setError('Please connect your wallet first')
      return
    }

    setIsRegistering(true)
    setError(null)

    try {
      const tx = await registerShelter(signer)
      setRegisteredAddress(APUSHELTER_ADDRESS)
      alert(`APUshelter registered successfully! 🎉\nTransaction: ${tx.hash}`)
    } catch (error: any) {
      console.error('Registration failed:', error)
      setError(error.message || 'Registration failed')
    } finally {
      setIsRegistering(false)
    }
  }

  const isAlreadyRegistered = registeredAddress?.toLowerCase() === APUSHELTER_ADDRESS.toLowerCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6 mb-8"
    >
      <div className="flex items-center space-x-4 mb-4">
        <Building2 className="w-6 h-6 text-white" />
        <h3 className="text-xl font-semibold text-white">APUshelter Registration & ETH Forwarding</h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-white/80 mb-2">APUshelter Address:</p>
          <div className="flex items-center space-x-2">
            <code className="bg-white/10 px-3 py-2 rounded text-sm text-white flex-1">
              {APUSHELTER_ADDRESS}
            </code>
            <a
              href={`https://sepolia.etherscan.io/address/${APUSHELTER_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {registeredAddress && (
          <div>
            <p className="text-white/80 mb-2">Currently Registered:</p>
            <div className="flex items-center space-x-2">
              <code className="bg-white/10 px-3 py-2 rounded text-sm text-white flex-1">
                {registeredAddress}
              </code>
              <a
                href={`https://sepolia.etherscan.io/address/${registeredAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {shelterBalance && (
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Wallet className="w-4 h-4 text-green-400" />
              <p className="text-white/80">Shelter Balance:</p>
            </div>
            <p className="text-xl font-semibold text-green-400">{shelterBalance} ETH</p>
            <p className="text-white/60 text-sm">Funds automatically forwarded from adoptions</p>
          </div>
        )}

        <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-400/20">
          <h4 className="text-blue-400 font-semibold mb-2">ETH Forwarding Mechanism</h4>
          <div className="text-white/80 text-sm space-y-1">
            <p>• <strong>External TX:</strong> Your Wallet → Smart Contract</p>
            <p>• <strong>Internal TX:</strong> Smart Contract → APUshelter</p>
            <p>• All transactions visible on Etherscan</p>
            <p>• Automatic forwarding using <code className="bg-white/10 px-1 rounded">call{`{value: msg.value}`}("")</code></p>
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {isAlreadyRegistered ? (
          <div className="flex items-center space-x-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span>APUshelter is registered and ready for ETH forwarding!</span>
          </div>
        ) : (
          <button
            onClick={handleRegister}
            disabled={isRegistering || !account}
            className="bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all flex items-center space-x-2"
          >
            {isRegistering ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Registering...</span>
              </>
            ) : (
              <>
                <Building2 className="w-4 h-4" />
                <span>Register APUshelter</span>
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default ShelterRegistration
