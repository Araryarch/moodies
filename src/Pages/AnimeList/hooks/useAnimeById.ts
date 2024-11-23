import { useQuery } from '@tanstack/react-query'
import api from '../../../api/jikan'
import { ApiResponse } from '../../../types/api'
import { Anime } from '../../../types/api'

export type AnimeResponse = ApiResponse<Anime>

interface UseAnimeByIdProps {
  id: string
}

export default function useAnimeById({ id }: UseAnimeByIdProps) {
  const {
    data: animeData,
    isLoading,
    error
  } = useQuery<AnimeResponse>({
    queryKey: ['anime', id], // Query key based on the id
    queryFn: async () => {
      const { data } = await api.get<AnimeResponse>(`/anime/${id}`)
      return data
    },
    refetchOnWindowFocus: false
  })

  return { animeData, isLoading, error }
}
