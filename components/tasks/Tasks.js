'use client'
import { useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

const SUBJECTS = ['Math', 'Science', 'English', 'History', 'CS', 'Art', 'Other']
const PRIORITIES = [
  { label: 'High', color: 'bg-rose-pale text-rose border-rose/20' },
  { label: 'Medium', color: 'bg-amber-pale text-amber border-amber/20' },
  { label: 'Low', color: 'bg-teal-pale text-teal border-teal/20' },
]

function getPriorityStyle(p) {
  return PRIORITIES.find(x => x.label === p)?.color || ''
}

function getDaysLeft(due) {
  if (!due) return null
  const diff = Math.ceil((new Date(due) - new Date()) / (1000 * 60 * 60 * 24))
  return diff
}

export default function Tasks() {
  const [tasks, setTasks] = useLocalStorage('studyos-tasks', [])
  const [filter, setFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', subject: 'Math', priority: 'Medium', due: '', notes: '' })

  const addTask = () => {
    if (!form.title.trim()) return
    setTasks(prev => [...prev, { ...form, id: Date.now(), done: false, createdAt: new Date().toISOString() }])
    setForm({ title: '', subject: 'Math', priority: 'Medium', due: '', notes: '' })
    setShowForm(false)
  }

  const toggle = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const remove = (id) => setTasks(prev => prev.filter(t => t.id !== id))

  const filtered = filter === 'All' ? tasks
    : filter === 'Done' ? tasks.filter(t => t.done)
    : tasks.filter(t => !t.done && t.subject === filter)

  const pending = tasks.filter(t => !t.done).length
  const overdue = tasks.filter(t => !t.done && t.due && getDaysLeft(t.due) < 0).length

  return (
    <div className="animate-fadeUp">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total', value: tasks.length, color: 'bg-sky-pale text-sky' },
          { label: 'Pending', value: pending, color: 'bg-amber-pale text-amber' },
          { label: 'Overdue', value: overdue, color: overdue > 0 ? 'bg-rose-pale text-rose' : 'bg-teal-pale text-teal' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-4 text-center ${s.color}`}>
            <div className="text-2xl font-display font-bold">{s.value}</div>
            <div className="text-xs font-body font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters + Add button */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {['All', 'Done', ...SUBJECTS].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-body font-medium transition-all border ${
                filter === f
                  ? 'bg-teal text-white border-teal'
                  : 'bg-white text-ink-light border-border hover:border-teal'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-teal hover:bg-teal-light text-white text-sm font-body font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          + New Task
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white border border-border rounded-2xl p-5 mb-5 animate-scaleIn">
          <h3 className="font-display text-lg text-ink mb-4">New Assignment</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Assignment title..."
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-body text-ink bg-cream"
            />
            <div className="grid grid-cols-3 gap-3">
              <select
                value={form.subject}
                onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                className="border border-border rounded-xl px-3 py-2.5 text-sm font-body text-ink bg-cream"
              >
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>
              <select
                value={form.priority}
                onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                className="border border-border rounded-xl px-3 py-2.5 text-sm font-body text-ink bg-cream"
              >
                {PRIORITIES.map(p => <option key={p.label}>{p.label}</option>)}
              </select>
              <input
                type="date"
                value={form.due}
                onChange={e => setForm(p => ({ ...p, due: e.target.value }))}
                className="border border-border rounded-xl px-3 py-2.5 text-sm font-body text-ink bg-cream"
              />
            </div>
            <textarea
              placeholder="Notes (optional)..."
              value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              rows={2}
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-body text-ink bg-cream resize-none"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm font-body text-ink-light border border-border hover:border-ink transition-colors">Cancel</button>
              <button onClick={addTask} className="px-5 py-2 rounded-xl text-sm font-body font-semibold bg-teal text-white hover:bg-teal-light transition-colors">Add Task</button>
            </div>
          </div>
        </div>
      )}

      {/* Task list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-ink-light font-body">
            <div className="text-4xl mb-3">📋</div>
            <p className="font-medium">No tasks here!</p>
            <p className="text-sm mt-1">Add your first assignment above.</p>
          </div>
        )}
        {filtered.map((task, i) => {
          const days = getDaysLeft(task.due)
          return (
            <div
              key={task.id}
              className={`bg-white border rounded-2xl p-4 flex items-start gap-3 transition-all animate-fadeUp ${
                task.done ? 'opacity-50 border-border' : 'border-border hover:border-teal/40'
              }`}
              style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both', opacity: task.done ? undefined : 0 }}
            >
              <button
                onClick={() => toggle(task.id)}
                className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  task.done ? 'bg-teal border-teal' : 'border-ink-light hover:border-teal'
                }`}
              >
                {task.done && <span className="text-white text-xs">✓</span>}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`font-body font-medium text-sm ${task.done ? 'line-through text-ink-light' : 'text-ink'}`}>
                  {task.title}
                </p>
                <div className="flex flex-wrap gap-2 mt-1.5 items-center">
                  <span className="text-xs font-body text-ink-light bg-cream px-2 py-0.5 rounded-full">{task.subject}</span>
                  <span className={`text-xs font-body px-2 py-0.5 rounded-full border ${getPriorityStyle(task.priority)}`}>{task.priority}</span>
                  {task.due && (
                    <span className={`text-xs font-body px-2 py-0.5 rounded-full ${
                      days < 0 ? 'bg-rose-pale text-rose' : days <= 2 ? 'bg-amber-pale text-amber' : 'bg-cream text-ink-light'
                    }`}>
                      {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today' : `${days}d left`}
                    </span>
                  )}
                </div>
                {task.notes && <p className="text-xs text-ink-light mt-1 font-body">{task.notes}</p>}
              </div>
              <button onClick={() => remove(task.id)} className="text-ink-light hover:text-rose text-sm transition-colors flex-shrink-0">✕</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
