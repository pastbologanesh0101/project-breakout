// Minimal YouTube IFrame Player API loader + typed-ish wrapper.
// We avoid a full @types/youtube dependency and just declare what we use.

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: (() => void) | undefined
  }
}

let apiLoadPromise: Promise<void> | null = null

export function loadYouTubeApi(): Promise<void> {
  if (window.YT && window.YT.Player) return Promise.resolve()
  if (apiLoadPromise) return apiLoadPromise

  apiLoadPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve()
    }
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
  })
  return apiLoadPromise
}

export function extractYouTubeId(url: string): string | null {
  const trimmed = url.trim()
  if (!trimmed) return null
  // Plain 11-char id pasted directly
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed

  try {
    const u = new URL(trimmed)
    if (u.hostname === 'youtu.be') {
      return u.pathname.slice(1) || null
    }
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname === '/watch') return u.searchParams.get('v')
      if (u.pathname.startsWith('/embed/')) return u.pathname.split('/')[2] ?? null
      if (u.pathname.startsWith('/shorts/')) return u.pathname.split('/')[2] ?? null
    }
  } catch {
    return null
  }
  return null
}

export function formatTimestamp(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m)
  const ss = String(sec).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}
