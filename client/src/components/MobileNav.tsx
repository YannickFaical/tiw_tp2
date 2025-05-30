import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../store'
import { addQuestion, deleteQuestion } from '../slices/eventsSlice'
import { motion } from 'framer-motion'
import { HomeIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

export const MobileNav = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { eventId, questionId } = useParams()
  const events = useSelector((state: RootState) => state.events.events)
  const currentEvent = events.find(e => e.id === eventId)

  const handleAddQuestion = () => {
    if (!eventId) return
    const newQuestionId = `q${Date.now()}`
    dispatch(addQuestion({
      eventId,
      question: {
        id: newQuestionId,
        content: 'Nouvelle question',
        votes: 0
      }
    }))
    navigate(`/events/${eventId}/questions/${newQuestionId}/edit`)
  }

  const handleEditQuestion = () => {
    if (!eventId || !questionId) return
    navigate(`/events/${eventId}/questions/${questionId}/edit`)
  }

  const handleDeleteQuestion = () => {
    if (!eventId || !questionId) return

    if (window.confirm('Voulez-vous vraiment supprimer cette question ?')) {
      dispatch(deleteQuestion({ eventId, questionId }))
      navigate(`/events/${eventId}`)
    }
  }

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4"
    >
      <div className="flex justify-around items-center">
        <button
          onClick={() => navigate('/events')}
          aria-label="Voir tous les événements"
          className="flex flex-col items-center text-gray-600 hover:text-primary-600"
        >
          <HomeIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Events</span>
        </button>

        <button
          onClick={handleAddQuestion}
          aria-label="Ajouter une question"
          className="flex flex-col items-center text-gray-600 hover:text-primary-600"
        >
          <PlusIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Add</span>
        </button>

        {questionId && (
          <>
            <button
              onClick={handleEditQuestion}
              aria-label="Modifier la question"
              className="flex flex-col items-center text-gray-600 hover:text-primary-600"
            >
              <PencilIcon className="h-6 w-6" />
              <span className="text-xs mt-1">Edit</span>
            </button>

            <button
              onClick={handleDeleteQuestion}
              aria-label="Supprimer la question"
              className="flex flex-col items-center text-red-600 hover:text-red-700"
            >
              <TrashIcon className="h-6 w-6" />
              <span className="text-xs mt-1">Delete</span>
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}
