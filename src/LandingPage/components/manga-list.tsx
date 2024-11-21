import { Manga } from '../../types/api'

interface MangaListProps {
  data: Manga[]
}

const MangaList = ({ data }: MangaListProps) => {
  return (
    <div className='container'>
      <h1 className='font-bold text-7xl'>Manga List</h1>
      {data?.map((manga, idx) => {
        return (
          <li key={idx}>
            <h1>{manga.title}</h1>
            <p>{manga.synopsis}</p>
          </li>
        )
      })}
    </div>
  )
}

export default MangaList
