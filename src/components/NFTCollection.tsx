import React from 'react'
import { motion } from 'framer-motion'
import { Award, Calendar, ExternalLink } from 'lucide-react'

interface NFT {
  id: string
  name: string
  image: string
  adoptionDate: string
  tokenId: string
  rarity: 'common' | 'rare' | 'legendary'
}

const NFTCollection: React.FC = () => {
  const nfts: NFT[] = [
    {
      id: '1',
      name: 'Mittens Adoption Certificate',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
      adoptionDate: '2024-01-15',
      tokenId: '#0001',
      rarity: 'rare'
    },
    {
      id: '2',
      name: 'Bruno Adoption Certificate',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
      adoptionDate: '2024-01-20',
      tokenId: '#0002',
      rarity: 'common'
    },
    {
      id: '3',
      name: 'Sunny Conservation Badge',
      image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&h=400&fit=crop',
      adoptionDate: '2024-02-01',
      tokenId: '#0003',
      rarity: 'legendary'
    }
  ]

  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-400'
      case 'rare': return 'from-purple-400 to-pink-400'
      default: return 'from-blue-400 to-green-400'
    }
  }

  return (
    <div className="glass rounded-3xl p-8">
      <h2 className="text-3xl font-bold text-white mb-6">NFT Collection</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        {nfts.map((nft, index) => (
          <motion.div
            key={nft.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all"
          >
            <div className="relative h-64">
              <img 
                src={nft.image} 
                alt={nft.name}
                className="w-full h-full object-cover"
              />
              <div className={`absolute top-4 right-4 rounded-full px-3 py-1 bg-gradient-to-r ${getRarityColor(nft.rarity)}`}>
                <span className="text-white text-sm font-semibold capitalize">{nft.rarity}</span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{nft.name}</h3>
              <div className="flex items-center text-white/70 mb-2">
                <Award className="w-4 h-4 mr-2" />
                <span className="text-sm">Token ID: {nft.tokenId}</span>
              </div>
              <div className="flex items-center text-white/70 mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">Adopted: {nft.adoptionDate}</span>
              </div>
              
              <button className="w-full glass rounded-lg py-2 text-white hover:bg-white/20 transition-all flex items-center justify-center space-x-2">
                <ExternalLink className="w-4 h-4" />
                <span>View on Etherscan</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default NFTCollection
