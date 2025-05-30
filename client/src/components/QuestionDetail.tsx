import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { setCurrentQuestion } from '../slices/appSlice';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { QuestionVote } from './QuestionVote';
import { addAnswer } from '../slices/eventsSlice';

export const QuestionDetail = () => {
  const { eventId, questionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [newAnswer, setNewAnswer] = useState('');

  const events = useSelector((state: RootState) => state.events.events);
  const currentEvent = events.find(e => e.id === eventId);
  const question = currentEvent?.questions.find(q => q.id === questionId);

  useEffect(() => {
    if (questionId) {
      dispatch(setCurrentQuestion(questionId));
    }
  }, [questionId, dispatch]);

  const handleAddAnswer = () => {
    if (newAnswer.trim() && eventId && questionId) {
      dispatch(addAnswer({
        eventId,
        questionId,
        answer: {
          id: `a${Date.now()}`,
          content: newAnswer,
          createdAt: new Date().toISOString()
        }
      }));
      setNewAnswer('');
    }
  };

  if (!question) {
    return (
      <Container maxWidth="md">
        <Typography variant="h5" color="error">
          Question not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          {question.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {question.content}
        </Typography>
        <QuestionVote question={question} eventId={eventId!} />
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Add Your Answer
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Your Answer"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button 
          variant="contained" 
          onClick={handleAddAnswer}
          disabled={!newAnswer.trim()}
        >
          Submit Answer
        </Button>
      </Paper>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" component="h2">
          {question.answers?.length === 0 ? 'No answers yet. Be the first to answer!' : 'Answers'}
        </Typography>
      </Box>

      <List>
        {question.answers?.map((answer) => (
          <Paper 
            key={answer.id}
            sx={{ 
              mb: 2,
              '&:hover': {
                boxShadow: 1
              }
            }}
          >
            <ListItem>
              <ListItemText
                primary={answer.content}
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    Answered on {new Date(answer.createdAt).toLocaleDateString()}
                  </Typography>
                }
              />
            </ListItem>
          </Paper>
        ))}
      </List>
    </Container>
  );
}; 