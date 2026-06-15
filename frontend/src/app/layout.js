import { Orbitron } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata = {
  title: "PiCipher: Secure The Stacks Mainframe",
  description: "An elite cyberpunk visual decryption puzzle game built on the Stacks blockchain. Hack nodes, decrypt visual anomalies, and mint proof-of-hack NFTs.",
  keywords: "Stacks, Web3, Blockchain Gaming, PiCipher, NFTs, Cyberpunk, Puzzle Game, Bitcoin L2",
  openGraph: {
    title: "PiCipher - Hack The Stacks Mainframe",
    description: "Infiltrate the Stacks network in this immersive cyberpunk puzzle game. Decrypt visual anomalies and mint your progress on-chain.",
    url: "https://picipher.com",
    siteName: "PiCipher",
    images: [
      {
        url: "https://picipher.com/og-stacks.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PiCipher: Stacks Edition",
    description: "An elite cyberpunk visual decryption puzzle game built on the Stacks blockchain.",
    images: ["https://picipher.com/og-stacks.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${orbitron.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
