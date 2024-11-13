import { LibraryBig, Menu, TvMinimalPlayIcon } from 'lucide-react'
import { PlaceholdersAndVanishInput } from '../placeholders-and-vanish-input'
import { FaDiscord, FaInstagram, FaReddit } from 'react-icons/fa'
import { FaX } from 'react-icons/fa6'
import { IoChatbubbles } from 'react-icons/io5'
import Tooltips from '../Tooltips'
import Sidebar from './components/sidebar'
import { useState, useRef } from 'react'
import { cn } from '../../../lib/utils'
import ToggleTheme from './components/toggletheme'
import useGetAllAnime from '../../../LandingPage/hooks/useGetAllAnime'

const Navbar = () => {
  const [isSidebar, setIsSidebar] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { animeData } = useGetAllAnime({ query: inputRef.current?.value || '' })

  console.log({ animeData })

  const handleCloseSidebar = () => {
    setIsSidebar(false)
  }

  const placeholders = [
    'Siapa sih Imu Sama di One Piece? ',
    'Apa yang bikin kamu suka anime? ',
    'Karakter anime siapa yang paling kamu suka? ',
    'Gimana pendapatmu tentang One Piece? '
  ]

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const searchTerm = inputRef.current?.value
    console.log('Submitted search term:', searchTerm)
  }

  return (
    <nav
      className={cn(
        'z-50 flex items-center justify-between w-full gap-8 px-5 py-4 transition-all duration-300 ease-in-out backdrop-blur-3xl bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.4)] text-primary-foreground xl:justify-around'
      )}
    >
      <ToggleTheme />
      <Menu
        size={30}
        className='cursor-pointer xl:hidden'
        onClick={() => setIsSidebar(true)}
      />
      <h1 className='hidden text-2xl font-bold uppercase xl:flex'>Moodies.</h1>
      <PlaceholdersAndVanishInput
        classname='px-20 md:px-10 xl:p-0'
        placeholders={placeholders}
        onSubmit={onSubmit}
        onChange={() => {}}
      />
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
      <div className='items-center justify-center hidden gap-5 font-medium features-list md:hidden xl:flex'>
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
        <button className='px-4 py-2 rounded-md bg-card hover:bg-muted text-card-foreground'>
          Register
        </button>
        <button className='px-4 py-2 rounded-md bg-card hover:bg-muted text-card-foreground'>
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
