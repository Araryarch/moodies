import { Manga, Anime } from '../../types/api'

interface MoodListProps {
  animes?: Anime[]
  mangas?: Manga[]
}

const MoodList = ({ animes, mangas }: MoodListProps) => {
  return (
    <div className='container'>
      <div>
        <h1 className='font-bold text-7xl'>Anime with mood</h1>
        {animes?.map((anime, idx) => {
          return (
            <li key={idx}>
              <h1>{anime.title}</h1>
              <p>{anime.synopsis}</p>
            </li>
          )
        })}
      </div>
      <div>
        <h1 className='font-bold text-7xl'>Manga with mood</h1>
        {mangas?.map((manga, idx) => {
          return (
            <li key={idx}>
              <h1>{manga.title}</h1>
              <p>{manga.synopsis}</p>
            </li>
          )
        })}
      </div>
    </div>
  )
}

export default MoodList
