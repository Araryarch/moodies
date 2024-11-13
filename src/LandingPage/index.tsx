import AiModal from '../components/ui/ai-modal'
import Navbar from '../components/ui/Navbar'

const LandingPage = () => {
  return (
    <main className='relative bg-cover w-full min-h-screen bg-[url("./images/landing/background.jpeg")] dark:bg-[url("./images/landing/goku.gif")]'>
      <Navbar />
      <AiModal />
    </main>
  )
}

export default LandingPage
