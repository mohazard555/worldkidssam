

export interface StoryPage {
  imageUrl: string; // base64
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
  coloringPages: ColoringPage[];
  quizzes: QuizQuestion[];
  drawings: Drawing[];
  puzzleImages: ColoringPage[];
  funFacts: FunFact[];
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