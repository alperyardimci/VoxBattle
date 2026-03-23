import React from "react";
import { Image, StyleSheet } from "react-native";
import { parse } from "twemoji-parser";

interface TwemojiProps {
  emoji: string;
  size?: number;
}

export default function Twemoji({ emoji, size = 32 }: TwemojiProps) {
  const parsed = parse(emoji);
  if (parsed.length === 0) return null;

  // Convert SVG URL to PNG (72x72)
  const pngUrl = parsed[0].url
    .replace("/svg/", "/72x72/")
    .replace(".svg", ".png");

  return (
    <Image
      source={{ uri: pngUrl }}
      style={{ width: size, height: size, resizeMode: "contain" }}
    />
  );
}
