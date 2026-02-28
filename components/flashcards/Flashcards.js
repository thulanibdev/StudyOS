'use client'
import { useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export default function Flashcards() {
  const [decks, setDecks] = useLocalStorage('studyos-flashcards', [])
  const [activeDeck, setActiveDeck] = useState(null)
  const [studyMode, setStudyMode] = useState(false)
  const [cardIndex, setCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [showDeckForm, setShowDeckForm] = useState(false)
  const [showCardForm, setShowCardForm] = useState(false)
  const [deckName, setDeckName] = useState('')
  const [cardForm, setCardForm] = useState({ front: '', back: '' })

  const addDeck = () => {
    if (!deckName.trim()) return
    const newDeck = { id: Date.now(), name: deckName, cards: [] }
    setDecks(prev => [...prev, newDeck])
    setDeckName('')
    setShowDeckForm(false)
  }

  const deleteDeck = (id) => {
    setDecks(prev => prev.filter(d => d.id !== id))
    if (activeDeck?.id === id) setActiveDeck(null)
  }

  const addCard = () => {
    if (!cardForm.front.trim() || !cardForm.back.trim()) return
    const newCard = { id: Date.now(), ...cardForm }
    setDecks(prev => prev.map(d =>
      d.id === activeDeck.id ? { ...d, cards: [...d.cards, newCard] } : d
    ))
    setActiveDeck(prev => ({ ...prev, cards: [...prev.cards, newCard] }))
    setCardForm({ front: '', back: '' })
    setShowCardForm(false)
  }

  const deleteCard = (cardId) => {
    setDecks(prev => prev.map(d =>
      d.id === activeDeck.id ? { ...d, cards: d.cards.filter(c => c.id !== cardId) } : d
    ))
    setActiveDeck(prev => ({ ...prev, cards: prev.cards.filter(c => c.id !== cardId) }))
  }

  const startStudy = () => {
    setCardIndex(0)
    setFlipped(false)
    setStudyMode(true)
  }

  const next = () => { setFlipped(false); setTimeout(() => setCardIndex(i => Math.min(i + 1, activeDeck.cards.length - 1)), 150) }
  const prev = () => { setFlipped(false); setTimeout(() => setCardIndex(i => Math.max(i - 1, 0)), 150) }

  // Study mode
  if (studyMode && activeDeck) {
    const card = activeDeck.cards[cardIndex]
    return (
      <div className="animate-fadeUp">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setStudyMode(false)} className="text-ink-light hover:text-teal text-sm font-body transition-colors">← Back to deck</button>
          <span className="text-sm font-body text-ink-light">{cardIndex + 1} / {activeDeck.cards.length}</span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-border rounded-full mb-8">
          <div
            className="h-full bg-teal rounded-full transition-all duration-500"
            style={{ width: `${((cardIndex + 1) / activeDeck.cards.length) * 100}%` }}
          />
        </div>

        {/* Card */}
        <div className="perspective mb-8 cursor-pointer" onClick={() => setFlipped(f => !f)}>
          <div className={`card-inner w-full h-56 relative ${flipped ? 'flipped' : ''}`}>
            <div className="card-front absolute inset-0 bg-white border-2 border-border rounded-3xl flex flex-col items-center justify-center p-8 text-center">
              <span className="text-xs font-body text-ink-light uppercase tracking-widest mb-4">Question</span>
              <p className="font-display text-2xl text-ink leading-snug">{card.front}</p>
              <span className="text-xs text-ink-light font-body mt-6">Tap to reveal answer</span>
            </div>
            <div className="card-back absolute inset-0 bg-teal border-2 border-teal rounded-3xl flex flex-col items-center justify-center p-8 text-center">
              <span className="text-xs font-body text-white/70 uppercase tracking-widest mb-4">Answer</span>
              <p className="font-display text-2xl text-white leading-snug">{card.back}</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button onClick={prev} disabled={cardIndex === 0} className="px-6 py-2.5 rounded-xl border border-border text-sm font-body text-ink-light hover:border-teal hover:text-teal disabled:opacity-30 transition-colors">← Prev</button>
          <button onClick={() => setFlipped(f => !f)} className="px-6 py-2.5 rounded-xl bg-teal text-white text-sm font-body font-semibold hover:bg-teal-light transition-colors">Flip</button>
          <button onClick={next} disabled={cardIndex === activeDeck.cards.length - 1} className="px-6 py-2.5 rounded-xl border border-border text-sm font-body text-ink-light hover:border-teal hover:text-teal disabled:opacity-30 transition-colors">Next →</button>
        </div>
      </div>
    )
  }

  // Deck view
  if (activeDeck) {
    return (
      <div className="animate-fadeUp">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setActiveDeck(null)} className="text-ink-light hover:text-teal text-sm font-body transition-colors">← All Decks</button>
          <div className="flex gap-2">
            <button onClick={() => setShowCardForm(!showCardForm)} className="px-4 py-2 rounded-xl border border-border text-sm font-body hover:border-teal transition-colors">+ Card</button>
            {activeDeck.cards.length > 0 && (
              <button onClick={startStudy} className="px-4 py-2 rounded-xl bg-teal text-white text-sm font-body font-semibold hover:bg-teal-light transition-colors">Study Now</button>
            )}
          </div>
        </div>

        <h2 className="font-display text-2xl text-ink mb-1">{activeDeck.name}</h2>
        <p className="text-ink-light text-sm font-body mb-6">{activeDeck.cards.length} cards</p>

        {showCardForm && (
          <div className="bg-white border border-border rounded-2xl p-5 mb-5 animate-scaleIn">
            <h3 className="font-display text-lg text-ink mb-4">New Card</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-body font-medium text-ink-light mb-1 block">FRONT (Question)</label>
                <textarea value={cardForm.front} onChange={e => setCardForm(p => ({ ...p, front: e.target.value }))} rows={2} placeholder="What is...?" className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-body text-ink bg-cream resize-none" />
              </div>
              <div>
                <label className="text-xs font-body font-medium text-ink-light mb-1 block">BACK (Answer)</label>
                <textarea value={cardForm.back} onChange={e => setCardForm(p => ({ ...p, back: e.target.value }))} rows={2} placeholder="The answer is..." className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-body text-ink bg-cream resize-none" />
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowCardForm(false)} className="px-4 py-2 rounded-xl text-sm font-body text-ink-light border border-border">Cancel</button>
                <button onClick={addCard} className="px-5 py-2 rounded-xl text-sm font-body font-semibold bg-teal text-white hover:bg-teal-light transition-colors">Add Card</button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {activeDeck.cards.length === 0 && (
            <div className="col-span-2 text-center py-16 text-ink-light font-body">
              <div className="text-4xl mb-3">🃏</div>
              <p>No cards yet. Add your first card!</p>
            </div>
          )}
          {activeDeck.cards.map((card, i) => (
            <div key={card.id} className="bg-white border border-border rounded-2xl p-4 animate-fadeUp" style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both', opacity: 0 }}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-body text-teal font-medium uppercase tracking-wide">Q</span>
                <button onClick={() => deleteCard(card.id)} className="text-ink-light hover:text-rose text-xs transition-colors">✕</button>
              </div>
              <p className="text-sm font-body text-ink font-medium mb-2">{card.front}</p>
              <div className="border-t border-border pt-2 mt-2">
                <span className="text-xs font-body text-ink-light font-medium uppercase tracking-wide">A</span>
                <p className="text-sm font-body text-ink-light mt-1">{card.back}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Decks list
  return (
    <div className="animate-fadeUp">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl text-ink">Your Decks</h2>
          <p className="text-ink-light text-sm font-body">{decks.length} deck{decks.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowDeckForm(!showDeckForm)} className="bg-teal hover:bg-teal-light text-white text-sm font-body font-semibold px-4 py-2 rounded-xl transition-colors">+ New Deck</button>
      </div>

      {showDeckForm && (
        <div className="bg-white border border-border rounded-2xl p-5 mb-5 animate-scaleIn">
          <input type="text" placeholder="Deck name (e.g. Biology Chapter 3)..." value={deckName} onChange={e => setDeckName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addDeck()} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-body text-ink bg-cream mb-3" />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowDeckForm(false)} className="px-4 py-2 rounded-xl text-sm font-body text-ink-light border border-border">Cancel</button>
            <button onClick={addDeck} className="px-5 py-2 rounded-xl text-sm font-body font-semibold bg-teal text-white hover:bg-teal-light transition-colors">Create</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks.length === 0 && (
          <div className="col-span-3 text-center py-16 text-ink-light font-body">
            <div className="text-4xl mb-3">📚</div>
            <p className="font-medium">No decks yet!</p>
            <p className="text-sm mt-1">Create your first flashcard deck.</p>
          </div>
        )}
        {decks.map((deck, i) => (
          <div key={deck.id} className="bg-white border border-border rounded-2xl p-5 cursor-pointer hover:border-teal transition-all animate-fadeUp group" style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both', opacity: 0 }} onClick={() => setActiveDeck(deck)}>
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 bg-teal-pale rounded-xl flex items-center justify-center text-xl">🃏</div>
              <button onClick={e => { e.stopPropagation(); deleteDeck(deck.id) }} className="text-ink-light hover:text-rose text-sm opacity-0 group-hover:opacity-100 transition-all">✕</button>
            </div>
            <h3 className="font-display text-lg text-ink leading-tight">{deck.name}</h3>
            <p className="text-ink-light text-sm font-body mt-1">{deck.cards.length} cards</p>
            <div className="mt-4 flex gap-2">
              {deck.cards.length > 0 && (
                <span className="text-xs font-body text-teal bg-teal-pale px-2 py-1 rounded-full">Ready to study</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
