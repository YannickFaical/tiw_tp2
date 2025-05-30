import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { setCurrentQuestion } from '../slices/appSlice';
import { Box, Typography, Container, Button, TextField } from '@mui/material';

export const QuestionDetail = () => {
  const { eventId, questionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentQuestionId } = useSelector((state: RootState) => state.app);

  useEffect(() => {
    if (questionId) {
      dispatch(setCurrentQuestion(questionId));
    }
  }, [questionId, dispatch]);

  // TODO: Replace with actual question data
  const question = {
    id: questionId,
    title: 'Sample Question',
    content: 'This is a sample question content.',
  };

  const handleBack = () => {
    navigate(`/event/${eventId}`);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Button onClick={handleBack} sx={{ mb: 2 }}>
          Back to Questions
        </Button>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {question.title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          {question.content}
        </Typography>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Your Answer"
          variant="outlined"
          sx={{ mb: 2 }}
        />
        
        <Button variant="contained" color="primary">
          Submit Answer
        </Button>
      </Box>
    </Container>
  );
}; 