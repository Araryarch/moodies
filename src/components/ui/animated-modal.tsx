import { cn } from '../../lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

interface ModalContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false)

  return (
    <ModalContext.Provider value={{ open, setOpen }}>
      {children}
    </ModalContext.Provider>
  )
}

export const UseModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('UseModal must be used within a ModalProvider')
  }
  return context
}

export function Modal({ children }: { children: ReactNode }) {
  return <ModalProvider>{children}</ModalProvider>
}

export const ModalTrigger = ({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) => {
  const { setOpen } = UseModal()
  return (
    <button
      className={cn(
        'rounded-md text-black dark:text-white text-center relative overflow-hidden',
        className
      )}
      onClick={() => setOpen(true)}
    >
      {children}
    </button>
  )
}

export const ModalBody = ({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) => {
  const { open, setOpen } = UseModal()

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [open])

  const modalRef = useRef<HTMLDivElement>(null)
  UseOutClick(modalRef, () => setOpen(false))

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          className='fixed [perspective:800px] [transform-style:preserve-3d] inset-0 min-h-screen w-full flex items-center justify-center z-50'
        >
          <Overlay />
          <motion.div
            ref={modalRef}
            className={cn(
              'min-h-[90%] max-h-[100%] md:max-w-[80%] bg-white dark:bg-neutral-950 border border-transparent dark:border-neutral-800 md:rounded-2xl relative z-50 flex flex-col flex-1 overflow-hidden',
              className
            )}
            initial={{ opacity: 0, scale: 0.5, rotateX: 40, y: 40 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: 10 }}
            transition={{ type: 'spring', stiffness: 260, damping: 15 }}
          >
            <CloseIcon />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export const ModalContent = ({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div className={cn('flex flex-col flex-1 p-8 md:p-10', className)}>
      {children}
    </div>
  )
}

export const ModalFooter = ({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn(
        'flex justify-end p-4 bg-gray-100 dark:bg-neutral-900',
        className
      )}
    >
      {children}
    </div>
  )
}

const Overlay = ({ className }: { className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
      exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      className={`fixed inset-0 h-full w-full bg-black bg-opacity-50 z-50 ${className}`}
    ></motion.div>
  )
}

const CloseIcon = () => {
  const { setOpen } = UseModal()
  return (
    <button
      onClick={() => setOpen(false)}
      className='absolute top-4 left-4 group z-[99999999] bg-primary-foreground px-2 py-2 rounded-full'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='40'
        height='40'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='w-4 h-4 text-black transition duration-200 dark:text-black group-hover:scale-125 group-hover:rotate-3'
      >
        <path
          stroke='none'
          d='M0 0h24v24H0z'
          fill='none'
        />
        <path d='M18 6l-12 12' />
        <path d='M6 6l12 12' />
      </svg>
    </button>
  )
}

export const UseOutClick = (
  ref: React.RefObject<HTMLDivElement>,
  callback: () => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }
      callback()
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, callback])
}
