import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../store'
import { upvoteQuestion } from '../slices/eventsSlice'
import type { Question as QuestionType } from '../model'
import { motion } from 'framer-motion'
import { useCallback } from 'react'

interface Props {
  question: QuestionType
  eventId: string
}

export const Question = ({ question, eventId }: Props) => {
  const dispatch = useDispatch<AppDispatch>()

  const handleVote = useCallback(() => {
    console.log('Voting for question:', { questionId: question.id, eventId })
    dispatch(upvoteQuestion({ eventId, questionId: question.id }))
  }, [dispatch, eventId, question.id])

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-4 mb-4"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-gray-800 text-lg">{question.content}</p>
          {question.author && (
            <p className="text-gray-500 text-sm mt-2">Par {question.author}</p>
          )}
        </div>
        <motion.button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleVote}
        >
          <span>👍</span>
          <span>{question.votes}</span>
        </motion.button>
      </div>
    </motion.div>
  )
}