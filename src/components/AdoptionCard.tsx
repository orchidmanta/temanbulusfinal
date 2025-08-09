import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Building2, Loader, Bug } from 'lucide-react'
import PetSprite from './PetSprite'

interface Pet {
  id: string
  name: string
  type: string
  location: string
  organization: string
  description: string
  adoptionFee: string
  image: string
  emoji?: string
}

interface AdoptionCardProps {
  pet: Pet
  onAdopt: () => void
  onDebug: () => void
  isAdopting: boolean
}

const AdoptionCard: React.FC<AdoptionCardProps> = ({ pet, onAdopt, onDebug, isAdopting }) => {
  return (
    <motion.div
      className="cute-card p-6 pet-card h-full flex flex-col"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Pet Image & Emoji */}
      <div className="relative mb-4">
        <img
          src={pet.image}
          alt={pet.name}
          className="w-full h-48 object-cover rounded-2xl border-4 border-pink-200"
        />
        <div className="absolute -top-2 -right-2 text-4xl bounce-animation">
          {pet.emoji || '💖'}
        </div>
        <div className="absolute -bottom-2 -left-2">
          <PetSprite type={pet.type} size="medium" animated />
        </div>
      </div>

      {/* Pet Info */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-2xl cute-text font-bold text-gray-800">{pet.name}</h3>
          <span className="cute-card px-3 py-1 text-sm cute-text font-bold text-purple-600">
            ID: {pet.id}
          </span>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <MapPin className="w-4 h-4 text-pink-500" />
          <span className="cute-text text-gray-600">{pet.location}</span>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Building2 className="w-4 h-4 text-blue-500" />
          <span className="cute-text text-gray-600">{pet.organization}</span>
        </div>

        <p className="cute-text text-gray-700 mb-6 leading-relaxed">
          {pet.description}
        </p>

        {/* Adoption Fee */}
        <div className="cute-card bg-gradient-to-r from-yellow-100 to-pink-100 p-4 mb-6 border-2 border-yellow-300">
          <div className="flex items-center justify-between">
            <span className="cute-text font-bold text-gray-700">Adoption Fee:</span>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">💰</span>
              <span className="text-xl cute-text font-bold text-green-600">
                {pet.adoptionFee} ETH
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onAdopt}
          disabled={isAdopting}
          className={`w-full pixel-btn pixel-btn-pink text-lg py-3 flex items-center justify-center space-x-2 ${
            isAdopting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isAdopting ? (
            <>
              <div className="cute-spinner w-5 h-5"></div>
              <span>Adopting...</span>
            </>
          ) : (
            <>
              <span className="text-2xl heartbeat">💖</span>
              <span>Adopt {pet.name}</span>
              <span className="text-2xl heartbeat">💖</span>
            </>
          )}
        </button>

        <button
          onClick={onDebug}
          className="w-full pixel-btn pixel-btn-blue text-sm py-2 flex items-center justify-center space-x-2"
        >
          <span className="text-lg">🔍</span>
          <span>Debug Info</span>
        </button>
      </div>

      {/* Cute decorative elements */}
      <div className="absolute top-2 left-2 text-lg float-animation">✨</div>
      <div className="absolute top-2 right-12 text-lg bounce-animation">🌟</div>
    </motion.div>
  )
}

export default AdoptionCard
