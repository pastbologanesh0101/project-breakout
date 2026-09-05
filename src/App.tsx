import { useEffect, useState } from 'react'
import Toolbar from './components/Toolbar'
import VideoPanel from './components/VideoPanel'
import CodeEditor from './components/CodeEditor'
import NotesPanel from './components/NotesPanel'
import AssistantPanel from './components/AssistantPanel'
import WipeConfirmModal from './components/WipeConfirmModal'
import SpecView from './components/SpecView'
import { DEFAULT_STATE, type ProjectState } from './types'
import { loadState, saveState } from './lib/storage'
import { extractYouTubeId } from './lib/youtube'

export default function App() {
  const [state, setState] = useState<ProjectState>(() => loadState())
  const [player, setPlayer] = useState<any>(null)
  const [editorFocused, setEditorFocused] = useState(false)
  const [showWipeConfirm, setShowWipeConfirm] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => saveState(state), [state])

  function patch(partial: Partial<ProjectState>) {
    setState((s) => ({ ...s, ...partial }))
  }

  function handleLoadVideo(url: string) {
    const id = extractYouTubeId(url)
    if (!id) {
      setLoadError('Could not find a video in that URL — paste a full YouTube link.')
      return
    }
    setLoadError(null)
    setPlayer(null)
    patch({ videoUrl: url, videoId: id, phase: 'learning' })
  }

  function getCurrentTime(): number | null {
    if (!player?.getCurrentTime) return null
    return player.getCurrentTime()
  }

  function handleSeek(seconds: number) {
    player?.seekTo?.(seconds, true)
    player?.playVideo?.()
  }

  function handleWipeConfirmed() {
    patch({
      phase: 'rebuilding',
      archivedCode: state.code,
      archivedVideoId: state.videoId,
      code: `// Rebuild it from scratch. No video, no copy-paste — just the spec.\n`,
    })
    setShowWipeConfirm(false)
  }

  function handleRestart() {
    setState({ ...DEFAULT_STATE })
    setPlayer(null)
  }

  const blind = state.phase === 'learning' && editorFocused

  return (
    <div className="flex h-screen flex-col">
      <Toolbar
        videoUrl={state.videoUrl}
        onLoadVideo={handleLoadVideo}
        language={state.language}
        onLanguageChange={(language) => patch({ language })}
        phase={state.phase}
        onWipeClick={() => setShowWipeConfirm(true)}
      />

      {loadError && <p className="bg-red-950/50 px-4 py-1.5 text-xs text-red-300">{loadError}</p>}

      <div className="grid flex-1 grid-cols-1 gap-3 overflow-hidden p-3 lg:grid-cols-[1.1fr_1.4fr_1fr]">
        <div className="flex min-h-0 flex-col gap-3">
          {state.phase === 'rebuilding' ? (
            <SpecView
              notes={state.notes}
              spec={state.spec}
              onSpecChange={(spec) => patch({ spec })}
              archivedCode={state.archivedCode}
              onRestart={handleRestart}
            />
          ) : state.phase === 'learning' && state.videoId ? (
            <VideoPanel videoId={state.videoId} blind={blind} onReady={setPlayer} />
          ) : (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-800 text-center text-zinc-500">
              <span className="text-2xl">📼</span>
              <p className="max-w-xs text-sm">Paste a YouTube tutorial link above to start a Breakout session.</p>
            </div>
          )}

          <div className="min-h-0 flex-1 overflow-hidden">
            <AssistantPanel chat={state.chat} onChatChange={(chat) => patch({ chat })} />
          </div>
        </div>

        <div className="min-h-[300px] overflow-hidden rounded-lg border border-zinc-800">
          <CodeEditor
            language={state.language}
            value={state.code}
            onChange={(code) => patch({ code })}
            onFocusChange={setEditorFocused}
          />
        </div>

        <div className="min-h-0">
          <NotesPanel
            notes={state.notes}
            onChange={(notes) => patch({ notes })}
            getCurrentTime={getCurrentTime}
            onSeek={handleSeek}
          />
        </div>
      </div>

      {showWipeConfirm && <WipeConfirmModal onConfirm={handleWipeConfirmed} onClose={() => setShowWipeConfirm(false)} />}
    </div>
  )
}
