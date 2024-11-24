import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../../lib/utils'
import Menu from './components/Menu'
import ToggleTheme from './components/toggletheme'
import Topbar from './components/topbar'
import { FaDiscord, FaInstagram, FaReddit } from 'react-icons/fa'
import { FaX } from 'react-icons/fa6'
import { IoChatbubbles } from 'react-icons/io5'
import Tooltips from '../Tooltips'
import { LibraryBig, TvMinimalPlay } from 'lucide-react'
import { useSearchTermStore } from '../../../lib/useSearchTermStore'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const Navbar = () => {
  const [searchTerm, setLocalSearchTerm] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { setSearchTerm } = useSearchTermStore()

  const placeholders = useMemo(
    () => [
      'Siapa sih Imu Sama di One Piece?',
      'Apa yang bikin kamu suka anime?',
      'Karakter anime siapa yang paling kamu suka?',
      'Gimana pendapatmu tentang One Piece?'
    ],
    []
  )

  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isNavbarOpen, setIsNavbarOpen] = useState(false)
  const [isXL, setIsXL] = useState(window.innerWidth >= 1280)
  const [isProcessing, setIsProcessing] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()

        if (profile) {
          setUserName(profile.full_name)
        }
      }
    }

    fetchUser()
  }, []) // This effect will run when the component mounts or when user changes

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [placeholders.length])

  useEffect(() => {
    const handleResize = () => {
      setIsXL(window.innerWidth >= 1280)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (searchTerm.trim()) {
      navigate('/search')
    }
  }, [searchTerm, navigate])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const term = inputRef.current?.value.trim().toLowerCase() || ''
    setLocalSearchTerm(term)
    setSearchTerm(term)

    setIsProcessing(true)

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.value = ''
      }
      setIsProcessing(false)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUserName(null)
    navigate('/')
  }

  return (
    <nav
      className={cn(
        'z-50 flex items-center justify-between w-full gap-8 px-5 xl:py-4 py-2 transition-all duration-300 ease-in-out backdrop-blur-[100px] xl:justify-around fixed text-foreground',
        isNavbarOpen && !isXL ? 'h-screen items-start p-5 fixed' : ''
      )}
    >
      <ToggleTheme />
      <h1
        className='text-xl font-bold uppercase cursor-pointer xl:flex'
        onClick={() => navigate('/')}
      >
        Moodies<span className='text-destructive'>.</span>
      </h1>
      <Menu data={setIsNavbarOpen} />
      {isNavbarOpen && <Topbar />}

      <form
        className='relative items-center hidden w-full max-w-xl gap-3 p-2 rounded-lg shadow-md xl:flex bg-card'
        onSubmit={onSubmit}
      >
        <input
          type='text'
          placeholder={placeholders[placeholderIndex]}
          ref={inputRef}
          className='w-full px-2 py-1 text-sm bg-transparent border-none outline-none text-secondary-foreground'
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
        />
        <button
          type='submit'
          className='px-4 py-2 text-sm font-bold rounded-md bg-secondary dark:text-white text-secondary-foreground hover:bg-muted'
          disabled={isProcessing}
          aria-label='Search'
        >
          {isProcessing ? 'Loading...' : 'Search'}
        </button>
      </form>

      {!isProcessing && searchTerm.trim() && (
        <p className='text-center text-muted'>
          Searching for "{searchTerm}"...
        </p>
      )}

      <div className='items-center hidden gap-3 medsos-list xl:flex'>
        <Tooltips text='Discord'>
          <FaDiscord
            size={20}
            aria-label='Discord'
          />
        </Tooltips>
        <Tooltips text='X'>
          <FaX
            size={20}
            aria-label='X'
          />
        </Tooltips>
        <Tooltips text='Instagram'>
          <FaInstagram
            size={20}
            aria-label='Instagram'
          />
        </Tooltips>
        <Tooltips text='Reddit'>
          <FaReddit
            size={20}
            aria-label='Reddit'
          />
        </Tooltips>
      </div>

      <div className='items-center justify-center hidden gap-5 text-sm font-medium features-list md:hidden xl:flex'>
        <div
          className='flex flex-col items-center justify-center cursor-pointer'
          onClick={() => navigate('/anime')}
        >
          <TvMinimalPlay size={30} />
          <p>Anime</p>
        </div>
        <div
          className='flex flex-col items-center justify-center cursor-pointer'
          onClick={() => navigate('/manga')}
        >
          <LibraryBig size={30} />
          <p>Manga</p>
        </div>
        <div
          className='flex flex-col items-center justify-center cursor-pointer'
          onClick={() => navigate('/community')}
        >
          <IoChatbubbles size={30} />
          <p>Community</p>
        </div>
        <div className='flex items-center justify-center gap-3 ml-10 uppercase'>
          {userName ? (
            <>
              <span className='font-medium'>{`Hello, ${userName}`}</span>
              <button
                className='px-4 py-2 font-bold transition-all duration-300 ease-in-out rounded-md shadow-2xl bg-secondary hover:bg-muted'
                onClick={handleLogout}
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <button
                className='px-4 py-2 font-bold transition-all duration-300 ease-in-out rounded-md shadow-2xl bg-secondary hover:bg-muted'
                onClick={() => navigate('/login/signup')}
              >
                REGISTER
              </button>
              <button
                className='px-4 py-2 font-bold transition-all duration-300 ease-in-out rounded-md shadow-2xl bg-secondary hover:bg-muted'
                onClick={() => navigate('/login/signin')}
              >
                LOGIN
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
