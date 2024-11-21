import { cn } from '../../../../lib/utils'
import { Anime, Manga } from '../../../../types/api'

interface CardProps {
  item: Anime | Manga
  type: 'anime' | 'manga'
}

const Card: React.FC<CardProps> = ({ item, type }) => {
  const renderGenres = () => {
    const genres = item.genres.slice(0, 2)
    return (
      <div className='flex gap-3 py-2'>
        {genres.map((genre) => (
          <span
            key={genre.name}
            className='px-2 py-1 text-sm font-bold rounded bg-secondary text-secondary-foreground'
          >
            {genre.name}
          </span>
        ))}
        {item.genres.length > 2 && (
          <span className='px-2 py-1 text-sm font-bold rounded bg-secondary text-secondary-foreground'>
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
    <div
      className={cn(
        'relative flex w-[24rem] card aspect-video border-2 border-secondary overflow-hidden rounded-xl cursor-pointer',
        type === 'anime' ? '-mr-2' : '-ml-2'
      )}
    >
      <img
        src={imageUrl}
        alt={item.title}
        className='object-cover w-full h-full rounded-xl'
      />
      <div className='absolute inset-0 transition-all duration-300 ease-in-out bg-black/30 hover:bg-black/50'>
        <div className='absolute px-2 py-1 font-bold rounded-md text-secondary-foreground top-2 left-2 bg-secondary'>
          {item.status || '-'}
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

export default Card
