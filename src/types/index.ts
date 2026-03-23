export type Difficulty = "easy" | "medium" | "hard";

export interface Word {
  id: string;
  word: string;
  language: string;
  country: string;
  countryFlag: string;
  difficulty: Difficulty;
  pronunciation: string; // phonetic guide
  acceptedPronunciations: string[]; // accepted speech-to-text results
}

export interface Player {
  id: string;
  name: string;
  score: number;
  isReady: boolean;
}

export interface GameState {
  id: string;
  players: { [key: string]: Player };
  currentWordIndex: number;
  currentTurn: string; // player id
  words: Word[];
  difficulty: Difficulty;
  status: "waiting" | "ready" | "playing" | "finished";
  round: number;
  maxRounds: number;
  winner?: string;
  createdAt: number;
}

export interface LobbyRoom {
  id: string;
  hostId: string;
  hostName: string;
  difficulty: Difficulty;
  status: "waiting" | "full" | "playing";
  createdAt: number;
}

export type GameMode = "solo" | "online";

export type RootStackParamList = {
  Home: undefined;
  ModeSelect: { difficulty: Difficulty };
  Lobby: { difficulty: Difficulty };
  Game: { gameId: string; playerId: string };
  SoloGame: { difficulty: Difficulty };
  SoloResult: { score: number; total: number; difficulty: Difficulty };
  Result: { gameId: string; playerId: string };
};
