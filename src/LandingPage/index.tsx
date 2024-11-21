import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { ArrowUpRight } from 'lucide-react'

import AiModal from '../components/ui/ai-modal'
import Navbar from '../components/ui/Navbar'
import AnimeList from './components/anime-list'
import MangaList from './components/manga-list'
import MoodList from './components/mood-list'

import { useFilteredDataStore } from '../lib/useFilteredData'
import useGetAllAnime from './hooks/useGetAllAnime'
import useGetAllManga from './hooks/useGetAllManga'
import useGetMoodAnime from './hooks/useGetMoodAnime'
import useGetMoodManga from './hooks/useGetMoodManga'

import { Manga, Anime, ApiResponse } from '../types/api'
import { cn } from '../lib/utils'

// Card Skeleton for loading state
const CardSkeleton: React.FC = () => (
  <div className='flex w-[24rem] card aspect-video bg-secondary rounded-xl animate-pulse'></div>
)

// Media Card Component with improved typing and error handling
interface MediaCardProps {
  item: Anime | Manga
  type: 'anime' | 'manga'
  rating?: number
}

const MediaCard: React.FC<MediaCardProps> = ({ item, type }) => {
  const renderGenres = () => {
    const genres = item.genres.slice(0, 2)
    return (
      <div className='flex gap-3 py-2'>
        {genres.map((genre) => (
          <span
            key={genre.name}
            className='px-2 py-1 text-sm rounded bg-secondary'
          >
            {genre.name}
          </span>
        ))}
        {item.genres.length > 2 && (
          <span className='px-2 py-1 text-sm rounded bg-secondary'>
            +{item.genres.length - 2}
          </span>
        )}
      </div>
    )
  }

  const imageUrl =
    type === 'anime'
      ? (item as Anime).images.jpg.large_image_url
      : (item as Manga).images.jpg.large_image_url

  return (
    <div className='relative flex w-[24rem] card aspect-video border-2 border-secondary overflow-hidden rounded-xl cursor-pointer'>
      <img
        src={imageUrl}
        alt={item.title}
        className='object-cover w-full h-full rounded-xl'
      />
      <div className='absolute inset-0 transition-all duration-300 ease-in-out bg-black/30 hover:bg-black/50'>
        <div className='absolute px-2 py-1 text-white rounded-md top-2 left-2 bg-secondary/80'>
          Rank: {item.rank || 'N/A'}
        </div>
        <div className='absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/70 to-transparent'>
          <h2 className='text-lg font-bold'>{item.title}</h2>
          {renderGenres()}
          <p className='text-sm line-clamp-2'>
            {item.synopsis.substring(0, 100)}...
          </p>
        </div>
      </div>
    </div>
  )
}

// Main Landing Page Component
const LandingPage: React.FC = () => {
  // Mood to Genre Mapping
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

  // State Management
  const [mood, setMood] = useState<string>('baik')
  const [genre, setGenre] = useState<string>('')
  const [startIndex, setStartIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  // Filtered Data from Store
  const filteredAnimeData = useFilteredDataStore(
    (state) => state.filteredAnimeData
  )
  const filteredMangaData = useFilteredDataStore(
    (state) => state.filteredMangaData
  )

  // Data Fetching Hooks
  const { animeData }: { animeData?: ApiResponse<Anime[]> } = useGetAllAnime({
    searchTerm: ''
  })
  const { mangaData }: { mangaData?: ApiResponse<Manga[]> } = useGetAllManga({
    searchTerm: ''
  })
  const { moodAnime } = useGetMoodAnime({ genre })
  const { moodManga } = useGetMoodManga({ genre })

  // Update Mood from localStorage
  const updateMood = useCallback(() => {
    const storedMood = localStorage.getItem('mood') || 'baik'
    if (storedMood !== mood) {
      setMood(storedMood)
    }
  }, [mood])

  // Effect to update genre based on mood
  useEffect(() => {
    if (mood && moodToGenreMap[mood as keyof typeof moodToGenreMap]) {
      setGenre(moodToGenreMap[mood as keyof typeof moodToGenreMap])
    }
  }, [mood, moodToGenreMap])

  // Effect to monitor mood changes
  useEffect(() => {
    updateMood()
    const interval = setInterval(updateMood, 2000)
    return () => clearInterval(interval)
  }, [updateMood])

  // Memoized Data
  const animes = useMemo(
    () =>
      filteredAnimeData.length > 0 ? filteredAnimeData : animeData?.data || [],
    [filteredAnimeData, animeData]
  )
  const mangas = useMemo(
    () =>
      filteredMangaData.length > 0 ? filteredMangaData : mangaData?.data || [],
    [filteredMangaData, mangaData]
  )

  // Effect for mood anime/manga rotation
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

  // Sliced Mood Data
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
        {/* Left Side Content */}
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

        {/* Right Side Content */}
        <div className='flex flex-col items-end justify-center w-full min-h-screen gap-5'>
          <h1 className='px-5'>
            Personalized Recommendations Based on Your Current Mood
            <span className='px-4 py-2 ml-2 font-bold uppercase bg-secondary text-destructive-foreground rounded-xl'>
              {mood || 'BAIK'}
            </span>
          </h1>

          <div className='flex flex-wrap justify-end w-full grid-cols-2 gap-5 gap-y-5 card-wrapper'>
            {loading ||
            (displayedAnime.length === 0 && displayedManga.length === 0) ? (
              Array.from({ length: 4 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))
            ) : (
              <>
                {displayedAnime.map((anime: Anime) => (
                  <MediaCard
                    key={anime.mal_id}
                    item={anime}
                    type='anime'
                  />
                ))}
                {displayedManga.map((manga: Manga) => (
                  <MediaCard
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

      {/* Additional Lists Section */}
      <div className='w-full min-h-screen p-10 bg-secondary text-secondary-foreground'>
        <AnimeList data={animes} />
        <MangaList data={mangas} />
        <MoodList
          animes={moodAnime?.data}
          mangas={moodManga?.data}
        />
      </div>
    </main>
  )
}

export default LandingPage
