import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { DeviceRouter } from './components/DeviceRouter'
import AppRoutes from './routes'
import { AppToolbar } from './components/AppToolbar'
import { CssBaseline, Container } from '@mui/material'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <DeviceRouter>
          <CssBaseline />
          <AppToolbar />
          <Container maxWidth="lg" sx={{ mt: 4 }}>
            <AppRoutes />
          </Container>
        </DeviceRouter>
      </BrowserRouter>
    </Provider>
  )
}

export default App