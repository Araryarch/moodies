import { useState, useEffect, useMemo, useCallback } from 'react'
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

// Skeleton Component untuk mengurangi duplikasi kode
const CardSkeleton = () => (
  <div className='flex w-[28rem] card aspect-video bg-secondary rounded-xl animate-pulse'></div>
)

// Komponen untuk menampilkan card Anime/Manga
const MediaCard = ({
  item,
  type
}: {
  item: Anime | Manga
  type: 'anime' | 'manga'
}) => {
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

  return (
    <div className='flex w-[28rem] card aspect-video border-2 border-secondary overflow-hidden rounded-xl p-2 cursor-pointer'>
      <img
        src={
          type === 'anime'
            ? (item as Anime).images.jpg.image_url
            : (item as Manga).images.jpg.image_url
        }
        alt={item.title}
        className='object-cover w-full h-full rounded-xl'
      />
      <div className='p-4'>
        <h2 className='text-lg font-bold'>{item.title}</h2>
        {renderGenres()}
        <p>{item.synopsis.substring(0, 100)}...</p>
      </div>
    </div>
  )
}

const LandingPage = () => {
  const filteredAnimeData = useFilteredDataStore(
    (state) => state.filteredAnimeData
  )
  const filteredMangaData = useFilteredDataStore(
    (state) => state.filteredMangaData
  )

  const [mood, setMood] = useState<string | null>(null)
  const [genre, setGenre] = useState<string>('')
  const [startIndex, setStartIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  // Memoize mood to genre map
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

  // Hooks untuk mengambil data
  const { animeData }: { animeData?: ApiResponse<Anime[]> } = useGetAllAnime({
    searchTerm: ''
  })
  const { mangaData }: { mangaData?: ApiResponse<Manga[]> } = useGetAllManga({
    searchTerm: ''
  })
  const { moodAnime } = useGetMoodAnime({ genre })
  const { moodManga } = useGetMoodManga({ genre })

  // Update mood dari localStorage (useCallback untuk memoize fungsi)
  const updateMood = useCallback(() => {
    const storedMood = localStorage.getItem('mood')
    if (storedMood !== mood) {
      setMood(storedMood)
    }
  }, [mood])

  // Efek untuk mengupdate genre berdasarkan mood
  useEffect(() => {
    if (mood && moodToGenreMap[mood as keyof typeof moodToGenreMap]) {
      setGenre(moodToGenreMap[mood as keyof typeof moodToGenreMap])
    }
  }, [mood, moodToGenreMap])

  // Efek untuk memantau perubahan mood
  useEffect(() => {
    updateMood()
    const interval = setInterval(updateMood, 2000)
    return () => clearInterval(interval)
  }, [updateMood])

  // Memoize data
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

  // Efek untuk rotasi mood anime/manga
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

  // Slice data mood anime dan manga
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

      <div className='flex items-center w-full min-h-screen'>
        {/* Hero Section */}
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
            <span className='px-4 py-2 ml-2 font-bold uppercase bg-secondary text-destructive-foreground rounded-xl'>
              {mood ? mood : 'BAIK'}
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
