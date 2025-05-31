import type { Middleware, MiddlewareAPI, Dispatch, UnknownAction } from 'redux';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { addEvent, addQuestion, upvoteQuestion } from '../slices/eventsSlice';
import { setCurrentEvent, setCurrentQuestion } from '../slices/appSlice';

const SOCKET_SERVER_URL = 'http://localhost:3000';

interface Action extends UnknownAction {
  type: string;
  payload: any;
  meta?: {
    socket?: {
      id: string;
    };
  };
}

type AppMiddleware = Middleware<Dispatch<UnknownAction>, any>;

const socketMiddleware: AppMiddleware = (store: MiddlewareAPI) => {
  let socket: Socket | null = null;
  const processingActions = new Set<string>();

  const connect = () => {
    socket = io(SOCKET_SERVER_URL);

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    socket.on('action', (action: Action) => {
      const actionKey = `${action.type}-${JSON.stringify(action.payload)}`;
      if (!processingActions.has(actionKey)) {
        processingActions.add(actionKey);
        store.dispatch(action);
        setTimeout(() => {
          processingActions.delete(actionKey);
        }, 100);
      }
    });
  };

  connect();

  return (next: Dispatch<UnknownAction>) => (action: Action) => {
    if (!socket) return next(action);

    const actionKey = `${action.type}-${JSON.stringify(action.payload)}`;
    if (processingActions.has(actionKey)) {
      return next(action);
    }

    const result = next(action);

    if (action.type === addEvent.type || 
        action.type === addQuestion.type || 
        action.type === upvoteQuestion.type ||
        action.type === setCurrentEvent.type ||
        action.type === setCurrentQuestion.type) {
      socket.emit('action', action);
    }

    return result;
  };
};

export default socketMiddleware; 