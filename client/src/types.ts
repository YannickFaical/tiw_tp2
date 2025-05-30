export interface Question {
  id: string
  title: string
  content: string
  votes: number
  createdAt: string
}

export interface Event {
  id: string
  title: string
  description?: string
  createdAt: string
  questions: Question[]
}

export interface AppState {
  currentEventId: string | null
  currentQuestionId: string | null
  isMobile: boolean
}

export interface EventsState {
  events: Event[]
} 