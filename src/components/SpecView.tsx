import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { generateSpecFromNotes } from '../lib/gemini'

interface SpecViewProps {
  notes: string
  spec: string
  onSpecChange: (spec: string) => void
  archivedCode: string
  onRestart: () => void
}

export default function SpecView({ notes, spec, onSpecChange, archivedCode, onRestart }: SpecViewProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const result = await generateSpecFromNotes(notes)
      onSpecChange(result)
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-3">
        <p className="text-sm font-semibold text-amber-200">🔒 Sandbox wiped — video access revoked</p>
        <p className="mt-1 text-xs text-amber-300/80">Rebuild the thing below from scratch. No peeking at the video.</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={generate}
          disabled={loading}
          className="rounded-md bg-sky-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-600 disabled:opacity-50"
        >
          {loading ? 'Generating…' : spec ? 'Regenerate spec with AI' : 'Generate spec with AI'}
        </button>
        <button
          onClick={() => setRevealed((r) => !r)}
          className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
        >
          {revealed ? 'Hide reference solution' : "I'm stuck — reveal reference"}
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="prose-notes flex-1 overflow-y-auto rounded-md border border-zinc-800 bg-zinc-900 p-3 text-left text-sm">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {spec || `## Your functional spec\n\nNo AI-generated spec yet — here are your raw notes to work from:\n\n---\n\n${notes}`}
        </ReactMarkdown>
      </div>

      {revealed && (
        <div className="max-h-48 overflow-y-auto rounded-md border border-zinc-700 bg-zinc-950 p-3">
          <p className="mb-1 text-xs font-semibold text-zinc-400">Archived reference solution</p>
          <pre className="whitespace-pre-wrap font-mono text-xs text-zinc-400">{archivedCode || '(empty)'}</pre>
        </div>
      )}

      <button onClick={onRestart} className="text-xs text-zinc-500 underline hover:text-zinc-300">
        Start a completely new tutorial
      </button>
    </div>
  )
}
