export interface Question {
  id: string
  content: string
  votes: number
}

export interface Event {
  id: string
  title: string
  questions: Question[]
} 