import { DEFAULT_STATE, type ProjectState } from '../types'

const STATE_KEY = 'project-breakout:state'
const API_KEY_KEY = 'project-breakout:gemini-api-key'

export function loadState(): ProjectState {
  try {
    const raw = localStorage.getItem(STATE_KEY)
    if (!raw) return DEFAULT_STATE
    return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_STATE
  }
}

export function saveState(state: ProjectState) {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state))
  } catch {
    // storage full or unavailable; ignore
  }
}

export function loadApiKey(): string {
  try {
    return localStorage.getItem(API_KEY_KEY) ?? ''
  } catch {
    return ''
  }
}

export function saveApiKey(key: string) {
  try {
    if (key) localStorage.setItem(API_KEY_KEY, key)
    else localStorage.removeItem(API_KEY_KEY)
  } catch {
    // ignore
  }
}
