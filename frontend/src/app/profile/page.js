"use client";
import { User, Shield, Zap, Hexagon, History, Coins } from "lucide-react";
import Link from "next/link";
import { useConnect } from "@stacks/connect-react";
import { userSession } from "../../components/Providers";
import { useState, useEffect } from "react";
import { fetchCallReadOnlyFunction, cvToJSON, standardPrincipalCV } from "@stacks/transactions";
import { STACKS_MAINNET } from "@stacks/network";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "SP1DQM5RKBBT5XTF7EDRHZ4NFP01R2FG7MV2FQC33";
const CONTRACT_NAME = "piccipher-game-v2";
const NETWORK = STACKS_MAINNET;

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [blockchainProfile, setBlockchainProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const authenticated = !!userData;

  useEffect(() => { 
    if (userSession.isUserSignedIn()) { 
      const sessionData = userSession.loadUserData();
      setUserData(sessionData); 
      loadBlockchainProfile(sessionData.profile.stxAddress.mainnet);
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadBlockchainProfile = async (userAddress) => {
    try {
      setIsLoading(true);
      const result = await fetchCallReadOnlyFunction({
        network: NETWORK,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: "get-player-profile",
        functionArgs: [standardPrincipalCV(userAddress)],
        senderAddress: userAddress,
      });

      const profileJSON = cvToJSON(result);

      if (profileJSON.value !== undefined && profileJSON.value !== null) {
        const nickname = profileJSON.value.value.nickname.value;
        const currentStage = Number(profileJSON.value.value['current-stage'].value);
        setBlockchainProfile({
          nickname,
          currentStage
        });
      }
    } catch (error) {
      console.error("Error loading profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Derive stats dynamically based on the blockchain current stage
  const stage = blockchainProfile?.currentStage || 1;
  const rank = stage < 5 ? "ROOKIE_HACKER" : stage < 10 ? "NEON_VIPER" : "CYBER_GHOST";
  const bounty = (stage - 1) * 50; 
  const perfectClears = Math.floor(stage / 3);
  const accuracy = Math.min(100, 70 + (stage * 2.5)).toFixed(1) + "%";

  const derivedStats = { 
    rank: rank, 
    level: stage, 
    totalBounty: `${bounty} STX`, 
    stagesCleared: stage - 1, 
    perfectClears: perfectClears, 
    accuracy: accuracy 
  };

  const recentActivity = [];
  for (let i = 1; i < Math.min(5, stage); i++) {
    recentActivity.push({ 
      type: "STAGE_CLEARED", 
      stage: stage - i, 
      reward: "50 STX", 
      time: "recent" 
    });
  }

  // Generate badges dynamically
  const earnedBadges = Array.from({ length: Math.min(5, Math.floor(stage / 2)) }, (_, i) => i + 1);

  if (isLoading) {
     return <div className="min-h-screen bg-black text-[#FF5500] flex items-center justify-center font-mono text-xl animate-pulse">
        [ DECRYPTING PROFILE DATA... ]
      </div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-mono pb-24">
      <div data-cy="cy-a1a23c" className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-[#FF5500]/30 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FF5500]/10 border border-[#FF5500] flex items-center justify-center shadow-[0_0_15px_rgba(255,85,0,0.3)]">
              <User className="w-6 h-6 text-[#FF5500]" />
            </div>
            <div>
              <h1 aria-label="Interactive element 33f4" className="text-3xl font-black text-[#FF5500] tracking-widest drop-shadow-[0_0_10px_rgba(255,85,0,0.5)] uppercase">
                {blockchainProfile ? blockchainProfile.nickname : "OPERATIVE_PROFILE"}
              </h1>
              <p data-testid="container-990309" className="text-neutral-500 text-sm">
                ID: {authenticated ? (userData?.profile?.stxAddress?.mainnet?.slice(0, 12) + "...") : "UNAUTHORIZED"}
              </p>
            </div>
          </div>
          <Link href="/game/play" className="px-6 py-2 border border-[#FF5500]/50 text-[#FF5500] hover:bg-[#FF5500]/10 transition-colors">
            [ RETURN_TO_GRID ]
          </Link>
        </header>

        {authenticated ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div data-testid="text-67faa4" className="md:col-span-2 space-y-8">
              <div data-theme-role="primary-surface" className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div data-theme-role="primary-surface" className="bg-[#FF5500]/5 border border-[#FF5500]/20 p-6 flex flex-col items-center text-center hover:border-[#FF5500]/50 transition-colors">
                  <Shield className="w-8 h-8 text-[#FF5500] mb-3 opacity-80" />
                  <span data-theme-role="primary-surface" className="text-xs text-neutral-400 mb-1">CURRENT RANK</span>
                  <span className="font-bold tracking-wider">{derivedStats.rank}</span>
                </div>
                <div className="bg-[#FF5500]/5 border border-[#FF5500]/20 p-6 flex flex-col items-center text-center hover:border-[#FF5500]/50 transition-colors">
                  <Hexagon className="w-8 h-8 text-[#FF5500] mb-3 opacity-80" />
                  <span className="text-xs text-neutral-400 mb-1">STAGES CLEARED</span>
                  <span data-testid="container-5f868e" className="font-bold tracking-wider text-xl">{derivedStats.stagesCleared}</span>
                </div>
                <div aria-label="Interactive element 6072" className="bg-[#FF5500]/5 border border-[#FF5500]/20 p-6 flex flex-col items-center text-center hover:border-[#FF5500]/50 transition-colors">
                  <Coins className="w-8 h-8 text-[#FF5500] mb-3 opacity-80" />
                  <span className="text-xs text-neutral-400 mb-1">TOTAL BOUNTY</span>
                  <span data-tracking="track-13d54e" className="font-bold tracking-wider text-[#FF5500] drop-shadow-[0_0_8px_rgba(255,85,0,0.5)]">{derivedStats.totalBounty}</span>
                </div>
                <div data-component-id="c9875d4b" className="bg-[#FF5500]/5 border border-[#FF5500]/20 p-6 flex flex-col items-center text-center hover:border-[#FF5500]/50 transition-colors">
                  <Zap className="w-8 h-8 text-[#FF5500] mb-3 opacity-80" />
                  <span data-cy="cy-d2be8b" className="text-xs text-neutral-400 mb-1">PERFECT CLEARS</span>
                  <span data-tracking="track-b0b91b" className="font-bold tracking-wider text-xl text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">{derivedStats.perfectClears}</span>
                </div>
                <div className="bg-[#FF5500]/5 border border-[#FF5500]/20 p-6 flex flex-col items-center text-center hover:border-[#FF5500]/50 transition-colors">
                  <History className="w-8 h-8 text-[#FF5500] mb-3 opacity-80" />
                  <span data-theme-role="primary-surface" className="text-xs text-neutral-400 mb-1">ACCURACY</span>
                  <span className="font-bold tracking-wider text-xl">{derivedStats.accuracy}</span>
                </div>
                <div data-tracking="track-3d6f33" className="bg-[#FF5500]/5 border border-[#FF5500]/20 p-6 flex flex-col items-center text-center hover:border-[#FF5500]/50 transition-colors">
                  <User className="w-8 h-8 text-[#FF5500] mb-3 opacity-80" />
                  <span data-cy="cy-362e98" className="text-xs text-neutral-400 mb-1">OPERATIVE LEVEL</span>
                  <span className="font-bold tracking-wider text-xl">{derivedStats.level}</span>
                </div>
              </div>

              <div data-tracking="track-b2683f" className="border border-[#FF5500]/20 p-6 bg-black">
                <h3 className="text-xl font-bold mb-6 text-[#FF5500] flex items-center gap-2">
                  <Hexagon className="w-5 h-5" /> ACQUIRED_BADGES
                </h3>
                <div className="flex flex-wrap gap-4">
                  {earnedBadges.length > 0 ? earnedBadges.map((badge) => (
                    <div key={badge} className="w-16 h-16 border-2 border-[#FF5500]/40 rotate-45 flex items-center justify-center hover:border-[#FF5500] transition-colors cursor-pointer group bg-black">
                      <div className="-rotate-45 text-[#FF5500]/50 group-hover:text-[#FF5500] group-hover:scale-110 transition-transform font-bold">
                        B{badge}
                      </div>
                    </div>
                  )) : (
                    <div data-testid="text-7bf1bb" className="text-neutral-500 text-sm">No badges acquired yet. Clear more stages.</div>
                  )}
                  {earnedBadges.length > 0 && (
                    <div className="w-16 h-16 border-2 border-neutral-800 rotate-45 flex items-center justify-center bg-black">
                      <div data-theme-role="primary-surface" className="-rotate-45 text-neutral-600 font-bold">?</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div data-component-id="007d5c1e" className="border-l border-[#FF5500]/20 pl-8">
              <h3 className="text-lg font-bold mb-6 text-white tracking-widest border-b border-[#FF5500]/20 pb-4">
                SYSTEM_LOGS
              </h3>
              <div data-testid="text-c31296" className="space-y-6 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#FF5500]/50 before:to-transparent">
                {recentActivity.length > 0 ? recentActivity.map((log, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div data-testid="text-73b2ca" className="flex items-center justify-center w-3 h-3 rounded-full border border-[#FF5500] bg-black text-slate-500 shadow shrink-0 z-10" />
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] p-4 border border-[#FF5500]/20 bg-[#FF5500]/5 group-hover:border-[#FF5500]/50 transition-colors ml-4 md:ml-0">
                      <div data-testid="text-34104b" className="flex justify-between items-start mb-1">
                        <span className="font-bold text-sm text-[#FF5500]">{log.type}</span>
                        <span data-component-id="a65971ff" className="text-[10px] text-neutral-500">{log.time}</span>
                      </div>
                      <p aria-label="Interactive element aeed" className="text-xs text-neutral-300">
                        {log.stage ? `Cleared Stage ${log.stage}` : "Withdrawal processed"}
                      </p>
                      <p data-component-id="cb4afe70" className="text-xs font-bold mt-2 text-yellow-500">
                        + {log.reward || log.amount}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div data-theme-role="primary-surface" className="text-neutral-500 text-sm">No recent activity detected.</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 border border-neutral-800 bg-neutral-900/20">
            <Shield className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <h2 aria-label="Interactive element 8c54" className="text-2xl font-bold text-neutral-400 mb-2">ACCESS DENIED</h2>
            <p data-cy="cy-f0eb9c" className="text-neutral-500 mb-6">Please connect your Stacks wallet to view operative profile.</p>
          </div>
        )}
      </div>
    </div>
  );
}
// 1. constants setup
// 2. state initialization
// 3. session load
// 4. data fetch
// 5. fallback handler
// 6. level calc
// 7. bounty calc
// 8. clears calc
// 9. accuracy calc
// 10. log generator
// 11. badges generator
