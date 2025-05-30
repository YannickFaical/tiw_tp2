import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { setCurrentEvent } from '../slices/appSlice';
import { List, ListItem, ListItemText, ListItemButton, Typography, Container, Box, Button, TextField, Paper } from '@mui/material';
import { QuestionVote } from './QuestionVote';
import { addQuestion } from '../slices/eventsSlice';
import { useState } from 'react';

export const QuestionList = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentEventId } = useSelector((state: RootState) => state.app);
  const events = useSelector((state: RootState) => state.events.events);
  const [newQuestion, setNewQuestion] = useState('');

  useEffect(() => {
    if (eventId) {
      dispatch(setCurrentEvent(eventId));
    }
  }, [eventId, dispatch]);

  const currentEvent = events.find(e => e.id === eventId);
  const questions = currentEvent?.questions || [];

  const handleQuestionClick = (questionId: string) => {
    navigate(`/event/${eventId}/question/${questionId}`);
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim() && eventId) {
      dispatch(addQuestion({
        eventId,
        question: {
          id: `q${Date.now()}`,
          title: newQuestion,
          content: newQuestion,
          votes: 0,
          createdAt: new Date().toISOString()
        }
      }));
      setNewQuestion('');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mb: 4 }}>
        Questions for Event: {currentEvent?.title}
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Add a New Question
        </Typography>
        <TextField
          fullWidth
          label="Your Question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button 
          variant="contained" 
          onClick={handleAddQuestion}
          disabled={!newQuestion.trim()}
        >
          Add Question
        </Button>
      </Paper>
      
      <Typography variant="h6" sx={{ mb: 2 }}>
        {questions.length === 0 ? 'No questions yet. Be the first to ask!' : 'Questions'}
      </Typography>

      <List>
        {questions.map((question) => (
          <Paper 
            key={question.id}
            sx={{ 
              mb: 2,
              '&:hover': {
                boxShadow: 3
              }
            }}
          >
            <ListItem 
              disablePadding
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch'
              }}
            >
              <ListItemButton 
                onClick={() => handleQuestionClick(question.id)}
                sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  p: 2
                }}
              >
                <ListItemText 
                  primary={
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {question.title}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      mt: 1
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        Asked on {new Date(question.createdAt).toLocaleDateString()}
                      </Typography>
                      <QuestionVote question={question} eventId={eventId!} />
                    </Box>
                  }
                />
              </ListItemButton>
            </ListItem>
          </Paper>
        ))}
      </List>
    </Container>
  );
}; 