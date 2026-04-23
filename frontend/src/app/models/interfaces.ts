export interface Category {
  id: number;
  name: string;
}

export interface Flashcard {
  id: number;
  deck: number;
  question: string;
  answer: string;
}

export interface Deck {
  id: number;
  title: string;
  description: string;
  category: number;
  category_name: string;
  author: number;
  cards: Flashcard[];
}

export interface Stats {
  total_decks: number;
  total_cards: number;
}

export interface AuthResponse {
  token: string;
  username: string;
}