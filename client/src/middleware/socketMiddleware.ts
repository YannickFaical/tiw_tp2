import type { Middleware, MiddlewareAPI, Dispatch, UnknownAction } from '@reduxjs/toolkit';
import { Socket, io } from 'socket.io-client';
import { addEvent, updateEvent, deleteEvent, addQuestion, updateQuestion, deleteQuestion, upvoteQuestion, addAnswer } from '../slices/eventsSlice';
import { setCurrentEvent, setCurrentQuestion } from '../slices/appSlice';
import type { Event } from '../types';

const socket: Socket = io('http://localhost:3000', {
  withCredentials: true
});

const actionsToPropagate = [
  'events/addEvent',
  'events/updateEvent',
  'events/deleteEvent',
  'events/addQuestion',
  'events/updateQuestion',
  'events/deleteQuestion',
  'events/upvoteQuestion',
  'app/setCurrentEvent',
  'app/setCurrentQuestion',
  'events/addAnswer'
] as const;

// Set pour suivre les actions en cours de traitement
const processingActions = new Set<string>();

export const socketMiddleware: Middleware = (store: MiddlewareAPI<Dispatch<UnknownAction>, any>) => {
  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

  socket.on('state', (state: { events: Event[] }) => {
    console.log('Received initial state:', state);
    // Mettre à jour le store avec l'état initial
    if (state.events) {
      state.events.forEach((event) => {
        store.dispatch(addEvent(event));
      });
    }
  });

  socket.on('action', (action: { type: string; payload: unknown; source?: string }) => {
    console.log('Received action from server:', action);
    
    // Ne pas dispatcher l'action si elle vient de nous-mêmes
    if (action.source === socket.id) {
      console.log('Ignoring action from self');
      return;
    }

    // Créer une clé unique pour cette action
    const actionKey = `${action.type}-${JSON.stringify(action.payload)}`;
    
    // Vérifier si l'action est déjà en cours de traitement
    if (processingActions.has(actionKey)) {
      console.log('Ignoring duplicate action:', actionKey);
      return;
    }

    // Marquer l'action comme en cours de traitement
    processingActions.add(actionKey);

    // Dispatch l'action
    store.dispatch(action);

    // Nettoyer après un court délai
    setTimeout(() => {
      processingActions.delete(actionKey);
    }, 1000);
  });

  return (next) => (action: UnknownAction) => {
    // Vérifier si l'action a le bon format
    if (typeof action === 'object' && action !== null && 'type' in action && 'payload' in action) {
      // Créer une clé unique pour cette action
      const actionKey = `${action.type}-${JSON.stringify(action.payload)}`;
      
      // Vérifier si l'action est déjà en cours de traitement
      if (processingActions.has(actionKey)) {
        console.log('Ignoring duplicate action:', actionKey);
        return next(action);
      }

      // Marquer l'action comme en cours de traitement
      processingActions.add(actionKey);

      // Exécuter l'action localement
      const result = next(action);

      // Propager l'action au serveur seulement si c'est une action à propager
      if (actionsToPropagate.includes(action.type as typeof actionsToPropagate[number])) {
        console.log('Propagating action to server:', action);
        socket.emit('action', {
          type: action.type,
          payload: action.payload
        });
      }

      // Nettoyer après un court délai
      setTimeout(() => {
        processingActions.delete(actionKey);
      }, 1000);

      return result;
    }

    // Si l'action n'a pas le bon format, la passer au middleware suivant
    return next(action);
  };
}; 