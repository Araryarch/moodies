import { useState } from 'react'
import { cn } from '../../../../lib/utils'

interface MenuProps {
  data: (isClose: boolean) => void
}

const Menu = ({ data }: MenuProps) => {
  const [isClose, setIsClose] = useState(true)

  const handleClick = () => {
    const newIsClose = !isClose
    setIsClose(newIsClose)
    data(newIsClose)
  }

  return (
    <div
      onClick={handleClick}
      className='flex flex-col justify-center w-10 gap-2 transition-all z-[9999999] duration-300 ease-out cursor-pointer menu-wrapper aspect-square xl:hidden'
    >
      <div
        className={cn(
          'w-[80%] h-[2px] bg-primary-foreground garis transition-all duration-500 ease-in-out',
          isClose ? 'rotate-45 -mb-2 ' : 'rotate-0 mb-0'
        )}
      ></div>
      <div
        className={cn(
          'w-[80%] h-[2.2px] bg-primary-foreground garis transition-all duration-300 ease-linear',
          isClose ? '-rotate-45 -mb-2 ' : 'rotate-0'
        )}
      ></div>
    </div>
  )
}

export default Menu
