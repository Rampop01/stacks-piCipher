import { Orbitron } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata = {
  title: "PiCipher Stacks",
  description: "A picture-word guessing game on Stacks",
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
