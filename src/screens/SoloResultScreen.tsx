import React, { useEffect, useRef, useState } from "react";
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
import { useAudioPlayer } from "expo-audio";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, WordResult } from "../types";
import { getLocaleForLanguage } from "../services/speechService";
import Twemoji from "../components/Twemoji";

type Props = NativeStackScreenProps<RootStackParamList, "SoloResult">;

function getRank(pct: number) {
  if (pct >= 90) return { emoji: "🏆", label: "Telaffuz Ustası!", color: "#FFD700" };
  if (pct >= 70) return { emoji: "🌟", label: "Çok İyi!", color: "#4CAF50" };
  if (pct >= 50) return { emoji: "👍", label: "Fena Değil!", color: "#FF9800" };
  if (pct >= 30) return { emoji: "💪", label: "Gelişiyor!", color: "#2196F3" };
  return { emoji: "📚", label: "Pratik Yap!", color: "#F44336" };
}

export default function SoloResultScreen({ route, navigation }: Props) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const { score, total, difficulty, wordResults } = route.params;
  const pct = Math.round((score / total) * 100);
  const rank = getRank(pct);
  const diffLabel = difficulty === "easy" ? "Kolay" : difficulty === "medium" ? "Orta" : "Zor";
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const cardScale = useRef(new Animated.Value(0)).current;
  const emojiScale = useRef(new Animated.Value(0)).current;
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

  const speakWord = (result: WordResult) => {
    if (speakingId === result.word.id) {
      Speech.stop();
      setSpeakingId(null);
      return;
    }
    setSpeakingId(result.word.id);
    const locale = getLocaleForLanguage(result.word.language);
    Speech.speak(result.word.word, {
      language: locale,
      rate: 0.8,
      onDone: () => setSpeakingId(null),
      onStopped: () => setSpeakingId(null),
      onError: () => setSpeakingId(null),
    });
  };

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
      {/* Confetti */}
      {pct >= 50 && (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {confetti.map((c, i) => (
            <Animated.View
              key={i}
              style={{
                position: "absolute",
                width: 8,
                height: 8,
                borderRadius: i % 2 === 0 ? 4 : 1,
                backgroundColor: ["#e94560", "#4CAF50", "#FF9800", "#2196F3", "#FFD700"][i % 5],
                transform: [{ translateX: c.x }, { translateY: c.y }, {
                  rotate: c.rot.interpolate({ inputRange: [0, 360], outputRange: ["0deg", "360deg"] }),
                }],
                opacity: c.opacity,
              }}
            />
          ))}
        </View>
      )}

      {/* Compact Score Header */}
      <Animated.View style={[styles.scoreHeader, { transform: [{ scale: cardScale }] }]}>
        <Animated.View style={{ transform: [{ scale: emojiScale }] }}>
          <Twemoji emoji={rank.emoji} size={36} />
        </Animated.View>
        <Text style={[styles.rankLabel, { color: rank.color }]}>{rank.label}</Text>
        <Text style={styles.scoreInline}>{score}/{total}</Text>
      </Animated.View>

      {/* Word Results */}
      <View style={styles.wordListCard}>
        <Text style={styles.wordListTitle}>KELİME DETAYLARI</Text>
        {wordResults.map((result, i) => (
          <View
            key={result.word.id}
            style={[
              styles.wordRow,
              i < wordResults.length - 1 && styles.wordRowBorder,
            ]}
          >
            <View style={styles.wordRowLeft}>
              <View style={[
                styles.resultBadge,
                { backgroundColor: result.correct ? "rgba(76,175,80,0.15)" : "rgba(244,67,54,0.15)" }
              ]}>
                <Twemoji emoji={result.correct ? "✅" : "❌"} size={16} />
              </View>
              <View style={styles.wordInfo}>
                <View style={styles.wordTopRow}>
                  <Twemoji emoji={result.word.countryFlag} size={16} />
                  <Text style={styles.wordName}> {result.word.word}</Text>
                </View>
                <Text style={styles.wordPronunciation}>
                  [ {result.word.pronunciation} ]
                </Text>
                {result.spokenText ? (
                  <Text style={styles.wordSpoken}>
                    Söylenen: "{result.spokenText}"
                  </Text>
                ) : (
                  <Text style={styles.wordSkipped}>Süre doldu / Geçildi</Text>
                )}
              </View>
            </View>

            <View style={styles.audioBtns}>
              {result.audioUri ? (
                <MyVoiceButton audioUri={result.audioUri} wordId={result.word.id} />
              ) : result.spokenText ? (
                <View style={[styles.speakerBtn, { opacity: 0.3 }]}>
                  <Twemoji emoji="🎤" size={18} />
                </View>
              ) : null}
              <TouchableOpacity
                style={[
                  styles.speakerBtn,
                  speakingId === result.word.id && styles.speakerBtnActive,
                ]}
                onPress={() => speakWord(result)}
                activeOpacity={0.7}
              >
                <Twemoji emoji={speakingId === result.word.id ? "⏹️" : "🔊"} size={18} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.btnGroup}>
        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          onPress={() => navigation.replace("SoloGame", { difficulty })}
          activeOpacity={0.75}
        >
          <Twemoji emoji="🔄" size={20} />
          <Text style={[styles.btnText, styles.btnTextPrimary]}> Tekrar Dene</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnSecondary]}
          onPress={() => navigation.replace("ModeSelect", { difficulty })}
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

function MyVoiceButton({ audioUri, wordId }: { audioUri: string; wordId: string }) {
  const player = useAudioPlayer(audioUri);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggle = () => {
    if (isPlaying) {
      player.pause();
      player.seekTo(0);
      setIsPlaying(false);
    } else {
      player.seekTo(0);
      player.play();
      setIsPlaying(true);
      // Auto-stop after playback
      const checkDone = setInterval(() => {
        if (!player.playing) {
          setIsPlaying(false);
          clearInterval(checkDone);
        }
      }, 300);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.speakerBtn, isPlaying && styles.speakerBtnActive]}
      onPress={toggle}
      activeOpacity={0.7}
    >
      <Twemoji emoji={isPlaying ? "⏹️" : "🎤"} size={18} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#0a0a1a",
  },
  container: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  scoreHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "100%",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 12,
  },
  rankLabel: {
    fontSize: 20,
    fontWeight: "900",
  },
  scoreInline: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
  },

  // Word list
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
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
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
  wordSpoken: {
    fontSize: 11,
    color: "#666",
    marginTop: 1,
  },
  wordSkipped: {
    fontSize: 11,
    color: "#555",
    fontStyle: "italic",
    marginTop: 1,
  },
  audioBtns: {
    flexDirection: "row",
    gap: 6,
    marginLeft: 6,
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
