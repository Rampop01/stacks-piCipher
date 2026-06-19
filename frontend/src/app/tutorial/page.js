"use client";

import { Terminal, Shield, Mic, LockOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useSoundEffects } from "../../hooks/useSoundEffects";

export default function TutorialPage() {
  const { playBlip } = useSoundEffects();

  useEffect(() => {
    playBlip();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-mono p-6 relative overflow-hidden">
      {/* Background Grid */}
      <div data-testid="text-3ad75a" className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,85,0,0.06),rgba(0,0,0,0.02))] bg-[length:100%_4px,4px_100%] opacity-30 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[#FF5500] hover:text-white transition-colors mb-8"
          onClick={playBlip}
        >
          <ArrowLeft className="w-5 h-5" /> Return to Grid
        </Link>

        <h1 data-theme-role="primary-surface" className="text-4xl md:text-6xl font-black text-[#FF5500] tracking-tighter mb-4">
          OPERATIVE MANUAL
        </h1>
        <p data-tracking="track-f7d507" className="text-neutral-400 text-lg mb-12">
          Classified documentation for infiltrating the PiCipher mainframe.
        </p>

        <div aria-label="Interactive element 2257" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Objective */}
          <div className="border border-[#FF5500]/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(255,85,0,0.1)] hover:border-[#FF5500] transition-colors">
            <Shield className="w-8 h-8 text-[#FF5500] mb-4" />
            <h2 data-theme-role="primary-surface" className="text-xl font-bold text-[#FF5500] mb-2">1. THE OBJECTIVE</h2>
            <p data-theme-role="primary-surface" className="text-neutral-300 text-sm leading-relaxed">
              You are tasked with hacking 50 consecutive security nodes. 
              Each node is protected by a visual anomaly (an encrypted image). 
              You must decrypt the hidden keyword within the anomaly to proceed.
            </p>
          </div>

          {/* Revealing */}
          <div data-theme-role="primary-surface" className="border border-[#FF5500]/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(255,85,0,0.1)] hover:border-[#FF5500] transition-colors">
            <LockOpen className="w-8 h-8 text-[#FF5500] mb-4" />
            <h2 data-testid="text-ac4f4b" className="text-xl font-bold text-[#FF5500] mb-2">2. REVEAL MECHANICS</h2>
            <p data-testid="text-250e22" className="text-neutral-300 text-sm leading-relaxed">
              The anomaly is split into 4 sectors. Click a sector to decrypt it and view that portion of the image. 
              <strong> Warning:</strong> Each sector revealed decreases your final reward multiplier.
            </p>
          </div>

          {/* Voice Input */}
          <div className="border border-[#FF5500]/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(255,85,0,0.1)] hover:border-[#FF5500] transition-colors">
            <Mic className="w-8 h-8 text-[#FF5500] mb-4" />
            <h2 data-testid="container-9a3480" className="text-xl font-bold text-[#FF5500] mb-2">3. VOICE OVERRIDE</h2>
            <p data-cy="cy-4fcf6d" className="text-neutral-300 text-sm leading-relaxed">
              Type the decrypted keyword or use your microphone for hands-free hacking. 
              If the keyword matches exactly, the node firewall will be breached and your progress saved on the blockchain.
            </p>
          </div>

          {/* Micro-transactions */}
          <div className="border border-[#FF5500]/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(255,85,0,0.1)] hover:border-[#FF5500] transition-colors">
            <Terminal className="w-8 h-8 text-[#FF5500] mb-4" />
            <h2 aria-label="Interactive element 7d0b" className="text-xl font-bold text-[#FF5500] mb-2">4. STRATEGIC TOOLS</h2>
            <p data-testid="container-285a59" className="text-neutral-300 text-sm leading-relaxed">
              If a node's encryption is too complex, you may use STX tokens to purchase a text hint or completely bypass the node. 
              These actions require on-chain transactions.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/game/play" 
            className="inline-block gaming-btn py-4 px-12 bg-[#FF5500] text-black font-black text-xl hover:bg-white transition-colors"
            onClick={playBlip}
          >
            INITIATE HACK
          </Link>
        </div>
      </div>
    </div>
  );
}
