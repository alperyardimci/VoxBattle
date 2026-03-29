import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import Twemoji from "../components/Twemoji";

type Props = NativeStackScreenProps<RootStackParamList, "ModeSelect">;

export default function ModeSelectScreen({ route, navigation }: Props) {
  const { difficulty } = route.params;
  const diffLabel = difficulty === "easy" ? "Kolay" : difficulty === "medium" ? "Orta" : "Zor";
  const diffEmoji = difficulty === "easy" ? "🟢" : difficulty === "medium" ? "🟡" : "🔴";

  const titleAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(titleAnim, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -6, duration: 1800, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 6, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.titleArea,
          {
            opacity: titleAnim,
            transform: [{ scale: titleAnim }, { translateY: floatAnim }],
          },
        ]}
      >
        <Twemoji emoji="⚡" size={40} />
        <Text style={styles.title}>Oyun Modu</Text>
        <View style={styles.diffBadge}>
          <Twemoji emoji={diffEmoji} size={16} />
          <Text style={styles.diffText}> {diffLabel}</Text>
        </View>
      </Animated.View>

      {/* Solo Mode */}
      <TouchableOpacity
        style={styles.modeCard}
        onPress={() => navigation.navigate("SoloGame", { difficulty })}
        activeOpacity={0.75}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View style={[styles.modeIconWrap, { backgroundColor: "rgba(233,69,96,0.15)" }]}>
          <Twemoji emoji="🎯" size={36} />
        </View>
        <View style={styles.modeContent}>
          <Text style={styles.modeLabel}>Tek Kişilik</Text>
          <Text style={styles.modeDesc}>Kendin pratik yap, skorunu geliştir</Text>
        </View>
        <View style={[styles.modeArrow, { backgroundColor: "#e94560" }]}>
          <Text style={styles.modeArrowText}>›</Text>
        </View>
      </TouchableOpacity>

      {/* Online Mode */}
      <TouchableOpacity
        style={[styles.modeCard, styles.modeCardOnline]}
        onPress={() => navigation.navigate("Lobby", { difficulty })}
        activeOpacity={0.75}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View style={[styles.modeIconWrap, { backgroundColor: "rgba(15,52,96,0.3)" }]}>
          <Twemoji emoji="⚔️" size={36} />
        </View>
        <View style={styles.modeContent}>
          <Text style={styles.modeLabel}>Online Düello</Text>
          <Text style={styles.modeDesc}>Rakip bul ve düello yap</Text>
        </View>
        <View style={[styles.modeArrow, { backgroundColor: "#0f3460" }]}>
          <Text style={styles.modeArrowText}>›</Text>
        </View>
      </TouchableOpacity>

      {/* Back */}
      <View style={{ marginTop: 24 }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Twemoji emoji="◀️" size={16} />
          <Text style={styles.backText}> Geri Dön</Text>
        </TouchableOpacity>
      </View>
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
  titleArea: {
    alignItems: "center",
    marginBottom: 36,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#e94560",
    marginTop: 8,
    letterSpacing: 2,
  },
  diffBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  diffText: {
    fontSize: 15,
    color: "#888",
    fontWeight: "700",
  },
  modeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(233,69,96,0.08)",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: "rgba(233,69,96,0.2)",
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  modeCardOnline: {
    backgroundColor: "rgba(15,52,96,0.15)",
    borderColor: "rgba(15,52,96,0.3)",
    shadowColor: "#0f3460",
  },
  modeIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  modeContent: {
    flex: 1,
  },
  modeLabel: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
  },
  modeDesc: {
    fontSize: 13,
    color: "#666",
    marginTop: 3,
  },
  modeArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  modeArrowText: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "900",
    marginTop: -2,
  },
  backButton: {
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
