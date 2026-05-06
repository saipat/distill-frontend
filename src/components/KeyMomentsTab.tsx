import type { VideoData } from '../types'
import './KeyMomentsTab.css'

interface KeymomentsTabProps {
  videoData: VideoData | null
}

export default function KeyMomentsTab({ videoData }: KeymomentsTabProps) {
  if (!videoData) {
    return (
      <div className="moments__locked">
        <div className="moments__locked-icon">
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <circle cx={12} cy={12} r={10} /><polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div className="moments__locked-title">Key moments</div>
        <p className="moments__locked-sub">Distill a video first to see timestamped key moments with direct YouTube links.</p>
      </div>
    )
  }

  function buildLink(videoId: string, seconds: number) {
    return `https://www.youtube.com/watch?v=${videoId}&t=${seconds}s`
  }

  return (
    <div className="moments">
      <div className="moments__header">
        <h2 className="moments__heading">Key moments</h2>
        <p className="moments__sub">
          The {videoData.moments.length} most important points — click any timestamp to jump directly there on YouTube.
        </p>
      </div>

      <div className="moments__list">
        {videoData.moments.map((moment, i) => (
          <a
            key={i}
            href={buildLink(videoData.videoId, moment.seconds)}
            target="_blank"
            rel="noopener noreferrer"
            className="moments__row"
          >
            <div className="moments__ts-badge">{moment.timestamp}</div>
            <div className="moments__body">
              <div className="moments__title">{moment.title}</div>
              <div className="moments__desc">{moment.description}</div>
              <div className="moments__link">
                <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1={10} y1={14} x2={21} y2={3} />
                </svg>
                Jump to this moment on YouTube
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}