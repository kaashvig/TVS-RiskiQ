import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, createContext, useContext } from 'react'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import RiskIntelligencePage from './pages/RiskIntelligencePage'
import CopilotPage from './pages/CopilotPage'
import ScenarioPage from './pages/ScenarioPage'
import PortfolioPage from './pages/PortfolioPage'
import DownloadPage from './pages/DownloadPage'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'

export const ThemeContext = createContext()

export function useTheme() {
  return useContext(ThemeContext)
}

function AppLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-dark-950">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  const [theme, setTheme] = useState('dark')

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
    document.documentElement.classList.toggle('light', newTheme === 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
          <Route path="/risk" element={<AppLayout><RiskIntelligencePage /></AppLayout>} />
          <Route path="/copilot" element={<AppLayout><CopilotPage /></AppLayout>} />
          <Route path="/scenarios" element={<AppLayout><ScenarioPage /></AppLayout>} />
          <Route path="/portfolio" element={<AppLayout><PortfolioPage /></AppLayout>} />
          <Route path="/downloads" element={<AppLayout><DownloadPage /></AppLayout>} />
        </Routes>
      </BrowserRouter>
    </ThemeContext.Provider>
  )
}
