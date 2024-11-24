import AnimeList from './Pages/AnimeList'
import LandingPage from './Pages/LandingPage'
import { Routes, Route } from 'react-router-dom'
import MangaList from './Pages/MangaList'
import SearchPage from './Pages/SearchPage'
import Login from './Pages/Login'
import AnimeDetail from './Pages/AnimeList/AnimeDetail'
import MangaDetail from './Pages/MangaList/MangaDetail'
import Community from './Pages/Community'

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
        element={<AnimeDetail />}
      />
      <Route
        path='/manga'
        element={<MangaList />}
      />
      <Route
        path='/manga/:id'
        element={<MangaDetail />}
      />
      <Route
        path='/search'
        element={<SearchPage />}
      />
      <Route
        path='/login/:type'
        element={<Login />}
      />
      <Route
        path='/community'
        element={<Community />}
      />
    </Routes>
  )
}

export default App
