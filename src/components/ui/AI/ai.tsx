import { useState, useEffect, useRef } from 'react'
import useChatCompletion, { ChatMessage } from './hooks/useChatCompletion'

const Ai = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isFirstMessage, setIsFirstMessage] = useState(true)
  const [mood, setMood] = useState<string | null>(localStorage.getItem('mood'))
  const [image, setImage] = useState<File | null>(null) // State for image file

  const { completionData, isLoading, error } = useChatCompletion(
    messages,
    messages.length > 0
  )

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSubmit = () => {
    if (input.trim()) {
      const newMessage: ChatMessage = { role: 'user', content: input.trim() }
      setMessages((prev) => [...prev, newMessage])
      setInput('')
      setIsFirstMessage(false)
    }
    if (image) {
      const imageUrl = URL.createObjectURL(image) // Create a URL for the image
      const imageMessage: ChatMessage = {
        role: 'user',
        content: JSON.stringify({
          type: 'image_url',
          image_url: { url: imageUrl }
        }) // Send image URL as message content
      }
      setMessages((prev) => [...prev, imageMessage])
      setImage(null) // Reset image state after sending
    }
  }

  useEffect(() => {
    if (completionData) {
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: completionData
      }
      setMessages((prev) => [...prev, assistantMessage])

      const moodMatch = completionData.match(
        /\[(baik|sedih|senang|marah|depresi)\]/
      )
      if (moodMatch) {
        const newMood = moodMatch[1]
        console.log('Detected mood:', newMood)

        if (newMood !== mood) {
          setMood(newMood)
          localStorage.setItem('mood', newMood)
          console.log('Mood saved to localStorage:', newMood)
        }
      } else {
        console.log('No mood detected')
      }
    }
  }, [completionData, mood])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

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
              {msg.content.startsWith('{"type":"image_url"') ? (
                <img
                  src={JSON.parse(msg.content).image_url.url}
                  alt='User uploaded'
                  className='max-w-xs mt-2 rounded-lg'
                />
              ) : (
                <p className='mt-1'>{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <p className='text-center text-muted-foreground'>Loading...</p>
        )}
        {error && (
          <p className='text-center text-destructive'>Error: {error.message}</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className='flex p-3 space-y-2 border-t border-border'>
        <div className='relative flex w-full'>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
            placeholder={
              isFirstMessage ? 'Ketik pesan pertama Anda...' : 'Type a message'
            }
            className='flex-1 p-3 pr-16 text-black rounded-lg resize-none dark:text-white placeholder-muted-foreground bg-input focus:outline-none'
            rows={1}
            style={{ overflowY: 'hidden' }}
          />
          <button
            onClick={handleSubmit}
            className='absolute px-4 py-2 font-semibold text-black transition-all duration-200 ease-in-out transform -translate-y-1/2 rounded-lg dark:text-white right-1 top-1/2 bg-secondary focus:outline-none'
          >
            Send
          </button>
        </div>
        <div className='mt-2'>
          <input
            type='file'
            accept='image/*'
            onChange={(e) => e.target.files && setImage(e.target.files[0])}
            className='w-full file-input file-input-bordered file-input-secondary'
          />
        </div>
      </div>
    </div>
  )
}

export default Ai
