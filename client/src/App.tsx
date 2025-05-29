import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QnaProvider } from './context/QnaContext'
import { AppToolbar } from './components/AppToolbar'
import { EventPanel } from './components/EventPanel'
import { MobileView } from './components/MobileView'

const App = () => {
  return (
    <QnaProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <AppToolbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<EventPanel />} />
              <Route path="/admin/event/:eventId" element={<EventPanel />} />
              <Route path="/event/:eventId/question/:questionId" element={<MobileView />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QnaProvider>
  )
}

export default App