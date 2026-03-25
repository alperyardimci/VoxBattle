"use client";

import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";

// ── Constants ──
const W = 1320;
const H = 2868;

const SIZES = [
  { label: '6.9"', w: 1320, h: 2868 },
  { label: '6.5"', w: 1284, h: 2778 },
  { label: '6.3"', w: 1206, h: 2622 },
  { label: '6.1"', w: 1125, h: 2436 },
] as const;

// Mockup measurements
const MK_W = 1022;
const MK_H = 2082;
const SC_L = (52 / MK_W) * 100;
const SC_T = (46 / MK_H) * 100;
const SC_W = (918 / MK_W) * 100;
const SC_H = (1990 / MK_H) * 100;
const SC_RX = (126 / 918) * 100;
const SC_RY = (126 / 1990) * 100;

// Brand
const ACCENT = "#e94560";
const BG_DARK = "#0a0a1a";
const BG_CARD = "rgba(255,255,255,0.06)";

// ── Phone Component ──
function Phone({ src, alt, style, className = "" }: {
  src: string; alt: string; style?: React.CSSProperties; className?: string;
}) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: `${MK_W}/${MK_H}`, ...style }}>
      <img src="/mockup.png" alt="" className="block w-full h-full" draggable={false} />
      <div className="absolute z-10 overflow-hidden" style={{
        left: `${SC_L}%`, top: `${SC_T}%`, width: `${SC_W}%`, height: `${SC_H}%`,
        borderRadius: `${SC_RX}% / ${SC_RY}%`,
      }}>
        <img src={src} alt={alt} className="block w-full h-full object-cover object-top" draggable={false} />
      </div>
    </div>
  );
}

// ── Caption Component ──
function Caption({ label, headline, light = false }: {
  label: string; headline: string; light?: boolean;
}) {
  return (
    <div style={{ textAlign: "center", padding: `0 ${W * 0.06}px` }}>
      <div style={{
        fontSize: W * 0.028, fontWeight: 600, letterSpacing: "0.15em",
        color: light ? "rgba(255,255,255,0.5)" : ACCENT,
        marginBottom: W * 0.015, textTransform: "uppercase",
      }}>
        {label}
      </div>
      <div style={{
        fontSize: W * 0.085, fontWeight: 800, lineHeight: 1.0,
        color: light ? "#fff" : "#fff",
      }} dangerouslySetInnerHTML={{ __html: headline }} />
    </div>
  );
}

// ── Decorative Blob ──
function Blob({ color, size, top, left, opacity = 0.15 }: {
  color: string; size: number; top: string; left: string; opacity?: number;
}) {
  return (
    <div style={{
      position: "absolute", top, left, width: size, height: size,
      borderRadius: "50%", background: color, opacity, filter: "blur(80px)",
      pointerEvents: "none",
    }} />
  );
}

