import { Anime } from '../../types/api'

interface AnimeListProps {
  data: Anime[]
}

const AnimeList = ({ data }: AnimeListProps) => {
  return (
    <div className='container'>
      <h1 className='font-bold text-7xl'>Anime List</h1>
      {data?.map((Anime, idx) => {
        return (
          <li key={idx}>
            <h1>{Anime.title}</h1>
            <p>{Anime.synopsis}</p>
          </li>
        )
      })}
    </div>
  )
}

export default AnimeList
