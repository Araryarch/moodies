import AnimeList from './Pages/AnimeList'
import LandingPage from './Pages/LandingPage'
import { Routes, Route } from 'react-router-dom'
import MangaList from './Pages/MangaList'

const App = () => {
  return (
    <Routes>
      <Route
        path='/'
        element={<LandingPage />}
      />
      <Route
        path='/anime'
        element={<AnimeList />}
      />
      <Route
        path='/anime/:id'
        element={<AnimeList />}
      />
      <Route
        path='/manga'
        element={<MangaList />}
      />
      <Route
        path='/manga/:id'
        element={<MangaList />}
      />
    </Routes>
  )
}

export default App
