import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentEvent, selectCurrentQuestion, setCurrentQuestion } from '../slices/eventsSlice'
import { Paper, Typography, Grid, List, ListItem, ListItemText, Button } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { QuestionCard } from './QuestionCard'

export function DesktopView() {
  const { eventId, questionId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const event = useSelector(selectCurrentEvent)
  const currentQuestion = useSelector(selectCurrentQuestion)

  useEffect(() => {
    if (questionId) {
      dispatch(setCurrentQuestion(questionId))
    }
  }, [questionId, dispatch])

  if (!event) {
    return (
      <Typography variant="h6" color="error">
        Événement non trouvé
      </Typography>
    )
  }

  const handleQuestionClick = (questionId: string) => {
    navigate(`/events/${eventId}/questions/${questionId}`)
  }

  const handleAddQuestion = () => {
    const newQuestion = {
      id: `q${Date.now()}`,
      content: 'Nouvelle question',
      votes: 0,
    }

    dispatch({ type: 'events/addQuestion', payload: { eventId, question: newQuestion } })
    // TODO: Envoyer l'action au serveur via WebSocket pour synchro globale
    navigate(`/events/${eventId}/questions/${newQuestion.id}`)
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h5" gutterBottom>
            {event.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {event.description || 'Aucune description'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddQuestion}
            fullWidth
            sx={{ mb: 2 }}
          >
            Ajouter une question
          </Button>
          <List>
            {event.questions?.map((question) => (
              <ListItem
                key={question.id}
                button
                selected={question.id === currentQuestion?.id}
                onClick={() => handleQuestionClick(question.id)}
              >
                <ListItemText
                  primary={question.content}
                  secondary={`${question.votes} vote(s)`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2 }}>
          {currentQuestion ? (
            <QuestionCard eventId={eventId!} question={currentQuestion} />

          ) : (
            <Typography variant="body1" color="text.secondary">
              Sélectionnez une question pour voir les détails
            </Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  )
}
