import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

const AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : "ca-app-pub-5385502180411655/7448045178";

let interstitial = InterstitialAd.createForAdRequest(AD_UNIT_ID);
let isAdLoaded = false;

function setupListeners() {
  interstitial.addAdEventListener(AdEventType.LOADED, () => {
    isAdLoaded = true;
  });

  interstitial.addAdEventListener(AdEventType.CLOSED, () => {
    isAdLoaded = false;
    // Preload next ad
    loadAd();
  });

  interstitial.addAdEventListener(AdEventType.ERROR, () => {
    isAdLoaded = false;
  });
}

export function loadAd() {
  try {
    interstitial.load();
  } catch {}
}

export function showAdIfReady(): Promise<void> {
  return new Promise((resolve) => {
    if (isAdLoaded) {
      const closeSub = interstitial.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          closeSub();
          resolve();
        }
      );
      interstitial.show();
    } else {
      // No ad loaded, skip
      resolve();
    }
  });
}

export function initAds() {
  setupListeners();
  loadAd();
}
