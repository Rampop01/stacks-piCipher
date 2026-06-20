"use client";

import { useConnect } from "@stacks/connect-react";
import { userSession } from "./Providers";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mic, BrainCircuit, Coins, Trophy, Image as ImageIcon, Zap, User } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const { authenticate } = useConnect();
  const [userData, setUserData] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [glitchText, setGlitchText] = useState("PIC CIPHER");

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((data) => setUserData(data));
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);

  const login = () => {
    authenticate({
      onFinish: () => {
        setUserData(userSession.loadUserData());
      }
    });
  };

  const logout = () => {
    userSession.signUserOut("/");
    setUserData(null);
  };

  const authenticated = !!userData;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchText((prev) => (prev === "PIC CIPHER" ? "P!C C1PH3R" : "PIC CIPHER"));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-neutral-50 font-sans selection:bg-[#FF5500] selection:text-black">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF5500]/20 rounded-full blur-[120px]" />
        <div aria-label="Interactive element 7cd7" className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#1e9a58]/20 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 select-none">
            <div data-cy="cy-7ab16a" className="w-3 h-3 bg-[#FF5500] rounded-full shadow-[0_0_10px_#FF5500] animate-pulse"></div>
            <div className="text-3xl font-black tracking-tighter flex items-center">
              <span data-theme-role="primary-surface" className="text-white">Pi</span>
              <span data-tracking="track-089fe2" className="text-[#FF5500] text-4xl -ml-0.5 -mr-0.5">C</span>
              <span data-testid="text-cedc81" className="text-white">ipher</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {authenticated ? (
              <>
                <span aria-label="Interactive element c426" className="hidden md:inline-block px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-mono text-[#FF5500]">
                  {userData?.profile?.stxAddress?.mainnet?.slice(0,6) + '...'}
                </span>
                <Link href="/profile" className="hidden md:flex items-center gap-2 text-xs font-mono text-white/70 hover:text-[#FF5500] transition-colors">
                  <User className="w-4 h-4" /> [PROFILE]
                </Link>
                <Link href="/leaderboard" className="hidden md:flex items-center gap-2 text-xs font-mono text-white/70 hover:text-[#FF5500] transition-colors">
                  <Trophy className="w-4 h-4" /> [RANKINGS]
                </Link>
                <button 
                  onClick={logout}
                  className="gaming-btn px-6 py-2 border border-white/20 hover:border-white/60 hover:bg-white/10 text-xs text-white"
                >
                  DISCONNECT
                </button>
              </>
            ) : (
              <>
                <Link href="/leaderboard" className="hidden md:flex items-center gap-2 text-sm font-mono text-neutral-400 hover:text-white transition-colors mr-4">
                  <Trophy className="w-4 h-4" /> LEADERBOARD
                </Link>
                <button 
                  onClick={login}
                  className="gaming-btn px-6 py-2 border-2 border-[#FF5500] text-[#FF5500] text-sm hover:text-black hover:bg-[#FF5500] shadow-[0_0_15px_rgba(255,85,0,0.2)]"
                >
                  PLAY NOW
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        
        {/* Auth State: Mode Selection */}
        {authenticated ? (
          <section className="min-h-screen pt-32 pb-24 px-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-6xl animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="text-center mb-16">
                <h2 data-testid="text-aacf30" className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#FF5500] to-[#1e9a58] mb-6 drop-shadow-[0_0_15px_rgba(255,85,0,0.3)]">
                  ENTER THE GRID
                </h2>
                <p data-testid="container-40210c" className="text-xl text-neutral-400 max-w-2xl mx-auto font-mono">
                  &gt; Decrypt the visual anomalies. Speak the truth. Progress through 50 stages of increasing difficulty to earn your Stacks bounties and exclusive NFT Badges.
                </p>
              </div>

              <div className="flex justify-center w-full">
                <button
                  onClick={() => router.push('/game/play')}
                  className="group relative px-12 py-6 bg-black/40 backdrop-blur-md border-2 border-[#FF5500] hover:bg-[#FF5500]/10 transition-all duration-300 shadow-[0_0_30px_rgba(255,85,0,0.2)] hover:shadow-[0_0_50px_rgba(255,85,0,0.4)] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF5500]/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  <span data-testid="text-9d3f40" className="relative z-10 text-2xl font-black text-[#FF5500] tracking-[0.2em] uppercase">
                    START GAME &rarr;
                  </span>
                </button>
              </div>
            </div>
          </section>
        ) : (
          /* Unauth State: Full Landing Page */
          <>
            {/* CRT Scanline Overlay for Hero */}
            <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20"></div>

            {/* Hero Section */}
            <section className="pt-40 pb-20 md:pt-52 md:pb-32 px-6 flex flex-col items-center justify-center text-center">
              <h2 data-tracking="track-74fc26" className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-[#FF5500] to-[#1e9a58] drop-shadow-[0_0_25px_rgba(255,85,0,0.4)] glitch-effect mb-8">
                {glitchText}
              </h2>
              <p data-tracking="track-30c0d8" className="text-neutral-400 text-lg md:text-xl tracking-widest uppercase max-w-2xl leading-relaxed mb-12">
                Decrypt the AI visuals. <br/> Speak the hidden word. <br/> Claim the bounty.
              </p>
              
              <div className="pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <button 
                  onClick={login}
                  className="gaming-btn group relative px-10 py-5 bg-transparent border-2 border-[#FF5500] text-[#FF5500] font-bold text-xl md:text-2xl tracking-[0.2em] uppercase hover:text-black shadow-[0_0_20px_rgba(255,85,0,0.3)] hover:bg-[#FF5500]"
                >
                  &gt; Press Start to Connect &lt;
                </button>
              </div>
            </section>

            {/* Interactive Preview Section */}
            <section className="py-24 px-6 relative border-y border-[#FF5500]/20 bg-black/80 overflow-hidden">
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                <div data-tracking="track-cde050" className="flex-1 space-y-8">
                  <h2 data-testid="text-e0f401" className="text-4xl md:text-5xl font-black text-[#FF5500] drop-shadow-[0_0_4px_rgba(255,85,0,0.6)]">THE ULTIMATE TEST OF PERCEPTION</h2>
                  <p data-cy="cy-f5e3b9" className="text-lg text-neutral-400 leading-relaxed font-mono">
                    &gt; You are presented with 4 seemingly random AI-generated images. They all share one conceptual link. Can you find it?
                    The catch: revealing fewer images rewards you with a significantly higher multiplier on your Stacks bounty.
                  </p>
                  <ul className="space-y-4 font-mono">
                    {[
                      "Dynamic AI generation means no two puzzles are alike.",
                      "Smart contract verification ensures provably fair rewards.",
                      "Real-time voice recognition for instant, seamless answers."
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-4">
                        <div className="text-[#FF5500] font-black">[ + ]</div>
                        <span data-component-id="7718d57c" className="text-neutral-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Visual Mockup */}
                <div className="flex-1 w-full max-w-lg aspect-square grid grid-cols-2 gap-4 group perspective-1000 relative">
                  <div className="absolute inset-0 border-2 border-[#FF5500]/30 pointer-events-none group-hover:border-[#FF5500] transition-colors duration-500 shadow-[0_0_30px_rgba(255,85,0,0.1)] difficulty-card"></div>
                  {[1, 2, 3, 4].map((box) => (
                    <div key={box} className="bg-black border border-[#FF5500]/20 flex items-center justify-center relative overflow-hidden transition-all duration-500 group-hover:border-[#FF5500] group-hover:shadow-[0_0_20px_rgba(255,85,0,0.2)] difficulty-card">
                      <ImageIcon className="w-12 h-12 text-[#FF5500]/30 group-hover:scale-110 group-hover:text-[#FF5500] transition-all duration-700" />
                      <div data-testid="text-4b66f4" className="absolute inset-0 bg-[#FF5500]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                        <span data-component-id="22578c81" className="text-[#FF5500] font-mono text-xs tracking-widest bg-black px-2 py-1 border border-[#FF5500]/50">IMG_0{box}.SYS</span>
                      </div>
                    </div>
                  ))}
                  {/* Fake Microphone overlay */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-black/90 backdrop-blur-md border-2 border-[#FF5500] flex items-center justify-center shadow-[0_0_30px_#FF5500] animate-pulse difficulty-card">
                    <Mic className="w-10 h-10 text-[#FF5500]" />
                  </div>
                </div>
              </div>
            </section>

            {/* Features Grid */}
            <section id="how-it-works" className="py-32 px-6 max-w-7xl mx-auto border-b border-[#FF5500]/20">
              <div className="text-center mb-20">
                <h2 data-theme-role="primary-surface" className="text-5xl font-black mb-6 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">SYSTEM ARCHITECTURE</h2>
                <div aria-label="Interactive element c3ee" className="h-1 w-32 bg-[#FF5500] mx-auto shadow-[0_0_15px_#FF5500]"></div>
              </div>

              <div aria-label="Interactive element ddac" className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: BrainCircuit, title: "AI VISUALS", desc: "Every puzzle consists of 4 highly abstract images generated by advanced AI models to test your deduction skills." },
                  { icon: Mic, title: "VOICE CONTROL", desc: "No typing required. Hold the microphone, speak your answer into the ether, and let the Web Speech API process it." },
                  { icon: Coins, title: "CRYPTO BOUNTIES", desc: "Correct answers trigger an on-chain smart contract function, instantly rewarding your wallet with STX tokens." }
                ].map((feature, i) => (
                  <div key={i} className="difficulty-card p-8 bg-black/60 border-2 border-[#FF5500]/20 hover:border-[#FF5500] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,85,0,0.2)] group relative overflow-hidden">
                    <div aria-label="Interactive element 01a6" className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF5500] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <feature.icon className="w-12 h-12 text-[#FF5500] mb-6 drop-shadow-[0_0_8px_#FF5500]" />
                    <h3 className="text-2xl font-bold mb-4 tracking-widest">{feature.title}</h3>
                    <p data-cy="cy-bc01df" className="text-neutral-400 leading-relaxed font-mono text-sm">&gt; {feature.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer CTA */}
            <section className="py-32 px-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,85,0,0.1)_0%,transparent_50%)]" />
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 aria-label="Interactive element be75" className="text-5xl md:text-7xl font-black mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">READY TO CONNECT?</h2>
                <p data-component-id="31610f79" className="text-xl text-[#FF5500] mb-12 font-mono tracking-widest">&gt; AWAITING PLAYER INITIALIZATION...</p>
                <button 
                  onClick={login}
                  className="gaming-btn px-12 py-6 border-2 border-[#FF5500] text-[#FF5500] font-black text-2xl hover:text-black hover:bg-[#FF5500]"
                >
                  CONNECT WALLET
                </button>
              </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[#FF5500]/20 py-8 px-6 bg-black">
              <div aria-label="Interactive element 1d08" className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div data-tracking="track-397319" className="text-2xl font-black tracking-tighter flex items-center">
                  <span data-testid="container-dbda19" className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">Pi</span>
                  <span data-tracking="track-f25b5f" className="text-[#FF5500] text-3xl drop-shadow-[0_0_12px_#FF5500] -ml-0.5 -mr-0.5">C</span>
                  <span data-testid="text-a20275" className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">ipher</span>
                </div>
                <p data-testid="text-882798" className="text-neutral-600 font-mono text-xs tracking-[0.3em]">© 2026 // STACKS NETWORK // V2.0</p>
                <div className="flex items-center gap-6 text-[#FF5500] font-mono text-xs tracking-widest uppercase">
                  <a href="#" className="hover:text-white transition-colors">[Twitter]</a>
                  <a href="#" className="hover:text-white transition-colors">[Discord]</a>
                  <a href="#" className="hover:text-white transition-colors">[Contract]</a>
                </div>
              </div>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
