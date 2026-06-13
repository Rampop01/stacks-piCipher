"use client";
import { User, Shield, Zap, Hexagon, History, Coins } from "lucide-react";
import Link from "next/link";
import { useConnect } from "@stacks/connect-react";
import { userSession } from "../../../components/Providers";
import { useState, useEffect } from "react";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const authenticated = !!userData;

  const mockStats = { rank: "NEON_VIPER", level: 42, totalBounty: "8,450 STX", stagesCleared: 124, perfectClears: 32, accuracy: "94.2%" };
  const recentActivity = [
    { type: "STAGE_CLEARED", stage: 124, reward: "50 STX", time: "2h ago" },
    { type: "PERFECT_CLEAR", stage: 122, reward: "100 STX", time: "1d ago" }
  ];

  useEffect(() => { if (userSession.isUserSignedIn()) { setUserData(userSession.loadUserData()); } }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-mono">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-[#FF5500]/30 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FF5500]/10 border border-[#FF5500] flex items-center justify-center shadow-[0_0_15px_rgba(255,85,0,0.3)]">
              <User className="w-6 h-6 text-[#FF5500]" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#FF5500] tracking-widest drop-shadow-[0_0_10px_rgba(255,85,0,0.5)] uppercase">
                OPERATIVE_PROFILE
              </h1>
              <p className="text-neutral-500 text-sm">
                ID: {authenticated ? (userData?.profile?.stxAddress?.mainnet?.slice(0, 12) + "...") : "UNAUTHORIZED"}
              </p>
            </div>
          </div>
          <Link href="/" className="px-6 py-2 border border-[#FF5500]/50 text-[#FF5500] hover:bg-[#FF5500]/10 transition-colors">
            [ RETURN_HOME ]
          </Link>
        </header>
      </div>
    </div>
  );
}
