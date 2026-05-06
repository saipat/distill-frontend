import { useState } from 'react'
import type { Tab, VideoData } from './types'
import TopBar from './components/TopBar'
import SummaryTab from './components/SummaryTab'
import KeyMomentsTab from './components/KeyMomentsTab'
import FlashcardsTab from './components/FlashcardsTab'
import QuizTab from './components/QuizTab'
import './App.css'


export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('summary')
  const [videoData, setVideoData] = useState<VideoData | null>(null)

  function handleDataLoaded(data: VideoData) {
    setVideoData(data)
  }

  function handleNewVideo() {
    setVideoData(null)
    setActiveTab('summary')
  }

  return (
    <div className="app">
      <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasData={videoData !== null}
        onNewVideo={handleNewVideo}
      />
      <div className="app-content">
        {activeTab === 'summary'    && <SummaryTab    videoData={videoData} onDataLoaded={handleDataLoaded} onTabChange={setActiveTab} />}
        {activeTab === 'moments'    && <KeyMomentsTab videoData={videoData} />}
        {activeTab === 'flashcards' && <FlashcardsTab videoData={videoData} />}
        {activeTab === 'quiz'       && <QuizTab       videoData={videoData} />}
      </div>
    </div>
  )
}