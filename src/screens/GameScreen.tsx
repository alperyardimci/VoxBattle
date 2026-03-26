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
  voteSkipWord,
} from "../services/gameService";
import {
  checkPronunciation,
  startListening,
  stopListening,
  useSpeechRecognitionEvent,
  getLocaleForLanguage,
  getCurrentLang,
} from "../services/speechService";
import Twemoji from "../components/Twemoji";
import { showAdIfReady, loadAd } from "../services/adService";

type Props = NativeStackScreenProps<RootStackParamList, "Game">;

export default function GameScreen({ route, navigation }: Props) {
  const { gameId, playerId } = route.params;
  const [game, setGame] = useState<GameState | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [spokenText, setSpokenText] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasVotedSkip, setHasVotedSkip] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const feedbackAnim = useRef(new Animated.Value(0)).current;
  const wordAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingRef = useRef(false);
  const retryCountRef = useRef(0);

  const isMyTurn = game?.currentTurn === playerId;
  const currentWord: Word | undefined = game?.words[game.currentWordIndex];
  const myScore = game?.players[playerId]?.score || 0;
  const opponentId = game ? Object.keys(game.players).find((id) => id !== playerId) : null;
  const opponentScore = opponentId ? game?.players[opponentId]?.score || 0 : 0;
  const opponentName = opponentId ? game?.players[opponentId]?.name || "Rakip" : "Rakip";
  const myName = game?.players[playerId]?.name || "Sen";
  const skipVotes = game?.skipVotes || {};
  const mySkipVote = skipVotes[playerId] || false;
  const opponentSkipVote = opponentId ? skipVotes[opponentId] || false : false;

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
        checkPronunciation(t, currentWord.acceptedPronunciations, currentWord.language)
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

  useSpeechRecognitionEvent("error", async () => {
    if (retryCountRef.current === 0 && getCurrentLang() !== "en-US") {
      retryCountRef.current = 1;
      try { await startListening("en-US"); return; } catch {}
    }
    retryCountRef.current = 0;
    setIsRecording(false);
    setIsProcessing(false);
    pulseAnim.setValue(1);
    showFeedback("Ses algılanamadı", false);
  });

  useSpeechRecognitionEvent("end", () => {
    if (!pendingRef.current && retryCountRef.current === 0) {
      setIsRecording(false);
      setIsProcessing(false);
      pulseAnim.setValue(1);
    }
  });

  useEffect(() => {
    const unsub = subscribeToGame(gameId, (gameState) => {
      setGame(gameState);
      if (gameState?.status === "finished") {
        showAdIfReady().then(() => {
          loadAd();
          navigation.replace("Result", { gameId, playerId });
        });
      }
    });
    return unsub;
  }, [gameId]);

  // Reset skip vote when word changes
  useEffect(() => {
    setHasVotedSkip(false);
  }, [game?.currentWordIndex]);

  // Word entrance animation
  useEffect(() => {
    if (game) {
      wordAnim.setValue(0);
      Animated.spring(wordAnim, {
        toValue: 1, friction: 5, tension: 40, useNativeDriver: true,
      }).start();
    }
  }, [game?.currentWordIndex]);

  // Timer for each turn
  useEffect(() => {
    if (!game || game.status !== "playing") return;
    if (!isMyTurn) { setTimeLeft(10); return; }

    setTimeLeft(10);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handlePronunciation(gameId, playerId, false);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [game?.currentTurn, game?.currentWordIndex]);

  const showFeedback = (text: string, isPositive: boolean) => {
    setFeedback(text);
    feedbackAnim.setValue(1);
    if (Platform.OS !== "web") Vibration.vibrate(isPositive ? 100 : [0, 100, 100, 100]);
    Animated.timing(feedbackAnim, { toValue: 0, duration: 2000, useNativeDriver: true })
      .start(() => setFeedback(null));
  };

  const handleMicPress = async () => {
    if (!isMyTurn || isProcessing || !currentWord || pendingRef.current) return;

    if (!isRecording) {
      setIsRecording(true);
      setSpokenText("");
      retryCountRef.current = 0;
      const locale = getLocaleForLanguage(currentWord.language);
      try {
        await startListening(locale);
      } catch {
        try { await startListening("en-US"); } catch {
          setIsRecording(false);
          showFeedback("Mikrofon hatası!", false);
          return;
        }
      }
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      setIsRecording(false);
      setIsProcessing(true);
      pulseAnim.setValue(1);
      stopListening();
    }
  };

  const handleSkipVote = () => {
    if (hasVotedSkip) return;
    setHasVotedSkip(true);
    // Stop any active recording
    if (isRecording) {
      setIsRecording(false);
      pulseAnim.setValue(1);
      stopListening();
    }
    voteSkipWord(gameId, playerId);
  };

  const handleForfeit = () => {
    Alert.alert(
      "Pes Et",
      "Oyundan çıkmak istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        { text: "Pes Et", style: "destructive", onPress: () => forfeitGame(gameId, playerId) },
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
          <Text style={styles.roundText}>{game.round}/{game.maxRounds}</Text>
          <Text style={styles.vsText}>VS</Text>
        </View>

        <View style={[styles.playerBox, !isMyTurn && styles.activePlayer]}>
          <Text style={styles.playerName}>{opponentName}</Text>
          <Text style={styles.playerScore}>{opponentScore}</Text>
        </View>
      </View>

      {/* Timer */}
      <View style={styles.timerOuter}>
        <View
          style={[styles.timerBar, {
            width: `${(timeLeft / 10) * 100}%`,
            backgroundColor: timeLeft > 5 ? "#4CAF50" : timeLeft > 3 ? "#FF9800" : "#F44336",
          }]}
        />
        <View style={styles.timerTextWrap}>
          <Twemoji emoji="⏱️" size={12} />
          <Text style={styles.timerText}> {timeLeft}s</Text>
        </View>
      </View>

      {/* Word Display */}
      <Animated.View
        style={[styles.wordCard, {
          opacity: wordAnim,
          transform: [
            { scale: wordAnim },
            { translateY: wordAnim.interpolate({ inputRange: [0, 1], outputRange: [-50, 0] }) },
          ],
        }]}
      >
        <View style={styles.flagRow}>
          <Twemoji emoji={currentWord.countryFlag} size={42} />
        </View>
        <Text style={styles.countryName}>{currentWord.country} • {currentWord.language}</Text>
        <Text style={styles.wordText}>{currentWord.word}</Text>
        <View style={styles.pronunciationBadge}>
          <Twemoji emoji="🔊" size={14} />
          <Text style={styles.pronunciationText}> {currentWord.pronunciation}</Text>
        </View>
      </Animated.View>

      {/* Turn Info */}
      <View style={styles.turnContainer}>
        {isMyTurn ? (
          <View style={styles.turnRow}>
            <Twemoji emoji="🎤" size={20} />
            <Text style={styles.turnText}> Senin sıran!</Text>
          </View>
        ) : (
          <View style={styles.turnRow}>
            <Twemoji emoji="⏳" size={20} />
            <Text style={styles.turnTextWait}> Rakibin sırası...</Text>
          </View>
        )}
      </View>

      {/* Feedback */}
      {feedback && (
        <Animated.View
          style={[styles.feedbackContainer, {
            opacity: feedbackAnim,
            transform: [{ translateY: feedbackAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
          }]}
        >
          <Twemoji emoji={feedback.includes("Doğru") ? "✅" : "❌"} size={24} />
          <Text style={[styles.feedbackText, { color: feedback.includes("Doğru") ? "#4CAF50" : "#F44336" }]}>
            {" "}{feedback}
          </Text>
        </Animated.View>
      )}

      {/* Spoken Text */}
      {spokenText ? (
        <View style={styles.spokenBubble}>
          <Twemoji emoji="💬" size={14} />
          <Text style={styles.spokenText}> "{spokenText}"</Text>
        </View>
      ) : null}

      {/* Mic Button */}
      <View style={styles.micArea}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }} pointerEvents="box-none">
          <TouchableOpacity
            style={[
              styles.micButton,
              !isMyTurn && styles.micButtonDisabled,
              isRecording && styles.micButtonRecording,
            ]}
            onPress={handleMicPress}
            disabled={!isMyTurn || isProcessing}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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

      {/* Bottom Buttons */}
      <View style={styles.bottomBtns}>
        <TouchableOpacity
          style={[styles.actionBtn, hasVotedSkip && styles.actionBtnActive]}
          onPress={handleSkipVote}
          disabled={!isMyTurn || hasVotedSkip || isRecording || isProcessing}
          activeOpacity={0.7}
        >
          <Twemoji emoji="⏭️" size={18} />
          <Text style={[styles.actionBtnText, hasVotedSkip && styles.actionBtnTextActive]}>
            {" "}{hasVotedSkip
              ? opponentSkipVote ? "Geçiliyor..." : "Rakip bekleniyor"
              : "Kelimeyi Geç"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handleForfeit}
          activeOpacity={0.7}
        >
          <Twemoji emoji="🏳️" size={18} />
          <Text style={styles.actionBtnText}> Pes Et</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a1a",
    paddingTop: 55,
    paddingHorizontal: 16,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 100,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  playerBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 14,
    padding: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  activePlayer: {
    borderColor: "#e94560",
    backgroundColor: "rgba(233,69,96,0.1)",
  },
  playerName: {
    fontSize: 12,
    color: "#888",
    fontWeight: "600",
  },
  playerScore: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "900",
  },
  roundInfo: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  roundText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
  vsText: {
    fontSize: 16,
    color: "#e94560",
    fontWeight: "900",
  },

  // Timer
  timerOuter: {
    height: 24,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    marginBottom: 14,
    overflow: "hidden",
    justifyContent: "center",
  },
  timerBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 12,
  },
  timerTextWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },

  // Word Card
  wordCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "rgba(233,69,96,0.2)",
  },
  flagRow: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  countryName: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  wordText: {
    fontSize: 36,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "rgba(233,69,96,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  pronunciationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(233,69,96,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  pronunciationText: {
    fontSize: 15,
    color: "#e94560",
    fontWeight: "600",
    fontStyle: "italic",
  },

  // Turn
  turnContainer: {
    alignItems: "center",
    marginBottom: 6,
  },
  turnRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  turnText: {
    fontSize: 18,
    color: "#4CAF50",
    fontWeight: "700",
  },
  turnTextWait: {
    fontSize: 18,
    color: "#FF9800",
    fontWeight: "700",
  },

  // Feedback
  feedbackContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  feedbackText: {
    fontSize: 20,
    fontWeight: "900",
  },

  // Spoken
  spokenBubble: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginBottom: 6,
    alignSelf: "center",
  },
  spokenText: {
    fontSize: 13,
    color: "#888",
    fontStyle: "italic",
  },

  // Mic
  micArea: {
    alignItems: "center",
    marginBottom: 14,
  },
  micButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e94560",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.15)",
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
  },
  micButtonDisabled: {
    backgroundColor: "#333",
    borderColor: "rgba(255,255,255,0.06)",
    shadowColor: "#000",
  },
  micButtonRecording: {
    backgroundColor: "#F44336",
    borderColor: "rgba(255,100,100,0.4)",
  },
  micHint: {
    fontSize: 12,
    color: "#555",
    marginTop: 8,
    textAlign: "center",
  },

  // Bottom Buttons
  bottomBtns: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  actionBtnActive: {
    backgroundColor: "rgba(233,69,96,0.15)",
    borderColor: "rgba(233,69,96,0.3)",
  },
  actionBtnText: {
    fontSize: 14,
    color: "#888",
    fontWeight: "700",
  },
  actionBtnTextActive: {
    color: "#e94560",
  },
});
