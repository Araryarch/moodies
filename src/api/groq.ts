import Groq from 'groq-sdk'

export type ChatMessage = {
  role: 'user' | 'system' | 'assistant'
  content: string
}

export async function fetchChatCompletion(
  messages: ChatMessage[]
): Promise<string> {
  const systemMessage: ChatMessage = {
    role: 'system',
    content: `Kamu adalah AI yang bernama Moodies, yang dapat mengecek mood seseorang berdasarkan percakapan.
    Setiap kali kamu memberikan jawaban, kamu harus mencantumkan mood pengguna di akhir percakapan dengan format berikut:
    1. Jawaban kamu terhadap pertanyaan atau percakapan pengguna.
    2. Mood pengguna: [mood], dengan mood yang bisa berupa salah satu dari: baik, senang, marah, sedih, atau depresi.
    
    Ingat! Format mood harus selalu dalam tanda kurung siku ([]) dan pastikan kamu menggunakan mood yang sesuai.`
  }

  const messagesWithSystem =
    messages.length > 0 ? [systemMessage, ...messages] : [systemMessage]

  const groq = new Groq({
    dangerouslyAllowBrowser: true,
    apiKey: import.meta.env.VITE_GROQ_APIKEY
  })

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: messagesWithSystem,
      model: 'llama-3.2-90b-vision-preview',
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null
    })

    return chatCompletion.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Error fetching chat completion:', error)
    throw new Error('Failed to fetch chat completion.')
  }
}
