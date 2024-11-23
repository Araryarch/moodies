import React, { useState, useEffect } from 'react'

interface Message {
  id: number
  text: string
  sender: string
  timestamp: string
}

const Community: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState<string>('')

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      const newMsg: Message = {
        id: Date.now(),
        text: newMessage,
        sender: 'You',
        timestamp: new Date().toLocaleTimeString()
      }
      setMessages([...messages, newMsg])
      setNewMessage('')
    }
  }

  useEffect(() => {
    // Simulasi pesan datang dari pengguna lain
    const interval = setInterval(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now(),
          text: 'Message from other user',
          sender: 'Other User',
          timestamp: new Date().toLocaleTimeString()
        }
      ])
    }, 5000)

    return () => clearInterval(interval)
  }, [messages])

  return (
    <div className='flex flex-col w-full min-h-screen bg-gray-100'>
      <div className='flex flex-col flex-1 p-6 space-y-4 overflow-auto'>
        {/* Title */}
        <div className='text-2xl font-semibold text-gray-800'>
          Community Chat
        </div>

        {/* Messages */}
        <div className='flex-1 space-y-4 overflow-auto'>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === 'You' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`p-4 rounded-lg max-w-xs text-sm break-words ${
                  msg.sender === 'You'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-black'
                }`}
              >
                <p className='font-semibold'>{msg.sender}</p>
                <p>{msg.text}</p>
                <span className='text-xs text-gray-500'>{msg.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className='p-4 bg-white border-t border-gray-200'>
        <div className='flex items-center space-x-4'>
          <input
            type='text'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className='flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Type a message...'
          />
          <button
            onClick={sendMessage}
            className='px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default Community
