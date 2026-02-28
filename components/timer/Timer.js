'use client'
import { useState, useEffect, useRef } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

const MODES = [
  { label: 'Focus', minutes: 25, color: 'text-teal', bg: 'bg-teal', pale: 'bg-teal-pale', ring: 'ring-teal' },
  { label: 'Short Break', minutes: 5, color: 'text-sky', bg: 'bg-sky', pale: 'bg-sky-pale', ring: 'ring-sky' },
  { label: 'Long Break', minutes: 15, color: 'text-amber', bg: 'bg-amber', pale: 'bg-amber-pale', ring: 'ring-amber' },
]

export default function Timer() {
  const [modeIndex, setModeIndex] = useState(0)
  const [seconds, setSeconds] = useState(MODES[0].minutes * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useLocalStorage('studyos-sessions', [])
  const [task, setTask] = useState('')
  const intervalRef = useRef(null)
  const mode = MODES[modeIndex]
  const total = mode.minutes * 60
  const progress = ((total - seconds) / total) * 100

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            if (modeIndex === 0) {
              setSessions(prev => [...prev, { id: Date.now(), task: task || 'Focus session', duration: mode.minutes, date: new Date().toISOString() }])
            }
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, modeIndex])

  const switchMode = (i) => {
    setRunning(false)
    setModeIndex(i)
    setSeconds(MODES[i].minutes * 60)
  }

  const reset = () => {
    setRunning(false)
    setSeconds(mode.minutes * 60)
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  const todaySessions = sessions.filter(s => new Date(s.date).toDateString() === new Date().toDateString())
  const todayMinutes = todaySessions.reduce((a, s) => a + s.duration, 0)

  // SVG circle progress
  const r = 80
  const circumference = 2 * Math.PI * r
  const strokeDash = circumference - (progress / 100) * circumference

  return (
    <div className="animate-fadeUp max-w-lg mx-auto">
      {/* Mode tabs */}
      <div className="flex gap-2 mb-8 bg-white border border-border rounded-2xl p-1.5">
        {MODES.map((m, i) => (
          <button
            key={m.label}
            onClick={() => switchMode(i)}
            className={`flex-1 py-2 rounded-xl text-sm font-body font-medium transition-all ${
              modeIndex === i ? `${m.bg} text-white` : 'text-ink-light hover:text-ink'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Task input */}
      <input
        type="text"
        placeholder="What are you working on? (optional)"
        value={task}
        onChange={e => setTask(e.target.value)}
        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-body text-ink bg-white mb-8"
      />

      {/* Timer circle */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <svg width="220" height="220" className="-rotate-90">
            <circle cx="110" cy="110" r={r} fill="none" stroke="#e8e4dc" strokeWidth="8" />
            <circle
              cx="110" cy="110" r={r} fill="none"
              stroke={modeIndex === 0 ? '#0d9488' : modeIndex === 1 ? '#0284c7' : '#d97706'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDash}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`font-display text-5xl font-bold ${mode.color}`}>{mm}:{ss}</div>
            <div className="text-ink-light text-sm font-body mt-1">{mode.label}</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3 mb-10">
        <button onClick={reset} className="w-12 h-12 rounded-full border border-border text-ink-light hover:border-ink hover:text-ink transition-colors text-lg">↺</button>
        <button
          onClick={() => setRunning(r => !r)}
          className={`w-24 h-12 rounded-full font-body font-semibold text-sm text-white transition-all ${mode.bg} hover:opacity-90`}
        >
          {running ? 'Pause' : seconds === total ? 'Start' : 'Resume'}
        </button>
        <button onClick={() => switchMode((modeIndex + 1) % MODES.length)} className="w-12 h-12 rounded-full border border-border text-ink-light hover:border-ink hover:text-ink transition-colors text-lg">→</button>
      </div>

      {/* Today's stats */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg text-ink">Today's Progress</h3>
          <span className={`text-sm font-body font-semibold ${mode.color}`}>{todayMinutes} min focused</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-teal-pale rounded-xl p-3 text-center">
            <div className="font-display text-2xl font-bold text-teal">{todaySessions.length}</div>
            <div className="text-xs font-body text-teal/70 mt-0.5">Sessions</div>
          </div>
          <div className="bg-sky-pale rounded-xl p-3 text-center">
            <div className="font-display text-2xl font-bold text-sky">{Math.round(todayMinutes / 60 * 10) / 10}h</div>
            <div className="text-xs font-body text-sky/70 mt-0.5">Focus Time</div>
          </div>
        </div>
        {todaySessions.length > 0 && (
          <div className="space-y-2">
            {todaySessions.slice(-3).reverse().map(s => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <span className="font-body text-ink truncate">{s.task}</span>
                <span className="font-body text-ink-light ml-2 flex-shrink-0">{s.duration}m</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
