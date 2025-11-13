

export interface StoryPage {
  imageUrl: string; // base64
  text?: string;
  audioUrl?: string; // base64 data URL
}

export interface Story {
  id: string;
  title: string;
  thumbnailUrl: string; // base64
  pages: StoryPage[];
  isNew?: boolean;
}

export interface ColoringPage {
  id: string;
  imageUrl: string; // base64
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Drawing {
  id: string;
  imageUrl: string; // base64
  title: string;
}

export interface FunFact {
  id: string;
  text: string;
  imageUrl: string;
}

export interface AnimalFlashcard {
    name: string;
    image: string; // base64 svg
}

export interface AlphabetFlashcard {
    letter: string;
    word: string;
    image: string; // emoji
    color: string; // tailwind bg color
}

export interface ColorFlashcard {
    name: string;
    hex: string;
}

export interface NumberFlashcard {
    number: number;
    word: string;
    representation: string; // emoji
}

export interface ShapeFlashcard {
    name: string;
    image: string; // base64 svg
    colorClass: string;
}

export interface FunnyFlashcard {
    name: string;
    image: string; // emoji
}


export interface AppSettings {
  siteTitle: string;
  logoUrl: string; // base64
  youtubeUrls: string[];
  externalLink: string;
  backgroundMusicUrl?: string; // base64 data URL
  backgroundImageUrl?: string; // base64
  developerName: string;
  developerLink: string;
  siteNotice?: string;
  aboutSectionText?: string;
  coloringPages: ColoringPage[];
  quizzes: QuizQuestion[];
  drawings: Drawing[];
  puzzleImages: ColoringPage[];
  funFacts: FunFact[];
  animalFlashcards: AnimalFlashcard[];
  colorFlashcards: ColorFlashcard[];
  numberFlashcards: NumberFlashcard[];
  shapeFlashcards: ShapeFlashcard[];
  funnyFlashcards: FunnyFlashcard[];
  arabicAlphabetData: AlphabetFlashcard[];
  englishAlphabetData: AlphabetFlashcard[];
}

export interface Advertisement {
  id: string;
  enabled: boolean;
  title: string;
  description: string;
  imageUrl: string; // base64
  linkUrl: string;
}

export interface GistSettings {
    rawUrl: string;
    accessToken: string;
}

export interface AppData {
    settings: AppSettings;
    stories: Story[];
    advertisements: Advertisement[];
    gist: GistSettings;
}