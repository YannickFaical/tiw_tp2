import { useDispatch } from 'react-redux';
import { IconButton, Typography, Box } from '@mui/material';
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
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton 
        onClick={handleVote}
        color="primary"
        size="small"
      >
        <ThumbUp />
      </IconButton>
      <Typography variant="body2" color="text.secondary">
        {question.votes} vote{question.votes !== 1 ? 's' : ''}
      </Typography>
    </Box>
  );
}; 