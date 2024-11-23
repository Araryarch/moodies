import { useParams } from 'react-router-dom'
import useMangaById from './hooks/useMangaById'
import Navbar from '../../components/ui/Navbar'
import Footer from '../../components/ui/Footer'

const MangaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  const { mangaData, isLoading, error } = useMangaById({ id: id! })

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

  if (!mangaData) {
    return (
      <div className='text-xl text-center text-muted-foreground'>
        Manga not found
      </div>
    )
  }

  return (
    <main>
      <Navbar />
      <div className='px-8 py-12 pt-24 mx-auto bg-background'>
        <div className='flex flex-col gap-10 md:flex-row'>
          <div className='md:w-1/3'>
            <img
              src={mangaData.data.images.jpg.large_image_url}
              alt={mangaData.data.title}
              className='w-full transition-all duration-300 rounded-lg shadow-lg hover:scale-105'
            />
          </div>

          <div className='space-y-6 md:w-2/3'>
            <h1 className='mb-4 text-4xl font-semibold text-foreground'>
              {mangaData.data.title}
            </h1>
            <p className='text-lg text-muted-foreground'>
              {mangaData.data.synopsis}
            </p>

            <div className='p-6 rounded-lg shadow-md bg-card'>
              <div className='flex flex-wrap gap-4'>
                <span className='text-lg font-medium text-foreground'>
                  Genres:
                </span>
                <span className='text-lg text-muted-foreground'>
                  {mangaData.data.genres.map((genre) => genre.name).join(', ')}
                </span>
              </div>

              <div className='flex flex-wrap gap-4 mt-4'>
                <span className='text-lg font-medium text-foreground'>
                  Status:
                </span>
                <span className='text-lg text-muted-foreground'>
                  {mangaData.data.status || 'N/A'}
                </span>
              </div>

              <div className='flex flex-wrap gap-4 mt-4'>
                <span className='text-lg font-medium text-foreground'>
                  Chapters:
                </span>
                <span className='text-lg text-muted-foreground'>
                  {mangaData.data.chapters}
                </span>
              </div>

              <div className='flex flex-wrap gap-4 mt-4'>
                <span className='text-lg font-medium text-foreground'>
                  Volumes:
                </span>
                <span className='text-lg text-muted-foreground'>
                  {mangaData.data.volumes}
                </span>
              </div>

              <div className='flex flex-wrap gap-4 mt-4'>
                <span className='text-lg font-medium text-foreground'>
                  Published:
                </span>
                <span className='text-lg text-muted-foreground'>
                  {mangaData.data.published.string || 'N/A'}
                </span>
              </div>

              <div className='flex flex-wrap gap-4 mt-4'>
                <span className='text-lg font-medium text-foreground'>
                  Authors:
                </span>
                <span className='text-lg text-muted-foreground'>
                  {mangaData.data.authors
                    .map((author) => author.name)
                    .join(', ')}
                </span>
              </div>

              <div className='flex flex-wrap gap-4 mt-4'>
                <span className='text-lg font-medium text-foreground'>
                  Score:
                </span>
                <span className='text-lg text-muted-foreground'>
                  {mangaData.data.score}
                </span>
              </div>

              <div className='mt-6'>
                <h2 className='text-2xl font-medium text-foreground'>
                  Background
                </h2>
                <p className='mt-2 text-lg text-muted-foreground'>
                  {mangaData.data.background ||
                    'No background information available'}
                </p>
              </div>
            </div>

            <div className='mt-6'>
              <button className='px-6 py-2 transition-all duration-300 rounded-lg text-primary-foreground bg-primary hover:bg-primary-foreground hover:text-primary'>
                Add to Reading List
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default MangaDetail
