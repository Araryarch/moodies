import { create } from 'zustand'
import { Anime, Manga } from '../types/api'

interface AnimeMangaState {
  animes: Anime[]
  mangas: Manga[]
  setAnimes: (animes: Anime[]) => void
  setMangas: (mangas: Manga[]) => void
}

export const useAnimeMangaStore = create<AnimeMangaState>((set) => ({
  animes: [],
  mangas: [],
  setAnimes: (animes) => set({ animes }),
  setMangas: (mangas) => set({ mangas })
}))
