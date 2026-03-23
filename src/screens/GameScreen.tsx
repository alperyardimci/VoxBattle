import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Vibration,
  Platform,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, GameState, Word } from "../types";
import {
  subscribeToGame,
  handlePronunciation,
  forfeitGame,
} from "../services/gameService";
import {
  checkPronunciation,
  startListening,
  stopListening,
  useSpeechRecognitionEvent,
  getLocaleForLanguage,
} from "../services/speechService";
import Twemoji from "../components/Twemoji";

type Props = NativeStackScreenProps<RootStackParamList, "Game">;

export default function GameScreen({ route, navigation }: Props) {
  const { gameId, playerId } = route.params;
  const [game, setGame] = useState<GameState | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [spokenText, setSpokenText] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const feedbackAnim = useRef(new Animated.Value(0)).current;
  const wordAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingRef = useRef(false);

  // Speech recognition events
  useSpeechRecognitionEvent("result", (event) => {
    if (pendingRef.current) return;
    const transcript = event.results[0]?.transcript || "";
    setSpokenText(transcript);

    if (event.isFinal && currentWord) {
      pendingRef.current = true;
      setIsRecording(false);
      setIsProcessing(false);
      pulseAnim.setValue(1);
      if (timerRef.current) clearInterval(timerRef.current);

      const allTranscripts = event.results.map((r: any) => r?.transcript || "").filter(Boolean);
      const correct = allTranscripts.some((t: string) =>
        checkPronunciation(t, currentWord.acceptedPronunciations)
      );
      if (correct) {
        showFeedback("Doğru! +1 Puan", true);
      } else {
        showFeedback(`Yanlış! "${transcript}"`, false);
      }
      setTimeout(async () => {
        await handlePronunciation(gameId, playerId, correct);
        pendingRef.current = false;
      }, 1000);
    }
  });

  useSpeechRecognitionEvent("error", () => {
    setIsRecording(false);
    setIsProcessing(false);
    pulseAnim.setValue(1);
    showFeedback("Ses algılanamadı", false);
  });

  useSpeechRecognitionEvent("end", () => {
    setIsRecording(false);
    setIsProcessing(false);
    pulseAnim.setValue(1);
  });

  useEffect(() => {
    const unsub = subscribeToGame(gameId, (gameState) => {
      setGame(gameState);
      if (gameState?.status === "finished") {
        navigation.replace("Result", { gameId, playerId });
      }
    });
    return unsub;
  }, [gameId]);

  // Word entrance animation
  useEffect(() => {
    if (game) {
      wordAnim.setValue(0);
      Animated.spring(wordAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  }, [game?.currentWordIndex]);

  // Timer for each turn
  useEffect(() => {
    if (!game || game.status !== "playing") return;

    const isMyTurn = game.currentTurn === playerId;
    if (!isMyTurn) {
      setTimeLeft(10);
      return;
    }

    setTimeLeft(10);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - count as wrong
          if (timerRef.current) clearInterval(timerRef.current);
          handlePronunciation(gameId, playerId, false);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [game?.currentTurn, game?.currentWordIndex]);

  const isMyTurn = game?.currentTurn === playerId;
  const currentWord: Word | undefined = game?.words[game.currentWordIndex];
  const myScore = game?.players[playerId]?.score || 0;
  const opponentId = game
    ? Object.keys(game.players).find((id) => id !== playerId)
    : null;
  const opponentScore = opponentId
    ? game?.players[opponentId]?.score || 0
    : 0;
  const opponentName = opponentId
    ? game?.players[opponentId]?.name || "Rakip"
    : "Rakip";
  const myName = game?.players[playerId]?.name || "Sen";

  const showFeedback = (text: string, isPositive: boolean) => {
    setFeedback(text);
    feedbackAnim.setValue(1);
    if (Platform.OS !== "web") Vibration.vibrate(isPositive ? 100 : [0, 100, 100, 100]);
    Animated.timing(feedbackAnim, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => setFeedback(null));
  };

  const handleMicPress = async () => {
    if (!isMyTurn || isProcessing || !currentWord || pendingRef.current) return;

    if (!isRecording) {
      setIsRecording(true);
      setSpokenText("");
      const locale = getLocaleForLanguage(currentWord.language);
      try {
        await startListening(locale);
      } catch {
        setIsRecording(false);
        showFeedback("Mikrofon hatası!", false);
        return;
      }
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      setIsRecording(false);
      setIsProcessing(true);
      pulseAnim.setValue(1);
      stopListening();
    }
  };

  const handleForfeit = () => {
    Alert.alert(
      "Pes Et",
      "Oyundan çıkmak istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Pes Et",
          style: "destructive",
          onPress: () => forfeitGame(gameId, playerId),
        },
      ]
    );
  };

  if (!game || !currentWord) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header - Scores */}
      <View style={styles.header}>
        <View style={[styles.playerBox, isMyTurn && styles.activePlayer]}>
          <Text style={styles.playerName}>{myName}</Text>
          <Text style={styles.playerScore}>{myScore}</Text>
        </View>

        <View style={styles.roundInfo}>
          <Text style={styles.roundText}>
            {game.round}/{game.maxRounds}
          </Text>
          <Text style={styles.vsText}>VS</Text>
        </View>

        <View style={[styles.playerBox, !isMyTurn && styles.activePlayer]}>
          <Text style={styles.playerName}>{opponentName}</Text>
          <Text style={styles.playerScore}>{opponentScore}</Text>
        </View>
      </View>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <View
          style={[
            styles.timerBar,
            {
              width: `${(timeLeft / 10) * 100}%`,
              backgroundColor:
                timeLeft > 5 ? "#4CAF50" : timeLeft > 3 ? "#FF9800" : "#F44336",
            },
          ]}
        />
      </View>

      {/* Word Display */}
      <Animated.View
        style={[
          styles.wordContainer,
          {
            transform: [
              { scale: wordAnim },
              {
                translateY: wordAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Twemoji emoji={currentWord.countryFlag} size={50} />
        <Text style={styles.countryName}>
          {currentWord.country} - {currentWord.language}
        </Text>
        <Text style={styles.wordText}>{currentWord.word}</Text>
        <Text style={styles.pronunciation}>[ {currentWord.pronunciation} ]</Text>
      </Animated.View>

      {/* Turn Info */}
      <View style={styles.turnContainer}>
        {isMyTurn ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Twemoji emoji="🎤" size={22} />
            <Text style={styles.turnText}> Senin sıran!</Text>
          </View>
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Twemoji emoji="⏳" size={22} />
            <Text style={styles.turnTextWait}> Rakibin sırası...</Text>
          </View>
        )}
      </View>

      {/* Feedback */}
      {feedback && (
        <Animated.View
          style={[
            styles.feedbackContainer,
            {
              opacity: feedbackAnim,
              transform: [
                {
                  translateY: feedbackAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text
            style={[
              styles.feedbackText,
              {
                color: feedback.includes("Doğru") ? "#4CAF50" : "#F44336",
              },
            ]}
          >
            {feedback}
          </Text>
        </Animated.View>
      )}

      {/* Spoken Text */}
      {spokenText ? (
        <Text style={styles.spokenText}>Söylenen: "{spokenText}"</Text>
      ) : null}

      {/* Mic Button */}
      <View style={styles.micContainer}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={[
              styles.micButton,
              !isMyTurn && styles.micButtonDisabled,
              isRecording && styles.micButtonRecording,
            ]}
            onPress={handleMicPress}
            disabled={!isMyTurn || isProcessing}
            activeOpacity={0.7}
          >
            <Twemoji emoji={isProcessing ? "⏳" : isRecording ? "⏹️" : "🎙️"} size={40} />
          </TouchableOpacity>
        </Animated.View>
        <Text style={styles.micHint}>
          {isProcessing
            ? "Değerlendiriliyor..."
            : isRecording
            ? "Dinleniyor... Bitirmek için dokun"
            : isMyTurn
            ? "Telaffuz etmek için dokun"
            : "Rakibin sırasını bekle"}
        </Text>
      </View>

      {/* Forfeit Button */}
      <TouchableOpacity style={styles.forfeitButton} onPress={handleForfeit}>
        <Text style={styles.forfeitText}>Pes Et</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  playerBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  activePlayer: {
    borderColor: "#e94560",
    backgroundColor: "rgba(233, 69, 96, 0.1)",
  },
  playerName: {
    fontSize: 14,
    color: "#a0a0c0",
    fontWeight: "600",
  },
  playerScore: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "900",
  },
  roundInfo: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  roundText: {
    fontSize: 14,
    color: "#a0a0c0",
    fontWeight: "600",
  },
  vsText: {
    fontSize: 20,
    color: "#e94560",
    fontWeight: "900",
  },
  timerContainer: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 3,
    marginBottom: 20,
    overflow: "hidden",
  },
  timerBar: {
    height: "100%",
    borderRadius: 3,
  },
  wordContainer: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(233, 69, 96, 0.2)",
  },
  countryFlag: {
    fontSize: 50,
    marginBottom: 8,
  },
  countryName: {
    fontSize: 14,
    color: "#a0a0c0",
    marginBottom: 12,
    letterSpacing: 1,
  },
  wordText: {
    fontSize: 40,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  pronunciation: {
    fontSize: 18,
    color: "#e94560",
    fontStyle: "italic",
  },
  turnContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  turnText: {
    fontSize: 20,
    color: "#4CAF50",
    fontWeight: "700",
  },
  turnTextWait: {
    fontSize: 20,
    color: "#FF9800",
    fontWeight: "700",
  },
  feedbackContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: "900",
  },
  spokenText: {
    fontSize: 14,
    color: "#a0a0c0",
    textAlign: "center",
    marginBottom: 10,
    fontStyle: "italic",
  },
  micContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  micButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e94560",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  micButtonDisabled: {
    backgroundColor: "#555",
    shadowColor: "#000",
  },
  micButtonRecording: {
    backgroundColor: "#F44336",
  },
  micIcon: {
    fontSize: 40,
  },
  micHint: {
    fontSize: 13,
    color: "#a0a0c0",
    marginTop: 10,
    textAlign: "center",
  },
  forfeitButton: {
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  forfeitText: {
    fontSize: 14,
    color: "#666",
    textDecorationLine: "underline",
  },
});
