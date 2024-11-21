export interface AnimeImageUrls {
  image_url: string
  small_image_url: string
  large_image_url: string
}

export interface TrailerImages {
  image_url: string
  small_image_url: string
  medium_image_url: string
  large_image_url: string
  maximum_image_url: string
}

export interface Trailer {
  youtube_id: string
  url: string
  embed_url: string
  images: TrailerImages
}

export interface AnimeProducer {
  mal_id: number
  type: string
  name: string
  url: string
}

export interface AnimeLicensor {
  mal_id: number
  type: string
  name: string
  url: string
}

export interface AnimeStudio {
  mal_id: number
  type: string
  name: string
  url: string
}

export interface Genre {
  mal_id: number
  type: string
  name: string
  url: string
}

export interface Theme {
  mal_id: number
  type: string
  name: string
  url: string
}

export interface Manga {
  mal_id: number
  url: string
  images: {
    jpg: AnimeImageUrls
    webp: AnimeImageUrls
  }
  approved: boolean
  titles: {
    type: string
    title: string
  }[]
  title: string
  title_english: string
  title_japanese: string
  title_synonyms: string[]
  type: string
  chapters: number
  volumes: number
  status: string
  publishing: boolean
  published: {
    from: string
    to: string
    prop: {
      from: { day: number; month: number; year: number }
      to: { day: number; month: number; year: number }
    }
    string: string
  }
  score: number
  scored_by: number
  rank: number
  popularity: number
  members: number
  favorites: number
  synopsis: string
  background: string
  authors: {
    mal_id: number
    type: string
    name: string
    url: string
  }[]
  serializations: {
    mal_id: number
    type: string
    name: string
    url: string
  }[]
  genres: Genre[]
  explicit_genres: unknown[]
  themes: Theme[]
  demographics: unknown[]
}

export interface Anime {
  mal_id: number
  url: string
  images: {
    jpg: AnimeImageUrls
    webp: AnimeImageUrls
  }
  trailer: Trailer
  approved: boolean
  titles: {
    type: string
    title: string
  }[]
  title: string
  title_english: string
  title_japanese: string
  title_synonyms: string[]
  type: string
  source: string
  episodes: number
  status: string
  airing: boolean
  aired: {
    from: string
    to: string
    prop: {
      from: { day: number; month: number; year: number }
      to: { day: number; month: number; year: number }
    }
    string: string
  }
  duration: string
  rating: string
  score: number
  scored_by: number
  rank: number
  popularity: number
  members: number
  favorites: number
  synopsis: string
  background: string
  season: string
  year: number
  broadcast: {
    day: string
    time: string
    timezone: string
    string: string
  }
  producers: AnimeProducer[]
  licensors: AnimeLicensor[]
  studios: AnimeStudio[]
  genres: Genre[]
  explicit_genres: unknown[]
  themes: Theme[]
  demographics: unknown[]
}

export interface ApiResponse<T> {
  data: T
  status: string
  message: string
}
