import Editor, { type OnMount } from '@monaco-editor/react'

interface CodeEditorProps {
  language: string
  value: string
  onChange: (value: string) => void
  onFocusChange: (focused: boolean) => void
}

export default function CodeEditor({ language, value, onChange, onFocusChange }: CodeEditorProps) {
  const handleMount: OnMount = (editor) => {
    editor.onDidFocusEditorWidget(() => onFocusChange(true))
    editor.onDidBlurEditorWidget(() => onFocusChange(false))
  }

  return (
    <Editor
      height="100%"
      theme="vs-dark"
      language={language}
      value={value}
      onChange={(v) => onChange(v ?? '')}
      onMount={handleMount}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        padding: { top: 12 },
      }}
    />
  )
}
