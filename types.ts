
export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  thumbnailUrl: string;
  tracks: {
    lang: string;
    url: string;
  }[];
  subtitles?: {
    lang: string;
    url: string;
  }[];
}

export interface Anime {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  bannerUrl: string;
  releaseYear: number;
  rating: number;
  genres: string[];
  episodes: Episode[];
}

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  avatarUrl: string;
}