import { useEffect, useState } from 'react'
import { IoChatbubbles } from 'react-icons/io5'
import { Modal, ModalBody, ModalContent, ModalTrigger } from './animated-modal'
import Ai from './AI/ai'

const AiModal = () => {
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = document.documentElement.clientHeight
      const isBottom = scrollTop + clientHeight >= scrollHeight - 10

      setIsScrolledToBottom(isBottom)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      className={`fixed right-2 bottom-2 z-50 p-2 border-2 border-black shadow-2xl bg-background rounded-xl dark:border-primary-foreground transition-all duration-300 ${
        isScrolledToBottom ? 'bottom-16' : 'bottom-2'
      }`}
    >
      <Modal>
        <ModalTrigger className='flex flex-col items-center justify-center cursor-pointer'>
          <IoChatbubbles
            size={30}
            className='text-black dark:text-primary-foreground'
          />
        </ModalTrigger>
        <ModalBody>
          <ModalContent>
            <Ai />
          </ModalContent>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default AiModal
