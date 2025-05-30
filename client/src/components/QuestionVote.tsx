import { useDispatch } from 'react-redux';
import { IconButton, Typography, Box, Button } from '@mui/material';
import { ThumbUp } from '@mui/icons-material';
import { upvoteQuestion } from '../slices/eventsSlice';
import type { Question } from '../types';

interface QuestionVoteProps {
  question: Question;
  eventId: string;
}

export const QuestionVote: React.FC<QuestionVoteProps> = ({ question, eventId }) => {
  const dispatch = useDispatch();

  const handleVote = () => {
    dispatch(upvoteQuestion({ eventId, questionId: question.id }));
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1,
      backgroundColor: 'action.hover',
      borderRadius: 1,
      p: 0.5
    }}>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={handleVote}
        startIcon={<ThumbUp />}
        sx={{ 
          minWidth: 'auto',
          px: 1
        }}
      >
        Vote
      </Button>
      <Typography 
        variant="body2" 
        sx={{ 
          fontWeight: 'bold',
          color: 'primary.main',
          minWidth: '40px',
          textAlign: 'center'
        }}
      >
        {question.votes} vote{question.votes !== 1 ? 's' : ''}
      </Typography>
    </Box>
  );
}; 