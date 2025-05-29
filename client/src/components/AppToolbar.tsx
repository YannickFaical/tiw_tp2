import { useQna } from '../context/QnaContext'
import { motion } from 'framer-motion'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export const AppToolbar = () => {
  const { state, setCurrentEvent, isConnected } = useQna()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    console.log('Selected event:', value)
    setCurrentEvent(value || null)
  }

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <motion.h1 
              className="text-2xl font-bold text-primary-600"
              whileHover={{ scale: 1.05 }}
            >
              TIW8 - Q&A App
            </motion.h1>
            <div className="ml-4 flex items-center">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} mr-2`} />
              <span className="text-sm text-gray-500">
                {isConnected ? 'Connecté' : 'Déconnecté'}
              </span>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center">
            <select 
              onChange={handleEventChange}
              value={state.currentEventId || ''}
              className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="">Sélectionner un événement</option>
              {state.events.map(event => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div 
        className="sm:hidden"
        initial={false}
        animate={{ height: isMobileMenuOpen ? 'auto' : 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="pt-2 pb-3 space-y-1">
          <select 
            onChange={handleEventChange}
            value={state.currentEventId || ''}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="">Sélectionner un événement</option>
            {state.events.map(event => (
              <option key={event.id} value={event.id}>{event.title}</option>
            ))}
          </select>
        </div>
      </motion.div>
    </motion.div>
  )
}