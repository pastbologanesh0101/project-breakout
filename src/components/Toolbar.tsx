import { useState } from 'react'
import type { Phase } from '../types'

const LANGUAGES = ['javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'go', 'rust', 'html', 'css']

interface ToolbarProps {
  videoUrl: string
  onLoadVideo: (url: string) => void
  language: string
  onLanguageChange: (lang: string) => void
  phase: Phase
  onWipeClick: () => void
}

export default function Toolbar({
  videoUrl,
  onLoadVideo,
  language,
  onLanguageChange,
  phase,
  onWipeClick,
}: ToolbarProps) {
  const [draftUrl, setDraftUrl] = useState(videoUrl)

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-zinc-800 bg-zinc-950 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">🧨</span>
        <span className="font-semibold text-zinc-100">Project Breakout</span>
      </div>

      <span
        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
          phase === 'setup'
            ? 'bg-zinc-800 text-zinc-400'
            : phase === 'learning'
              ? 'bg-emerald-900/50 text-emerald-300'
              : 'bg-amber-900/50 text-amber-300'
        }`}
      >
        {phase === 'setup' ? 'awaiting video' : phase === 'learning' ? 'learning' : 'rebuilding solo'}
      </span>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          onLoadVideo(draftUrl)
        }}
        className="flex flex-1 min-w-[220px] gap-2"
      >
        <input
          value={draftUrl}
          onChange={(e) => setDraftUrl(e.target.value)}
          placeholder="Paste a YouTube tutorial URL…"
          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 outline-none focus:border-zinc-600"
        />
        <button
          type="submit"
          className="whitespace-nowrap rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-800"
        >
          Load
        </button>
      </form>

      <select
        value={language}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-200 outline-none"
      >
        {LANGUAGES.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>

      {phase === 'learning' && (
        <button
          onClick={onWipeClick}
          className="rounded-md bg-red-900/60 px-3 py-1.5 text-sm font-medium text-red-200 hover:bg-red-800/60"
        >
          💣 Wipe & Rebuild Solo
        </button>
      )}
    </div>
  )
}
