import { useQna } from '../context/QnaContext'
import type { Question } from '../model'
import { useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpIcon } from '@heroicons/react/24/solid'

interface Props {
  question: Question
  eventId: string
}

export const QuestionComponent = ({ question, eventId }: Props) => {
  const { upvoteQuestion } = useQna()
  const lastVoteTime = useRef<number>(0)

  const handleVote = useCallback(() => {
    const now = Date.now()
    if (now - lastVoteTime.current < 1000) {
      return
    }
    lastVoteTime.current = now
    
    console.log('Voting for question:', { questionId: question.id, eventId })
    upvoteQuestion(eventId, question.id)
  }, [question.id, eventId, upvoteQuestion])

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-100 hover:border-primary-200 transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-lg text-gray-800 mb-2">{question.content}</p>
          {question.author && (
            <p className="text-sm text-gray-500">Par {question.author}</p>
          )}
        </div>
        <motion.button 
          onClick={handleVote}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center justify-center bg-primary-50 hover:bg-primary-100 text-primary-600 rounded-lg px-4 py-2 transition-colors"
        >
          <ArrowUpIcon className="h-6 w-6" />
          <span className="text-sm font-medium mt-1">{question.votes}</span>
        </motion.button>
      </div>
    </motion.div>
  )
}