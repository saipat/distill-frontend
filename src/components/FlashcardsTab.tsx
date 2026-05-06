import { useState } from 'react'
import type { VideoData } from '../types'
import './FlashcardsTab.css'

interface FlashcardsTabProps {
  videoData: VideoData | null
}

export default function FlashcardsTab({ videoData }: FlashcardsTabProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped]           = useState(false)
  const [mastered, setMastered]         = useState<Set<string>>(new Set())

  if (!videoData) {
    return (
      <div className="flashcards__locked">
        <div className="flashcards__locked-icon">
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <rect x={2} y={3} width={20} height={14} rx={2} /><line x1={8} y1={21} x2={16} y2={21} /><line x1={12} y1={17} x2={12} y2={21} />
          </svg>
        </div>
        <div className="flashcards__locked-title">Flashcards</div>
        <p className="flashcards__locked-sub">Distill a video first to generate interactive flashcards.</p>
      </div>
    )
  }

  const cards    = videoData.flashcards
  const card     = cards[currentIndex]
  const total    = cards.length
  const progress = Math.round((mastered.size / total) * 100)
  const allDone  = mastered.size === total

  function next() {
    setFlipped(false)
    setTimeout(() => setCurrentIndex(i => Math.min(i + 1, total - 1)), 150)
  }
  function prev() {
    setFlipped(false)
    setTimeout(() => setCurrentIndex(i => Math.max(i - 1, 0)), 150)
  }
  function markGood() {
    setMastered(s => new Set(s).add(card.id))
    if (currentIndex < total - 1) next()
  }
  function markAgain() {
    setMastered(s => { const ns = new Set(s); ns.delete(card.id); return ns })
    if (currentIndex < total - 1) next()
  }

  return (
    <div className="flashcards">
      <div className="flashcards__header">
        <h2 className="flashcards__heading">Flashcards</h2>
        <p className="flashcards__sub">Tap a card to reveal the answer. Mark each one to track your progress.</p>
      </div>

      <div className="flashcards__controls">
        <span className="flashcards__counter">{currentIndex + 1} / {total}</span>
        <div className="flashcards__prog-track">
          <div className="flashcards__prog-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="flashcards__mastered-label">{mastered.size} mastered</span>
      </div>

      {!allDone ? (
        <>
          <div
            className={`flashcards__card-outer${flipped ? " flashcards__card-outer--flipped" : ""}`}
            onClick={() => setFlipped(f => !f)}
          >
            <div className="flashcards__card-inner">
              <div className="flashcards__face flashcards__face--front">
                <span className="flashcards__face-tag flashcards__face-tag--question">Question</span>
                <p className="flashcards__question">{card.question}</p>
                <p className="flashcards__tap-hint">Tap to reveal answer</p>
              </div>
              <div className="flashcards__face flashcards__face--back">
                <span className="flashcards__face-tag flashcards__face-tag--answer">Answer</span>
                <p className="flashcards__answer">{card.answer}</p>
              </div>
            </div>
          </div>

          {flipped && (
            <div className="flashcards__actions">
              <button className="flashcards__again-btn" onClick={markAgain}>Study again</button>
              <button className="flashcards__good-btn" onClick={markGood}>Got it ✓</button>
            </div>
          )}

          <div className="flashcards__nav-row">
            <button className="flashcards__nav-btn" onClick={prev} disabled={currentIndex === 0}>← Prev</button>
            <button className="flashcards__nav-btn" onClick={next} disabled={currentIndex === total - 1}>Next →</button>
          </div>
        </>
      ) : (
        <div className="flashcards__all-done">
          <div className="flashcards__done-emoji">🎉</div>
          <h3 className="flashcards__done-title">All {total} cards mastered!</h3>
          <p className="flashcards__done-sub">Great work. Ready to test yourself?</p>
          <button className="flashcards__quiz-cta" onClick={() => { setMastered(new Set()); setCurrentIndex(0); setFlipped(false) }}>
            Review again
          </button>
        </div>
      )}
    </div>
  )
}
