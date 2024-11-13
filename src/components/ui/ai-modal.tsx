import { IoChatbubbles } from 'react-icons/io5'
import { Modal, ModalBody, ModalContent, ModalTrigger } from './animated-modal'
import Ai from './AI/ai'

const AiModal = () => {
  return (
    <div className='fixed z-50 p-2 bottom-10 right-10 bg-primary rounded-xl'>
      <Modal>
        <ModalTrigger className='flex flex-col items-center justify-center cursor-pointer'>
          <IoChatbubbles
            size={30}
            className='text-primary-foreground'
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
