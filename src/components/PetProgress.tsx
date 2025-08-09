import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Heart, Users, MapPin } from 'lucide-react'

interface PetProgressData {
  id: string
  name: string
  type: string
  location: string
  totalDonations: string
  supporters: number
  healthStatus: number
  recentUpdate: string
  image: string
}

const PetProgress: React.FC = () => {
  const petsProgress: PetProgressData[] = [
    {
      id: '1',
      name: 'Mittens',
      type: 'cat',
      location: 'Petaling Jaya Shelter',
      totalDonations: '0.125',
      supporters: 23,
      healthStatus: 95,
      recentUpdate: 'Mittens is doing great! She loves playing with her new toys.',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop'
    },
    {
      id: '2',
      name: 'Bruno',
      type: 'dog',
      location: 'KL Animal Rescue',
      totalDonations: '0.089',
      supporters: 18,
      healthStatus: 88,
      recentUpdate: 'Bruno completed his vaccination schedule and is very healthy!',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop'
    },
    {
      id: '3',
      name: 'Sunny',
      type: 'sunbear',
      location: 'Sunbear Conservation Centre',
      totalDonations: '0.342',
      supporters: 45,
      healthStatus: 82,
      recentUpdate: 'Sunny is adapting well to the sanctuary and gaining weight.',
      image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&h=400&fit=crop'
    }
  ]

  return (
    <div className="glass rounded-3xl p-8">
      <h2 className="text-3xl font-bold text-white mb-6">Pet Progress & Impact</h2>
      
      {/* Overall Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="glass rounded-xl p-4 text-center">
          <Heart className="w-8 h-8 text-white mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">3</p>
          <p className="text-white/70 text-sm">Pets Adopted</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <TrendingUp className="w-8 h-8 text-white mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">0.556 ETH</p>
          <p className="text-white/70 text-sm">Total Impact</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <Users className="w-8 h-8 text-white mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">86</p>
          <p className="text-white/70 text-sm">Total Supporters</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <MapPin className="w-8 h-8 text-white mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">3</p>
          <p className="text-white/70 text-sm">Organizations</p>
        </div>
      </div>

      {/* Individual Pet Progress */}
      <div className="space-y-6">
        {petsProgress.map((pet, index) => (
          <motion.div
            key={pet.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-start space-x-6">
              <img 
                src={pet.image} 
                alt={pet.name}
                className="w-24 h-24 rounded-xl object-cover"
              />
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold text-white">{pet.name}</h3>
                  <button className="glass rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-all">
                    Visit {pet.name}
                  </button>
                </div>
                
                <div className="flex items-center space-x-4 text-white/70 mb-3">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {pet.location}
                  </span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {pet.supporters} supporters
                  </span>
                  <span className="flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    {pet.totalDonations} ETH raised
                  </span>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-white/70 text-sm mb-1">
                    <span>Health Status</span>
                    <span>{pet.healthStatus}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full"
                      style={{ width: `${pet.healthStatus}%` }}
                    ></div>
                  </div>
                </div>

                <p className="text-white/80 italic">"{pet.recentUpdate}"</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default PetProgress
