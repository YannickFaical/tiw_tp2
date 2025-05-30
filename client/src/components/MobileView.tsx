import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { addQuestion } from '../slices/eventsSlice'
import { AppBar, Toolbar, IconButton, Typography, Paper, List, ListItem, ListItemText, Button, Box } from '@mui/material'
import { ArrowBack as ArrowBackIcon, Add as AddIcon } from '@mui/icons-material'

export function MobileView() {
  const { eventId, questionId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const event = useSelector((state) => 
    state.events.events.find(e => e.id === eventId)
  )

  const currentQuestion = useSelector((state) => 
    event?.questions.find(q => q.id === questionId)
  )

  useEffect(() => {
    if (questionId) {
      // Si tu veux faire quelque chose quand la question change, sinon ce useEffect peut être supprimé
    }
  }, [questionId])

  if (!event) {
    return (
      <Typography variant="h6" color="error" sx={{ p: 2 }}>
        Événement non trouvé
      </Typography>
    )
  }

  const handleBack = () => {
    if (questionId) {
      navigate(`/events/${eventId}`)
    } else {
      navigate('/events')
    }
  }

  const handleQuestionClick = (questionId: string) => {
    navigate(`/events/${eventId}/questions/${questionId}`)
  }

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

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleBack}
            sx={{ mr: 2 }}
            aria-label="Retour"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {questionId ? currentQuestion?.content : event.title}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {!questionId ? (
          <>
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
              {event.questions.map((question) => (
                <ListItem
                  key={question.id}
                  component="button"
                  onClick={() => handleQuestionClick(question.id)}
                >
                  <ListItemText
                    primary={question.content}
                    secondary={`${question.votes} vote(s)`}
                  />
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {currentQuestion?.content}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentQuestion?.votes} vote(s)
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  )
}
