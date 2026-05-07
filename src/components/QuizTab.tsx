import { useState, useRef } from 'react'
import type { VideoData, QuizQuestion } from '../types'
import './QuizTab.css'

// declare let SpeechRecognition: any
// declare let webkitSpeechRecognition: any

interface QuizTabProps {
  videoData: VideoData | null
}

type QuizState   = 'intro' | 'question' | 'results'
type AnswerState = 'unanswered' | 'correct' | 'wrong'

interface QuestionResult {
  questionId: string
  correct: boolean
  userAnswer: string
}

export default function QuizTab({ videoData }: QuizTabProps) {
  const [quizState, setQuizState]     = useState<QuizState>('intro')
  const [currentIdx, setCurrentIdx]   = useState(0)
  const [results, setResults]         = useState<QuestionResult[]>([])
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null)
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered')
  const [typedAnswer, setTypedAnswer] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [feedback, setFeedback]       = useState<{ correct: boolean; explanation: string } | null>(null)
  const recognitionRef = useRef<{ stop: () => void; start: () => void; lang: string; interimResults: boolean; onresult: unknown; onend: unknown; onerror: unknown } | null>(null)

  if (!videoData) {
    return (
      <div className="quiz__locked">
        <div className="quiz__locked-icon">
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        </div>
        <div className="quiz__locked-title">Quiz mode</div>
        <p className="quiz__locked-sub">Distill a video first, then test yourself with multiple choice and spoken answers.</p>
      </div>
    )
  }

  const questions = videoData.quiz
  const currentQ  = questions[currentIdx]
  const score     = results.filter(r => r.correct).length
  const LETTERS   = ['A', 'B', 'C', 'D']

 function toggleMic() {
  if (isRecording) {
    recognitionRef.current?.stop()
    setIsRecording(false)
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  if (!SR) { alert('Speech recognition not supported. Try Chrome.'); return }

  const rec = new SR()
  rec.lang = 'en-US'
  rec.interimResults = false
  rec.onresult = (e: any) => {
    const t = e.results[0][0].transcript
    setTypedAnswer((prev: string) => prev ? `${prev} ${t}` : t)
  }
  rec.onend  = () => setIsRecording(false)
  rec.onerror = () => setIsRecording(false)
  recognitionRef.current = rec
  rec.start()
  setIsRecording(true)
}

  function handleOptionSelect(option: string) {
    if (answerState !== 'unanswered') return
    setSelectedOpt(option)
    const correct = option === currentQ.correctAnswer
    setAnswerState(correct ? 'correct' : 'wrong')
    setFeedback({ correct, explanation: currentQ.explanation })
    setResults(prev => [...prev, { questionId: currentQ.id, correct, userAnswer: option }])
  }

  function handleTypedSubmit() {
    if (!typedAnswer.trim() || answerState !== 'unanswered') return
    const answer   = typedAnswer.toLowerCase()
    const keywords = currentQ.correctAnswer.toLowerCase().split(' ').filter(w => w.length > 4)
    const matches  = keywords.filter(kw => answer.includes(kw)).length
    const correct  = matches >= Math.ceil(keywords.length * 0.35)
    setAnswerState(correct ? 'correct' : 'wrong')
    setFeedback({ correct, explanation: currentQ.explanation })
    setResults(prev => [...prev, { questionId: currentQ.id, correct, userAnswer: typedAnswer }])
  }

  function handleNext() {
    if (currentIdx + 1 >= questions.length) {
      setQuizState('results')
    } else {
      setCurrentIdx(i => i + 1)
      setSelectedOpt(null)
      setAnswerState('unanswered')
      setTypedAnswer('')
      setFeedback(null)
    }
  }

  function handleRestart() {
    setQuizState('intro')
    setCurrentIdx(0)
    setResults([])
    setSelectedOpt(null)
    setAnswerState('unanswered')
    setTypedAnswer('')
    setFeedback(null)
  }

  /* ── Intro ── */
  if (quizState === 'intro') {
    const mcCount    = questions.filter((q: QuizQuestion) => q.type === 'multiple_choice').length
    const typedCount = questions.filter((q: QuizQuestion) => q.type === 'typed').length
    return (
      <div className="quiz">
        <div className="quiz__intro-card">
          <div className="quiz__intro-icon">🎯</div>
          <h2 className="quiz__intro-title">Quiz mode</h2>
          <p className="quiz__intro-sub">
            {questions.length} questions — a mix of multiple choice and open-ended answers.
            Type your answers or speak them using the microphone.
          </p>
          <div className="quiz__intro-meta">
            <div className="quiz__meta-item">
              <span className="quiz__meta-num">{mcCount}</span>
              <span className="quiz__meta-lbl">Multiple choice</span>
            </div>
            <div className="quiz__meta-divider" />
            <div className="quiz__meta-item">
              <span className="quiz__meta-num">{typedCount}</span>
              <span className="quiz__meta-lbl">Written / spoken</span>
            </div>
          </div>
          <button className="quiz__start-btn" onClick={() => setQuizState('question')}>Start quiz →</button>
        </div>
      </div>
    )
  }

  /* ── Results ── */
  if (quizState === 'results') {
    const pct   = Math.round((score / questions.length) * 100)
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚'
    return (
      <div className="quiz">
        <div className="quiz__results-card">
          <div className="quiz__results-emoji">{emoji}</div>
          <div className="quiz__results-score">{score} / {questions.length}</div>
          <div className="quiz__results-label">
            {pct}% correct · {pct >= 80 ? 'Excellent work!' : pct >= 60 ? 'Good effort — review the explanations below.' : 'Keep studying — the flashcards can help.'}
          </div>

          <div className="quiz__breakdown">
            <div className="quiz__bd-item quiz__bd-item--correct">
              <span className="quiz__bd-num">{score}</span>
              <span className="quiz__bd-lbl">Correct</span>
            </div>
            <div className="quiz__bd-item quiz__bd-item--wrong">
              <span className="quiz__bd-num">{questions.length - score}</span>
              <span className="quiz__bd-lbl">Incorrect</span>
            </div>
          </div>

          <div className="quiz__review-list">
            {questions.map((q, i) => {
              const r = results[i]
              return (
                <div key={q.id} className={`quiz__review-item quiz__review-item--${r?.correct ? 'correct' : 'wrong'}`}>
                  <div className="quiz__review-q"><span className="quiz__review-num">Q{i + 1}</span>{q.question}</div>
                  <div className={`quiz__review-answer quiz__review-answer--${r?.correct ? 'correct' : 'wrong'}`}>
                    {r?.correct ? '✓' : '✗'} {r?.userAnswer || '(no answer)'}
                  </div>
                  {!r?.correct && <div className="quiz__review-exp">{q.explanation}</div>}
                </div>
              )
            })}
          </div>

          <div className="quiz__results-btns">
            <button className="quiz__retry-btn" onClick={handleRestart}>Try again</button>
          </div>
        </div>
      </div>
    )
  }

  /* ── Question ── */
  const progressPct = (currentIdx / questions.length) * 100

  return (
    <div className="quiz">
      <div className="quiz__header">
        <div className="quiz__prog-wrap">
          <div className="quiz__prog-labels">
            <span className="quiz__prog-label">Question {currentIdx + 1} of {questions.length}</span>
            <span className="quiz__prog-label">{score} correct</span>
          </div>
          <div className="quiz__prog-track">
            <div className="quiz__prog-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
        <div className="quiz__score-badge">{score}/{questions.length}</div>
      </div>

      <div className="quiz__card" key={currentQ.id}>
        <div className="quiz__q-meta">
          {currentQ.type === 'multiple_choice'
            ? <span className="quiz__type-tag quiz__type-tag--mc">Multiple choice</span>
            : <span className="quiz__type-tag quiz__type-tag--typed">Written answer</span>
          }
        </div>
        <p className="quiz__question">{currentQ.question}</p>

        {/* Multiple choice */}
        {currentQ.type === 'multiple_choice' && currentQ.options && (
          <div className="quiz__mc-options">
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedOpt === opt
              const isCorrect  = answerState !== 'unanswered' && opt === currentQ.correctAnswer
              const isWrong    = isSelected && answerState === 'wrong'
              let cls = 'quiz__mc-opt'
              if (isCorrect) cls += ' quiz__mc-opt--correct'
              else if (isWrong) cls += ' quiz__mc-opt--wrong'
              else if (isSelected) cls += ' quiz__mc-opt--selected'
              let letterCls = 'quiz__opt-letter'
              if (isCorrect) letterCls += ' quiz__opt-letter--correct'
              else if (isWrong) letterCls += ' quiz__opt-letter--wrong'
              else if (isSelected) letterCls += ' quiz__opt-letter--selected'
              return (
                <button key={i} className={cls} onClick={() => handleOptionSelect(opt)} disabled={answerState !== 'unanswered'}>
                  <span className={letterCls}>{LETTERS[i]}</span>
                  {opt}
                </button>
              )
            })}
          </div>
        )}

        {/* Typed answer */}
        {currentQ.type === 'typed' && (
          <div>
            <textarea
              className={`quiz__typed-area${answerState === 'correct' ? ' quiz__typed-area--correct' : answerState === 'wrong' ? ' quiz__typed-area--wrong' : ''}`}
              placeholder="Type your answer here… or use the mic button to speak it."
              value={typedAnswer}
              onChange={e => setTypedAnswer(e.target.value)}
              disabled={answerState !== 'unanswered'}
              rows={4}
            />
            <div className="quiz__typed-actions">
              <div className="quiz__mic-group">
                <button
                  className={`quiz__mic-btn${isRecording ? ' quiz__mic-btn--recording' : ''}`}
                  onClick={toggleMic}
                  disabled={answerState !== 'unanswered'}
                  title={isRecording ? 'Stop recording' : 'Speak your answer'}
                >
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={isRecording ? 'var(--rose)' : 'var(--text-2)'} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                    <path d="M19 10v2a7 7 0 01-14 0v-2" />
                    <line x1={12} y1={19} x2={12} y2={23} />
                    <line x1={8}  y1={23} x2={16} y2={23} />
                  </svg>
                </button>
                <span className="quiz__mic-label">{isRecording ? 'Listening…' : 'Speak answer'}</span>
              </div>
              <button
                className="quiz__submit-btn"
                onClick={handleTypedSubmit}
                disabled={!typedAnswer.trim() || answerState !== 'unanswered'}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className={`quiz__feedback quiz__feedback--${feedback.correct ? 'correct' : 'wrong'}`}>
            <div className="quiz__feedback-title">{feedback.correct ? '✓ Correct!' : '✗ Not quite'}</div>
            <div className="quiz__feedback-exp">{feedback.explanation}</div>
          </div>
        )}
      </div>

      {answerState !== 'unanswered' && (
        <div className="quiz__next-row">
          <button className="quiz__next-btn" onClick={handleNext}>
            {currentIdx + 1 >= questions.length ? 'See results →' : 'Next question →'}
          </button>
        </div>
      )}
    </div>
  )
}