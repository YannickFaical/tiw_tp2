export type Question ={
  id: string
  content: string
  votes: number
  author?: string
  color?: string
}

export interface Event {
  id: string
  title: string
  questions: Question[]
}

export interface AppState {
  currentEventId: string | null
  events: Event[]
  currentQuestionId?: string | null
}