import { ArrowUpRight } from 'lucide-react'
import Tooltips from '../../Tooltips'
import { FaDiscord } from 'react-icons/fa'
import { FaInstagram, FaReddit, FaX } from 'react-icons/fa6'

const Topbar = () => {
  return (
    <div className='fixed inset-0 flex flex-col items-center justify-center xl:hidden bg-white/20'>
      <div className='absolute inset-0 z-10 flex flex-col items-center justify-center gap-10'>
        <h1 className='flex items-center uppercase transition-all duration-300 ease-in-out cursor-pointer text-7xl group'>
          <ArrowUpRight
            size={60}
            className='transition-all duration-300 ease-in-out group-hover:mr-2 group-hover:rotate-45'
          />
          Anime
        </h1>
        <h1 className='flex items-center uppercase cursor-pointer text-7xl group'>
          <ArrowUpRight
            size={60}
            className='transition-all duration-300 ease-in-out group-hover:mr-2 group-hover:rotate-45 '
          />
          Manga
        </h1>
        <h1 className='flex items-center uppercase cursor-pointer text-7xl group'>
          <ArrowUpRight
            size={60}
            className='transition-all duration-300 ease-in-out group-hover:mr-2 group-hover:rotate-45 '
          />
          Community
        </h1>
        <div className='flex gap-2 medsos-wrapper'>
          <Tooltips text='Discord'>
            <FaDiscord size={30} />
          </Tooltips>
          <Tooltips text='X'>
            <FaX size={30} />
          </Tooltips>
          <Tooltips text='Instagram'>
            <FaInstagram size={30} />
          </Tooltips>
          <Tooltips text='Reddit'>
            <FaReddit size={30} />
          </Tooltips>
        </div>
      </div>
    </div>
  )
}

export default Topbar
