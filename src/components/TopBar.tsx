import React from 'react'
import type { Tab } from '../types'
import './TopBar.css'

interface TopBarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  hasData: boolean
  onNewVideo: () => void
}

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'summary',
    label: 'Summary',
    icon: (
      <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'moments',
    label: 'Key moments',
    icon: (
      <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <circle cx={12} cy={12} r={10} />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: 'flashcards',
    label: 'Flashcards',
    icon: (
      <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <rect x={2} y={3} width={20} height={14} rx={2} />
        <line x1={8} y1={21} x2={16} y2={21} />
        <line x1={12} y1={17} x2={12} y2={21} />
      </svg>
    ),
  },
  {
    id: 'quiz',
    label: 'Quiz',
    icon: (
      <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
]

export default function TopBar({ activeTab, onTabChange, hasData, onNewVideo }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="topbar__wordmark">
        <b>dis</b>till
      </div>
      <nav className="topbar__nav">
        {tabs.map((tab) => {
          const locked = !hasData && tab.id !== 'summary'
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`topbar__nav-btn${activeTab === tab.id ? ' topbar__nav-btn--active' : ''}`}
              disabled={locked}
              title={locked ? 'Distill a video first' : undefined}
            >
              {tab.icon}
              {tab.label}
            </button>
          )
        })}
      </nav>
      <button className="topbar__new-btn" onClick={onNewVideo}>
        New video
      </button>
    </header>
  )
}