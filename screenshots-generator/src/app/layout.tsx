import { Inter } from "next/font/google";
import "./globals.css";

const font = Inter({ subsets: ["latin"], weight: ["400", "600", "700", "800", "900"] });

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={font.className} style={{ margin: 0, background: "#111" }}>{children}</body>
    </html>
  );
}
