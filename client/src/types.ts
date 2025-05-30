export interface Question {
  id: string
  text: string
  votes: number
  answers: Answer[]
}

export interface Event {
  id: string
  title: string
  description: string
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

export interface Answer {
  id: string
  text: string
  createdAt: string
  author: string
}