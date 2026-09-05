import { useState } from 'react'
import type { ChatMessage } from '../types'
import { askSocraticAssistant, type AssistantContext } from '../lib/gemini'

interface AssistantPanelProps {
  chat: ChatMessage[]
  onChatChange: (chat: ChatMessage[]) => void
  context: AssistantContext
}

export default function AssistantPanel({ chat, onChatChange, context }: AssistantPanelProps) {
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function send() {
    const content = draft.trim()
    if (!content || loading) return
    setError(null)
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content }
    const nextChat = [...chat, userMsg]
    onChatChange(nextChat)
    setDraft('')
    setLoading(true)
    try {
      const reply = await askSocraticAssistant(nextChat, context)
      onChatChange([...nextChat, { id: crypto.randomUUID(), role: 'assistant', content: reply }])
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-200">Socratic Assistant</h3>
          <p className="text-[11px] text-zinc-500">Hints and questions only — it will never write code for you.</p>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto rounded-md border border-zinc-800 bg-zinc-900 p-3">
        {chat.length === 0 && (
          <p className="text-sm text-zinc-500">
            Stuck? Ask a question about the concept you're implementing — you'll get hints, not answers.
          </p>
        )}
        {chat.map((m) => (
          <div
            key={m.id}
            className={`max-w-[90%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
              m.role === 'user' ? 'ml-auto bg-sky-900/40 text-sky-100' : 'bg-zinc-800 text-zinc-200'
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && <div className="text-xs text-zinc-500">thinking…</div>}
      </div>

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

      <div className="mt-2 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="e.g. why does my loop never terminate?"
          className="flex-1 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-zinc-600"
        />
        <button
          onClick={send}
          disabled={loading}
          className="rounded-md bg-sky-700 px-3 py-2 text-sm font-medium text-white hover:bg-sky-600 disabled:opacity-50"
        >
          Ask
        </button>
      </div>
    </div>
  )
}
