import { ArrowUp, LoaderCircle, Sparkles } from 'lucide-react'
import { useState } from 'react'

import IconButton from '../ui/IconButton'
import TextInput from '../ui/TextInput'

import type { AskCevynState } from '../../hooks/useAskCevyn'

type AskCevynBarProps = {
  state: AskCevynState
  onAsk: (prompt: string) => void
}

function AskCevynBar({ state, onAsk }: AskCevynBarProps) {
  const [prompt, setPrompt] = useState('')
  const isLoading = state.status === 'loading'
  const canSubmit = prompt.trim() !== '' && !isLoading

  return (
    <form
      className="ask-cevyn-bar glass glass-thick"
      onSubmit={(event) => {
        event.preventDefault()
        if (canSubmit) {
          onAsk(prompt.trim())
        }
      }}
    >
      <div className="ask-cevyn-input">
        <TextInput
          label="Ask Cevyn"
          value={prompt}
          icon={<Sparkles size={14} />}
          placeholder="Ask Cevyn to create or change charts…"
          disabled={isLoading}
          onValueChange={setPrompt}
        />
        <IconButton label="Send" size="sm" type="submit" disabled={!canSubmit}>
          {isLoading ? (
            <LoaderCircle className="ask-cevyn-spinner" size={16} />
          ) : (
            <ArrowUp size={16} />
          )}
        </IconButton>
      </div>
      {state.messages.length > 0 ? (
        <ul
          className={`ask-cevyn-messages is-${state.status}`}
          role={state.status === 'error' ? 'alert' : 'status'}
        >
          {state.messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      ) : null}
    </form>
  )
}

export default AskCevynBar
