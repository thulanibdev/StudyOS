'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const Tasks = dynamic(() => import('@/components/tasks/Tasks'), { ssr: false })
const Flashcards = dynamic(() => import('@/components/flashcards/Flashcards'), { ssr: false })
const Timer = dynamic(() => import('@/components/timer/Timer'), { ssr: false })
const Notes = dynamic(() => import('@/components/notes/Notes'), { ssr: false })

const TABS = [
  { id: 'tasks', label: 'Tasks', icon: '📋', desc: 'Assignments & deadlines' },
  { id: 'flashcards', label: 'Flashcards', icon: '🃏', desc: 'Study & memorize' },
  { id: 'timer', label: 'Focus Timer', icon: '⏱', desc: 'Pomodoro sessions' },
  { id: 'notes', label: 'Notes', icon: '📝', desc: 'Quick notes by subject' },
]

function Greeting() {
  const [time, setTime] = useState('')
  const [greeting, setGreeting] = useState('')
  const [stats, setStats] = useState({ tasks: 0, sessions: 0, notes: 0, decks: 0 })

  useEffect(() => {
    const update = () => {
      const h = new Date().getHours()
      setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening')
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }
    update()
    const iv = setInterval(update, 1000)

    // Load stats
    try {
      const tasks = JSON.parse(localStorage.getItem('studyos-tasks') || '[]')
      const sessions = JSON.parse(localStorage.getItem('studyos-sessions') || '[]')
      const notes = JSON.parse(localStorage.getItem('studyos-notes') || '[]')
      const decks = JSON.parse(localStorage.getItem('studyos-flashcards') || '[]')
      const todaySessions = sessions.filter(s => new Date(s.date).toDateString() === new Date().toDateString())
      setStats({
        tasks: tasks.filter(t => !t.done).length,
        sessions: todaySessions.length,
        notes: notes.length,
        decks: decks.length,
      })
    } catch {}

    return () => clearInterval(iv)
  }, [])

  return (
    <div className="mb-8 animate-fadeUp">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-ink-light font-body text-sm mb-1">{greeting} 👋</p>
          <h1 className="font-display text-4xl md:text-5xl text-ink leading-tight">
            Ready to <span className="italic text-teal">study?</span>
          </h1>
        </div>
        <div className="font-display text-3xl text-ink-light">{time}</div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {[
          { label: 'Pending Tasks', value: stats.tasks, icon: '📋', color: 'border-amber/30 bg-amber-pale' },
          { label: 'Focus Sessions Today', value: stats.sessions, icon: '⏱', color: 'border-teal/30 bg-teal-pale' },
          { label: 'Notes Saved', value: stats.notes, icon: '📝', color: 'border-sky/30 bg-sky-pale' },
          { label: 'Flashcard Decks', value: stats.decks, icon: '🃏', color: 'border-rose/20 bg-rose-pale' },
        ].map((s, i) => (
          <div key={s.label} className={`rounded-2xl border p-4 animate-fadeUp ${s.color}`} style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both', opacity: 0 }}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="font-display text-2xl font-bold text-ink">{s.value}</div>
            <div className="text-xs font-body text-ink-light mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('tasks')

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal rounded-lg flex items-center justify-center text-white font-display font-bold text-sm">S</div>
            <span className="font-display text-xl text-ink">StudyOS</span>
          </div>
          <p className="text-xs font-body text-ink-light bg-white border border-border px-3 py-1.5 rounded-full">
            All data saved locally 🔒
          </p>
        </div>

        <Greeting />

        {/* Tab nav */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                activeTab === tab.id
                  ? 'bg-ink border-ink text-white shadow-lg'
                  : 'bg-white border-border text-ink hover:border-teal'
              }`}
            >
              <div className="text-2xl mb-2">{tab.icon}</div>
              <div className={`font-body font-semibold text-sm ${activeTab === tab.id ? 'text-white' : 'text-ink'}`}>{tab.label}</div>
              <div className={`text-xs font-body mt-0.5 ${activeTab === tab.id ? 'text-white/60' : 'text-ink-light'}`}>{tab.desc}</div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-cream">
          {activeTab === 'tasks' && <Tasks />}
          {activeTab === 'flashcards' && <Flashcards />}
          {activeTab === 'timer' && <Timer />}
          {activeTab === 'notes' && <Notes />}
        </div>
      </div>

      <footer className="text-center py-8 text-xs text-ink-light font-body border-t border-border mt-12">
        StudyOS — Built for students 📚
      </footer>
    </div>
  )
}
