"use client";
import { User, Shield, Zap, Hexagon, History, Coins } from "lucide-react";
import Link from "next/link";
import { useConnect } from "@stacks/connect-react";
import { userSession } from "../../../components/Providers";
import { useState, useEffect } from "react";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const authenticated = !!userData;

  const mockStats = {
    rank: "NEON_VIPER",
    level: 42,
    totalBounty: "8,450 STX",
    stagesCleared: 124,
    perfectClears: 32,
    accuracy: "94.2%"
  };

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono">
      <header className="flex justify-between items-center mb-12 border-b border-[#FF5500]/30 pb-6">
        <h1 className="text-3xl font-black text-[#FF5500]">OPERATIVE_PROFILE</h1>
        <Link href="/">[ RETURN_HOME ]</Link>
      </header>
    </div>
  );
}
