import { useQuery } from '@tanstack/react-query'
import api from '../../api/jikan'
import { ApiResponse } from '../../types/api'
import { Anime } from '../../types/api'

export type AnimeResponse = ApiResponse<Anime[]>

interface UseGetAllAnimeProps {
  searchTerm?: string
}

export default function useGetAllAnime({ searchTerm }: UseGetAllAnimeProps) {
  const {
    data: animeData,
    isLoading,
    error
  } = useQuery<AnimeResponse>({
    queryKey: ['anime', searchTerm],
    queryFn: async () => {
      const { data } = await api.get<AnimeResponse>('/anime', {
        params: {
          limit: 15,
          q: searchTerm
        }
      })
      return data
    },
    refetchOnWindowFocus: true
  })

  return { animeData, isLoading, error }
}
