import AnimeList from './Pages/AnimeList'
import LandingPage from './Pages/LandingPage'
import { Routes, Route } from 'react-router-dom'
import MangaList from './Pages/MangaList'
import SearchPage from './Pages/SearchPage'
import Login from './Pages/Login'

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
      <Route
        path='/search'
        element={<SearchPage />}
      />
      <Route
        path='/login'
        element={<Login />}
      />
    </Routes>
  )
}

export default App
