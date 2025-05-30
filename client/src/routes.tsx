import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from './store'
import { EventList } from './components/EventList'
import { QuestionList } from './components/QuestionList'
import { QuestionDetail } from './components/QuestionDetail'
import { MobileQuestionView } from './components/MobileQuestionView'

const AppRoutes = () => {
  const { currentEventId, currentQuestionId, isMobile } = useSelector(
    (state: RootState) => state.app
  )

  if (isMobile) {
    return (
      <Routes>
        <Route path="/mobile" element={<MobileQuestionView />} />
        <Route path="/mobile/question/:questionId" element={<MobileQuestionView />} />
        <Route path="*" element={<Navigate to="/mobile" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<EventList />} />
      <Route path="/event/:eventId" element={<QuestionList />} />
      <Route path="/event/:eventId/question/:questionId" element={<QuestionDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
