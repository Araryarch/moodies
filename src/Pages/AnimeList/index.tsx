import { useState, useEffect } from 'react'
import useGetDataAnime from './hooks/useGetDataAnime'
import { Genre, Anime } from '../../types/api'
import Navbar from '../../components/ui/Navbar'
import Footer from '../../components/ui/Footer'

const AnimeList = () => {
  const { animeData, isLoading, error } = useGetDataAnime()
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredAnime, setFilteredAnime] = useState<Anime[]>([])

  const genres: Genre[] = [
    { mal_id: 1, type: 'genre', name: 'Action', url: '#' },
    { mal_id: 2, type: 'genre', name: 'Adventure', url: '#' },
    { mal_id: 3, type: 'genre', name: 'Fantasy', url: '#' },
    { mal_id: 12, type: 'genre', name: 'Comedy', url: '#' }
  ]

  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Number(event.target.value)
    setSelectedGenre(selected)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  useEffect(() => {
    if (!animeData?.data) return

    const animeArray = Array.isArray(animeData.data)
      ? animeData.data
      : [animeData.data]

    const filtered = selectedGenre
      ? animeArray.filter((anime) =>
          anime.genres.some((genre: Genre) => genre.mal_id === selectedGenre)
        )
      : animeArray

    setFilteredAnime(filtered)
    setCurrentPage(1)
  }, [animeData, selectedGenre])

  if (isLoading) return <SkeletonLoading />
  if (error instanceof Error) return <div>Error: {error.message}</div>

  const itemsPerPage = 8
  const totalPages = Math.ceil(filteredAnime.length / itemsPerPage)
  const displayedAnime = filteredAnime.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <main className='w-full min-h-screen bg-background'>
      <Navbar />
      <div className='container min-h-screen p-4 pt-24 mx-auto'>
        <div className='mb-4'>
          <label
            htmlFor='genre'
            className='block text-lg font-medium text-secondary-foreground'
          >
            Select Genre
          </label>
          <select
            id='genre'
            value={selectedGenre ?? ''}
            onChange={handleGenreChange}
            className='w-full p-2 mt-2 border rounded-md'
          >
            <option value=''>All Genres</option>
            {genres.map((genre) => (
              <option
                key={genre.mal_id}
                value={genre.mal_id}
              >
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {displayedAnime.map((anime: Anime) => (
            <div
              key={anime.mal_id}
              className='overflow-hidden bg-white rounded-lg shadow-lg'
            >
              <img
                src={anime.images.jpg.large_image_url}
                alt={anime.title}
                className='object-cover w-full h-48'
              />
              <div className='p-4'>
                <h3 className='text-xl font-semibold text-gray-800'>
                  {anime.title_english || anime.title}
                </h3>
                <p className='mt-2 text-sm text-gray-600'>
                  {anime.synopsis.slice(0, 100)}...
                </p>
                <div className='flex items-center justify-between mt-4'>
                  <span className='text-sm text-gray-500'>
                    Rating: {anime.score}
                  </span>
                  <a
                    href={`/anime/${anime.mal_id}`}
                    className='text-sm text-blue-500'
                  >
                    More Info
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='flex justify-center mt-8'>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className='px-4 py-2 mx-2 text-gray-700 bg-gray-300 rounded-lg disabled:opacity-50'
          >
            Previous
          </button>
          <span className='px-4 py-2 text-secondary-foreground'>
            {currentPage}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='px-4 py-2 mx-2 text-gray-700 bg-gray-300 rounded-lg disabled:opacity-50'
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
    </main>
  )
}

const SkeletonLoading = () => {
  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {Array(8)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className='overflow-hidden rounded-lg shadow-lg bg-background animate-pulse'
          >
            {/* Image Skeleton */}
            <div className='w-full h-48 bg-gray-300'></div>
            <div className='p-4'>
              {/* Title Skeleton */}
              <div className='w-3/4 h-6 mb-2 bg-gray-400 rounded'></div>
              {/* Synopsis Skeleton */}
              <div className='w-5/6 h-4 mb-2 bg-gray-300 rounded'></div>
              {/* Rating Skeleton */}
              <div className='flex items-center justify-between mt-4'>
                <div className='w-1/4 h-4 bg-gray-300 rounded'></div>
                <div className='w-1/4 h-4 bg-gray-300 rounded'></div>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

export default AnimeList
