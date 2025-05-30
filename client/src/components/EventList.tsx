import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../store'
import { setCurrentEvent } from '../slices/appSlice'
import {
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Container,
  TextField,
  Paper
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { addEvent } from '../slices/eventsSlice'
import { useState } from 'react'

export const EventList = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const events = useSelector((state: RootState) => state.events.events)
  const [newEvent, setNewEvent] = useState('')

  const handleEventClick = (eventId: string) => {
    dispatch(setCurrentEvent(eventId))
    navigate(`/event/${eventId}`)
  }

  const handleAddEvent = () => {
    if (newEvent.trim()) {
      const event = {
        id: `e${Date.now()}`,
        title: newEvent,
        description: '',
        questions: [],
        createdAt: new Date().toISOString()
      }
      console.log('Creating new event:', event)
      dispatch(addEvent(event))
      setNewEvent('')
    }
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          Events
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Create New Event
          </Typography>
          <TextField
            fullWidth
            label="Event Title"
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button 
            variant="contained" 
            onClick={handleAddEvent}
            disabled={!newEvent.trim()}
          >
            Create Event
          </Button>
        </Box>
      </Paper>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" component="h2">
          {events.length === 0 ? 'No events yet. Create your first event!' : 'Your Events'}
        </Typography>
      </Box>

      <List>
        {events.map((event) => (
          <Paper 
            key={event.id}
            sx={{ 
              mb: 2,
              '&:hover': {
                boxShadow: 3
              }
            }}
          >
            <ListItemButton 
              onClick={() => handleEventClick(event.id)}
              sx={{ p: 2 }}
            >
              <Box>
                <Typography variant="h6" component="h3">
                  {event.title}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Created on {new Date(event.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.questions?.length || 0} question{event.questions?.length !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              </Box>
            </ListItemButton>
          </Paper>
        ))}
      </List>
    </Container>
  )
}
