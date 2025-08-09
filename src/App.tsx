import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WalletProvider } from './contexts/WalletContext'
import { GraphProvider } from './contexts/GraphContext'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import AdoptPage from './pages/AdoptPage'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <WalletProvider>
      <GraphProvider>
        <Router>
          <div className="min-h-screen gradient-bg">
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/adopt" element={<AdoptPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </div>
        </Router>
      </GraphProvider>
    </WalletProvider>
  )
}

export default App
