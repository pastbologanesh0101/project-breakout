export type Phase = 'setup' | 'learning' | 'rebuilding'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface ProjectState {
  videoUrl: string
  videoId: string | null
  language: string
  code: string
  notes: string
  phase: Phase
  archivedCode: string
  archivedVideoId: string | null
  spec: string
  chat: ChatMessage[]
}

export const DEFAULT_STATE: ProjectState = {
  videoUrl: '',
  videoId: null,
  language: 'javascript',
  code: '// Paste a tutorial link above, then start coding here.\n// Blindfold mode will pause + blur the video whenever this editor is focused.\n',
  notes: '# Notes\n\nPress **Ctrl/Cmd+Shift+B** while this panel is focused to drop a timestamp bookmark at the current video time.\n',
  phase: 'setup',
  archivedCode: '',
  archivedVideoId: null,
  spec: '',
  chat: [],
}
