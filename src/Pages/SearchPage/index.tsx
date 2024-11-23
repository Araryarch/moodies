import { useEffect, useMemo } from 'react'
import Navbar from '../../components/ui/Navbar'
import { useAnimeMangaStore } from '../../lib/useAnimeMangaStore'
import { useSearchTermStore } from '../../lib/useSearchTermStore'
import useGetSearchManga from './hooks/useSearchManga'
import useGetSearchAnime from './hooks/useSearchAnime'

import { Anime, Manga } from '../../types/api'
import { useNavigate } from 'react-router-dom'

const SearchPage = () => {
  const { animes, setAnimes, mangas, setMangas } = useAnimeMangaStore()
  const { searchTerm } = useSearchTermStore()

  const {
    animeData,
    isLoading: isLoadingAnime,
    error: errorAnime
  } = useGetSearchAnime({ searchTerm })
  const {
    mangaData,
    isLoading: isLoadingManga,
    error: errorManga
  } = useGetSearchManga({ searchTerm })

  const navigate = useNavigate()

  const renderMediaCard = useMemo(
    () => (media: Anime | Manga, type: 'anime' | 'manga', index: number) =>
      (
        <div
          key={index}
          className='overflow-hidden rounded-lg shadow-lg cursor-pointer bg-card'
          onClick={() => navigate(`/${type}/${media.mal_id}`)}
        >
          <img
            src={media.images.jpg.large_image_url}
            alt={media.title}
            className='object-cover w-full h-48'
          />
          <div className='p-4'>
            <p className='text-xs uppercase text-foreground'>{type}</p>
            <h3 className='text-lg font-semibold text-foreground'>
              {media.title}
            </h3>
            <p className='mt-2 text-sm text-muted-foreground'>
              {media.synopsis
                ? `${media.synopsis.substring(0, 100)}...`
                : 'No synopsis available'}
            </p>
          </div>
        </div>
      ),
    [navigate]
  )

  useEffect(() => {
    if (animeData) setAnimes(animeData?.data || [])
  }, [animeData, setAnimes])

  useEffect(() => {
    if (mangaData) setMangas(mangaData?.data || [])
  }, [mangaData, setMangas])

  if (errorAnime || errorManga) {
    return (
      <div className='w-full min-h-screen bg-background'>
        <Navbar />
        <h1 className='px-6 pt-24 mb-4 text-2xl font-bold text-foreground'>
          Error fetching data. Please try again later.
        </h1>
      </div>
    )
  }

  if (!searchTerm.trim()) {
    return (
      <div className='w-full min-h-screen bg-background'>
        <Navbar />
        <h1 className='px-6 pt-24 mb-4 text-2xl font-bold text-foreground'>
          Please enter a search term to start searching.
        </h1>
      </div>
    )
  }

  return (
    <div className='w-full min-h-screen bg-background'>
      <Navbar />
      <h1 className='px-6 pt-24 mb-4 text-2xl font-bold text-foreground'>
        Search Results for "{searchTerm}":
      </h1>

      <div className='grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {isLoadingAnime || isLoadingManga ? (
          Array(8)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className='overflow-hidden rounded-lg shadow-lg bg-card animate-pulse'
              >
                <div className='h-48 bg-muted'></div>
                <div className='p-4 space-y-2'>
                  <div className='w-1/3 h-4 bg-muted'></div>
                  <div className='w-2/3 h-6 bg-muted'></div>
                  <div className='w-full h-3 bg-muted'></div>
                </div>
              </div>
            ))
        ) : (
          <>
            {animes.map((anime, index) =>
              renderMediaCard(anime, 'anime', index)
            )}
            {mangas.map((manga, index) =>
              renderMediaCard(manga, 'manga', index)
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default SearchPage
