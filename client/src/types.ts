export interface Event {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  votes: number;
  answers: Answer[];
}

export interface Answer {
  id: string;
  text: string;
  createdAt: string;
  author: string;
}

export interface RootState {
  events: {
    events: Event[];
    currentEventId: string | null;
    currentQuestionId: string | null;
  };
  app: {
    currentEventId: string | null;
    currentQuestionId: string | null;
    isMobile: boolean;
  };
} 