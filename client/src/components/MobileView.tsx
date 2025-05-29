import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../store'
import { upvoteQuestion } from '../slices/eventsSlice'
import { motion } from 'framer-motion'

export const MobileView = () => {
  const { eventId, questionId } = useParams()
  const dispatch = useDispatch()
  const events = useSelector((state: RootState) => state.events.events)
  const currentEvent = events.find(e => e.id === eventId)
  const question = currentEvent?.questions.find(q => q.id === questionId)

  const [isVoting, setIsVoting] = useState(false)
  const voteTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const handleVote = () => {
    if (!eventId || !questionId || isVoting) return

    setIsVoting(true)
    dispatch(upvoteQuestion({ eventId, questionId }))

    if (voteTimeoutRef.current) {
      clearTimeout(voteTimeoutRef.current)
    }

    voteTimeoutRef.current = setTimeout(() => {
      setIsVoting(false)
    }, 1000)
  }

  useEffect(() => {
    return () => {
      if (voteTimeoutRef.current) {
        clearTimeout(voteTimeoutRef.current)
      }
    }
  }, [])

  if (!question) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Question non trouvée</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-4"
    >
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{question.content}</h2>
        
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Votes:</span>
            <span className="text-xl font-bold text-primary-600">{question.votes}</span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVote}
            disabled={isVoting}
            className={`px-6 py-2 rounded-full font-medium ${
              isVoting
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {isVoting ? 'Vote enregistré!' : 'Voter'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}