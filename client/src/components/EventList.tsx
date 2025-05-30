import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectEvents } from '../slices/eventsSlice'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Container
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'

export const EventList = () => {
  const navigate = useNavigate()
  const events = useSelector(selectEvents)

  const sortedEvents = [...events].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`)
  }

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Événements</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/')}
        >
          Nouvel événement
        </Button>
      </Box>

      {sortedEvents.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Aucun événement pour le moment. Créez-en un nouveau !
        </Typography>
      ) : (
        <List>
          {sortedEvents.map((event) => (
            <ListItem key={event.id} disablePadding>
              <ListItemButton onClick={() => handleEventClick(event.id)}>
                <ListItemText primary={event.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  )
}
