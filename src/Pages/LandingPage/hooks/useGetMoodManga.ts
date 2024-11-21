import { useQuery } from '@tanstack/react-query'
import api from '../../../api/jikan'
import { ApiResponse } from '../../../types/api'
import { Manga } from '../../../types/api'

export type MangaResponse = ApiResponse<Manga[]>

interface UseGetMoodMangaProps {
  genre?: string | number
}

export default function useGetMoodManga({ genre }: UseGetMoodMangaProps) {
  const {
    data: moodManga,
    isLoading,
    error
  } = useQuery<MangaResponse>({
    queryKey: ['Manga', genre],
    queryFn: async () => {
      const { data } = await api.get<MangaResponse>('/manga', {
        params: {
          limit: 15,
          genres: genre
        }
      })
      return data
    },
    refetchOnWindowFocus: true
  })

  return { moodManga, isLoading, error }
}
