import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { AppDispatch } from '../store'
import { updateQuestion, selectCurrentEvent } from '../slices/eventsSlice'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface QuestionEditProps {
  eventId: string
  questionId: string
}

export const QuestionEdit = ({ eventId, questionId }: QuestionEditProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const event = useSelector(selectCurrentEvent)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [content, setContent] = useState('')
  const [initialContent, setInitialContent] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const question = event?.questions.find((q) => q.id === questionId)
    if (question) {
      setContent(question.content)
      setInitialContent(question.content)
    }
  }, [event, questionId])

  useEffect(() => {
    textareaRef.current?.focus()
  }, [questionId])

  const hasUnsavedChanges = content !== initialContent

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [hasUnsavedChanges])

  const handleSave = () => {
    const currentQuestion = event?.questions.find(q => q.id === questionId)
    if (!currentQuestion) return

    dispatch(updateQuestion({
      eventId,
      question: {
        id: questionId,
        content,
        votes: currentQuestion.votes,
      }
    }))
    setInitialContent(content)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const index = event?.questions.findIndex(q => q.id === questionId) ?? -1

  const handlePrevious = () => {
    if (index > 0) {
      const prevQuestion = event!.questions[index - 1]
      navigate(`/events/${eventId}/questions/${prevQuestion.id}/edit`)
    }
  }

  const handleNext = () => {
    if (event && index < event.questions.length - 1) {
      const nextQuestion = event.questions[index + 1]
      navigate(`/events/${eventId}/questions/${nextQuestion.id}/edit`)
    }
  }

  const handleCancel = () => {
    if (hasUnsavedChanges && !confirm('Des modifications non enregistrées seront perdues. Continuer ?')) {
      return
    }
    navigate(`/events/${eventId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={index <= 0}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <button
          onClick={handleNext}
          disabled={!event || index >= event.questions.length - 1}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Question
        </label>
        <textarea
          id="content"
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          rows={4}
        />
      </div>

      {saved && <p className="text-green-600 text-sm">Enregistré !</p>}

      <div className="flex justify-end space-x-3">
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          onClick={handleSave}
          disabled={!content.trim() || content === initialContent}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enregistrer
        </button>
      </div>
    </div>
  )
}
