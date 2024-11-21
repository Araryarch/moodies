import { useQuery } from '@tanstack/react-query'
import api from '../../api/jikan'
import { ApiResponse } from '../../types/api'
import { Anime } from '../../types/api'

export type AnimeResponse = ApiResponse<Anime[]>

interface UseGetMoodAnimeProps {
  genre?: string | number
}

export default function useGetMoodAnime({ genre }: UseGetMoodAnimeProps) {
  const {
    data: moodAnime,
    isLoading,
    error
  } = useQuery<AnimeResponse>({
    queryKey: ['anime', genre],
    queryFn: async () => {
      const { data } = await api.get<AnimeResponse>('/anime', {
        params: {
          limit: 15,
          genres: genre
        }
      })
      return data
    },
    refetchOnWindowFocus: true
  })

  return { moodAnime, isLoading, error }
}
