import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import {
  findOrCreateRoom,
  generatePlayerId,
  generatePlayerName,
  subscribeToRoom,
  subscribeToGame,
  cleanupRoom,
  createBotGame,
} from "../services/gameService";
import Twemoji from "../components/Twemoji";

type Props = NativeStackScreenProps<RootStackParamList, "Lobby">;

export default function LobbyScreen({ route, navigation }: Props) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const { difficulty } = route.params;
  const [status, setStatus] = useState<string>("Rakip aranıyor...");
  const [playerInfo, setPlayerInfo] = useState<{ id: string; name: string } | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const dotAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  const particles = useRef(
    Array.from({ length: 10 }, () => ({
      x: new Animated.Value(Math.random() * SCREEN_WIDTH),
      y: new Animated.Value(Math.random() * 800),
      opacity: new Animated.Value(0.1 + Math.random() * 0.15),
      size: 4 + Math.random() * 6,
    }))
  ).current;

  const diffLabel = difficulty === "easy" ? "Kolay" : difficulty === "medium" ? "Orta" : "Zor";
  const diffEmoji = difficulty === "easy" ? "🟢" : difficulty === "medium" ? "🟡" : "🔴";

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1, duration: 4000, easing: Easing.linear, useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(dotAnim, { toValue: 0.3, duration: 600, useNativeDriver: true }),
      ])
    ).start();

    Animated.spring(cardAnim, { toValue: 1, friction: 5, tension: 50, useNativeDriver: true }).start();

    particles.forEach((p, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(p.y, { toValue: -50, duration: 5000 + i * 800, useNativeDriver: true }),
          Animated.timing(p.y, { toValue: 800, duration: 0, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    let unsubRoom: (() => void) | null = null;
    let unsubGame: (() => void) | null = null;
    let botTimer: ReturnType<typeof setTimeout> | null = null;
    let createdRoomId: string | null = null;

    const playerId = generatePlayerId();
    const playerName = generatePlayerName();
    setPlayerInfo({ id: playerId, name: playerName });

    async function joinLobby() {
      if (cancelled) return;
      try {
        const { roomId: newRoomId, isHost } = await findOrCreateRoom(playerId, playerName, difficulty);
        if (cancelled) {
          cleanupRoom(newRoomId).catch(() => {});
          return;
        }
        setRoomId(newRoomId);
        createdRoomId = newRoomId;

        if (isHost) {
          setStatus("Oda oluşturuldu! Rakip bekleniyor...");
          unsubRoom = subscribeToRoom(newRoomId, (room) => {
            if (room && room.status === "full") {
              setStatus("Rakip bulundu! Oyun başlıyor...");
              if (botTimer) { clearTimeout(botTimer); botTimer = null; }
            }
          });

          // After 15 seconds with no opponent, add a bot
          botTimer = setTimeout(async () => {
            if (cancelled) return;
            setStatus("Bot rakip atanıyor...");
            try {
              await createBotGame(newRoomId, playerId, playerName, difficulty);
            } catch (e) {
              console.error("Bot error:", e);
            }
          }, 15000);
        } else {
          setStatus("Rakip bulundu! Oyun başlıyor...");
        }

        unsubGame = subscribeToGame(newRoomId, (game) => {
          if (game && game.status === "playing" && !cancelled) {
            navigation.replace("Game", { gameId: newRoomId, playerId });
          }
        });
      } catch (err: any) {
        if (!cancelled) {
          console.error("Lobby error:", err?.message || err);
          setStatus(`Bağlantı hatası: ${err?.message || "Bilinmeyen hata"}`);
        }
      }
    }

    joinLobby();

    return () => {
      cancelled = true;
      unsubRoom?.();
      unsubGame?.();
      if (botTimer) clearTimeout(botTimer);
      if (createdRoomId) cleanupRoom(createdRoomId).catch(() => {});
    };
  }, [difficulty]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      {/* Particles */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {particles.map((p, i) => (
          <Animated.View
            key={i}
            style={{
              position: "absolute",
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: i % 2 === 0 ? "#e94560" : "#0f3460",
              transform: [{ translateX: p.x }, { translateY: p.y }],
              opacity: p.opacity,
            }}
          />
        ))}
      </View>

      {/* Globe + Title */}
      <Animated.View style={[styles.globeWrap, { transform: [{ rotate: spin }] }]}>
        <Twemoji emoji="🌍" size={70} />
      </Animated.View>

      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Text style={styles.title}>VoxBattle</Text>
      </Animated.View>

      {/* Info Card */}
      <Animated.View style={[styles.infoCard, { transform: [{ scale: cardAnim }] }]}>
        <View style={styles.infoRow}>
          <View style={styles.infoBadge}>
            <Twemoji emoji={diffEmoji} size={18} />
            <Text style={styles.infoLabel}> {diffLabel}</Text>
          </View>
          {playerInfo && (
            <View style={styles.infoBadge}>
              <Twemoji emoji="👤" size={18} />
              <Text style={styles.infoLabel}> {playerInfo.name}</Text>
            </View>
          )}
        </View>
      </Animated.View>

      {/* Status */}
      <View style={styles.statusCard}>
        <View style={styles.statusDots}>
          {[0, 1, 2].map((i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  opacity: dotAnim.interpolate({
                    inputRange: [0, 0.3, 1],
                    outputRange: i === 0 ? [0.3, 1, 0.3] : i === 1 ? [1, 0.3, 1] : [0.3, 1, 0.3],
                  }),
                },
              ]}
            />
          ))}
        </View>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      {/* How to Play */}
      <View style={styles.htpCard}>
        <Text style={styles.htpTitle}>NASIL OYNANIR?</Text>
        <View style={styles.htpSteps}>
          <View style={styles.htpStep}>
            <View style={styles.htpIconWrap}>
              <Twemoji emoji="🎙️" size={20} />
            </View>
            <Text style={styles.htpLabel}>Telaffuz Et</Text>
            <Text style={styles.htpDesc}>Sıra sendeyken kelimeyi söyle</Text>
          </View>
          <View style={styles.htpDivider} />
          <View style={styles.htpStep}>
            <View style={styles.htpIconWrap}>
              <Twemoji emoji="⚔️" size={20} />
            </View>
            <Text style={styles.htpLabel}>Düello</Text>
            <Text style={styles.htpDesc}>Yanlış telaffuzda sıra rakibe geçer</Text>
          </View>
          <View style={styles.htpDivider} />
          <View style={styles.htpStep}>
            <View style={styles.htpIconWrap}>
              <Twemoji emoji="🏆" size={20} />
            </View>
            <Text style={styles.htpLabel}>Kazan!</Text>
            <Text style={styles.htpDesc}>En çok puan toplayan kazanır</Text>
          </View>
        </View>
      </View>

      {/* Back */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Twemoji emoji="◀️" size={16} />
        <Text style={styles.backText}> Geri Dön</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a1a",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  globeWrap: {
    marginBottom: 12,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#e94560",
    marginBottom: 20,
    letterSpacing: 3,
    textShadowColor: "rgba(233,69,96,0.4)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
  infoCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "100%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  infoBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: "#aaa",
    fontWeight: "600",
  },
  statusCard: {
    alignItems: "center",
    marginBottom: 24,
  },
  statusDots: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e94560",
  },
  statusText: {
    fontSize: 17,
    color: "#e94560",
    fontWeight: "700",
    textAlign: "center",
  },
  htpCard: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginBottom: 20,
  },
  htpTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#444",
    letterSpacing: 3,
    textAlign: "center",
    marginBottom: 14,
  },
  htpSteps: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  htpStep: {
    flex: 1,
    alignItems: "center",
  },
  htpIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(233,69,96,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  htpLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#aaa",
    marginBottom: 2,
    textAlign: "center",
  },
  htpDesc: {
    fontSize: 10,
    color: "#555",
    textAlign: "center",
    lineHeight: 13,
  },
  htpDivider: {
    width: 1,
    height: 50,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginTop: 14,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  backText: {
    fontSize: 15,
    color: "#666",
    fontWeight: "700",
  },
});
