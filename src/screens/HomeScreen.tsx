import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  useWindowDimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, Difficulty } from "../types";
import { requestMicrophonePermission } from "../services/speechService";
import Twemoji from "../components/Twemoji";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

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
  const { width, height } = useWindowDimensions();
  const titleScale = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleSlide = useRef(new Animated.Value(30)).current;
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
        {DIFFICULTIES.map((diff) => (
          <TouchableOpacity
            key={diff.key}
            style={[styles.diffButton, { borderLeftColor: diff.color, borderLeftWidth: 4 }]}
            onPress={() => handlePlay(diff.key)}
            activeOpacity={0.75}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
        ))}
      </View>

      {/* How to Play */}
      <Animated.View style={[styles.htpCard, { opacity: footerAnim }]}>
        <Text style={styles.htpTitle}>NASIL OYNANIR?</Text>
        <View style={styles.htpSteps}>
          <View style={styles.htpStep}>
            <View style={styles.htpIconWrap}>
              <Twemoji emoji="🌍" size={20} />
            </View>
            <View style={styles.htpNumBadge}><Text style={styles.htpNum}>1</Text></View>
            <Text style={styles.htpLabel}>Kelimeyi Gör</Text>
            <Text style={styles.htpDesc}>Farklı ülkelerden kelimeler ekrana gelir</Text>
          </View>
          <View style={styles.htpDivider} />
          <View style={styles.htpStep}>
            <View style={styles.htpIconWrap}>
              <Twemoji emoji="🎙️" size={20} />
            </View>
            <View style={styles.htpNumBadge}><Text style={styles.htpNum}>2</Text></View>
            <Text style={styles.htpLabel}>Telaffuz Et</Text>
            <Text style={styles.htpDesc}>Mikrofona doğru telaffuz etmeye çalış</Text>
          </View>
          <View style={styles.htpDivider} />
          <View style={styles.htpStep}>
            <View style={styles.htpIconWrap}>
              <Twemoji emoji="🏆" size={20} />
            </View>
            <View style={styles.htpNumBadge}><Text style={styles.htpNum}>3</Text></View>
            <Text style={styles.htpLabel}>Kazan!</Text>
            <Text style={styles.htpDesc}>Doğru telaffuz et, puan topla, zirveye çık</Text>
          </View>
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
  htpCard: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
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
  htpNumBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  htpNum: {
    fontSize: 10,
    fontWeight: "800",
    color: "#555",
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
});
