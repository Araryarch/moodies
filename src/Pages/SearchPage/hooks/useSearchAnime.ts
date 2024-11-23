import { useQuery } from '@tanstack/react-query'
import api from '../../../api/jikan'
import { ApiResponse } from '../../../types/api'
import { Anime } from '../../../types/api'

export type AnimeResponse = ApiResponse<Anime[]>

interface UseGetSearchAnimeProps {
  searchTerm?: string
}

export default function useGetSearchAnime({
  searchTerm
}: UseGetSearchAnimeProps) {
  const {
    data: animeData,
    isLoading,
    error
  } = useQuery<AnimeResponse>({
    queryKey: ['searchAnime', searchTerm],
    queryFn: async () => {
      const { data } = await api.get<AnimeResponse>('/anime', {
        params: {
          limit: 15,
          q: searchTerm
        }
      })
      return data
    },
    enabled: !!searchTerm?.trim(),
    refetchOnWindowFocus: false
  })

  return { animeData, isLoading, error }
}
