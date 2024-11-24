import { useQuery } from '@tanstack/react-query'
import { fetchChatCompletion } from '../../../../api/groq'
import type { ChatMessage } from '../../../../api/groq'

export type { ChatMessage }

export default function useChatCompletion(
  messages: ChatMessage[],
  enabled: boolean
) {
  const {
    data: completionData,
    isLoading,
    error
  } = useQuery<string>({
    queryKey: ['chatCompletion', JSON.stringify(messages)],
    queryFn: async () => {
      if (messages.length === 0) return ''
      const result = await fetchChatCompletion(messages)
      return result
    },
    enabled: enabled && messages.length > 0,
    refetchOnWindowFocus: false
  })

  return { completionData, isLoading, error }
}
