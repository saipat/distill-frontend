import { useState } from 'react'
import type { VideoData, LoadingStep, Tab } from '../types/index'
import './SummaryTab.css'

interface SummaryTabProps {
  videoData: VideoData | null
  onDataLoaded: (data: VideoData) => void
  onTabChange: (tab: Tab) => void
}

const STEPS: { key: LoadingStep; label: string }[] = [
  { key: 'fetching',     label: 'Fetching transcript from YouTube' },
  { key: 'chunking',    label: 'Chunking into 800-word segments' },
  { key: 'summarizing', label: 'Generating summary with Claude' },
  { key: 'done',        label: 'Preparing your results' },
]
const STEP_ORDER: LoadingStep[] = ['fetching', 'chunking', 'summarizing', 'done']
const DOT_CLASSES = ['--sage', '--amber', '--rose', '--blue', '--sage']

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)) }

export default function SummaryTab({ videoData, onDataLoaded, onTabChange }: SummaryTabProps) {
  const [url, setUrl]                 = useState('')
  const [loadingStep, setLoadingStep] = useState<LoadingStep>('idle')
  const [error, setError]             = useState<string | null>(null)

  const isLoading = loadingStep !== 'idle' && loadingStep !== 'done'

  function getStepState(step: LoadingStep): 'idle' | 'active' | 'done' {
    const current = STEP_ORDER.indexOf(loadingStep)
    const target  = STEP_ORDER.indexOf(step)
    if (current < 0 || target < 0) return 'idle'
    if (target < current) return 'done'
    if (target === current) return 'active'
    return 'idle'
  }

  function getProgressPercent(): number {
    const idx = STEP_ORDER.indexOf(loadingStep)
    return idx < 0 ? 0 : ((idx + 1) / STEP_ORDER.length) * 100
  }

  async function handleSubmit() {
    if (!url.trim()) return
    setError(null)

    // Animate through steps while API call runs in background
    setLoadingStep('fetching')
    await delay(800)
    setLoadingStep('chunking')
    await delay(700)
    setLoadingStep('summarizing')

    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/distill`, {git add .
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Something went wrong')
      }

      const json = await res.json()
      setLoadingStep('done')
      await delay(400)
      onDataLoaded(json.data)

    } catch (e: unknown) {
      setLoadingStep('idle')
      setError(e instanceof Error ? e.message : 'Failed to reach the backend. Is it running?')
    }
  }

  function handleReset() {
    setUrl('')
    setLoadingStep('idle')
    setError(null)
  }

  return (
    <div className="summary">

      {/* Hero */}
      {!videoData && loadingStep === 'idle' && (
        <div className="summary__hero">
          <p className="summary__hero-label">Distill — Video Learning</p>
          <h1 className="summary__hero-h1">Turn any video into<br />an active study session.</h1>
          <p className="summary__hero-sub">
            Paste a YouTube URL and get a summary, timestamped moments, flashcards, and a quiz — powered by AI.
          </p>
        </div>
      )}

      {/* URL input */}
      {!videoData && (
        <>
          <div className="summary__input-wrap">
            <input
              className="summary__url-field"
              type="text"
              placeholder="Paste a YouTube URL…"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !isLoading && handleSubmit()}
              disabled={isLoading}
            />
            <button
              className="summary__enter-btn"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Working…' : 'Enter'}
            </button>
          </div>
          <p className="summary__url-hint">Works with lectures, tutorials, documentaries, and talks.</p>
          {error && <p className="summary__error">{error}</p>}
        </>
      )}

      {/* Loading steps */}
      {loadingStep !== 'idle' && !videoData && (
        <div className="summary__loading">
          <div className="summary__prog-track">
            <div className="summary__prog-bar" style={{ width: `${getProgressPercent()}%` }} />
          </div>
          <div className="summary__steps">
            {STEPS.map(({ key, label }) => {
              const state = getStepState(key)
              return (
                <div key={key} className={`summary__step summary__step--${state}`}>
                  <div className="summary__step-icon">
                    {state === 'done'
                      ? <svg width={9} height={9} viewBox="0 0 12 10" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="1 5 4 8 11 1" /></svg>
                      : <div className="summary__step-dot" />
                    }
                  </div>
                  {label}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Result */}
      {videoData && (
        <div className="summary__result">

          <div className="summary__res-meta">
            <div>
              <div className="summary__res-title">{videoData.title}</div>
              <div className="summary__res-sub">
                {videoData.duration && `${videoData.duration} · `}
                {videoData.summary.key_concepts.length} concepts extracted
              </div>
            </div>
            <span className="summary__ready-tag">✓ Ready</span>
          </div>

          {/* Distill nav strip */}
          <div className="summary__distill-head">
            <div className="summary__distill-label">Distill</div>
            <div className="summary__strip">
              <button className="summary__strip-btn" onClick={() => onTabChange('moments')}>
                <ClockIcon /> Key moments
              </button>
              <button className="summary__strip-btn" onClick={() => onTabChange('flashcards')}>
                <CardsIcon /> Flashcards
              </button>
              <button className="summary__strip-btn summary__strip-btn--primary" onClick={() => onTabChange('quiz')}>
                <QuizIcon primary /> Start quiz
              </button>
            </div>
          </div>

          {/* TL;DR */}
          <div className="summary__section">
            <div className="summary__sec-label">TL;DR</div>
            <div className="summary__tldr-card">
              <p className="summary__tldr-text">{videoData.summary.tldr}</p>
            </div>
          </div>

          {/* Key concepts */}
          <div className="summary__section">
            <div className="summary__sec-label">Key concepts</div>
            <div className="summary__concept-stack">
              {videoData.summary.key_concepts.map((concept, i) => (
                <div key={i} className="summary__concept-row">
                  <span className="summary__c-num">0{i + 1}</span>
                  <div className={`summary__c-dot summary__c-dot${DOT_CLASSES[i % DOT_CLASSES.length]}`} />
                  {concept}
                </div>
              ))}
            </div>
          </div>

          {/* Conclusion */}
          <div className="summary__section">
            <div className="summary__sec-label">Conclusion</div>
            <div className="summary__conc-card">
              <p className="summary__conc-text">{videoData.summary.conclusion}</p>
            </div>
          </div>

          <button className="summary__reset-btn" onClick={handleReset}>← Try another video</button>
        </div>
      )}
    </div>
  )
}

function ClockIcon() {
  return <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><circle cx={12} cy={12} r={10} /><polyline points="12 6 12 12 16 14" /></svg>
}
function CardsIcon() {
  return <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><rect x={2} y={3} width={20} height={14} rx={2} /><line x1={8} y1={21} x2={16} y2={21} /><line x1={12} y1={17} x2={12} y2={21} /></svg>
}
function QuizIcon({ primary }: { primary?: boolean }) {
  return <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke={primary ? '#fff' : 'currentColor'} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
}