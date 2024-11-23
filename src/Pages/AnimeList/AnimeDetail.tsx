import { useParams } from 'react-router-dom'
import useAnimeById from './hooks/useAnimeById'
import Navbar from '../../components/ui/Navbar'
import Footer from '../../components/ui/Footer'

const AnimeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  const { animeData, isLoading, error } = useAnimeById({ id: id! })

  if (isLoading) {
    return (
      <div className='text-xl text-center text-muted-foreground'>
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div className='text-xl text-center text-destructive-foreground'>
        Error: {error instanceof Error ? error.message : 'Something went wrong'}
      </div>
    )
  }

  if (!animeData) {
    return (
      <div className='text-xl text-center text-muted-foreground'>
        Anime not found
      </div>
    )
  }

  return (
    <main>
      <Navbar />
      <div className='px-8 py-12 mx-auto pt-28 bg-background'>
        <div className='flex flex-col gap-10 md:flex-row'>
          <div className='md:w-1/3'>
            <img
              src={animeData.data.images.jpg.large_image_url}
              alt={animeData.data.title}
              className='w-full transition-all duration-300 rounded-lg shadow-lg hover:scale-105'
            />
          </div>

          <div className='space-y-6 md:w-2/3'>
            <h1 className='mb-4 text-4xl font-semibold text-foreground'>
              {animeData.data.title}
            </h1>
            <p className='text-lg text-muted-foreground'>
              {animeData.data.synopsis}
            </p>

            <div className='p-6 rounded-lg shadow-md bg-card'>
              <div className='flex flex-wrap gap-4'>
                <span className='text-lg font-medium text-foreground'>
                  Genres:
                </span>
                <span className='text-lg text-muted-foreground'>
                  {animeData.data.genres.map((genre) => genre.name).join(', ')}
                </span>
              </div>

              <div className='flex flex-wrap gap-4 mt-4'>
                <span className='text-lg font-medium text-foreground'>
                  Episodes:
                </span>
                <span className='text-lg text-muted-foreground'>
                  {animeData.data.episodes || 'N/A'}
                </span>
              </div>

              <div className='flex flex-wrap gap-4 mt-4'>
                <span className='text-lg font-medium text-foreground'>
                  Aired:
                </span>
                <span className='text-lg text-muted-foreground'>
                  {animeData.data.aired.string}
                </span>
              </div>

              <div className='flex flex-wrap gap-4 mt-4'>
                <span className='text-lg font-medium text-foreground'>
                  Producers:
                </span>
                <span className='text-lg text-muted-foreground'>
                  {animeData.data.producers.map((prod) => prod.name).join(', ')}
                </span>
              </div>

              <div className='flex flex-wrap gap-4 mt-4'>
                <span className='text-lg font-medium text-foreground'>
                  Licensors:
                </span>
                <span className='text-lg text-muted-foreground'>
                  {animeData.data.licensors.map((lic) => lic.name).join(', ')}
                </span>
              </div>

              <div className='flex flex-wrap gap-4 mt-4'>
                <span className='text-lg font-medium text-foreground'>
                  Studios:
                </span>
                <span className='text-lg text-muted-foreground'>
                  {animeData.data.studios
                    .map((studio) => studio.name)
                    .join(', ')}
                </span>
              </div>

              <div className='flex flex-wrap gap-4 mt-4'>
                <span className='text-lg font-medium text-foreground'>
                  Duration:
                </span>
                <span className='text-lg text-muted-foreground'>
                  {animeData.data.duration}
                </span>
              </div>

              <div className='flex flex-wrap gap-4 mt-4'>
                <span className='text-lg font-medium text-foreground'>
                  Rating:
                </span>
                <span className='text-lg text-muted-foreground'>
                  {animeData.data.rating}
                </span>
              </div>

              <div className='flex flex-wrap gap-4 mt-4'>
                <span className='text-lg font-medium text-foreground'>
                  Score:
                </span>
                <span className='text-lg text-muted-foreground'>
                  {animeData.data.score}
                </span>
              </div>

              <div className='mt-6'>
                <h2 className='text-2xl font-medium text-foreground'>
                  Trailer
                </h2>
                {animeData.data.trailer && animeData.data.trailer.url ? (
                  <iframe
                    width='100%'
                    height='315'
                    src={animeData.data.trailer.url}
                    title={animeData.data.title}
                    frameBorder='0'
                    allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                    className='mt-4 rounded-lg'
                  />
                ) : (
                  <p className='mt-4 text-lg text-muted-foreground'>
                    No trailer available
                  </p>
                )}
              </div>

              <div className='mt-6'>
                <h2 className='text-2xl font-medium text-foreground'>
                  Background
                </h2>
                <p className='mt-2 text-lg text-muted-foreground'>
                  {animeData.data.background ||
                    'No background information available'}
                </p>
              </div>
            </div>

            <div className='mt-6'>
              <button className='px-6 py-2 transition-all duration-300 rounded-lg text-primary-foreground bg-primary hover:bg-primary-foreground hover:text-primary'>
                Add to Watchlist
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default AnimeDetail
