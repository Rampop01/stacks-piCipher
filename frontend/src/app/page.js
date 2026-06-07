"use client";

import { useState, useEffect } from "react";
import { AppConfig, UserSession, showConnect } from "@stacks/connect";

let userSession;
if (typeof window !== "undefined") {
  const appConfig = new AppConfig(["store_write", "publish_data"]);
  userSession = new UserSession({ appConfig });
}

export default function Home() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!userSession) return;
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);

  const authenticate = () => {
    if (!userSession) return;
    showConnect({
      appDetails: {
        name: "PicCipher",
        icon: window.location.origin + "/favicon.ico",
      },
      redirectTo: "/",
      onFinish: () => {
        setUserData(userSession.loadUserData());
      },
      userSession,
    });
  };

  const disconnect = () => {
    if (!userSession) return;
    userSession.signUserOut("/");
    setUserData(null);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans">
      <header className="flex items-center justify-between p-6 border-b border-neutral-800">
        <h1 className="text-2xl font-bold tracking-tight text-[#FF9900]">PicCipher <span className="text-neutral-500 text-sm">Stacks</span></h1>
        
        {userData ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-400">
              {userData.profile.stxAddress?.mainnet.slice(0, 6)}...
            </span>
            <button 
              onClick={disconnect}
              className="px-4 py-2 text-sm font-medium bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button 
            onClick={authenticate}
            className="px-5 py-2.5 text-sm font-medium bg-[#FF9900] hover:bg-[#e68a00] text-black rounded-lg transition-colors shadow-[0_0_15px_rgba(255,153,0,0.3)]"
          >
            Connect Wallet
          </button>
        )}
      </header>

      <main className="max-w-4xl mx-auto p-6 mt-12 flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
          Select Your Challenge
        </h2>
        <p className="text-neutral-400 text-center max-w-lg mb-12 text-lg">
          Guess the hidden word from the AI-generated images. The more images you reveal, the fewer points you earn.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-8">
          {[
            { mode: 1, title: "Expert Mode", pics: 1, desc: "Guess from 1 picture. Max points.", color: "from-[#FF9900] to-[#cc7a00]" },
            { mode: 2, title: "Hard Mode", pics: 2, desc: "Guess from 2 pictures.", color: "from-[#FFB347] to-[#e69900]" },
            { mode: 3, title: "Normal Mode", pics: 3, desc: "Guess from 3 pictures.", color: "from-[#FFC966] to-[#ffaa00]" },
            { mode: 4, title: "Easy Mode", pics: 4, desc: "Guess from 4 pictures. Minimum points.", color: "from-[#FFDF99] to-[#ffbb33]" },
          ].map((m) => (
            <button
              key={m.mode}
              className="relative overflow-hidden group p-1 rounded-2xl transition-transform hover:scale-105 active:scale-95 text-left"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${m.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
              <div className="relative h-full bg-neutral-900 border border-neutral-800 p-8 rounded-xl flex flex-col items-start gap-4">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br ${m.color} text-black font-bold`}>
                    {m.pics}
                  </span>
                  <h3 className="text-xl font-bold text-white">{m.title}</h3>
                </div>
                <p className="text-neutral-400 text-sm">{m.desc}</p>
                <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#FF9900] group-hover:text-white transition-colors">
                  Play Now &rarr;
                </span>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
