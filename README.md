# VoxBattle - Telaffuz Düellosu

Farklı ülkelerden kelimeleri telaffuz ederek öğrendiğin mobil oyun. Solo pratik yap veya online düelloda rakibinle yarış!

## Özellikler

- **180+ kelime**, 45+ dil ve ülkeden
- **Gerçek zamanlı konuşma tanıma** (Apple Speech Recognition)
- **3 zorluk seviyesi**: Kolay, Orta, Zor
- **Tek kişilik mod**: Kendi başına pratik yap
- **Online düello**: Gerçek rakiplerle canlı düello
- **Detaylı sonuç ekranı**: Doğru telaffuzları dinle, kendi sesini tekrar dinle
- **Sesli telaffuz rehberi** (Text-to-Speech)

## Teknoloji

| Katman | Teknoloji |
|--------|-----------|
| Framework | React Native + Expo SDK 55 |
| Dil | TypeScript |
| Backend | Firebase Realtime Database |
| Konuşma Tanıma | expo-speech-recognition |
| Sesli Okuma | expo-speech (TTS) |
| Ses Kaydı | expo-audio |
| Reklam | Google AdMob |
| Emoji | Twemoji (Twitter) |
| Navigation | React Navigation |

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# iOS native projesi oluştur
npx expo prebuild --platform ios

# Simulator'de çalıştır
npx expo run:ios
```

## Firebase Kurulumu

1. [Firebase Console](https://console.firebase.google.com)'dan yeni proje oluştur
2. iOS uygulaması ekle (Bundle ID: `com.alperyardimci.VoxBattle`)
3. `GoogleService-Info.plist` dosyasını proje kök dizinine koy
4. Realtime Database oluştur ve kuralları ayarla
5. Authentication > Anonymous sign-in aktif et
6. `src/config/firebase.ts` dosyasını kendi config değerlerinle güncelle

## Proje Yapısı

```
src/
├── components/     # Twemoji bileşeni
├── config/         # Firebase yapılandırması
├── data/           # 180 kelimelik veritabanı
├── screens/        # Uygulama ekranları
│   ├── HomeScreen        # Ana menü + zorluk seçimi
│   ├── ModeSelectScreen  # Solo / Online mod seçimi
│   ├── SoloGameScreen    # Tek kişilik oyun
│   ├── SoloResultScreen  # Solo sonuç ekranı
│   ├── LobbyScreen       # Online eşleşme bekleme
│   ├── GameScreen        # Online düello
│   └── ResultScreen      # Online sonuç ekranı
├── services/       # İş mantığı
│   ├── gameService   # Firebase matchmaking + oyun yönetimi
│   ├── speechService # Konuşma tanıma + telaffuz karşılaştırma
│   └── adService     # Google AdMob reklam yönetimi
└── types/          # TypeScript tip tanımları
```

## Desteklenen Diller

Türkçe, İngilizce, İspanyolca, Fransızca, Almanca, İtalyanca, Japonca, Korece, Çince, Rusça, Arapça, Hintçe, Portekizce, Lehçe, Çekçe, Macarca, Fince, Danca, Hollandaca, İsveççe, Norveççe, Yunanca, Romence, Hırvatça, Vietnamca, Endonezyaca, İbranice, Tayca, Svahili, Hawaiice, Galce, İrlandaca, İzlandaca ve daha fazlası...

## Lisans

© 2026 Alper Yardımcı. Tüm hakları saklıdır.
