import { useEffect, useRef } from 'react'
import { loadYouTubeApi } from '../lib/youtube'

interface VideoPanelProps {
  videoId: string
  blind: boolean
  onReady: (player: any) => void
}

export default function VideoPanel({ videoId, blind, onReady }: VideoPanelProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const readyRef = useRef(onReady)
  readyRef.current = onReady

  useEffect(() => {
    let cancelled = false
    loadYouTubeApi().then(() => {
      if (cancelled || !mountRef.current) return
      playerRef.current = new window.YT.Player(mountRef.current, {
        videoId,
        playerVars: { rel: 0, modestbranding: 1 },
        events: {
          onReady: (e: any) => readyRef.current(e.target),
        },
      })
    })
    return () => {
      cancelled = true
      playerRef.current?.destroy?.()
      playerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId])

  useEffect(() => {
    if (blind) playerRef.current?.pauseVideo?.()
  }, [blind])

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
      <div ref={mountRef} className="h-full w-full" />
      {blind && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 text-center backdrop-blur-xl">
          <span className="text-3xl">🙈</span>
          <p className="max-w-xs text-sm font-medium text-zinc-200">Blindfold active</p>
          <p className="max-w-xs text-xs text-zinc-400">
            You're typing — the video is paused and hidden. Internalize the logic, don't transcribe it.
          </p>
        </div>
      )}
    </div>
  )
}
