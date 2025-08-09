import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useWallet } from '../contexts/WalletContext'
import { Heart, Home, PawPrint, User, Wallet } from 'lucide-react'

const Navbar: React.FC = () => {
  const { account, connectWallet, disconnectWallet } = useWallet()
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: Home, emoji: '🏠' },
    { path: '/adopt', label: 'Adopt', icon: PawPrint, emoji: '🐾' },
    { path: '/profile', label: 'Profile', icon: User, emoji: '👤' }
  ]

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <nav className="cute-navbar sticky top-0 z-50 px-4 py-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="pixel-decoration">
            <div className="text-4xl bounce-animation">🐾</div>
          </div>
          <div>
            <h1 className="text-2xl font-bold cute-text" style={{ color: 'var(--pixel-pink)' }}>
              TemanBulus
            </h1>
            <p className="text-sm cute-text" style={{ color: 'var(--pixel-purple)' }}>
              Virtual Pet Care 💖
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all cute-text font-medium ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100'
                }`}
              >
                <span className="text-lg emoji-float">{item.emoji}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Wallet Connection */}
        <div className="flex items-center space-x-3">
          {account ? (
            <div className="flex items-center space-x-3">
              <div className="cute-card px-4 py-2 flex items-center space-x-2">
                <div className="text-lg emoji-bounce">👛</div>
                <span className="cute-text font-medium text-gray-700">
                  {formatAddress(account)}
                </span>
              </div>
              <button
                onClick={disconnectWallet}
                className="pixel-btn pixel-btn-pink"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="pixel-btn pixel-btn-blue flex items-center space-x-2"
            >
              <span>🔗</span>
              <span>Connect</span>
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center space-x-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`text-2xl transition-all ${
                  isActive ? 'bounce-animation' : 'float-animation'
                }`}
              >
                {item.emoji}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
