import { useState } from 'react'

interface SettingsModalProps {
  apiKey: string
  onSave: (key: string) => void
  onClose: () => void
}

export default function SettingsModal({ apiKey, onSave, onClose }: SettingsModalProps) {
  const [value, setValue] = useState(apiKey)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="text-base font-semibold text-zinc-100">Gemini API key</h2>
        <p className="mt-1 text-xs text-zinc-400">
          The Socratic Assistant calls Google's Gemini API directly from your browser using this key. It's stored
          only in this browser's localStorage and never sent anywhere except Google's API. Free tier, no card
          required — grab one at{' '}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noreferrer"
            className="text-sky-400 underline"
          >
            aistudio.google.com/apikey
          </a>
          .
        </p>
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="AIza..."
          className="mt-3 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-zinc-500"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200">
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(value.trim())
              onClose()
            }}
            className="rounded-md bg-sky-700 px-3 py-2 text-sm font-medium text-white hover:bg-sky-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
