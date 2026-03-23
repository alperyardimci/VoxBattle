import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

export async function requestMicrophonePermission(): Promise<boolean> {
  const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
  return result.granted;
}

export async function startListening(_lang: string = "en-US"): Promise<void> {
  // Always use en-US: accepted pronunciations are romanized Latin text,
  // so native locales (ar-SA, ru-RU, etc.) would return native script
  // that never matches our Latin-based accepted list.
  ExpoSpeechRecognitionModule.start({
    lang: "en-US",
    interimResults: true,
    maxAlternatives: 3,
  });
}

export function stopListening(): void {
  ExpoSpeechRecognitionModule.stop();
}

export { useSpeechRecognitionEvent };

export function checkPronunciation(
  spokenText: string,
  acceptedPronunciations: string[]
): boolean {
  const normalizedSpoken = spokenText
    .toLowerCase()
    .trim()
    .replace(/[^a-z\s]/g, "");

  if (!normalizedSpoken) return false;

  for (const accepted of acceptedPronunciations) {
    const normalizedAccepted = accepted
      .toLowerCase()
      .trim()
      .replace(/[^a-z\s]/g, "");

    if (normalizedSpoken === normalizedAccepted) return true;

    const distance = levenshteinDistance(normalizedSpoken, normalizedAccepted);
    const maxLen = Math.max(normalizedSpoken.length, normalizedAccepted.length);
    if (maxLen === 0) continue;
    const similarity = 1 - distance / maxLen;

    if (similarity >= 0.75) return true;
  }

  return false;
}

// Map language names to BCP-47 locale codes for speech recognition
export function getLocaleForLanguage(language: string): string {
  const localeMap: Record<string, string> = {
    Turkish: "tr-TR",
    Spanish: "es-ES",
    French: "fr-FR",
    German: "de-DE",
    Italian: "it-IT",
    Japanese: "ja-JP",
    Portuguese: "pt-BR",
    Korean: "ko-KR",
    Chinese: "zh-CN",
    Russian: "ru-RU",
    Arabic: "ar-SA",
    Hindi: "hi-IN",
    Czech: "cs-CZ",
    Welsh: "cy-GB",
    Danish: "da-DK",
    Polish: "pl-PL",
    Hungarian: "hu-HU",
    Icelandic: "is-IS",
    Finnish: "fi-FI",
    Thai: "th-TH",
    Irish: "ga-IE",
  };
  return localeMap[language] || "en-US";
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}
