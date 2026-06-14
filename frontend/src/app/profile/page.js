"use client";
import { User, Shield, Zap, Hexagon, History, Coins } from "lucide-react";
import Link from "next/link";
import { useConnect } from "@stacks/connect-react";
import { userSession } from "../../components/Providers";
import { useState, useEffect } from "react";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const authenticated = !!userData;

  const mockStats = { rank: "NEON_VIPER", level: 42, totalBounty: "8,450 STX", stagesCleared: 124, perfectClears: 32, accuracy: "94.2%" };
  const recentActivity = [
    { type: "STAGE_CLEARED", stage: 124, reward: "50 STX", time: "2h ago" },
    { type: "STAGE_CLEARED", stage: 123, reward: "45 STX", time: "5h ago" },
    { type: "PERFECT_CLEAR", stage: 122, reward: "100 STX", time: "1d ago" },
    { type: "BOUNTY_CLAIMED", amount: "500 STX", time: "2d ago" },
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

        {authenticated ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-[#FF5500]/5 border border-[#FF5500]/20 p-6 flex flex-col items-center text-center hover:border-[#FF5500]/50 transition-colors">
                  <Shield className="w-8 h-8 text-[#FF5500] mb-3 opacity-80" />
                  <span className="text-xs text-neutral-400 mb-1">CURRENT RANK</span>
                  <span className="font-bold tracking-wider">{mockStats.rank}</span>
                </div>
                <div className="bg-[#FF5500]/5 border border-[#FF5500]/20 p-6 flex flex-col items-center text-center hover:border-[#FF5500]/50 transition-colors">
                  <Hexagon className="w-8 h-8 text-[#FF5500] mb-3 opacity-80" />
                  <span className="text-xs text-neutral-400 mb-1">STAGES CLEARED</span>
                  <span className="font-bold tracking-wider text-xl">{mockStats.stagesCleared}</span>
                </div>
                <div className="bg-[#FF5500]/5 border border-[#FF5500]/20 p-6 flex flex-col items-center text-center hover:border-[#FF5500]/50 transition-colors">
                  <Coins className="w-8 h-8 text-[#FF5500] mb-3 opacity-80" />
                  <span className="text-xs text-neutral-400 mb-1">TOTAL BOUNTY</span>
                  <span className="font-bold tracking-wider text-[#FF5500] drop-shadow-[0_0_8px_rgba(255,85,0,0.5)]">{mockStats.totalBounty}</span>
                </div>
                <div className="bg-[#FF5500]/5 border border-[#FF5500]/20 p-6 flex flex-col items-center text-center hover:border-[#FF5500]/50 transition-colors">
                  <Zap className="w-8 h-8 text-[#FF5500] mb-3 opacity-80" />
                  <span className="text-xs text-neutral-400 mb-1">PERFECT CLEARS</span>
                  <span className="font-bold tracking-wider text-xl text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">{mockStats.perfectClears}</span>
                </div>
                <div className="bg-[#FF5500]/5 border border-[#FF5500]/20 p-6 flex flex-col items-center text-center hover:border-[#FF5500]/50 transition-colors">
                  <History className="w-8 h-8 text-[#FF5500] mb-3 opacity-80" />
                  <span className="text-xs text-neutral-400 mb-1">ACCURACY</span>
                  <span className="font-bold tracking-wider text-xl">{mockStats.accuracy}</span>
                </div>
                <div className="bg-[#FF5500]/5 border border-[#FF5500]/20 p-6 flex flex-col items-center text-center hover:border-[#FF5500]/50 transition-colors">
                  <User className="w-8 h-8 text-[#FF5500] mb-3 opacity-80" />
                  <span className="text-xs text-neutral-400 mb-1">OPERATIVE LEVEL</span>
                  <span className="font-bold tracking-wider text-xl">{mockStats.level}</span>
                </div>
              </div>

              <div className="border border-[#FF5500]/20 p-6 bg-black">
                <h3 className="text-xl font-bold mb-6 text-[#FF5500] flex items-center gap-2">
                  <Hexagon className="w-5 h-5" /> ACQUIRED_BADGES
                </h3>
                <div className="flex flex-wrap gap-4">
                  {[1, 2, 3, 4, 5].map((badge) => (
                    <div key={badge} className="w-16 h-16 border-2 border-[#FF5500]/40 rotate-45 flex items-center justify-center hover:border-[#FF5500] transition-colors cursor-pointer group bg-black">
                      <div className="-rotate-45 text-[#FF5500]/50 group-hover:text-[#FF5500] group-hover:scale-110 transition-transform font-bold">
                        B{badge}
                      </div>
                    </div>
                  ))}
                  <div className="w-16 h-16 border-2 border-neutral-800 rotate-45 flex items-center justify-center bg-black">
                    <div className="-rotate-45 text-neutral-600 font-bold">?</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-l border-[#FF5500]/20 pl-8">
              <h3 className="text-lg font-bold mb-6 text-white tracking-widest border-b border-[#FF5500]/20 pb-4">
                SYSTEM_LOGS
              </h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#FF5500]/50 before:to-transparent">
                {recentActivity.map((log, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-3 h-3 rounded-full border border-[#FF5500] bg-black text-slate-500 shadow shrink-0 z-10" />
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] p-4 border border-[#FF5500]/20 bg-[#FF5500]/5 group-hover:border-[#FF5500]/50 transition-colors ml-4 md:ml-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-sm text-[#FF5500]">{log.type}</span>
                        <span className="text-[10px] text-neutral-500">{log.time}</span>
                      </div>
                      <p className="text-xs text-neutral-300">
                        {log.stage ? `Cleared Stage ${log.stage}` : "Withdrawal processed"}
                      </p>
                      <p className="text-xs font-bold mt-2 text-yellow-500">
                        + {log.reward || log.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 border border-neutral-800 bg-neutral-900/20">
            <Shield className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-neutral-400 mb-2">ACCESS DENIED</h2>
            <p className="text-neutral-500 mb-6">Please connect your Stacks wallet to view operative profile.</p>
          </div>
        )}
      </div>
    </div>
  );
}
