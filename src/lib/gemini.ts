import type { ChatMessage } from '../types'

async function callApi(body: Record<string, unknown>): Promise<string> {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error ?? `Assistant request failed (${res.status})`)
  }
  return data.text || '(no response)'
}

export interface AssistantContext {
  code: string
  language: string
  notes: string
}

export async function askSocraticAssistant(history: ChatMessage[], context: AssistantContext): Promise<string> {
  return callApi({
    mode: 'chat',
    messages: history.map((m) => ({ role: m.role, content: m.content })),
    code: context.code,
    language: context.language,
    notes: context.notes,
  })
}

export async function generateSpecFromNotes(notes: string): Promise<string> {
  return callApi({ mode: 'spec', notes })
}