// ── Slide 1: Hero ──
function Slide1() {
  return (
    <div style={{
      width: W, height: H, position: "relative", overflow: "hidden",
      background: `linear-gradient(170deg, #0f0a20 0%, ${BG_DARK} 40%, #0d1525 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <Blob color={ACCENT} size={600} top="-10%" left="-15%" opacity={0.12} />
      <Blob color="#533483" size={500} top="60%" left="70%" opacity={0.1} />

      {/* App Icon */}
      <div style={{ marginTop: H * 0.08, marginBottom: W * 0.03 }}>
        <img src="/app-icon.png" alt="VoxBattle" style={{
          width: W * 0.16, height: W * 0.16, borderRadius: W * 0.035,
        }} />
      </div>

      <Caption label="TELAFFUZ DÜELLOSU" headline="Söyle ve<br/>Kazan!" />

      <div style={{ flex: 1, position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
        <Phone src="/screenshots/home.png" alt="Ana Sayfa" style={{
          position: "absolute", bottom: 0, width: "84%",
          transform: "translateY(12%)",
        }} />
      </div>
    </div>
  );
}

// ── Slide 2: Game Modes ──
function Slide2() {
  return (
    <div style={{
      width: W, height: H, position: "relative", overflow: "hidden",
      background: `linear-gradient(170deg, #1a0e2e 0%, ${BG_DARK} 50%)`,
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <Blob color="#0f3460" size={500} top="5%" left="60%" opacity={0.15} />
      <Blob color={ACCENT} size={400} top="70%" left="-10%" opacity={0.1} />

      <div style={{ marginTop: H * 0.08 }}>
        <Caption label="İKİ MOD" headline="Solo Pratik<br/>veya Düello" />
      </div>

      <div style={{ flex: 1, position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
        <Phone src="/screenshots/mode-select.png" alt="Mod Seçimi" style={{
          position: "absolute", bottom: 0, width: "84%",
          transform: "translateY(14%)",
        }} />
      </div>
    </div>
  );
}

// ── Slide 3: Gameplay ──
function Slide3() {
  return (
    <div style={{
      width: W, height: H, position: "relative", overflow: "hidden",
      background: `linear-gradient(180deg, #0d1525 0%, ${BG_DARK} 60%, #1a0e2e 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <Blob color={ACCENT} size={500} top="40%" left="50%" opacity={0.08} />

      <div style={{ marginTop: H * 0.08 }}>
        <Caption label="180+ KELİME • 45+ DİL" headline="Dünyadan<br/>Kelimeler" />
      </div>

      <div style={{ flex: 1, position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
        {/* Back phone */}
        <Phone src="/screenshots/game-start.png" alt="Oyun" style={{
          position: "absolute", bottom: 0, left: "-6%", width: "65%",
          transform: "translateY(8%) rotate(-4deg)", opacity: 0.5,
        }} />
        {/* Front phone */}
        <Phone src="/screenshots/game-japanese.png" alt="Japonca" style={{
          position: "absolute", bottom: 0, right: "-4%", width: "82%",
          transform: "translateY(12%)",
        }} />
      </div>
    </div>
  );
}

// ── Slide 4: Correct Answer ──
function Slide4() {
  return (
    <div style={{
      width: W, height: H, position: "relative", overflow: "hidden",
      background: `linear-gradient(170deg, #0a1a0a 0%, ${BG_DARK} 50%, #0d0d25 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <Blob color="#4CAF50" size={500} top="10%" left="30%" opacity={0.1} />
      <Blob color={ACCENT} size={400} top="65%" left="60%" opacity={0.08} />

      <div style={{ marginTop: H * 0.08 }}>
        <Caption label="GERÇEK ZAMANLI" headline="Mikrofona Söyle<br/>Anında Öğren" />
      </div>

      <div style={{ flex: 1, position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
        <Phone src="/screenshots/game-correct.png" alt="Doğru Cevap" style={{
          position: "absolute", bottom: 0, width: "84%",
          transform: "translateY(12%)",
        }} />
      </div>
    </div>
  );
}

// ── Slide 5: Results ──
function Slide5() {
  return (
    <div style={{
      width: W, height: H, position: "relative", overflow: "hidden",
      background: `linear-gradient(170deg, #1a1005 0%, ${BG_DARK} 50%)`,
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <Blob color="#FF9800" size={450} top="5%" left="50%" opacity={0.12} />
      <Blob color="#533483" size={400} top="70%" left="-5%" opacity={0.1} />

      <div style={{ marginTop: H * 0.08 }}>
        <Caption label="DETAYLI SONUÇLAR" headline="Doğrusunu<br/>Dinle ve Öğren" />
      </div>

      <div style={{ flex: 1, position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
        <Phone src="/screenshots/results.png" alt="Sonuçlar" style={{
          position: "absolute", bottom: 0, width: "84%",
          transform: "translateY(12%)",
        }} />
      </div>
    </div>
  );
}

// ── Slide 6: Online ──
function Slide6() {
  return (
    <div style={{
      width: W, height: H, position: "relative", overflow: "hidden",
      background: `linear-gradient(170deg, #0f0a20 0%, ${BG_DARK} 40%, #0a1520 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <Blob color={ACCENT} size={600} top="60%" left="40%" opacity={0.1} />
      <Blob color="#0f3460" size={500} top="5%" left="-10%" opacity={0.12} />

      <div style={{ marginTop: H * 0.08 }}>
        <Caption label="ONLİNE DÜELLO" headline="Arkadaşlarınla<br/>Yarış!" />
      </div>

      <div style={{ flex: 1, position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
        <Phone src="/screenshots/lobby.png" alt="Online Lobby" style={{
          position: "absolute", bottom: 0, width: "84%",
          transform: "translateY(12%)",
        }} />
      </div>
    </div>
  );
}

// ── Registry ──
const SLIDES = [
  { id: "hero", label: "Hero", Component: Slide1 },
  { id: "modes", label: "Modlar", Component: Slide2 },
  { id: "gameplay", label: "Oyun", Component: Slide3 },
  { id: "correct", label: "Telaffuz", Component: Slide4 },
  { id: "results", label: "Sonuçlar", Component: Slide5 },
  { id: "online", label: "Online", Component: Slide6 },
];

// ── Preview + Export ──
function ScreenshotPreview({ slide, index, size, exporting, onExport }: {
  slide: typeof SLIDES[0]; index: number;
  size: typeof SIZES[number]; exporting: boolean;
  onExport: (el: HTMLDivElement, name: string) => void;
}) {
  const previewRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const { Component } = slide;

  const scale = 320 / W;

  return (
    <div
      style={{ position: "relative", cursor: "pointer" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => exportRef.current && onExport(exportRef.current, `${String(index + 1).padStart(2, "0")}-${slide.id}-${size.w}x${size.h}`)}
    >
      {/* Preview */}
      <div style={{
        width: 320, height: 320 * (H / W), overflow: "hidden",
        borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
        position: "relative",
      }}>
        <div ref={previewRef} style={{
          width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left",
        }}>
          <Component />
        </div>
        {hover && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 12,
          }}>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>
              {exporting ? "Exporting..." : "Click to Export"}
            </span>
          </div>
        )}
      </div>
      <div style={{ textAlign: "center", marginTop: 8, color: "#888", fontSize: 13, fontWeight: 600 }}>
        {slide.label}
      </div>

      {/* Offscreen export target */}
      <div ref={exportRef} style={{
        position: "absolute", left: -9999, top: 0,
        width: size.w, height: size.h, overflow: "hidden",
      }}>
        <div style={{ width: W, height: H, transform: `scale(${size.w / W})`, transformOrigin: "top left" }}>
          <Component />
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──
export default function ScreenshotsPage() {
  const [sizeIdx, setSizeIdx] = useState(0);
  const [exporting, setExporting] = useState<string | null>(null);
  const size = SIZES[sizeIdx];

  const exportOne = async (el: HTMLDivElement, name: string) => {
    setExporting(name);
    el.style.left = "0px";
    el.style.opacity = "1";
    el.style.zIndex = "-1";

    const opts = { width: size.w, height: size.h, pixelRatio: 1, cacheBust: true };
    await toPng(el, opts); // warm up
    const dataUrl = await toPng(el, opts);

    el.style.left = "-9999px";
    el.style.opacity = "";
    el.style.zIndex = "";

    const link = document.createElement("a");
    link.download = `${name}.png`;
    link.href = dataUrl;
    link.click();
    setExporting(null);
  };

  const exportAll = async () => {
    for (let i = 0; i < SLIDES.length; i++) {
      const el = document.querySelectorAll<HTMLDivElement>("[data-export]")[i];
      if (!el) continue;
      const name = `${String(i + 1).padStart(2, "0")}-${SLIDES[i].id}-${size.w}x${size.h}`;
      setExporting(name);

      el.style.left = "0px";
      el.style.opacity = "1";
      el.style.zIndex = "-1";

      const opts = { width: size.w, height: size.h, pixelRatio: 1, cacheBust: true };
      await toPng(el, opts);
      const dataUrl = await toPng(el, opts);

      el.style.left = "-9999px";
      el.style.opacity = "";
      el.style.zIndex = "";

      const link = document.createElement("a");
      link.download = `${name}.png`;
      link.href = dataUrl;
      link.click();

      await new Promise((r) => setTimeout(r, 300));
    }
    setExporting(null);
  };

  return (
    <div style={{ padding: 32, minHeight: "100vh", background: "#111" }}>
      {/* Toolbar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 16, marginBottom: 32,
        padding: "12px 20px", background: "rgba(255,255,255,0.05)",
        borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
      }}>
        <span style={{ color: ACCENT, fontWeight: 800, fontSize: 18 }}>VoxBattle Screenshots</span>
        <div style={{ flex: 1 }} />

        {/* Size picker */}
        {SIZES.map((s, i) => (
          <button key={s.label} onClick={() => setSizeIdx(i)} style={{
            padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
            background: i === sizeIdx ? ACCENT : "rgba(255,255,255,0.08)",
            color: i === sizeIdx ? "#fff" : "#888", fontWeight: 700, fontSize: 13,
          }}>
            {s.label}
          </button>
        ))}

        <button onClick={exportAll} style={{
          padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer",
          background: ACCENT, color: "#fff", fontWeight: 700, fontSize: 14,
        }}>
          {exporting ? `Exporting...` : "Export All"}
        </button>
      </div>

      {/* Grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, 320px)",
        gap: 24, justifyContent: "center",
      }}>
        {SLIDES.map((slide, i) => (
          <ScreenshotPreview
            key={slide.id}
            slide={slide}
            index={i}
            size={size}
            exporting={exporting === slide.id}
            onExport={exportOne}
          />
        ))}
      </div>

      {/* Hidden export targets with data-export attribute */}
      <div style={{ position: "absolute", left: -9999, top: 0 }}>
        {SLIDES.map((slide, i) => {
          const { Component } = slide;
          return (
            <div key={slide.id} data-export style={{
              position: "absolute", left: -9999, top: 0,
              width: size.w, height: size.h, overflow: "hidden",
            }}>
              <div style={{ width: W, height: H, transform: `scale(${size.w / W})`, transformOrigin: "top left" }}>
                <Component />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
