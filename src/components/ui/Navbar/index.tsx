import { useState, useEffect, useRef } from 'react'
import { LibraryBig, Menu, TvMinimalPlayIcon } from 'lucide-react'
import { FaDiscord, FaInstagram, FaReddit } from 'react-icons/fa'
import { FaX } from 'react-icons/fa6'
import { IoChatbubbles } from 'react-icons/io5'
import Tooltips from '../Tooltips'
import Sidebar from './components/sidebar'
import { cn } from '../../../lib/utils'

import ToggleTheme from './components/toggletheme'
import useGetAllAnime from '../../../LandingPage/hooks/useGetAllAnime'
import { useFilteredDataStore } from '../../../lib/useFilteredData'
import useGetAllManga from '../../../LandingPage/hooks/useGetAllManga'

const Navbar = () => {
  const [isSidebar, setIsSidebar] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)

  const { animeData } = useGetAllAnime({ searchTerm })
  const { mangaData } = useGetAllManga({ searchTerm })

  const setAnimeFilteredData = useFilteredDataStore(
    (state) => state.setAnimeFilteredData
  )
  const setMangaFilteredData = useFilteredDataStore(
    (state) => state.setMangaFilteredData
  )

  const placeholders = [
    'Siapa sih Imu Sama di One Piece?',
    'Apa yang bikin kamu suka anime?',
    'Karakter anime siapa yang paling kamu suka?',
    'Gimana pendapatmu tentang One Piece?'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [placeholders.length])

  useEffect(() => {
    if (searchTerm) {
      // Filter anime data secara lengkap (bukan hanya judul)
      const filteredAnimeData =
        animeData?.data.filter((animeItem) =>
          animeItem.title.toLowerCase().includes(searchTerm)
        ) || []

      // Filter manga data secara lengkap (bukan hanya judul)
      const filteredMangaData =
        mangaData?.data.filter((mangaItem) =>
          mangaItem.title.toLowerCase().includes(searchTerm)
        ) || []

      // Simpan objek yang sudah difilter
      setAnimeFilteredData(filteredAnimeData)
      setMangaFilteredData(filteredMangaData)
    } else {
      setAnimeFilteredData([]) // Clear jika searchTerm kosong
      setMangaFilteredData([]) // Clear jika searchTerm kosong
    }
  }, [
    searchTerm,
    animeData,
    mangaData,
    setAnimeFilteredData,
    setMangaFilteredData
  ])

  const handleCloseSidebar = () => {
    setIsSidebar(false)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const term = inputRef.current?.value.toLowerCase() || ''
    setSearchTerm(term)

    if (inputRef.current) {
      inputRef.current.value = ''
    }

    const filteredAnimeData =
      animeData?.data.filter((animeItem) =>
        animeItem.title.toLowerCase().includes(term)
      ) || []

    const filteredMangaData =
      mangaData?.data.filter((mangaItem) =>
        mangaItem.title.toLowerCase().includes(term)
      ) || []

    setAnimeFilteredData(filteredAnimeData)
    setMangaFilteredData(filteredMangaData)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  return (
    <nav
      className={cn(
        'z-50 flex items-center justify-between w-full gap-8 px-5 py-4 transition-all duration-300 ease-in-out backdrop-blur-[100px] xl:justify-around fixed text-foreground'
      )}
    >
      <ToggleTheme />
      <Menu
        size={30}
        className='cursor-pointer xl:hidden'
        onClick={() => setIsSidebar(true)}
      />
      <h1 className='hidden text-xl font-bold uppercase xl:flex'>
        Moodies<span className='text-destructive'>.</span>
      </h1>
      <form
        className='relative flex items-center w-full max-w-xl gap-3 p-2 rounded-lg shadow-md bg-card'
        onSubmit={onSubmit}
      >
        <input
          type='text'
          placeholder={placeholders[placeholderIndex]}
          ref={inputRef}
          className='w-full px-2 py-1 text-sm bg-transparent border-none outline-none text-primary'
          onKeyDown={handleKeyDown}
        />
        <button
          type='submit'
          className='px-4 py-2 text-sm font-bold rounded-md bg-secondary dark:text-white text-secondary-foreground hover:bg-muted'
        >
          Search
        </button>
      </form>
      <div className='items-center hidden gap-3 medsos-list xl:flex'>
        <Tooltips text='Discord'>
          <FaDiscord size={20} />
        </Tooltips>
        <Tooltips text='X'>
          <FaX size={20} />
        </Tooltips>
        <Tooltips text='Instagram'>
          <FaInstagram size={20} />
        </Tooltips>
        <Tooltips text='Reddit'>
          <FaReddit size={20} />
        </Tooltips>
      </div>
      <div className='items-center justify-center hidden gap-5 text-sm font-medium features-list md:hidden xl:flex'>
        <div className='flex flex-col items-center justify-center cursor-pointer'>
          <TvMinimalPlayIcon size={30} />
          <p>Anime</p>
        </div>
        <div className='flex flex-col items-center justify-center cursor-pointer'>
          <LibraryBig size={30} />
          <p>Manga</p>
        </div>
        <div className='flex flex-col items-center justify-center cursor-pointer'>
          <IoChatbubbles size={30} />
          <p>Community</p>
        </div>
      </div>
      <div className='items-center justify-center hidden gap-2 ml-28 auth xl:flex'>
        <button className='px-4 py-2 rounded-md shadow-2xl bg-secondary hover:bg-muted text-card-foreground'>
          Register
        </button>
        <button className='px-4 py-2 rounded-md shadow-2xl bg-secondary hover:bg-muted text-card-foreground'>
          Login
        </button>
      </div>
      <Sidebar
        classname={`${isSidebar ? 'ml-0 xl:-ml-96' : '-ml-96'}`}
        onClose={handleCloseSidebar}
      />
    </nav>
  )
}

export default Navbar
