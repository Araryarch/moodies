import { useQuery } from '@tanstack/react-query'
import api from '../../../api/jikan'
import { ApiResponse } from '../../../types/api'
import { Manga } from '../../../types/api'

export type MangaResponse = ApiResponse<Manga[]>

interface UseGetSearchMangaProps {
  searchTerm?: string
}

export default function useGetSearchManga({
  searchTerm
}: UseGetSearchMangaProps) {
  const {
    data: mangaData,
    isLoading,
    error
  } = useQuery<MangaResponse>({
    queryKey: ['Manga', searchTerm],
    queryFn: async () => {
      const { data } = await api.get<MangaResponse>(`/manga`, {
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

  return { mangaData, isLoading, error }
}
