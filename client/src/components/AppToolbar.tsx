import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addEvent } from '../slices/eventsSlice'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'

interface NewEvent {
  id: string
  title: string
  description: string
  questions: []
  createdAt: string
}

export function AppToolbar() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
    setTitle('')
    setDescription('')
  }

  const handleAddEvent = () => {
    const newEvent: NewEvent = {
      id: `e${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      questions: [],
      createdAt: new Date().toISOString()
    }

    if (!newEvent.title) {
      return // ou afficher une alerte
    }

    console.log('Creating new event:', newEvent)
    dispatch(addEvent(newEvent))
    handleClose()
    navigate(`/events/${newEvent.id}`)
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Q&A Events
        </Typography>
        <Button
          color="inherit"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Nouvel événement
        </Button>
      </Toolbar>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Créer un nouvel événement</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Titre"
            type="text"
            fullWidth
            autoComplete="off"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            autoComplete="off"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button
            onClick={handleAddEvent}
            disabled={!title.trim()}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  )
}
