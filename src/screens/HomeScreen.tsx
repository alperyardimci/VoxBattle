import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, Difficulty } from "../types";
import { requestMicrophonePermission } from "../services/speechService";
import Twemoji from "../components/Twemoji";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;
const { width, height } = Dimensions.get("window");

const DIFFICULTIES: {
  key: Difficulty;
  label: string;
  color: string;
  desc: string;
  emoji: string;
}[] = [
  { key: "easy", label: "Kolay", color: "#4CAF50", desc: "Basit selamlaşmalar", emoji: "🟢" },
  { key: "medium", label: "Orta", color: "#FF9800", desc: "Günlük kelimeler", emoji: "🟡" },
  { key: "hard", label: "Zor", color: "#F44336", desc: "İmkansız telaffuzlar", emoji: "🔴" },
];

export default function HomeScreen({ navigation }: Props) {
  const titleScale = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleSlide = useRef(new Animated.Value(30)).current;
  const buttonAnims = useRef(DIFFICULTIES.map(() => new Animated.Value(0))).current;
  const footerAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const [hasMicPermission, setHasMicPermission] = useState(false);

  // Floating particles
  const particles = useRef(
    Array.from({ length: 15 }, () => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height),
      opacity: new Animated.Value(0.05 + Math.random() * 0.15),
      size: 4 + Math.random() * 8,
    }))
  ).current;

  useEffect(() => {
    requestMicrophonePermission().then(setHasMicPermission);

    // Entrance animations staggered
    Animated.sequence([
      Animated.parallel([
        Animated.spring(titleScale, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }),
        Animated.timing(titleOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(subtitleSlide, { toValue: 0, duration: 400, useNativeDriver: true }),
      Animated.stagger(
        120,
        buttonAnims.map((anim) =>
          Animated.spring(anim, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true })
        )
      ),
      Animated.timing(footerAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    // Title float
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -8, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    // Particles
    particles.forEach((p, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(p.y, { toValue: -50, duration: 5000 + i * 800, useNativeDriver: true }),
          Animated.timing(p.y, { toValue: height + 50, duration: 0, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  const handlePlay = (difficulty: Difficulty) => {
    if (!hasMicPermission) {
      requestMicrophonePermission().then((granted) => {
        setHasMicPermission(granted);
        if (granted) navigation.navigate("ModeSelect", { difficulty });
      });
    } else {
      navigation.navigate("ModeSelect", { difficulty });
    }
  };

  return (
    <View style={styles.container}>
      {/* Particles */}
      {particles.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: p.size / 2,
            backgroundColor: i % 3 === 0 ? "#e94560" : i % 3 === 1 ? "#0f3460" : "#533483",
            transform: [{ translateX: p.x }, { translateY: p.y }],
            opacity: p.opacity,
          }}
        />
      ))}

      {/* Title */}
      <Animated.View
        style={[
          styles.titleContainer,
          {
            opacity: titleOpacity,
            transform: [{ scale: titleScale }, { translateY: floatAnim }],
          },
        ]}
      >
        <View style={styles.titleIconWrap}>
          <Twemoji emoji="🎙️" size={56} />
        </View>
        <Text style={styles.title}>VoxBattle</Text>
        <Animated.Text
          style={[styles.subtitle, { transform: [{ translateY: subtitleSlide }] }]}
        >
          TELAFFUZ DÜELLOSU
        </Animated.Text>
      </Animated.View>

      {/* Difficulty buttons */}
      <View style={styles.diffContainer}>
        <Text style={styles.sectionTitle}>ZORLUK SEVİYESİ SEÇ</Text>
        {DIFFICULTIES.map((diff, i) => (
          <Animated.View
            key={diff.key}
            style={{
              opacity: buttonAnims[i],
              transform: [
                {
                  translateX: buttonAnims[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: [-80, 0],
                  }),
                },
                {
                  scale: buttonAnims[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            }}
          >
            <TouchableOpacity
              style={[styles.diffButton, { borderLeftColor: diff.color, borderLeftWidth: 4 }]}
              onPress={() => handlePlay(diff.key)}
              activeOpacity={0.75}
            >
              <View style={styles.diffLeft}>
                <Twemoji emoji={diff.emoji} size={24} />
                <View style={styles.diffTextWrap}>
                  <Text style={styles.diffLabel}>{diff.label}</Text>
                  <Text style={styles.diffDesc}>{diff.desc}</Text>
                </View>
              </View>
              <View style={[styles.diffArrowCircle, { backgroundColor: diff.color }]}>
                <Text style={styles.diffArrow}>›</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {/* How to Play */}
      <Animated.View style={[styles.howToPlay, { opacity: footerAnim }]}>
        <View style={styles.howToPlayRow}>
          <Twemoji emoji="🌍" size={16} />
          <Text style={styles.howToPlayText}> Kelimeyi gör</Text>
          <Twemoji emoji="🎙️" size={16} />
          <Text style={styles.howToPlayText}> Telaffuz et</Text>
          <Twemoji emoji="🎯" size={16} />
          <Text style={styles.howToPlayText}> Puan kazan!</Text>
        </View>
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
  titleContainer: {
    alignItems: "center",
    marginBottom: 36,
  },
  titleIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(233,69,96,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "rgba(233,69,96,0.3)",
  },
  title: {
    fontSize: 52,
    fontWeight: "900",
    color: "#e94560",
    letterSpacing: 3,
    textShadowColor: "rgba(233,69,96,0.5)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    marginTop: 6,
    letterSpacing: 6,
    fontWeight: "700",
  },
  diffContainer: {
    width: "100%",
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
    marginBottom: 14,
    letterSpacing: 3,
    fontWeight: "700",
  },
  diffButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    marginBottom: 10,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  diffLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  diffTextWrap: {
    marginLeft: 14,
  },
  diffLabel: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
  },
  diffDesc: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  diffArrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  diffArrow: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "900",
    marginTop: -2,
  },
  howToPlay: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  howToPlayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  howToPlayText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
    marginRight: 8,
  },
});
