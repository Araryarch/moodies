import AiModal from '../components/ui/ai-modal'
import Navbar from '../components/ui/Navbar'
import { useFilteredDataStore } from '../lib/useFilteredData'
import useGetAllAnime from './hooks/useGetAllAnime'
import useGetAllManga from './hooks/useGetAllManga'
import useGetMoodAnime from './hooks/useGetMoodAnime'
import { useState, useEffect } from 'react'
import useGetMoodManga from './hooks/useGetMoodManga'
import AnimeList from './components/anime-list'
import MoodList from './components/mood-list'
import MangaList from './components/manga-list'
import { Manga, Anime, ApiResponse } from '../types/api'
import { cn } from '../lib/utils'
import { ArrowUpRight } from 'lucide-react'

const LandingPage = () => {
  const filteredAnimeData = useFilteredDataStore(
    (state) => state.filteredAnimeData
  )
  const filteredMangaData = useFilteredDataStore(
    (state) => state.filteredMangaData
  )

  const [mood, setMood] = useState<string | null>(null)
  const [genre, setGenre] = useState<string>('')

  const { animeData }: { animeData?: ApiResponse<Anime[]> } = useGetAllAnime({
    searchTerm: ''
  })
  const { mangaData }: { mangaData?: ApiResponse<Manga[]> } = useGetAllManga({
    searchTerm: ''
  })

  useEffect(() => {
    const moodToGenreMap: Record<
      'baik' | 'sedih' | 'senang' | 'marah' | 'depresi',
      string
    > = {
      baik: '8,36',
      sedih: '7,40',
      senang: '4,10',
      marah: '14,38',
      depresi: '33,34'
    }

    if (mood && moodToGenreMap[mood as keyof typeof moodToGenreMap]) {
      setGenre(moodToGenreMap[mood as keyof typeof moodToGenreMap])
    }
  }, [mood])

  const updateMood = () => {
    const storedMood = localStorage.getItem('mood')
    if (storedMood !== mood) {
      setMood(storedMood)
    }
  }

  useEffect(() => {
    updateMood()

    const interval = setInterval(() => {
      updateMood()
    }, 2000)

    return () => clearInterval(interval)
  })

  const { moodAnime } = useGetMoodAnime({ genre })
  const { moodManga } = useGetMoodManga({ genre })

  const animes =
    filteredAnimeData.length > 0 ? filteredAnimeData : animeData?.data || []
  const mangas =
    filteredMangaData.length > 0 ? filteredMangaData : mangaData?.data || []

  const [startIndex, setStartIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  const displayedAnime =
    moodAnime?.data?.slice(startIndex, startIndex + 4) || []

  useEffect(() => {
    const interval = setInterval(() => {
      if (moodAnime?.data) {
        setLoading(true)
        setTimeout(() => {
          const nextIndex = startIndex + 4
          if (nextIndex < moodAnime.data.length) {
            setStartIndex(nextIndex)
          } else {
            setStartIndex(0)
          }
          setLoading(false)
        }, 500)
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [startIndex, moodAnime?.data])

  return (
    <main
      className={cn(
        'relative w-full min-h-screen bg-background text-secondary-foreground'
      )}
    >
      <Navbar />
      <AiModal />
      <div className='flex items-center w-full min-h-screen'>
        <div className='flex flex-col items-start max-w-2xl gap-6 pl-10'>
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
              {mood}
            </span>
          </h1>
          <div className='flex flex-wrap justify-end w-full gap-2 card-wrapper'>
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className='flex w-[28rem] card aspect-video bg-secondary rounded-xl animate-pulse'
                  ></div>
                ))
              : displayedAnime.length <= 0
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className='flex w-[28rem] card aspect-video bg-secondary rounded-xl animate-pulse'
                  ></div>
                ))
              : displayedAnime.map((anime: Anime) => (
                  <div
                    key={anime.mal_id}
                    className='flex w-[28rem] card aspect-video border-2 border-secondary overflow-hidden rounded-xl p-2 cursor-pointer'
                  >
                    <img
                      src={anime.images.jpg.image_url}
                      alt={anime.title}
                      className='object-cover w-full h-full rounded-xl'
                    />
                    <div className='p-4'>
                      <h2 className='text-lg font-bold'>{anime.title}</h2>
                      <div className='flex gap-3 py-2'>
                        {anime.genres.slice(-2).map((genre) => (
                          <span
                            key={genre.name}
                            className='px-2 py-1 text-sm rounded bg-secondary'
                          >
                            {genre.name}
                          </span>
                        ))}
                        {anime.genres.length > 2 && (
                          <span className='px-2 py-1 text-sm rounded bg-secondary'>
                            +{anime.genres.length - 2}
                          </span>
                        )}
                      </div>
                      <p>{anime.synopsis.substring(0, 100)}...</p>
                    </div>
                  </div>
                ))}
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
