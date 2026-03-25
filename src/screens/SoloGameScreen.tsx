import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Vibration,
  Platform,
  Dimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, Word, WordResult } from "../types";
import { getRandomWords } from "../data/words";
import { showAdIfReady, loadAd } from "../services/adService";
import {
  checkPronunciation,
  startListening,
  stopListening,
  useSpeechRecognitionEvent,
  getLocaleForLanguage,
  getCurrentLang,
} from "../services/speechService";
import Twemoji from "../components/Twemoji";

type Props = NativeStackScreenProps<RootStackParamList, "SoloGame">;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TOTAL_ROUNDS = 10;

export default function SoloGameScreen({ route, navigation }: Props) {
  const { difficulty } = route.params;
  const [words] = useState<Word[]>(() => getRandomWords(difficulty, TOTAL_ROUNDS));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [spokenText, setSpokenText] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(15);
  const [streak, setStreak] = useState(0);
  const wordResultsRef = useRef<WordResult[]>([]);
  const lastAudioUriRef = useRef<string | null>(null);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const feedbackAnim = useRef(new Animated.Value(0)).current;
  const wordAnim = useRef(new Animated.Value(0)).current;
  const wordSlideAnim = useRef(new Animated.Value(0)).current;
  const micGlowAnim = useRef(new Animated.Value(0)).current;
  const scorePopAnim = useRef(new Animated.Value(1)).current;
  const skipBounce = useRef(new Animated.Value(0)).current;
  const bgParticles = useRef(
    Array.from({ length: 8 }, () => ({
      x: new Animated.Value(Math.random() * SCREEN_WIDTH),
      y: new Animated.Value(Math.random() * 800),
      opacity: new Animated.Value(0.15 + Math.random() * 0.2),
    }))
  ).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingNextRef = useRef(false);

  const currentWord = words[currentIndex];
  const isGameOver = currentIndex >= words.length;

  // Floating particles animation
  useEffect(() => {
    bgParticles.forEach((p, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(p.y, {
              toValue: -50,
              duration: 6000 + i * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(p.opacity, {
              toValue: 0,
              duration: 6000 + i * 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(p.y, {
              toValue: 800,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(p.opacity, {
              toValue: 0.15 + Math.random() * 0.2,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    });
  }, []);

  // Mic glow animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(micGlowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(micGlowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Skip button subtle bounce
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(skipBounce, {
          toValue: 5,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(skipBounce, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Capture recorded audio URI from both audiostart and audioend
  useSpeechRecognitionEvent("audiostart", (event: any) => {
    if (event?.uri) {
      lastAudioUriRef.current = event.uri;
    }
  });

  useSpeechRecognitionEvent("audioend", (event: any) => {
    if (event?.uri) {
      lastAudioUriRef.current = event.uri;
    }
  });

  // Speech recognition events
  useSpeechRecognitionEvent("result", (event) => {
    if (pendingNextRef.current) return;
    const transcript = event.results[0]?.transcript || "";
    setSpokenText(transcript);

    if (event.isFinal && currentWord) {
      pendingNextRef.current = true;
      setIsRecording(false);
      setIsProcessing(false);
      pulseAnim.setValue(1);
      if (timerRef.current) clearInterval(timerRef.current);

      // Check ALL alternatives from STT, not just the first one
      const allTranscripts = event.results.map((r: any) => r?.transcript || "").filter(Boolean);
      const correct = allTranscripts.some((t: string) =>
        checkPronunciation(t, currentWord.acceptedPronunciations, currentWord.language)
      );

      // Push result - audioUri may arrive later via audioend event
      const resultEntry = {
        word: currentWord,
        correct,
        spokenText: transcript,
        audioUri: lastAudioUriRef.current || undefined,
      };
      wordResultsRef.current.push(resultEntry);
      // If audioUri not yet available, patch it after a short delay
      if (!resultEntry.audioUri) {
        setTimeout(() => {
          if (lastAudioUriRef.current) {
            resultEntry.audioUri = lastAudioUriRef.current;
            lastAudioUriRef.current = null;
          }
        }, 500);
      } else {
        lastAudioUriRef.current = null;
      }

      if (correct) {
        Animated.sequence([
          Animated.timing(scorePopAnim, { toValue: 1.4, duration: 150, useNativeDriver: true }),
          Animated.spring(scorePopAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
        ]).start();
        showFeedback(`Doğru! +1 ${streak >= 2 ? `(${streak + 1}x seri!)` : ""}`, true);
      } else {
        showFeedback(`Yanlış! "${transcript}"`, false);
      }

      setTimeout(() => {
        pendingNextRef.current = false;
        goNext(correct, true);
      }, 1200);
    }
  });

  const retryCountRef = useRef(0);

  useSpeechRecognitionEvent("error", async (event) => {
    console.log("STT error:", event.error);
    // If locale not supported, retry with en-US
    if (retryCountRef.current === 0 && getCurrentLang() !== "en-US") {
      retryCountRef.current = 1;
      try {
        await startListening("en-US", true);
        return;
      } catch {}
    }
    retryCountRef.current = 0;
    setIsRecording(false);
    setIsProcessing(false);
    pulseAnim.setValue(1);
    showFeedback("Ses algılanamadı, tekrar dene", false);
  });

  useSpeechRecognitionEvent("end", () => {
    // Only reset if we're not in the middle of a retry or pending result
    if (!pendingNextRef.current && retryCountRef.current === 0) {
      setIsRecording(false);
      setIsProcessing(false);
      pulseAnim.setValue(1);
    }
  });

  // Word entrance animation
  useEffect(() => {
    if (!isGameOver) {
      wordAnim.setValue(0);
      wordSlideAnim.setValue(50);
      Animated.parallel([
        Animated.spring(wordAnim, {
          toValue: 1,
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.spring(wordSlideAnim, {
          toValue: 0,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [currentIndex]);

  const goNext = useCallback(
    (correct: boolean, skipRecord?: boolean) => {
      if (correct) {
        setScore((s) => s + 1);
        setStreak((s) => s + 1);
      } else {
        setStreak(0);
      }
      // Record timeout/skip if not already recorded by STT handler
      if (!skipRecord && words[currentIndex]) {
        const alreadyRecorded = wordResultsRef.current.some(
          (r) => r.word.id === words[currentIndex].id
        );
        if (!alreadyRecorded) {
          wordResultsRef.current.push({
            word: words[currentIndex],
            correct,
            spokenText: "",
          });
        }
      }
      const nextIndex = currentIndex + 1;
      if (nextIndex >= words.length) {
        const finalScore = correct ? score + 1 : score;
        // Show ad, then navigate to results
        setTimeout(async () => {
          await showAdIfReady();
          loadAd(); // Preload next ad
          navigation.replace("SoloResult", {
            score: finalScore,
            total: words.length,
            difficulty,
            wordResults: wordResultsRef.current,
          });
        }, 600);
      } else {
        setCurrentIndex(nextIndex);
        setSpokenText("");
        setTimeLeft(15);
      }
    },
    [currentIndex, score, words.length, difficulty, navigation]
  );

  // Timer
  useEffect(() => {
    if (isGameOver) return;
    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          stopListening();
          setIsRecording(false);
          pulseAnim.setValue(1);
          showFeedback("Süre doldu!", false);
          setTimeout(() => goNext(false), 800);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isGameOver, goNext]);

  const showFeedback = (text: string, isPositive: boolean) => {
    setFeedback(text);
    feedbackAnim.setValue(1);
    if (Platform.OS !== "web") Vibration.vibrate(isPositive ? 100 : [0, 100, 100, 100]);
    Animated.timing(feedbackAnim, { toValue: 0, duration: 2500, useNativeDriver: true }).start(() =>
      setFeedback(null)
    );
  };

  const handleMicPress = async () => {
    if (isProcessing || isGameOver || !currentWord || pendingNextRef.current) return;

    if (!isRecording) {
      setIsRecording(true);
      setSpokenText("");
      retryCountRef.current = 0;
      lastAudioUriRef.current = null;
      const locale = getLocaleForLanguage(currentWord.language);
      try {
        await startListening(locale, true);
      } catch {
        try {
          await startListening("en-US", true);
        } catch {
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

  if (isGameOver || !currentWord) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  const timerPercent = timeLeft / 15;
  const timerColor = timeLeft > 8 ? "#4CAF50" : timeLeft > 4 ? "#FF9800" : "#F44336";

  return (
    <View style={styles.container}>
      {/* Floating particles */}
      {bgParticles.map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.particle,
            {
              transform: [{ translateX: p.x }, { translateY: p.y }],
              opacity: p.opacity,
              backgroundColor: i % 2 === 0 ? "#e94560" : "#0f3460",
            },
          ]}
        />
      ))}

      {/* Header Stats */}
      <View style={styles.header}>
        <View style={styles.statBox}>
          <Twemoji emoji="🔥" size={18} />
          <Animated.Text style={[styles.statValue, { transform: [{ scale: scorePopAnim }] }]}>
            {score}
          </Animated.Text>
          <Text style={styles.statLabel}>Skor</Text>
        </View>

        <View style={[styles.statBox, styles.statBoxCenter]}>
          <Twemoji emoji="📖" size={18} />
          <Text style={styles.statValue}>
            {currentIndex + 1}/{words.length}
          </Text>
          <Text style={styles.statLabel}>Kelime</Text>
        </View>

        <View style={styles.statBox}>
          <Twemoji emoji={streak >= 3 ? "⚡" : "💫"} size={18} />
          <Text style={[styles.statValue, streak >= 3 && styles.streakHot]}>
            {streak}x
          </Text>
          <Text style={styles.statLabel}>Seri</Text>
        </View>
      </View>

      {/* Timer */}
      <View style={styles.timerOuter}>
        <Animated.View
          style={[
            styles.timerInner,
            {
              width: `${timerPercent * 100}%`,
              backgroundColor: timerColor,
            },
          ]}
        />
        <View style={styles.timerTextWrap}>
          <Twemoji emoji="⏱️" size={14} />
          <Text style={styles.timerText}> {timeLeft}s</Text>
        </View>
      </View>

      {/* Word Card */}
      <Animated.View
        style={[
          styles.wordCard,
          {
            opacity: wordAnim,
            transform: [{ translateY: wordSlideAnim }, { scale: wordAnim }],
          },
        ]}
      >
        <View style={styles.flagRow}>
          <Twemoji emoji={currentWord.countryFlag} size={48} />
        </View>
        <Text style={styles.countryName}>
          {currentWord.country} • {currentWord.language}
        </Text>
        <Text style={styles.wordText}>{currentWord.word}</Text>
        <View style={styles.pronunciationBadge}>
          <Twemoji emoji="🔊" size={16} />
          <Text style={styles.pronunciationText}> {currentWord.pronunciation}</Text>
        </View>
      </Animated.View>

      {/* Spoken text */}
      {spokenText ? (
        <View style={styles.spokenBubble}>
          <Twemoji emoji="💬" size={16} />
          <Text style={styles.spokenText}> "{spokenText}"</Text>
        </View>
      ) : null}

      {/* Feedback */}
      {feedback && (
        <Animated.View
          style={[
            styles.feedbackContainer,
            {
              opacity: feedbackAnim,
              transform: [
                {
                  scale: feedbackAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.8, 1.1, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Twemoji emoji={feedback.includes("Doğru") ? "✅" : "❌"} size={28} />
          <Text
            style={[
              styles.feedbackText,
              { color: feedback.includes("Doğru") ? "#4CAF50" : "#F44336" },
            ]}
          >
            {" "}{feedback}
          </Text>
        </Animated.View>
      )}

      {/* Mic Button */}
      <View style={styles.micArea}>
        {/* Glow ring behind mic */}
        <Animated.View
          style={[
            styles.micGlow,
            isRecording
              ? { opacity: pulseAnim.interpolate({ inputRange: [1, 1.3], outputRange: [0.3, 0.7] }) }
              : { opacity: micGlowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.1, 0.3] }) },
            isRecording && { backgroundColor: "#F44336" },
          ]}
        />
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={[styles.micButton, isRecording && styles.micButtonRecording]}
            onPress={handleMicPress}
            disabled={isProcessing || pendingNextRef.current}
            activeOpacity={0.7}
          >
            {isProcessing ? (
              <Twemoji emoji="⏳" size={44} />
            ) : isRecording ? (
              <Twemoji emoji="⏹️" size={44} />
            ) : (
              <Twemoji emoji="🎙️" size={44} />
            )}
          </TouchableOpacity>
        </Animated.View>
        <Text style={styles.micHint}>
          {isProcessing
            ? "Değerlendiriliyor..."
            : isRecording
            ? "Dinleniyor... Bitirmek için dokun"
            : "Telaffuz etmek için dokun"}
        </Text>
      </View>

      {/* Skip Button - styled as real button */}
      <Animated.View style={{ transform: [{ translateX: skipBounce }] }}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => {
            if (timerRef.current) clearInterval(timerRef.current);
            stopListening();
            setIsRecording(false);
            pulseAnim.setValue(1);
            showFeedback("Geçildi!", false);
            setTimeout(() => goNext(false), 500);
          }}
          disabled={isProcessing || pendingNextRef.current}
          activeOpacity={0.7}
        >
          <Twemoji emoji="⏭️" size={20} />
          <Text style={styles.skipText}> Kelimeyi Geç</Text>
        </TouchableOpacity>
      </Animated.View>
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
  particle: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
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
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  statBoxCenter: {
    borderColor: "rgba(233,69,96,0.3)",
  },
  statValue: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    marginTop: 2,
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 1,
  },
  streakHot: {
    color: "#FF9800",
  },

  // Timer
  timerOuter: {
    height: 28,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    marginBottom: 16,
    overflow: "hidden",
    justifyContent: "center",
  },
  timerInner: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 14,
  },
  timerTextWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },

  // Word Card
  wordCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: "rgba(233,69,96,0.25)",
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  flagRow: {
    marginBottom: 8,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  countryName: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  wordText: {
    fontSize: 38,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
    textShadowColor: "rgba(233,69,96,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  pronunciationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(233,69,96,0.15)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pronunciationText: {
    fontSize: 16,
    color: "#e94560",
    fontWeight: "600",
    fontStyle: "italic",
  },

  // Spoken bubble
  spokenBubble: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    alignSelf: "center",
  },
  spokenText: {
    fontSize: 15,
    color: "#a0a0c0",
    fontStyle: "italic",
  },

  // Feedback
  feedbackContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  feedbackText: {
    fontSize: 22,
    fontWeight: "900",
  },

  // Mic
  micArea: {
    alignItems: "center",
    marginBottom: 16,
  },
  micGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#e94560",
    top: -10,
  },
  micButton: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#e94560",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.15)",
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 10,
  },
  micButtonRecording: {
    backgroundColor: "#F44336",
    borderColor: "rgba(255,100,100,0.4)",
  },
  micHint: {
    fontSize: 13,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
  },

  // Skip button
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  skipText: {
    fontSize: 15,
    color: "#888",
    fontWeight: "700",
  },
});
