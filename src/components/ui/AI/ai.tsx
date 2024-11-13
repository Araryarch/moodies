import React, { useState, useEffect } from 'react'
import useChatCompletion, { ChatMessage } from './hooks/useChatCompletion'

const Ai: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isFirstMessage, setIsFirstMessage] = useState(true)
  const [mood, setMood] = useState<string>('')

  console.log({ mood })

  const { completionData, isLoading, error } = useChatCompletion(
    messages,
    messages.length > 0
  )

  const handleSubmit = () => {
    if (input.trim()) {
      const newMessage: ChatMessage = { role: 'user', content: input.trim() }
      setMessages((prev) => [...prev, newMessage])
      setInput('')
      setIsFirstMessage(false)
    }
  }

  useEffect(() => {
    if (completionData) {
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: completionData
      }
      setMessages((prev) => [...prev, assistantMessage])

      const moodMatch = completionData.match(/\[(baik|sedih|senang)\]/)
      if (moodMatch) {
        setMood(moodMatch[1])
      }
    }
  }, [completionData])

  return (
    <div className='absolute inset-0 flex flex-col p-4 text-white bg-background'>
      <div className='flex-1 p-4 space-y-4 overflow-auto'>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs p-4 rounded-lg transition-all duration-300 ease-in-out transform ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground shadow-lg hover:scale-105'
                  : 'bg-secondary text-secondary-foreground shadow-xl hover:scale-105'
              }`}
            >
              <strong className='font-semibold'>
                {msg.role === 'user' ? 'You' : 'Moodies'}:
              </strong>
              <p className='mt-1'>{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <p className='text-center text-muted-foreground'>Loading...</p>
        )}
        {error && (
          <p className='text-center text-destructive'>Error: {error.message}</p>
        )}
      </div>

      <div className='flex items-center p-2 space-x-2 border-t border-border'>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isFirstMessage ? 'Ketik pesan pertama Anda...' : 'Type a message'
          }
          className='w-full p-3 text-white rounded-lg placeholder-muted-foreground bg-input focus:outline-none'
        />
        <button
          onClick={handleSubmit}
          className='p-3 text-white transition-all rounded-lg bg-primary hover:bg-primary-foreground'
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Ai
