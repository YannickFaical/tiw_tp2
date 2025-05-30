import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App'
import './index.css'

// Déclaration globale pour exposer le store dans la console (utile en dev)
declare global {
  interface Window {
    mystore: typeof store
  }
}

// Expose le store pour les tests/debug en développement
window.mystore = store

const rootElement = document.getElementById('root')

// Vérifie la présence de l'élément root
if (!rootElement) throw new Error('Élément #root introuvable dans le DOM.')

const root = ReactDOM.createRoot(rootElement)

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
