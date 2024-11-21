import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../Molecules/tooltip-molecules'

const Tooltips = ({
  children,
  text
}: {
  children: React.ReactNode
  text: string
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className='flex flex-col items-center justify-center'>
          {children}
        </TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default Tooltips
