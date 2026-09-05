import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { formatTimestamp } from '../lib/youtube'

interface NotesPanelProps {
  notes: string
  onChange: (value: string) => void
  getCurrentTime: () => number | null
  onSeek: (seconds: number) => void
}

export default function NotesPanel({ notes, onChange, getCurrentTime, onSeek }: NotesPanelProps) {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const isBookmarkHotkey = (e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'B' || e.key === 'b')
    if (!isBookmarkHotkey) return
    e.preventDefault()
    const t = getCurrentTime()
    if (t == null) return

    const el = e.currentTarget
    const snippet = `[⏱ ${formatTimestamp(t)}](t=${Math.floor(t)}) `
    const start = el.selectionStart
    const end = el.selectionEnd
    const next = notes.slice(0, start) + snippet + notes.slice(end)
    onChange(next)
    requestAnimationFrame(() => {
      el.focus()
      const pos = start + snippet.length
      el.setSelectionRange(pos, pos)
    })
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex gap-1 rounded-md bg-zinc-800 p-0.5">
          <button
            onClick={() => setMode('edit')}
            className={`rounded px-2 py-1 text-xs font-medium ${mode === 'edit' ? 'bg-zinc-700 text-white' : 'text-zinc-400'}`}
          >
            Edit
          </button>
          <button
            onClick={() => setMode('preview')}
            className={`rounded px-2 py-1 text-xs font-medium ${mode === 'preview' ? 'bg-zinc-700 text-white' : 'text-zinc-400'}`}
          >
            Preview
          </button>
        </div>
        <span className="text-[11px] text-zinc-500">⌘/Ctrl+Shift+B bookmarks the video</span>
      </div>

      {mode === 'edit' ? (
        <textarea
          value={notes}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-full w-full flex-1 resize-none rounded-md border border-zinc-800 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 outline-none focus:border-zinc-600"
          placeholder="Write what you understand in your own words. Ctrl/Cmd+Shift+B to drop a video timestamp here."
        />
      ) : (
        <div className="prose-notes h-full flex-1 overflow-y-auto rounded-md border border-zinc-800 bg-zinc-900 p-3 text-left text-sm text-zinc-200">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children }) => {
                const match = href?.match(/^t=(\d+)$/)
                if (match) {
                  const seconds = Number(match[1])
                  return (
                    <a
                      className="timestamp-link"
                      onClick={(e) => {
                        e.preventDefault()
                        onSeek(seconds)
                      }}
                    >
                      {children}
                    </a>
                  )
                }
                return (
                  <a href={href} target="_blank" rel="noreferrer">
                    {children}
                  </a>
                )
              },
            }}
          >
            {notes || '*Nothing here yet.*'}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}
