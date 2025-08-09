import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PetSprite from '../components/PetSprite'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  const pets = [
    { type: 'cat', x: 10, y: 20, name: 'Mittens' },
    { type: 'dog', x: 80, y: 30, name: 'Bruno' },
    { type: 'rabbit', x: 20, y: 70, name: 'Coco' },
    { type: 'bird', x: 70, y: 60, name: 'Chirpy' },
    { type: 'sunbear', x: 40, y: 40, name: 'Sunny' },
    { type: 'cat', x: 60, y: 80, name: 'Kiki' }, // Changed from orangutan to cat
    { type: 'turtle', x: 30, y: 50, name: 'Shelly' },
    { type: 'dog', x: 90, y: 50, name: 'Raja' } // Changed from monkey to dog
  ]

  const floatingEmojis = ['✨', '💖', '🌟', '💫', '🎀', '🌈', '🦋', '🌸']

  return (
    <div className="min-h-screen pixel-bg pixel-grid relative overflow-hidden">
      {/* Floating Emojis */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingEmojis.map((emoji, index) => (
          <motion.div
            key={index}
            className="absolute text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + index,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* Animated pet sprites in background */}
      <div className="absolute inset-0 pointer-events-none">
        {pets.map((pet, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{ left: `${pet.x}%`, top: `${pet.y}%` }}
            animate={{
              x: [0, 30, -30, 0],
              y: [0, -20, 20, 0],
            }}
            transition={{
              duration: 8 + index * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <PetSprite type={pet.type} size="medium" animated />
            <div className="text-center mt-2">
              <span className="cute-card px-2 py-1 text-xs cute-text font-bold text-gray-700">
                {pet.name}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8">
            <div className="text-8xl mb-4 heartbeat">💖</div>
            <h1 className="text-4xl md:text-6xl pixel-title mb-6">
              Adopt a Pet,
              <br />
              <span className="text-yellow-300">Save a Life!</span>
            </h1>
          </div>
          
          <div className="cute-card p-8 mb-12 max-w-2xl mx-auto">
            <p className="text-xl md:text-2xl cute-text font-medium text-gray-700 mb-4">
              Give stray pets and wildlife in Malaysia a virtual home! 🏠
            </p>
            <p className="text-lg cute-text text-gray-600">
              NFT-backed donations • Blockchain secured • Real impact ✨
            </p>
          </div>
          
          <motion.button
            onClick={() => navigate('/adopt')}
            className="pixel-btn pixel-btn-pink text-lg px-8 py-4 flex items-center space-x-3 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl emoji-bounce">🐾</span>
            <span>Start Adopting</span>
            <span className="text-2xl emoji-bounce">💖</span>
          </motion.button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.h2 
          className="text-3xl pixel-title text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Why TemanBulus? 🌟
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            className="cute-card p-8 text-center pet-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-6xl mb-4 bounce-animation">🛡️</div>
            <h3 className="text-2xl cute-text font-bold text-gray-800 mb-3">
              Blockchain Secured
            </h3>
            <p className="cute-text text-gray-600">
              Every adoption is recorded on Sepolia blockchain for transparency! 📝✨
            </p>
          </motion.div>

          <motion.div 
            className="cute-card p-8 text-center pet-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-6xl mb-4 heartbeat">💝</div>
            <h3 className="text-2xl cute-text font-bold text-gray-800 mb-3">
              Real Impact
            </h3>
            <p className="cute-text text-gray-600">
              Your donations directly support APUshelter and help real animals! 🐕🐱
            </p>
          </motion.div>

          <motion.div 
            className="cute-card p-8 text-center pet-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-6xl mb-4 float-animation">🌍</div>
            <h3 className="text-2xl cute-text font-bold text-gray-800 mb-3">
              Community Driven
            </h3>
            <p className="cute-text text-gray-600">
              Join Malaysia's cutest virtual pet care community! 🇲🇾💕
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div 
          className="cute-card p-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-3xl pixel-title text-center mb-12 text-gray-800">
            Our Amazing Partners 🤝
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="cute-card p-6 mb-4 pet-card">
                <div className="text-6xl mb-4 bounce-animation">🏠</div>
                <img 
                  src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop" 
                  alt="APUshelter"
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-pink-300"
                />
              </div>
              <h4 className="text-xl cute-text font-bold text-white">APUshelter</h4>
              <p className="cute-text text-white/90">Supporting local animal shelters 🐾</p>
            </div>
            
            <div className="text-center">
              <div className="cute-card p-6 mb-4 pet-card">
                <div className="text-6xl mb-4 float-animation">🐻</div>
                <img 
                  src="https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=200&h=200&fit=crop" 
                  alt="Sunbear Conservation"
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-yellow-300"
                />
              </div>
              <h4 className="text-xl cute-text font-bold text-white">Sunbear Conservation</h4>
              <p className="cute-text text-white/90">Protecting Malaysia's wildlife 🌿</p>
            </div>
            
            <div className="text-center">
              <div className="cute-card p-6 mb-4 pet-card">
                <div className="text-6xl mb-4 heartbeat">🦁</div>
                <img 
                  src="https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=200&h=200&fit=crop" 
                  alt="Zoo Negara"
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-green-300"
                />
              </div>
              <h4 className="text-xl cute-text font-bold text-white">Zoo Negara</h4>
              <p className="cute-text text-white/90">National Zoo of Malaysia 🇲🇾</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="text-6xl mb-6 heartbeat">🌟</div>
          <h2 className="text-3xl pixel-title mb-6">
            Ready to Make a Difference?
          </h2>
          <button
            onClick={() => navigate('/adopt')}
            className="pixel-btn pixel-btn-green text-xl px-12 py-6 flex items-center space-x-4 mx-auto"
          >
            <span className="text-3xl">🚀</span>
            <span>Adopt Now</span>
            <span className="text-3xl">💖</span>
          </button>
        </motion.div>
      </section>
    </div>
  )
}

export default LandingPage
