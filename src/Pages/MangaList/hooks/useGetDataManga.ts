import { useQuery } from '@tanstack/react-query'
import api from '../../../api/jikan'
import { ApiResponse } from '../../../types/api'
import { Manga } from '../../../types/api'

export type MangaResponse = ApiResponse<Manga>

export default function useGetDataManga() {
  const {
    data: MangaData,
    isLoading,
    error
  } = useQuery<MangaResponse>({
    queryKey: ['manga'],
    queryFn: async () => {
      const { data } = await api.get<MangaResponse>(`/manga`)
      return data
    },
    refetchOnWindowFocus: true
  })

  return { MangaData, isLoading, error }
}
