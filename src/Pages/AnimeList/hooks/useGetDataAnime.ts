import { useQuery } from '@tanstack/react-query'
import api from '../../../api/jikan'
import { ApiResponse } from '../../../types/api'
import { Anime } from '../../../types/api'

export type AnimeResponse = ApiResponse<Anime>

export default function useGetDataAnime() {
  const {
    data: animeData,
    isLoading,
    error
  } = useQuery<AnimeResponse>({
    queryKey: ['anime'],
    queryFn: async () => {
      const { data } = await api.get<AnimeResponse>(`/anime`)
      return data
    },
    refetchOnWindowFocus: true
  })

  return { animeData, isLoading, error }
}
