import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, GameState } from "../types";
import { subscribeToGame } from "../services/gameService";
import Twemoji from "../components/Twemoji";

type Props = NativeStackScreenProps<RootStackParamList, "Result">;

export default function ResultScreen({ route, navigation }: Props) {
  const { gameId, playerId } = route.params;
  const [game, setGame] = useState<GameState | null>(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const confettiAnims = useRef(
    Array.from({ length: 12 }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const unsub = subscribeToGame(gameId, setGame);

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();

    // Confetti animation
    confettiAnims.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    return unsub;
  }, [gameId]);

  if (!game) {
    return (
      <View style={styles.container}>
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

  return (
    <View style={styles.container}>
      {/* Confetti for winner */}
      {isWinner &&
        confettiAnims.map((anim, i) => (
          <Animated.View
            key={i}
            style={[
              styles.confetti,
              {
                left: `${(i / 12) * 100}%`,
                backgroundColor: ["#e94560", "#4CAF50", "#FF9800", "#2196F3"][i % 4],
                opacity: anim,
                transform: [
                  {
                    translateY: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 600],
                    }),
                  },
                  {
                    rotate: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", `${360 + i * 30}deg`],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}

      <Animated.View
        style={[styles.resultCard, { transform: [{ scale: scaleAnim }] }]}
      >
        <Twemoji emoji={isWinner ? "🏆" : isDraw ? "🤝" : "😢"} size={80} />
        <Text
          style={[
            styles.resultTitle,
            {
              color: isWinner ? "#4CAF50" : isDraw ? "#FF9800" : "#F44336",
            },
          ]}
        >
          {isWinner ? "KAZANDIN!" : isDraw ? "BERABERE!" : "KAYBETTİN!"}
        </Text>

        {/* Scores */}
        <View style={styles.scoresContainer}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreName}>{myName}</Text>
            <Text
              style={[
                styles.scoreValue,
                myScore > opponentScore && styles.winnerScore,
              ]}
            >
              {myScore}
            </Text>
          </View>

          <Text style={styles.scoreSeparator}>-</Text>

          <View style={styles.scoreBox}>
            <Text style={styles.scoreName}>{opponentName}</Text>
            <Text
              style={[
                styles.scoreValue,
                opponentScore > myScore && styles.winnerScore,
              ]}
            >
              {opponentScore}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Zorluk</Text>
            <Text style={styles.statValue}>
              {game.difficulty === "easy"
                ? "Kolay"
                : game.difficulty === "medium"
                ? "Orta"
                : "Zor"}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Toplam Tur</Text>
            <Text style={styles.statValue}>{game.round - 1}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Başarı Oranı</Text>
            <Text style={styles.statValue}>
              {game.round > 1
                ? `%${Math.round((myScore / (game.round - 1)) * 100)}`
                : "%0"}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Actions */}
      <TouchableOpacity
        style={styles.playAgainButton}
        onPress={() =>
          navigation.replace("Lobby", { difficulty: game.difficulty })
        }
      >
        <Text style={styles.playAgainText}>Tekrar Oyna</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.replace("Home")}
      >
        <Text style={styles.homeText}>Ana Menüye Dön</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
  },
  confetti: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 2,
    top: 0,
  },
  resultCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: 30,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(233, 69, 96, 0.3)",
    marginBottom: 30,
  },
  resultEmoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  resultTitle: {
    fontSize: 36,
    fontWeight: "900",
    marginBottom: 20,
    letterSpacing: 3,
  },
  scoresContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  scoreBox: {
    alignItems: "center",
    flex: 1,
  },
  scoreName: {
    fontSize: 16,
    color: "#a0a0c0",
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: "900",
    color: "#fff",
  },
  winnerScore: {
    color: "#4CAF50",
  },
  scoreSeparator: {
    fontSize: 36,
    color: "#555",
    fontWeight: "bold",
    marginHorizontal: 15,
  },
  statsContainer: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingTop: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  statLabel: {
    fontSize: 15,
    color: "#a0a0c0",
  },
  statValue: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "600",
  },
  playAgainButton: {
    backgroundColor: "#e94560",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 50,
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  playAgainText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 1,
  },
  homeButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  homeText: {
    fontSize: 16,
    color: "#a0a0c0",
    textDecorationLine: "underline",
  },
});
