import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import App from './App';
import { QnaProvider } from './context/QnaContext';
import './index.css';

const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter future={router.future}>
        <QnaProvider>
          <App />
        </QnaProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
); 