import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

export async function requestMicrophonePermission(): Promise<boolean> {
  const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
  return result.granted;
}

// Only languages confirmed to work on iOS STT
const NATIVE_LOCALE_LANGUAGES: Record<string, string> = {
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
  Danish: "da-DK",
  Polish: "pl-PL",
  Hungarian: "hu-HU",
  Finnish: "fi-FI",
  Thai: "th-TH",
  Dutch: "nl-NL",
  Swedish: "sv-SE",
  Norwegian: "nb-NO",
  Greek: "el-GR",
  Romanian: "ro-RO",
  Croatian: "hr-HR",
  Vietnamese: "vi-VN",
  Indonesian: "id-ID",
  Malay: "ms-MY",
  Hebrew: "he-IL",
  Catalan: "ca-ES",
};
// NOT supported on iOS STT (fallback to en-US):
// Bulgarian, Serbian, Ukrainian, Slovak, Slovenian,
// Latvian, Lithuanian, Estonian, Filipino, Persian

// Languages where STT doesn't exist or is poor - fallback to en-US
// Welsh, Irish, Scottish Gaelic, Xhosa, Navajo, Maori, Swahili,
// Hawaiian, Quechua, Tongan, etc.

export function getLocaleForLanguage(language: string): string {
  return NATIVE_LOCALE_LANGUAGES[language] || "en-US";
}

export function isNativeLocaleLanguage(language: string): boolean {
  return language in NATIVE_LOCALE_LANGUAGES;
}

let currentLang = "en-US";

export async function startListening(lang: string = "en-US", persistAudio: boolean = false): Promise<void> {
  currentLang = lang;
  const opts: any = {
    lang,
    interimResults: true,
    maxAlternatives: 3,
  };
  if (persistAudio) {
    opts.recordingOptions = { persist: true };
  }
  try {
    ExpoSpeechRecognitionModule.start(opts);
  } catch {
    if (lang !== "en-US") {
      currentLang = "en-US";
      opts.lang = "en-US";
      ExpoSpeechRecognitionModule.start(opts);
    }
  }
}

export function getCurrentLang(): string {
  return currentLang;
}

export function stopListening(): void {
  ExpoSpeechRecognitionModule.stop();
}

export { useSpeechRecognitionEvent };

export function checkPronunciation(
  spokenText: string,
  acceptedPronunciations: string[],
  language?: string
): boolean {
  const normalizedSpoken = normalizeText(spokenText);
  if (!normalizedSpoken) return false;

  // Native locale languages get strict matching,
  // en-US fallback languages get relaxed matching
  const isNative = language ? language in NATIVE_LOCALE_LANGUAGES : true;
  const threshold = isNative ? 0.75 : 0.55;

  for (const accepted of acceptedPronunciations) {
    const normalizedAccepted = normalizeText(accepted);
    if (!normalizedAccepted) continue;

    if (normalizedSpoken === normalizedAccepted) return true;

    const distance = levenshteinDistance(normalizedSpoken, normalizedAccepted);
    const maxLen = Math.max(normalizedSpoken.length, normalizedAccepted.length);
    if (maxLen === 0) continue;
    const similarity = 1 - distance / maxLen;

    if (similarity >= threshold) return true;
  }

  return false;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Remove diacritics/accents for comparison
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // Keep letters (including non-latin), digits and spaces
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
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
