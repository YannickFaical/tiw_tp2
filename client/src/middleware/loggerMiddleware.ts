import type { PayloadAction } from '@reduxjs/toolkit';
import type { Middleware } from 'redux';

const loggerMiddleware: Middleware = (api) => (next) => (action: unknown) => {
  // Log the previous state
  const act = action as PayloadAction;
  console.group(act.type);
  console.log('Previous State:', api.getState());
  
  // Log the action
  console.log('Action:', action);
  
  // Call next middleware/reducer
  const result = next(action);
  
  // Log the next state
  console.log('Next State:', api.getState());
  console.groupEnd();
  
  // Return the result
  return result;
};

export default loggerMiddleware; 