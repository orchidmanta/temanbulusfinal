import React from 'react'

interface PetSpriteProps {
  type: string
  size?: 'small' | 'medium' | 'large'
  animated?: boolean
}

const PetSprite: React.FC<PetSpriteProps> = ({ type, size = 'medium', animated = false }) => {
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl'
  }

  const animationClass = animated ? 'bounce-animation' : 'float-animation'

  const getSprite = () => {
    switch(type) {
      case 'cat':
        return '🐱'
      case 'dog':
        return '🐶'
      case 'bird':
        return '🐦'
      case 'rabbit':
        return '🐰'
      case 'sunbear':
        return '🐻'
      case 'orangutan':
        return '🦧'
      case 'turtle':
        return '🐢'
      case 'monkey':
        return '🐵'
      case 'capybara':
        return '🦫'
      default:
        return '💖'
    }
  }

  return (
    <div className={`pet-sprite ${sizeClasses[size]} ${animationClass} inline-block cursor-pointer`}>
      {getSprite()}
    </div>
  )
}

export default PetSprite
