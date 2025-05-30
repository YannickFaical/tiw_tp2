// components/QuestionCard.tsx
import { useDispatch } from 'react-redux'
import { upvoteQuestion } from '../slices/eventsSlice'
import { Card, CardContent, Typography, Button } from '@mui/material'
import type { Question } from '../types'

interface Props {
  question: Question
  eventId: string
}

export const QuestionCard = ({ question, eventId }: Props) => {
  const dispatch = useDispatch()

  const handleUpvote = () => {
    dispatch(upvoteQuestion({ eventId, questionId: question.id }))
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="body1">{question.content}</Typography>
        <Typography variant="body2" color="text.secondary">Votes: {question.votes}</Typography>
        <Button variant="contained" color="primary" onClick={handleUpvote} sx={{ mt: 1 }}>
          +1 Vote
        </Button>
      </CardContent>
    </Card>
  )
}
