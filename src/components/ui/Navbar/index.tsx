import { useState, useEffect, useRef } from 'react'
import { LibraryBig, TvMinimalPlayIcon } from 'lucide-react'
import Menu from './components/Menu'
import { FaDiscord, FaInstagram, FaReddit } from 'react-icons/fa'
import { FaX } from 'react-icons/fa6'
import { IoChatbubbles } from 'react-icons/io5'
import Tooltips from '../Tooltips'
import { useNavigate } from 'react-router-dom'

import { cn } from '../../../lib/utils'

import ToggleTheme from './components/toggletheme'
import useGetAllAnime from '../../../Pages/LandingPage/hooks/useGetAllAnime'
import { useFilteredDataStore } from '../../../lib/useFilteredData'
import useGetAllManga from '../../../Pages/LandingPage/hooks/useGetAllManga'
import Topbar from './components/topbar'

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isNavbar, setIsNavbar] = useState(false)
  const [isXL, setIsXL] = useState(false)

  const { animeData } = useGetAllAnime({ searchTerm })
  const { mangaData } = useGetAllManga({ searchTerm })

  const setAnimeFilteredData = useFilteredDataStore(
    (state) => state.setAnimeFilteredData
  )
  const setMangaFilteredData = useFilteredDataStore(
    (state) => state.setMangaFilteredData
  )

  const handleClick = (props: boolean) => {
    console.log('clicked', props)
    setIsNavbar(props)
  }

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
      const filteredAnimeData =
        animeData?.data.filter((animeItem) =>
          animeItem.title.toLowerCase().includes(searchTerm)
        ) || []

      const filteredMangaData =
        mangaData?.data.filter((mangaItem) =>
          mangaItem.title.toLowerCase().includes(searchTerm)
        ) || []

      setAnimeFilteredData(filteredAnimeData)
      setMangaFilteredData(filteredMangaData)
    } else {
      setAnimeFilteredData([])
      setMangaFilteredData([])
    }
  }, [
    searchTerm,
    animeData,
    mangaData,
    setAnimeFilteredData,
    setMangaFilteredData
  ])

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

  useEffect(() => {
    const handleResize = () => {
      setIsXL(window.innerWidth >= 1280) // Set to true if the window width is XL (>= 1280px)
    }
    handleResize() // Check the initial window size
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navigate = useNavigate()

  return (
    <nav
      className={cn(
        'z-50 flex items-center justify-between w-full gap-8 px-5 xl:py-4 py-2 transition-all duration-300 ease-in-out backdrop-blur-[100px] xl:justify-around fixed text-foreground',
        isNavbar && !isXL ? 'h-screen items-start p-5 fixed' : ''
      )}
    >
      <ToggleTheme />
      <h1 className='text-xl font-bold uppercase xl:flex'>
        Moodies<span className='text-destructive'>.</span>
      </h1>
      <Menu data={handleClick} />
      {isNavbar && <Topbar />}
      <form
        className='relative items-center hidden w-full max-w-xl gap-3 p-2 rounded-lg shadow-md xl:flex bg-card'
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
        <div
          className='flex flex-col items-center justify-center cursor-pointer'
          onClick={() => navigate('/anime')}
        >
          <TvMinimalPlayIcon size={30} />
          <p>Anime</p>
        </div>
        <div className='flex flex-col items-center justify-center cursor-pointer'>
          <LibraryBig
            size={30}
            onClick={() => navigate('/manga')}
          />
          <p>Manga</p>
        </div>
        <div className='flex flex-col items-center justify-center cursor-pointer'>
          <IoChatbubbles
            size={30}
            onClick={() => navigate('/community')}
          />
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
    </nav>
  )
}

export default Navbar
