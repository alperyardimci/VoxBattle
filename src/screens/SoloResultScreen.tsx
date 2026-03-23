import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import Twemoji from "../components/Twemoji";

type Props = NativeStackScreenProps<RootStackParamList, "SoloResult">;
const { width: SCREEN_WIDTH } = Dimensions.get("window");

function getRank(pct: number) {
  if (pct >= 90) return { emoji: "🏆", label: "Telaffuz Ustası!", color: "#FFD700" };
  if (pct >= 70) return { emoji: "🌟", label: "Çok İyi!", color: "#4CAF50" };
  if (pct >= 50) return { emoji: "👍", label: "Fena Değil!", color: "#FF9800" };
  if (pct >= 30) return { emoji: "💪", label: "Gelişiyor!", color: "#2196F3" };
  return { emoji: "📚", label: "Pratik Yap!", color: "#F44336" };
}

export default function SoloResultScreen({ route, navigation }: Props) {
  const { score, total, difficulty } = route.params;
  const pct = Math.round((score / total) * 100);
  const rank = getRank(pct);
  const diffLabel = difficulty === "easy" ? "Kolay" : difficulty === "medium" ? "Orta" : "Zor";

  const cardScale = useRef(new Animated.Value(0)).current;
  const emojiScale = useRef(new Animated.Value(0)).current;
  const barWidth = useRef(new Animated.Value(0)).current;
  const btn1 = useRef(new Animated.Value(0)).current;
  const btn2 = useRef(new Animated.Value(0)).current;
  const btn3 = useRef(new Animated.Value(0)).current;
  const confetti = useRef(
    Array.from({ length: 16 }, () => ({
      x: new Animated.Value(Math.random() * SCREEN_WIDTH),
      y: new Animated.Value(-20),
      rot: new Animated.Value(0),
      opacity: new Animated.Value(1),
    }))
  ).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(cardScale, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }),
      Animated.spring(emojiScale, { toValue: 1, friction: 3, tension: 80, useNativeDriver: true }),
    ]).start();

    Animated.timing(barWidth, { toValue: pct / 100, duration: 1500, useNativeDriver: false }).start();

    Animated.stagger(150, [
      Animated.spring(btn1, { toValue: 1, friction: 5, useNativeDriver: true }),
      Animated.spring(btn2, { toValue: 1, friction: 5, useNativeDriver: true }),
      Animated.spring(btn3, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();

    // Confetti
    if (pct >= 50) {
      confetti.forEach((c, i) => {
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
  }, []);

  return (
    <View style={styles.container}>
      {/* Confetti */}
      {pct >= 50 &&
        confetti.map((c, i) => (
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
                {
                  rotate: c.rot.interpolate({
                    inputRange: [0, 360],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
              opacity: c.opacity,
            }}
          />
        ))}

      {/* Card */}
      <Animated.View style={[styles.card, { transform: [{ scale: cardScale }] }]}>
        <Animated.View style={{ transform: [{ scale: emojiScale }], marginBottom: 8 }}>
          <Twemoji emoji={rank.emoji} size={72} />
        </Animated.View>

        <Text style={[styles.rankLabel, { color: rank.color }]}>{rank.label}</Text>

        <View style={styles.scoreRow}>
          <Text style={styles.scoreVal}>{score}</Text>
          <Text style={styles.scoreSep}>/</Text>
          <Text style={styles.scoreTotal}>{total}</Text>
        </View>

        <Text style={styles.pctText}>%{pct} Başarı</Text>

        {/* Progress bar */}
        <View style={styles.barOuter}>
          <Animated.View
            style={[
              styles.barInner,
              {
                width: barWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
                backgroundColor: rank.color,
              },
            ]}
          />
        </View>

        {/* Stats */}
        <View style={styles.statsWrap}>
          <View style={styles.statRow}>
            <View style={styles.statLeft}>
              <Twemoji emoji="📊" size={16} />
              <Text style={styles.statLabel}> Zorluk</Text>
            </View>
            <Text style={styles.statVal}>{diffLabel}</Text>
          </View>
          <View style={styles.statRow}>
            <View style={styles.statLeft}>
              <Twemoji emoji="✅" size={16} />
              <Text style={styles.statLabel}> Doğru</Text>
            </View>
            <Text style={[styles.statVal, { color: "#4CAF50" }]}>{score}</Text>
          </View>
          <View style={styles.statRow}>
            <View style={styles.statLeft}>
              <Twemoji emoji="❌" size={16} />
              <Text style={styles.statLabel}> Yanlış</Text>
            </View>
            <Text style={[styles.statVal, { color: "#F44336" }]}>{total - score}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Buttons */}
      <Animated.View
        style={{ opacity: btn1, transform: [{ scale: btn1 }], width: "100%" }}
      >
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.replace("SoloGame", { difficulty })}
          activeOpacity={0.75}
        >
          <Twemoji emoji="🔄" size={22} />
          <Text style={styles.primaryText}> Tekrar Dene</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={{ opacity: btn2, transform: [{ scale: btn2 }], width: "100%" }}
      >
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.replace("ModeSelect", { difficulty })}
          activeOpacity={0.7}
        >
          <Twemoji emoji="🎮" size={18} />
          <Text style={styles.secondaryText}> Mod Seç</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={{ opacity: btn3, transform: [{ scale: btn3 }] }}>
        <TouchableOpacity
          style={styles.tertiaryBtn}
          onPress={() => navigation.replace("Home")}
          activeOpacity={0.7}
        >
          <Twemoji emoji="🏠" size={16} />
          <Text style={styles.tertiaryText}> Ana Menü</Text>
        </TouchableOpacity>
      </Animated.View>
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
  card: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 28,
    padding: 28,
    width: "100%",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(233,69,96,0.2)",
    marginBottom: 24,
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  rankLabel: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 12,
    letterSpacing: 1,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 4,
  },
  scoreVal: {
    fontSize: 60,
    fontWeight: "900",
    color: "#fff",
  },
  scoreSep: {
    fontSize: 34,
    color: "#333",
    marginHorizontal: 6,
  },
  scoreTotal: {
    fontSize: 34,
    color: "#555",
    fontWeight: "700",
  },
  pctText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  barOuter: {
    width: "100%",
    height: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 6,
    marginBottom: 20,
    overflow: "hidden",
  },
  barInner: {
    height: "100%",
    borderRadius: 6,
  },
  statsWrap: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    paddingTop: 14,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },
  statLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  statVal: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "700",
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e94560",
    borderRadius: 18,
    paddingVertical: 16,
    marginBottom: 10,
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryText: {
    fontSize: 19,
    fontWeight: "800",
    color: "#fff",
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(233,69,96,0.2)",
  },
  secondaryText: {
    fontSize: 16,
    color: "#e94560",
    fontWeight: "700",
  },
  tertiaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  tertiaryText: {
    fontSize: 15,
    color: "#555",
    fontWeight: "600",
  },
});
