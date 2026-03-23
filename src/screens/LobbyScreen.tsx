import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, LobbyRoom } from "../types";
import {
  findOrCreateRoom,
  generatePlayerId,
  generatePlayerName,
  subscribeToRoom,
  subscribeToGame,
  cleanupRoom,
} from "../services/gameService";
import Twemoji from "../components/Twemoji";

type Props = NativeStackScreenProps<RootStackParamList, "Lobby">;

export default function LobbyScreen({ route, navigation }: Props) {
  const { difficulty } = route.params;
  const [status, setStatus] = useState<string>("Rakip aranıyor...");
  const [playerInfo, setPlayerInfo] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Spin animation
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const playerId = generatePlayerId();
    const playerName = generatePlayerName();
    setPlayerInfo({ id: playerId, name: playerName });

    let unsubRoom: (() => void) | null = null;
    let unsubGame: (() => void) | null = null;

    async function joinLobby() {
      try {
        const { roomId: newRoomId, isHost } = await findOrCreateRoom(
          playerId,
          playerName,
          difficulty
        );
        setRoomId(newRoomId);

        if (isHost) {
          setStatus("Oda oluşturuldu! Rakip bekleniyor...");
          // Subscribe to room changes - wait for opponent
          unsubRoom = subscribeToRoom(newRoomId, (room) => {
            if (room && room.status === "full") {
              setStatus("Rakip bulundu! Oyun başlıyor...");
            }
          });
        } else {
          setStatus("Rakip bulundu! Oyun başlıyor...");
        }

        // Subscribe to game - when created, navigate
        unsubGame = subscribeToGame(newRoomId, (game) => {
          if (game && game.status === "playing") {
            navigation.replace("Game", {
              gameId: newRoomId,
              playerId,
            });
          }
        });
      } catch (err) {
        console.error("Lobby error:", err);
        setStatus("Bağlantı hatası! Tekrar deneniyor...");
      }
    }

    joinLobby();

    return () => {
      unsubRoom?.();
      unsubGame?.();
      // Clean up if leaving lobby
      if (roomId) {
        cleanupRoom(roomId).catch(() => {});
      }
    };
  }, [difficulty]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.globe, { transform: [{ rotate: spin }] }]}
      >
        <Twemoji emoji="🌍" size={80} />
      </Animated.View>

      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Text style={styles.title}>VoxBattle</Text>
      </Animated.View>

      <View style={styles.infoBox}>
        <Text style={styles.difficulty}>
          Zorluk:{" "}
          {difficulty === "easy"
            ? "Kolay 🟢"
            : difficulty === "medium"
            ? "Orta 🟡"
            : "Zor 🔴"}
        </Text>
        {playerInfo && (
          <Text style={styles.playerName}>
            Oyuncu: {playerInfo.name}
          </Text>
        )}
      </View>

      <View style={styles.statusContainer}>
        <ActivityIndicator size="large" color="#e94560" />
        <Text style={styles.statusText}>{status}</Text>
      </View>

      <View style={styles.tipsContainer}>
        <Text style={styles.tipTitle}>Nasıl Oynanır?</Text>
        <Text style={styles.tip}>1. Ekrandaki kelimeyi oku</Text>
        <Text style={styles.tip}>2. Mikrofona doğru telaffuz et</Text>
        <Text style={styles.tip}>3. Doğru telaffuz = +1 puan</Text>
        <Text style={styles.tip}>4. Yanlış telaffuz = sıra rakibe geçer</Text>
      </View>
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
  globe: {
    marginBottom: 20,
  },
  globeText: {
    fontSize: 80,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#e94560",
    marginBottom: 30,
    letterSpacing: 2,
  },
  infoBox: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(233, 69, 96, 0.3)",
  },
  difficulty: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  playerName: {
    fontSize: 16,
    color: "#a0a0c0",
    textAlign: "center",
  },
  statusContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  statusText: {
    fontSize: 18,
    color: "#e94560",
    marginTop: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  tipsContainer: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 16,
    width: "100%",
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  tip: {
    fontSize: 14,
    color: "#a0a0c0",
    marginBottom: 4,
  },
});
