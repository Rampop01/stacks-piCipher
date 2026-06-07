import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PicCipher (Stacks)",
  description: "A picture-word guessing game on Stacks",
  other: {
    "talentapp:project_verification": "3ee2ffddf1ab0c6ddeffc35195fd96f1e7f90b23b6580eaa591d09273931532fc0870ba87c5b6beb81cca81f5e7f0956e65dcd56bcb60f1f8e876113af8a3989",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
