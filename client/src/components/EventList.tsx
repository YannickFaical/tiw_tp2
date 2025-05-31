import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { addEvent, selectEvents } from '../slices/eventsSlice';
import { setCurrentEvent, setIsMobile } from '../slices/appSlice';
import GestureCanvas from './GestureCanvas';

const EventList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const events = useSelector(selectEvents);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');

  useEffect(() => {
    dispatch(setIsMobile(isMobile));
  }, [isMobile, dispatch]);

  const handleCreateEvent = () => {
    if (newEventTitle.trim()) {
      const event = {
        id: Date.now().toString(),
        title: newEventTitle,
        description: newEventDescription,
        questions: []
      };
      dispatch(addEvent(event));
      setNewEventTitle('');
      setNewEventDescription('');
    }
  };

  const handleEventClick = (eventId: string) => {
    dispatch(setCurrentEvent(eventId));
    navigate(`/event/${eventId}`);
  };

  const handleNavigation = (direction: 'next' | 'previous') => {
    const currentIndex = events.findIndex(e => e.id === events[0]?.id);
    if (currentIndex === -1) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % events.length;
    } else {
      newIndex = (currentIndex - 1 + events.length) % events.length;
    }

    const nextEventId = events[newIndex]?.id;
    if (nextEventId) {
      dispatch(setCurrentEvent(nextEventId));
      navigate(`/event/${nextEventId}`);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Events
      </Typography>

      {isMobile && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Draw a gesture to navigate:
          </Typography>
          <GestureCanvas />
        </Box>
      )}

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Event Title"
          value={newEventTitle}
          onChange={(e) => setNewEventTitle(e.target.value)}
          sx={{ mb: 1 }}
        />
        <TextField
          fullWidth
          label="Event Description"
          value={newEventDescription}
          onChange={(e) => setNewEventDescription(e.target.value)}
          multiline
          rows={2}
          sx={{ mb: 1 }}
        />
        <Button
          variant="contained"
          onClick={handleCreateEvent}
          disabled={!newEventTitle.trim()}
        >
          Create Event
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {events.map((event) => (
          <Card
            key={event.id}
            onClick={() => handleEventClick(event.id)}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                boxShadow: 6
              }
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {event.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {event.description || 'No description'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {event.questions.length} questions
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default EventList; 