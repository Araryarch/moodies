import { useQuery } from '@tanstack/react-query'
import api from '../../../api/jikan'
import { ApiResponse } from '../../../types/api'
import { Manga } from '../../../types/api'

export type MangaResponse = ApiResponse<Manga>

interface UseMangaByIdProps {
  id: string
}

export default function useMangaById({ id }: UseMangaByIdProps) {
  const {
    data: mangaData,
    isLoading,
    error
  } = useQuery<MangaResponse>({
    queryKey: ['manga', id],
    queryFn: async () => {
      const { data } = await api.get<MangaResponse>(`/manga/${id}`)
      return data
    },
    refetchOnWindowFocus: false
  })

  return { mangaData, isLoading, error }
}
