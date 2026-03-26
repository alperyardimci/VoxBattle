import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import * as Speech from "expo-speech";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, GameState, Word } from "../types";
import { subscribeToGame } from "../services/gameService";
import { getLocaleForLanguage } from "../services/speechService";
import Twemoji from "../components/Twemoji";

type Props = NativeStackScreenProps<RootStackParamList, "Result">;

export default function ResultScreen({ route, navigation }: Props) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const { gameId, playerId } = route.params;
  const [game, setGame] = useState<GameState | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const confettiAnims = useRef(
    Array.from({ length: 14 }, () => ({
      x: new Animated.Value(Math.random() * SCREEN_WIDTH),
      y: new Animated.Value(-20),
      rot: new Animated.Value(0),
      opacity: new Animated.Value(1),
    }))
  ).current;

  useEffect(() => {
    const unsub = subscribeToGame(gameId, setGame);

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();

    return unsub;
  }, [gameId]);

  // Start confetti after game loads
  useEffect(() => {
    if (!game) return;
    const isWinner = game.winner === playerId;
    if (isWinner) {
      confettiAnims.forEach((c, i) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(i * 150),
            Animated.parallel([
              Animated.timing(c.y, { toValue: 800, duration: 2500 + Math.random() * 1000, useNativeDriver: true }),
              Animated.timing(c.rot, { toValue: 360, duration: 2500, useNativeDriver: true }),
              Animated.timing(c.opacity, { toValue: 0, duration: 2500, useNativeDriver: true }),
            ]),
            Animated.parallel([
              Animated.timing(c.y, { toValue: -20, duration: 0, useNativeDriver: true }),
              Animated.timing(c.opacity, { toValue: 1, duration: 0, useNativeDriver: true }),
              Animated.timing(c.rot, { toValue: 0, duration: 0, useNativeDriver: true }),
            ]),
          ])
        ).start();
      });
    }
  }, [game]);

  const speakWord = (word: Word) => {
    if (speakingId === word.id) {
      Speech.stop();
      setSpeakingId(null);
      return;
    }
    setSpeakingId(word.id);
    const locale = getLocaleForLanguage(word.language);
    Speech.speak(word.word, {
      language: locale,
      rate: 0.8,
      onDone: () => setSpeakingId(null),
      onStopped: () => setSpeakingId(null),
      onError: () => setSpeakingId(null),
    });
  };

  if (!game) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  const playerIds = Object.keys(game.players);
  const myScore = game.players[playerId]?.score || 0;
  const opponentId = playerIds.find((id) => id !== playerId) || "";
  const opponentScore = game.players[opponentId]?.score || 0;
  const opponentName = game.players[opponentId]?.name || "Rakip";
  const myName = game.players[playerId]?.name || "Sen";
  const isWinner = game.winner === playerId;
  const isDraw = game.winner === "draw";
  const words = game.words || [];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Confetti */}
      {isWinner &&
        confettiAnims.map((c, i) => (
          <Animated.View
            key={i}
            style={{
              position: "absolute",
              width: 8,
              height: 8,
              borderRadius: i % 2 === 0 ? 4 : 1,
              backgroundColor: ["#e94560", "#4CAF50", "#FF9800", "#2196F3", "#FFD700"][i % 5],
              transform: [
                { translateX: c.x },
                { translateY: c.y },
                { rotate: c.rot.interpolate({ inputRange: [0, 360], outputRange: ["0deg", "360deg"] }) },
              ],
              opacity: c.opacity,
            }}
          />
        ))}

      {/* Score Header */}
      <Animated.View style={[styles.scoreHeader, { transform: [{ scale: scaleAnim }] }]}>
        <Twemoji emoji={isWinner ? "🏆" : isDraw ? "🤝" : "😢"} size={32} />
        <Text style={[styles.resultLabel, { color: isWinner ? "#4CAF50" : isDraw ? "#FF9800" : "#F44336" }]}>
          {isWinner ? "KAZANDIN!" : isDraw ? "BERABERE!" : "KAYBETTİN!"}
        </Text>
      </Animated.View>

      {/* Score Comparison */}
      <View style={styles.scoreCard}>
        <View style={styles.playerCol}>
          <Text style={styles.playerName}>{myName}</Text>
          <Text style={[styles.playerScore, myScore > opponentScore && { color: "#4CAF50" }]}>
            {myScore}
          </Text>
        </View>
        <View style={styles.vsCol}>
          <Text style={styles.vsText}>VS</Text>
        </View>
        <View style={styles.playerCol}>
          <Text style={styles.playerName}>{opponentName}</Text>
          <Text style={[styles.playerScore, opponentScore > myScore && { color: "#4CAF50" }]}>
            {opponentScore}
          </Text>
        </View>
      </View>

      {/* Word List Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#4CAF50" }]} />
          <Text style={styles.legendText}>Sen</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#F44336" }]} />
          <Text style={styles.legendText}>Rakip</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#FF9800" }]} />
          <Text style={styles.legendText}>Geçildi</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#333" }]} />
          <Text style={styles.legendText}>Oynanmadı</Text>
        </View>
      </View>

      {/* Word List */}
      <View style={styles.wordListCard}>
        <Text style={styles.wordListTitle}>KELİME DETAYLARI</Text>
        {words.map((word, i) => {
          const outcomes = game.wordOutcomes || {};
          const outcome = outcomes[String(i)];
          const wasPlayed = i < (game.currentWordIndex || 0);
          const iAnswered = outcome?.answeredBy === playerId;
          const opponentAnswered = outcome?.answeredBy && outcome.answeredBy !== playerId;
          const wasSkipped = outcome?.skipped === true;

          // Color logic: green=me, red=opponent, yellow=skipped, gray=not played
          let badgeBg = "rgba(100,100,100,0.15)";
          let badgeEmoji = "⬜";
          let nameColor = "#555";
          let statusText = "Oynanmadı";

          if (iAnswered) {
            badgeBg = "rgba(76,175,80,0.2)";
            badgeEmoji = "✅";
            nameColor = "#4CAF50";
            statusText = "Sen bildin";
          } else if (opponentAnswered) {
            badgeBg = "rgba(244,67,54,0.2)";
            badgeEmoji = "❌";
            nameColor = "#F44336";
            statusText = `${opponentName} bildi`;
          } else if (wasSkipped) {
            badgeBg = "rgba(255,152,0,0.2)";
            badgeEmoji = "⏭️";
            nameColor = "#FF9800";
            statusText = "Geçildi";
          }

          return (
            <View
              key={word.id}
              style={[styles.wordRow, i < words.length - 1 && styles.wordRowBorder]}
            >
              <View style={styles.wordRowLeft}>
                <View style={[styles.resultBadge, { backgroundColor: badgeBg }]}>
                  <Twemoji emoji={badgeEmoji} size={16} />
                </View>
                <View style={styles.wordInfo}>
                  <View style={styles.wordTopRow}>
                    <Twemoji emoji={word.countryFlag} size={16} />
                    <Text style={[styles.wordName, { color: nameColor }]}> {word.word}</Text>
                  </View>
                  <Text style={styles.wordPronunciation}>[ {word.pronunciation} ]</Text>
                  <Text style={[styles.wordStatus, { color: nameColor }]}>{statusText}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.speakerBtn, speakingId === word.id && styles.speakerBtnActive]}
                onPress={() => speakWord(word)}
                activeOpacity={0.7}
              >
                <Twemoji emoji={speakingId === word.id ? "⏹️" : "🔊"} size={20} />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* Buttons */}
      <View style={styles.btnGroup}>
        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          onPress={() => navigation.replace("Lobby", { difficulty: game.difficulty })}
          activeOpacity={0.75}
        >
          <Twemoji emoji="🔄" size={20} />
          <Text style={[styles.btnText, styles.btnTextPrimary]}> Tekrar Oyna</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnSecondary]}
          onPress={() => navigation.replace("ModeSelect", { difficulty: game.difficulty })}
          activeOpacity={0.75}
        >
          <Twemoji emoji="🎮" size={20} />
          <Text style={[styles.btnText, styles.btnTextSecondary]}> Mod Seç</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnSecondary]}
          onPress={() => navigation.replace("Home")}
          activeOpacity={0.75}
        >
          <Twemoji emoji="🏠" size={20} />
          <Text style={[styles.btnText, styles.btnTextSecondary]}> Ana Menü</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#0a0a1a",
  },
  container: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0a0a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
  },

  // Score Header
  scoreHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "100%",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 12,
  },
  resultLabel: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 2,
  },

  // Score Card
  scoreCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 18,
    padding: 16,
    width: "100%",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  playerCol: {
    flex: 1,
    alignItems: "center",
  },
  playerName: {
    fontSize: 13,
    color: "#888",
    fontWeight: "600",
    marginBottom: 4,
  },
  playerScore: {
    fontSize: 40,
    fontWeight: "900",
    color: "#fff",
  },
  vsCol: {
    paddingHorizontal: 12,
  },
  vsText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#e94560",
  },

  // Word List
  wordListCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 20,
    padding: 16,
    width: "100%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  wordListTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#555",
    letterSpacing: 3,
    textAlign: "center",
    marginBottom: 12,
  },
  wordRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  wordRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  wordRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  resultBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  wordIndex: {
    fontSize: 12,
    fontWeight: "700",
    color: "#666",
  },
  wordInfo: {
    flex: 1,
  },
  wordTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  wordName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  wordPronunciation: {
    fontSize: 12,
    color: "#e94560",
    fontStyle: "italic",
    marginTop: 1,
  },
  wordStatus: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 1,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
  },
  speakerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  speakerBtnActive: {
    backgroundColor: "rgba(233,69,96,0.2)",
    borderColor: "rgba(233,69,96,0.4)",
  },

  // Buttons
  btnGroup: {
    width: "100%",
    gap: 10,
    marginBottom: 10,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingVertical: 15,
    width: "100%",
  },
  btnPrimary: {
    backgroundColor: "#e94560",
  },
  btnSecondary: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  btnText: {
    fontSize: 17,
    fontWeight: "700",
  },
  btnTextPrimary: {
    color: "#fff",
  },
  btnTextSecondary: {
    color: "#888",
  },
});
