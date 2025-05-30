import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { setCurrentQuestion } from '../slices/appSlice';
import { Box, IconButton, Typography, Container } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

export const MobileQuestionView = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentEventId, currentQuestionId } = useSelector(
    (state: RootState) => state.app
  );

  useEffect(() => {
    if (questionId) {
      dispatch(setCurrentQuestion(questionId));
    }
  }, [questionId, dispatch]);

  const handlePreviousQuestion = () => {
    // TODO: Implement navigation to previous question
    console.log('Navigate to previous question');
  };

  const handleNextQuestion = () => {
    // TODO: Implement navigation to next question
    console.log('Navigate to next question');
  };

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
        <IconButton onClick={handlePreviousQuestion}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6">Question {currentQuestionId}</Typography>
        <IconButton onClick={handleNextQuestion}>
          <ChevronRight />
        </IconButton>
      </Box>
      
      <Box sx={{ flex: 1, p: 2 }}>
        {/* TODO: Add question content */}
        <Typography variant="body1">
          Question content will be displayed here
        </Typography>
      </Box>
    </Container>
  );
}; 