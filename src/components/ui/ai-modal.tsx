import { IoChatbubbles } from 'react-icons/io5'
import { Modal, ModalBody, ModalContent, ModalTrigger } from './animated-modal'
import Ai from './AI/ai'

const AiModal = () => {
  return (
    <div className='fixed z-50 p-2 border-2 border-black shadow-2xl bottom-10 right-10 bg-background rounded-xl dark:border-primary-foreground'>
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
