import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { ArrowUpRight } from 'lucide-react'

import AiModal from '../components/ui/ai-modal'
import Navbar from '../components/ui/Navbar'

import { useFilteredDataStore } from '../lib/useFilteredData'
import { useAnimeMangaStore } from '../lib/useAnimeMangaStore'

import useGetAllAnime from './hooks/useGetAllAnime'
import useGetAllManga from './hooks/useGetAllManga'
import useGetMoodAnime from './hooks/useGetMoodAnime'
import useGetMoodManga from './hooks/useGetMoodManga'

import { Manga, Anime, ApiResponse } from '../types/api'
import { cn } from '../lib/utils'
import Card from './components/Molecules/Card'

const CardSkeleton: React.FC = () => (
  <div className='flex w-[24rem] card aspect-video bg-secondary rounded-xl animate-pulse'></div>
)

const LandingPage: React.FC = () => {
  const moodToGenreMap = useMemo(
    () => ({
      baik: '8,36',
      sedih: '7,40',
      senang: '4,10',
      marah: '14,38',
      depresi: '12,8'
    }),
    []
  )

  const [mood, setMood] = useState<string>('baik')
  const [genre, setGenre] = useState<string>('')
  const [startIndex, setStartIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  const filteredAnimeData = useFilteredDataStore(
    (state) => state.filteredAnimeData
  )
  const filteredMangaData = useFilteredDataStore(
    (state) => state.filteredMangaData
  )

  const { animeData }: { animeData?: ApiResponse<Anime[]> } = useGetAllAnime({
    searchTerm: ''
  })
  const { mangaData }: { mangaData?: ApiResponse<Manga[]> } = useGetAllManga({
    searchTerm: ''
  })
  const { moodAnime } = useGetMoodAnime({ genre })
  const { moodManga } = useGetMoodManga({ genre })

  const { setAnimes, setMangas } = useAnimeMangaStore()

  const updateMood = useCallback(() => {
    const storedMood = localStorage.getItem('mood') || 'baik'
    if (storedMood !== mood) {
      setMood(storedMood)
    }
  }, [mood])

  useEffect(() => {
    if (mood && moodToGenreMap[mood as keyof typeof moodToGenreMap]) {
      setGenre(moodToGenreMap[mood as keyof typeof moodToGenreMap])
    }
  }, [mood, moodToGenreMap])

  useEffect(() => {
    updateMood()
    const interval = setInterval(updateMood, 2000)
    return () => clearInterval(interval)
  }, [updateMood])

  useEffect(() => {
    if (animeData?.data) {
      const animeList =
        filteredAnimeData.length > 0 ? filteredAnimeData : animeData.data
      setAnimes(animeList)
    }
  }, [animeData, filteredAnimeData, setAnimes])

  useEffect(() => {
    if (mangaData?.data) {
      const mangaList =
        filteredMangaData.length > 0 ? filteredMangaData : mangaData.data
      setMangas(mangaList)
    }
  }, [mangaData, filteredMangaData, setMangas])

  useEffect(() => {
    const interval = setInterval(() => {
      if (moodAnime?.data || moodManga?.data) {
        setLoading(true)
        setTimeout(() => {
          const nextIndex = startIndex + 2
          const maxLength = Math.max(
            moodAnime?.data?.length || 0,
            moodManga?.data?.length || 0
          )
          setStartIndex(nextIndex < maxLength ? nextIndex : 0)
          setLoading(false)
        }, 500)
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [startIndex, moodAnime?.data, moodManga?.data])

  const displayedAnime =
    moodAnime?.data?.slice(startIndex, startIndex + 2) || []
  const displayedManga =
    moodManga?.data?.slice(startIndex, startIndex + 2) || []

  return (
    <main
      className={cn(
        'relative w-full min-h-screen bg-background text-secondary-foreground'
      )}
    >
      <Navbar />
      <AiModal />

      <div className='relative flex items-center w-full min-h-screen'>
        <div className='flex flex-col items-start max-w-xl gap-6 pl-10'>
          <h1 className='font-bold text-8xl'>MOODIES.</h1>
          <p className='font-medium'>
            Moodies is your go-to app for anime that fits your vibe! Feeling
            happy, sad, hyped, chill, or romantic? Just pick a mood, and let
            Jikan API deliver top anime picks that match your energy. Try it now
            and vibe like a true weeb! 🎉
          </p>
          <button className='px-4 py-2 border-[1px] flex gap-2 text-xl items-center group hover:gap-5 transition-all duration-300 ease-in-out'>
            <ArrowUpRight className='group-hover:rotate-45' /> TRY NOW
          </button>
        </div>

        <div className='flex flex-col items-end justify-center w-full min-h-screen gap-5'>
          <h1 className='px-5'>
            Personalized Recommendations Based on Your Current Mood
            <span className='px-4 py-2 ml-2 font-bold uppercase bg-secondary text-secondary-foreground rounded-xl'>
              {mood || 'BAIK'}
            </span>
          </h1>

          <div className='flex flex-wrap justify-end w-full gap-5 card-wrapper min-h-[60vh]'>
            {loading ||
            (displayedAnime.length === 0 && displayedManga.length === 0) ? (
              Array.from({ length: 4 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))
            ) : (
              <>
                {displayedAnime.map((anime: Anime) => (
                  <Card
                    key={anime.mal_id}
                    item={anime}
                    type='anime'
                  />
                ))}
                {displayedManga.map((manga: Manga) => (
                  <Card
                    key={manga.mal_id}
                    item={manga}
                    type='manga'
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default LandingPage
