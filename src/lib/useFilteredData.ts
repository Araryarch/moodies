import { create } from 'zustand'

import { Anime, Manga } from '../types/api'

type FilteredDataStore = {
  filteredAnimeData: Anime[]
  filteredMangaData: Manga[]
  setAnimeFilteredData: (data: Anime[]) => void
  setMangaFilteredData: (data: Manga[]) => void
}

export const useFilteredDataStore = create<FilteredDataStore>((set) => ({
  filteredAnimeData: [],
  filteredMangaData: [],
  setAnimeFilteredData: (data: Anime[]) => set({ filteredAnimeData: data }),
  setMangaFilteredData: (data: Manga[]) => set({ filteredMangaData: data })
}))
