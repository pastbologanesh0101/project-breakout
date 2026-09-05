interface WipeConfirmModalProps {
  onConfirm: () => void
  onClose: () => void
}

export default function WipeConfirmModal({ onConfirm, onClose }: WipeConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-lg border border-red-900/50 bg-zinc-900 p-5">
        <h2 className="text-base font-semibold text-zinc-100">💣 Wipe the sandbox?</h2>
        <p className="mt-2 text-sm text-zinc-400">
          This will lock the video away, archive your current code, and clear your editor. You'll be left with an
          AI-generated functional spec from your notes and a blank editor — rebuild it solo, with zero video access.
        </p>
        <p className="mt-2 text-xs text-zinc-500">You can still peek at your archived solution afterward if you get truly stuck.</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200">
            Not yet
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-red-700 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            Wipe it
          </button>
        </div>
      </div>
    </div>
  )
}
