// ── API response types (match your FastAPI backend exactly) ──────────────────

export interface Summary {
  tldr: string
  key_concepts: string[]
  conclusion: string
}

export interface KeyMoment {
  timestamp: string      // "4:15"
  seconds: number        // 255  — used to build the YouTube deep-link
  title: string
  description: string
}

export interface Flashcard {
  id: string
  question: string
  answer: string
}

export interface QuizQuestion {
  id: string
  type: 'multiple_choice' | 'typed'
  question: string
  options?: string[]          // only for multiple_choice
  correctAnswer: string       // correct option text or model answer for typed
  explanation: string
}

// ── App-level state ──────────────────────────────────────────────────────────

export type Tab = 'summary' | 'moments' | 'flashcards' | 'quiz'

export type LoadingStep =
  | 'idle'
  | 'fetching'
  | 'chunking'
  | 'summarizing'
  | 'done'

export interface VideoData {
  url: string
  videoId: string
  title: string
  duration: string
  summary: Summary
  moments: KeyMoment[]
  flashcards: Flashcard[]
  quiz: QuizQuestion[]
}