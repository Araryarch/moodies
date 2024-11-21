import LandingPage from './Pages/LandingPage'
import { cn } from './lib/utils'

const App = () => {
  return (
    <main
      id='landing'
      className={cn(
        'w-full min-h-screen bg-primary transition-all duration-300 ease-in-out'
      )}
    >
      <LandingPage />
    </main>
  )
}

export default App
