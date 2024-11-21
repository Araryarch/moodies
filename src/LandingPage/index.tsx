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
import BentoGridThirdDemo from './components/About'
import { HeroParallax } from './components/ui/hero-parallax'
import { ContainerScroll } from './components/ui/container-scroll-animation'

import moodies from '../assets/images/moodies.png'
import { InfiniteMovingCards } from './components/ui/infinite-moving-cards'

const CardSkeleton: React.FC<{ classname: string }> = ({ classname }) => (
  <div
    className={cn(
      'flex w-[24rem] card aspect-video bg-secondary rounded-xl animate-pulse',
      classname
    )}
  ></div>
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

  const testimonials = [
    {
      quote:
        'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.',
      name: 'Charles Dickens',
      title: 'A Tale of Two Cities'
    },
    {
      quote:
        "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
      name: 'William Shakespeare',
      title: 'Hamlet'
    },
    {
      quote: 'All that we see or seem is but a dream within a dream.',
      name: 'Edgar Allan Poe',
      title: 'A Dream Within a Dream'
    },
    {
      quote:
        'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
      name: 'Jane Austen',
      title: 'Pride and Prejudice'
    },
    {
      quote:
        'Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.',
      name: 'Herman Melville',
      title: 'Moby-Dick'
    }
  ]

  return (
    <main
      className={cn(
        'relative w-full min-h-screen bg-background text-secondary-foreground'
      )}
    >
      <Navbar />
      <AiModal />
      <div className='relative flex items-center w-full min-h-screen overflow-hidden'>
        <div className='flex flex-col items-center w-full gap-6 pl-10 xl:max-w-xl xl:items-start'>
          <h1 className='font-bold text-8xl'>
            MOODIES<span className='text-destructive'>.</span>
          </h1>
          <p className='max-w-xl font-medium xl:w-full'>
            Moodies is your go-to app for anime that fits your vibe! Feeling
            happy, sad, hyped, chill, or romantic? Just pick a mood, and let
            Jikan API deliver top anime picks that match your energy. Try it now
            and vibe like a true weeb! 🎉
          </p>
          <button className='px-4 py-2 border-[1px] flex gap-2 text-xl items-center group hover:gap-5 transition-all duration-300 ease-in-out'>
            <ArrowUpRight className='duration-1000 group-hover:rotate-45' /> TRY
            NOW
          </button>
        </div>

        <div className='flex-col items-end justify-center hidden w-full min-h-screen gap-5 xl:flex'>
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
                <CardSkeleton
                  key={index}
                  classname={index < 2 ? 'mr-[-10px]' : 'ml-[-10px]'}
                />
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
      <div className='w-full min-h-screen xl:hidden'>
        <HeroParallax
          animeProducts={moodAnime?.data || []}
          mangaProducts={moodManga?.data || []}
        />
      </div>
      <div className='flex flex-col items-center justify-center w-full min-h-screen gap-5 p-5 bg-secondary'>
        <BentoGridThirdDemo />
      </div>
      <div className='w-full min-h-screen p-5 bg-background'>
        <ContainerScroll
          titleComponent={
            <>
              <h1 className='text-4xl font-semibold text-black uppercase dark:text-white'>
                Modern Design and Stunning <br />
                <span className='text-4xl md:text-[6rem] font-bold mt-1 leading-none'>
                  MOODIES
                </span>
              </h1>
            </>
          }
        >
          <img
            src={moodies}
            alt='hero'
            height={720}
            width={1400}
            className='object-cover object-left-top h-full mx-auto rounded-2xl'
            draggable={false}
          />
        </ContainerScroll>
      </div>
      <div className='flex flex-col items-center justify-center w-full gap-5 p-5 bg-secondary'>
        <h1 className='text-4xl font-bold uppercase'>Testimonials</h1>
        <InfiniteMovingCards
          items={testimonials}
          direction='right'
          speed='slow'
        />
      </div>
      <div className='w-full gap-5 p-5 text-xs uppercase bg-background'>
        <a href='https://github.com/Araryarch/Moodies'>
          <h1>moodies</h1>
        </a>
      </div>
    </main>
  )
}

export default LandingPage
