import { X } from 'lucide-react'

interface SidebarProps {
  classname?: string
  onClose?: () => void
}

const Sidebar = ({ classname, onClose }: SidebarProps) => {
  return (
    <div
      className={`absolute transition-all duration-300 ease-in-out inset-0 min-h-screen z-50 max-w-sm p-7 sidebar ${classname} backdrop-blur-3xl bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.4)]`}
    >
      <div className='flex justify-between w-full title-wrapper'>
        <X
          size={30}
          className='cursor-pointer'
          onClick={onClose}
        />
        <h1 className='text-2xl font-bold uppercase'>Moodies.</h1>
      </div>
      <div className='side-wrapper'></div>
    </div>
  )
}

export default Sidebar
