import React, { useState } from 'react'
import { motion } from 'framer-motion'
import PetSprite from './PetSprite'

interface VirtualPet {
  id: string
  name: string
  type: string
  status: string
  message: string
  happiness: number
  lastFed: Date
  emoji: string
}

const VirtualPetRoom: React.FC = () => {
  const [selectedPet, setSelectedPet] = useState<string | null>(null)
  
  const pets: VirtualPet[] = [
    {
      id: '1',
      name: 'Mittens',
      type: 'cat',
      status: 'Happy',
      message: 'Thank you for the treats! Purr... 😸',
      happiness: 85,
      lastFed: new Date(),
      emoji: '🐱'
    },
    {
      id: '2',
      name: 'Bruno',
      type: 'dog',
      status: 'Playful',
      message: 'Woof! Can we play fetch? 🎾',
      happiness: 92,
      lastFed: new Date(),
      emoji: '🐶'
    },
    {
      id: '3',
      name: 'Kiki', // Changed to cat
      type: 'cat',
      status: 'Sleepy',
      message: 'Meow... time for a nap! 😴',
      happiness: 78,
      lastFed: new Date(),
      emoji: '😻'
    }
  ]

  const handleFeed = (petId: string) => {
    console.log(`Feeding pet ${petId} 🍖`)
    // Implement feeding logic with cute animations
  }

  const handleChat = (petId: string) => {
    setSelectedPet(petId)
    console.log(`Chatting with pet ${petId} 💬`)
  }

  const handlePlay = (petId: string) => {
    console.log(`Playing with pet ${petId} 🎮`)
  }

  return (
    <div className="cute-card p-8">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4 heartbeat">🏠</div>
        <h2 className="text-3xl pixel-title text-gray-800 mb-2">Virtual Pet Room</h2>
        <p className="cute-text text-gray-600">Your adopted pets live here! 💖</p>
      </div>
      
      {/* Pet Room Scene */}
      <div className="cute-card bg-gradient-to-b from-sky-100 to-green-100 p-8 mb-8 relative h-96 overflow-hidden border-4 border-blue-300">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-4 left-4 text-3xl float-animation">🌤️</div>
          <div className="absolute top-4 right-4 text-3xl bounce-animation">🌈</div>
          <div className="absolute bottom-4 left-4 text-2xl">🌸</div>
          <div className="absolute bottom-4 right-4 text-2xl">🦋</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl float-animation">🌳</div>
        </div>
        
        {/* Animated Pets */}
        {pets.map((pet, index) => (
          <motion.div
            key={pet.id}
            className="absolute cursor-pointer"
            style={{
              left: `${20 + index * 25}%`,
              bottom: '20%'
            }}
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.5
            }}
            onClick={() => handleChat(pet.id)}
          >
            <div className="text-6xl mb-2">
              {pet.emoji}
            </div>
            
            {/* Speech Bubble */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -top-20 left-1/2 transform -translate-x-1/2 cute-card px-3 py-2 whitespace-nowrap border-2 border-pink-300"
            >
              <p className="cute-text text-sm text-gray-700">{pet.message}</p>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
            </motion.div>
            
            {/* Pet Name */}
            <div className="cute-card px-2 py-1 mt-2">
              <p className="cute-text font-bold text-gray-700 text-center text-sm">{pet.name}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pet Status Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {pets.map(pet => (
          <div key={pet.id} className="cute-card p-6 border-4 border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-3xl">{pet.emoji}</span>
                <h3 className="text-xl cute-text font-bold text-gray-800">{pet.name}</h3>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-2xl heartbeat">💖</span>
                <span className="cute-text font-bold text-pink-500">{pet.happiness}%</span>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between cute-text text-gray-600 text-sm mb-2">
                <span>Happiness Level</span>
                <span>{pet.happiness}%</span>
              </div>
              <div className="w-full bg-pink-100 rounded-full h-3 border-2 border-pink-200">
                <div 
                  className="bg-gradient-to-r from-pink-400 to-purple-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${pet.happiness}%` }}
                ></div>
              </div>
            </div>

            <div className="cute-card bg-gradient-to-r from-blue-50 to-purple-50 p-3 mb-4 border-2 border-blue-200">
              <p className="cute-text text-sm text-gray-700">
                <span className="font-bold">Status:</span> {pet.status} ✨
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleFeed(pet.id)}
                className="pixel-btn pixel-btn-green text-xs py-2 flex flex-col items-center space-y-1"
              >
                <span className="text-lg">🍖</span>
                <span>Feed</span>
              </button>
              <button
                onClick={() => handleChat(pet.id)}
                className="pixel-btn pixel-btn-blue text-xs py-2 flex flex-col items-center space-y-1"
              >
                <span className="text-lg">💬</span>
                <span>Chat</span>
              </button>
              <button
                onClick={() => handlePlay(pet.id)}
                className="pixel-btn pixel-btn-pink text-xs py-2 flex flex-col items-center space-y-1"
              >
                <span className="text-lg">🎮</span>
                <span>Play</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Pet Button */}
      <div className="text-center mt-8">
        <button className="pixel-btn pixel-btn-yellow text-lg px-8 py-4 flex items-center space-x-3 mx-auto">
          <span className="text-2xl bounce-animation">➕</span>
          <span>Adopt More Pets</span>
          <span className="text-2xl bounce-animation">🐾</span>
        </button>
      </div>
    </div>
  )
}

export default VirtualPetRoom
