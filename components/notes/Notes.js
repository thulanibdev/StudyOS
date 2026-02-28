'use client'
import { useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

const SUBJECTS = ['Math', 'Science', 'English', 'History', 'CS', 'Art', 'Other']
const COLORS = ['bg-white', 'bg-amber-pale', 'bg-teal-pale', 'bg-sky-pale', 'bg-rose-pale']

export default function Notes() {
  const [notes, setNotes] = useLocalStorage('studyos-notes', [])
  const [activeNote, setActiveNote] = useState(null)
  const [search, setSearch] = useState('')
  const [filterSubject, setFilterSubject] = useState('All')

  const newNote = () => {
    const note = { id: Date.now(), title: 'Untitled Note', content: '', subject: 'Other', color: 'bg-white', updatedAt: new Date().toISOString() }
    setNotes(prev => [note, ...prev])
    setActiveNote(note)
  }

  const updateNote = (field, value) => {
    const updated = { ...activeNote, [field]: value, updatedAt: new Date().toISOString() }
    setActiveNote(updated)
    setNotes(prev => prev.map(n => n.id === updated.id ? updated : n))
  }

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id))
    if (activeNote?.id === id) setActiveNote(null)
  }

  const filtered = notes.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase())
    const matchSubject = filterSubject === 'All' || n.subject === filterSubject
    return matchSearch && matchSubject
  })

  const timeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 60000)
    if (diff < 1) return 'Just now'
    if (diff < 60) return `${diff}m ago`
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
    return `${Math.floor(diff / 1440)}d ago`
  }

  return (
    <div className="animate-fadeUp flex gap-4 h-[600px]">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-3">
        <button onClick={newNote} className="w-full bg-teal hover:bg-teal-light text-white text-sm font-body font-semibold py-2.5 rounded-xl transition-colors">
          + New Note
        </button>
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-border rounded-xl px-3 py-2 text-sm font-body text-ink bg-white"
        />
        <select
          value={filterSubject}
          onChange={e => setFilterSubject(e.target.value)}
          className="w-full border border-border rounded-xl px-3 py-2 text-sm font-body text-ink bg-white"
        >
          <option value="All">All Subjects</option>
          {SUBJECTS.map(s => <option key={s}>{s}</option>)}
        </select>

        <div className="flex-1 overflow-y-auto space-y-2">
          {filtered.length === 0 && (
            <div className="text-center py-10 text-ink-light font-body text-sm">
              <div className="text-3xl mb-2">📝</div>
              No notes yet
            </div>
          )}
          {filtered.map(note => (
            <div
              key={note.id}
              onClick={() => setActiveNote(note)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${note.color} ${
                activeNote?.id === note.id ? 'border-teal shadow-sm' : 'border-border hover:border-teal/40'
              }`}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-body font-medium text-sm text-ink truncate flex-1">{note.title || 'Untitled'}</h4>
                <button onClick={e => { e.stopPropagation(); deleteNote(note.id) }} className="text-ink-light hover:text-rose text-xs ml-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all">✕</button>
              </div>
              <p className="text-xs text-ink-light font-body mt-1 line-clamp-2">{note.content || 'Empty note'}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-body text-ink-light bg-white/60 px-1.5 py-0.5 rounded">{note.subject}</span>
                <span className="text-xs text-ink-light font-body">{timeAgo(note.updatedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 bg-white border border-border rounded-2xl overflow-hidden flex flex-col">
        {activeNote ? (
          <>
            {/* Toolbar */}
            <div className="border-b border-border p-4 flex items-center gap-3 flex-wrap">
              <input
                type="text"
                value={activeNote.title}
                onChange={e => updateNote('title', e.target.value)}
                className="font-display text-xl text-ink bg-transparent flex-1 min-w-0"
                placeholder="Note title..."
              />
              <select
                value={activeNote.subject}
                onChange={e => updateNote('subject', e.target.value)}
                className="border border-border rounded-lg px-2 py-1 text-xs font-body text-ink bg-cream"
              >
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>
              <div className="flex gap-1">
                {COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => updateNote('color', c)}
                    className={`w-5 h-5 rounded-full border ${c} ${activeNote.color === c ? 'ring-2 ring-teal ring-offset-1' : 'border-border'}`}
                  />
                ))}
              </div>
              <button onClick={() => deleteNote(activeNote.id)} className="text-ink-light hover:text-rose text-sm transition-colors">🗑</button>
            </div>
            {/* Content */}
            <textarea
              value={activeNote.content}
              onChange={e => updateNote('content', e.target.value)}
              placeholder="Start writing your notes here..."
              className="flex-1 p-5 font-body text-sm text-ink leading-relaxed resize-none bg-transparent"
            />
            <div className="border-t border-border px-5 py-2 flex items-center justify-between">
              <span className="text-xs text-ink-light font-body">{activeNote.content.length} characters</span>
              <span className="text-xs text-ink-light font-body">Last edited {timeAgo(activeNote.updatedAt)}</span>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-ink-light">
            <div className="text-5xl mb-4">📝</div>
            <p className="font-display text-xl text-ink mb-2">Select a note to edit</p>
            <p className="text-sm font-body">or create a new one</p>
          </div>
        )}
      </div>
    </div>
  )
}
