import {
  ref,
  set,
  push,
  onValue,
  update,
  remove,
  get,
  query,
  orderByChild,
  equalTo,
  off,
} from "firebase/database";
import { db } from "../config/firebase";
import { GameState, Player, Difficulty, LobbyRoom } from "../types";
import { getRandomWords } from "../data/words";

const GAMES_REF = "games";
const LOBBY_REF = "lobby";
const MAX_ROUNDS = 10;

export function generatePlayerId(): string {
  return "player_" + Math.random().toString(36).substr(2, 9);
}

export function generatePlayerName(): string {
  const adjectives = ["Swift", "Bold", "Clever", "Mighty", "Quick", "Sharp", "Brave", "Keen"];
  const nouns = ["Fox", "Wolf", "Eagle", "Lion", "Tiger", "Hawk", "Bear", "Owl"];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 100);
  return `${adj}${noun}${num}`;
}

// Create a lobby room and wait for opponent
export async function createRoom(
  hostId: string,
  hostName: string,
  difficulty: Difficulty
): Promise<string> {
  const lobbyRef = push(ref(db, LOBBY_REF));
  const roomId = lobbyRef.key!;

  const room: LobbyRoom = {
    id: roomId,
    hostId,
    hostName,
    difficulty,
    status: "waiting",
    createdAt: Date.now(),
  };

  await set(lobbyRef, room);
  return roomId;
}

// Find an available room or create one
export async function findOrCreateRoom(
  playerId: string,
  playerName: string,
  difficulty: Difficulty
): Promise<{ roomId: string; isHost: boolean }> {
  const lobbyQuery = query(
    ref(db, LOBBY_REF),
    orderByChild("status"),
    equalTo("waiting")
  );

  const snapshot = await get(lobbyQuery);

  if (snapshot.exists()) {
    const rooms = snapshot.val();
    // Find a room with matching difficulty that isn't ours
    for (const [roomId, room] of Object.entries(rooms) as [string, LobbyRoom][]) {
      if (room.difficulty === difficulty && room.hostId !== playerId) {
        // Join this room
        await update(ref(db, `${LOBBY_REF}/${roomId}`), {
          status: "full",
        });
        // Create game
        await createGame(roomId, room.hostId, room.hostName, playerId, playerName, difficulty);
        return { roomId, isHost: false };
      }
    }
  }

  // No matching room found, create one
  const roomId = await createRoom(playerId, playerName, difficulty);
  return { roomId, isHost: true };
}

// Create a game when two players are matched
export async function createGame(
  roomId: string,
  player1Id: string,
  player1Name: string,
  player2Id: string,
  player2Name: string,
  difficulty: Difficulty
): Promise<void> {
  // Coin flip - random first turn
  const firstTurn = Math.random() < 0.5 ? player1Id : player2Id;
  const words = getRandomWords(difficulty, MAX_ROUNDS);

  const gameState: GameState = {
    id: roomId,
    players: {
      [player1Id]: { id: player1Id, name: player1Name, score: 0, isReady: true },
      [player2Id]: { id: player2Id, name: player2Name, score: 0, isReady: true },
    },
    currentWordIndex: 0,
    currentTurn: firstTurn,
    words,
    difficulty,
    status: "playing",
    round: 1,
    maxRounds: MAX_ROUNDS,
    createdAt: Date.now(),
  };

  await set(ref(db, `${GAMES_REF}/${roomId}`), gameState);
}

// Listen to game state changes
export function subscribeToGame(
  gameId: string,
  callback: (game: GameState | null) => void
): () => void {
  const gameRef = ref(db, `${GAMES_REF}/${gameId}`);
  onValue(gameRef, (snapshot) => {
    callback(snapshot.val());
  });
  return () => off(gameRef);
}

// Listen to lobby room changes
export function subscribeToRoom(
  roomId: string,
  callback: (room: LobbyRoom | null) => void
): () => void {
  const roomRef = ref(db, `${LOBBY_REF}/${roomId}`);
  onValue(roomRef, (snapshot) => {
    callback(snapshot.val());
  });
  return () => off(roomRef);
}

// Handle pronunciation result
export async function handlePronunciation(
  gameId: string,
  playerId: string,
  isCorrect: boolean
): Promise<void> {
  const gameRef = ref(db, `${GAMES_REF}/${gameId}`);
  const snapshot = await get(gameRef);
  const game: GameState = snapshot.val();

  if (!game || game.status !== "playing") return;

  const playerIds = Object.keys(game.players);
  const otherPlayerId = playerIds.find((id) => id !== playerId)!;

  if (isCorrect) {
    // Correct: add point, move to next word
    const newScore = (game.players[playerId]?.score || 0) + 1;
    const newWordIndex = game.currentWordIndex + 1;
    const newRound = game.round + 1;

    if (newWordIndex >= game.words.length || newRound > game.maxRounds) {
      // Game over
      const p1Id = playerIds[0];
      const p2Id = playerIds[1];
      const p1Score = p1Id === playerId ? newScore : game.players[p1Id].score;
      const p2Score = p2Id === playerId ? newScore : game.players[p2Id].score;
      const winner = p1Score > p2Score ? p1Id : p2Score > p1Score ? p2Id : "draw";

      await update(gameRef, {
        [`players/${playerId}/score`]: newScore,
        currentWordIndex: newWordIndex,
        status: "finished",
        winner,
      });
    } else {
      await update(gameRef, {
        [`players/${playerId}/score`]: newScore,
        currentWordIndex: newWordIndex,
        round: newRound,
        currentTurn: playerId, // correct answer: same player continues
      });
    }
  } else {
    // Wrong: turn passes to opponent, same word
    await update(gameRef, {
      currentTurn: otherPlayerId,
    });
  }
}

// Clean up room from lobby
export async function cleanupRoom(roomId: string): Promise<void> {
  await remove(ref(db, `${LOBBY_REF}/${roomId}`));
}

// Leave / forfeit game
export async function forfeitGame(
  gameId: string,
  playerId: string
): Promise<void> {
  const gameRef = ref(db, `${GAMES_REF}/${gameId}`);
  const snapshot = await get(gameRef);
  const game: GameState = snapshot.val();

  if (!game) return;

  const otherPlayerId = Object.keys(game.players).find((id) => id !== playerId);

  await update(gameRef, {
    status: "finished",
    winner: otherPlayerId || "draw",
  });
}
