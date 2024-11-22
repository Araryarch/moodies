import { useState, useEffect, useMemo } from 'react'
import Navbar from '../../components/ui/Navbar'
import { useAnimeMangaStore } from '../../lib/useAnimeMangaStore'
import useGetAllAnime from '../LandingPage/hooks/useGetAllAnime'
import useGetAllManga from '../LandingPage/hooks/useGetAllManga'
import { Anime, Manga } from '../../types/api'

const SearchPage = () => {
  const { animes, setAnimes, mangas, setMangas } = useAnimeMangaStore()
  const [searchTerm, setSearchTerm] = useState('')

  const { animeData } = useGetAllAnime({ searchTerm })
  const { mangaData } = useGetAllManga({ searchTerm })

  useEffect(() => {
    if (animeData?.data && animeData.data.length > 0) {
      setAnimes(animeData.data)
    }
  }, [animeData, setAnimes])

  useEffect(() => {
    if (mangaData?.data && mangaData.data.length > 0) {
      setMangas(mangaData.data)
    }
  }, [mangaData, setMangas])

  const renderMediaCard = useMemo(
    () => (media: Anime | Manga, type: 'anime' | 'manga', index: number) =>
      (
        <div
          key={index}
          className='overflow-hidden rounded-lg shadow-lg bg-card'
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
    []
  )

  return (
    <div className='w-full min-h-screen bg-background'>
      <Navbar setSearchTerm={setSearchTerm} />

      <h1 className='px-6 pt-24 mb-4 text-2xl font-bold text-foreground'>
        Search Results:
      </h1>

      <div className='grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {animes.map((anime, index) => renderMediaCard(anime, 'anime', index))}
        {mangas.map((manga, index) => renderMediaCard(manga, 'manga', index))}
      </div>
    </div>
  )
}

export default SearchPage
