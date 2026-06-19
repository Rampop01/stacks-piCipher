"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, AlertCircle, Play, FastForward, CheckCircle2, Lock, Trophy } from "lucide-react";
import { GAME_VAULT } from "../../../data/vault";
import { useConnect } from "@stacks/connect-react";
import { userSession } from "../../../components/Providers";
import { useSoundEffects } from "../../../hooks/useSoundEffects";
import VictoryScreen from "../../../components/VictoryScreen";
import OnboardingOverlay from "../../../components/OnboardingOverlay";
import { STACKS_MAINNET, STACKS_MOCKNET } from "@stacks/network";
import {
  fetchCallReadOnlyFunction,
  cvToJSON,
  standardPrincipalCV,
  stringAsciiCV,
  bufferCVFromString,
  PostConditionMode,
  Pc,
  FungibleConditionCode
} from "@stacks/transactions";
import Link from "next/link";
import TiltCard from "../../../components/TiltCard";


const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "SP1DQM5RKBBT5XTF7EDRHZ4NFP01R2FG7MV2FQC33";
const CONTRACT_NAME = "piccipher-game-v2";
const NETWORK = STACKS_MAINNET;

export default function GamePlay() {
  const router = useRouter();
  const { doContractCall } = useConnect();
  const { playBlip, playKeystroke, playSuccess, playError, playUnlock } = useSoundEffects();

  // State
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nicknameInput, setNicknameInput] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [currentStageData, setCurrentStageData] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [revealedImages, setRevealedImages] = useState([false, false, false, false]);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Refs
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      loadProfile();
    } else {
      router.push("/");
    }

    if (typeof window !== "undefined") {
      const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setShowOnboarding(false);
  };

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const userData = userSession.loadUserData();
      const userAddress = userData.profile.stxAddress.mainnet;

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
        // (some (tuple (current-stage u1) (nickname "Hacker")))
        const nickname = profileJSON.value.value.nickname.value;
        const currentStage = Number(profileJSON.value.value['current-stage'].value);
        
        setProfile({
          nickname: nickname,
          currentStage: currentStage
        });
        loadStage(currentStage);
        speakText(`Welcome back to the grid, ${nickname}.`);
      } else {
        setProfile({ isRegistered: false });
        speakText("Unregistered identity detected. Please register a nickname.");
      }
    } catch (error) {
      console.error("Error loading profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStage = (stageId) => {
    const stage = GAME_VAULT.find(s => s.stageId === stageId);
    if (stage) {
      setCurrentStageData(stage);
      setShowHint(false);
      setTranscript("");
      setRevealedImages([false, false, false, false]);
    } else {
      setCurrentStageData({ isComplete: true });
      speakText("Incredible. You have bypassed all security protocols. Campaign completed.");
    }
  };

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const engVoice = voices.find(v => v.lang.includes("en-US") && v.name.includes("Google")) || voices[0];
      utterance.voice = engVoice;
      utterance.pitch = 0.8;
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const revealImage = (index) => {
    if (revealedImages[index]) return;
    playBlip();
    const newRevealed = [...revealedImages];
    newRevealed[index] = true;
    setRevealedImages(newRevealed);
    speakText(`Decrypting visual anomaly 0${index + 1}. Reward multiplier decreased.`);
  };

  const handleRegister = async () => {
    if (!nicknameInput) return;
    setIsRegistering(true);

    await doContractCall({
      network: NETWORK,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: "register",
      functionArgs: [stringAsciiCV(nicknameInput)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
      onFinish: (data) => {
        playSuccess();
        setFeedback({ type: "success", message: "Identity registered! Waiting for block confirmation..." });
        speakText(`Identity confirmed. Welcome, ${nicknameInput}.`);
        // We wait a bit then load profile (though Stacks blocks take 10 mins, we assume fast mocknet or optimistically update)
        setTimeout(() => loadProfile(), 3000);
      },
      onCancel: () => {
        playError();
        setIsRegistering(false);
        setFeedback({ type: "error", message: "Registration cancelled." });
      }
    });
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser. Please type your answer.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setFeedback({ type: "info", message: "Listening... speak now." });
    };

    recognitionRef.current.onresult = async (event) => {
      const current = event.resultIndex;
      const result = event.results[current][0].transcript.toUpperCase().trim();
      setTranscript(result);
      checkAnswer(result);
    };

    recognitionRef.current.onerror = (event) => {
      console.error(event.error);
      setIsListening(false);
      setFeedback({ type: "error", message: "Voice recognition failed." });
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const checkAnswer = async (guess) => {
    if (!currentStageData) return;
    if (guess === currentStageData.word) {
      playSuccess();
      speakText("Access granted. Impressive hacking.");
      setFeedback({ type: "success", message: "Correct! Submitting to Stacks blockchain..." });
      
      await doContractCall({
        network: NETWORK,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: "submit-stage-answer",
        functionArgs: [bufferCVFromString(guess)],
        postConditionMode: PostConditionMode.Deny,
        postConditions: [],
        onFinish: (data) => {
          playUnlock();
          setFeedback({ type: "success", message: "Answer submitted successfully!" });
          setTimeout(() => loadProfile(), 2000);
        },
        onCancel: () => {
          playError();
          setFeedback({ type: "error", message: "Submission cancelled." });
        }
      });
    } else {
      playError();
      speakText("Incorrect. Security systems alerted.");
      setFeedback({ type: "error", message: `Incorrect guess: ${guess}` });
    }
  };

  const handleBypass = async () => {
    const userData = userSession.loadUserData();
    const userAddress = userData.profile.stxAddress.mainnet;
    const bypassFee = 50000; // 0.05 STX
    
    const postCondition = Pc.principal(userAddress).willSendEq(bypassFee).ustx();

    setFeedback({ type: "loading", message: "Processing bypass with STX..." });
    
    await doContractCall({
      network: NETWORK,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: "bypass-stage",
      functionArgs: [],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [postCondition],
      onFinish: (data) => {
        playSuccess();
        speakText("Stage bypassed using STX.");
        setFeedback({ type: "success", message: "Stage bypassed! Waiting for block..." });
        setTimeout(() => loadProfile(), 3000);
      },
      onCancel: () => {
        playError();
        setFeedback({ type: "error", message: "Bypass cancelled." });
      }
    });
  };

  const handleBuyHint = async () => {
    const userData = userSession.loadUserData();
    const userAddress = userData.profile.stxAddress.mainnet;
    const hintFee = 10000; // 0.01 STX
    
    const postCondition = Pc.principal(userAddress).willSendEq(hintFee).ustx();

    setFeedback({ type: "loading", message: "Purchasing hint with STX..." });

    await doContractCall({
      network: NETWORK,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: "buy-hint",
      functionArgs: [],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [postCondition],
      onFinish: (data) => {
        playUnlock();
        setShowHint(true);
        speakText("Hint unlocked.");
        setFeedback({ type: "success", message: "Hint purchased!" });
      },
      onCancel: () => {
        playError();
        setFeedback({ type: "error", message: "Hint purchase cancelled." });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-[#FF5500] flex items-center justify-center font-mono text-xl animate-pulse">
        [ CONNECTING TO MAINFRAME... ]
      </div>
    );
  }

  if (profile && !profile.isRegistered) {
    return (
      <div data-component-id="dea78889" className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md p-8 border-2 border-[#FF5500] bg-black/50 backdrop-blur shadow-[0_0_30px_rgba(255,85,0,0.2)]">
          <h2 data-component-id="698bd0b9" className="text-3xl font-black mb-6 text-[#FF5500]">REGISTER IDENTITY</h2>
          <p data-cy="cy-4279ae" className="text-neutral-400 mb-8 font-mono text-sm">
            You must mint your Beginner Badge NFT to enter the grid. Enter a hacker alias below.
          </p>
          <input 
            type="text" 
            value={nicknameInput}
            onChange={(e) => {
              const val = e.target.value.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 15);
              playKeystroke();
              setNicknameInput(val);
            }}
            placeholder="NICKNAME" 
            className="w-full bg-transparent border-b-2 border-[#FF5500]/50 focus:border-[#FF5500] outline-none py-3 text-xl font-mono text-[#FF5500] placeholder:text-[#FF5500]/30 mb-8"
          />
          <button 
            onClick={handleRegister}
            disabled={isRegistering || !nicknameInput}
            className="w-full gaming-btn py-4 border border-[#FF5500] text-[#FF5500] font-bold hover:bg-[#FF5500] hover:text-black disabled:opacity-50"
          >
            {isRegistering ? "[ MINTING... ]" : "[ INITIALIZE ]"}
          </button>
          
          {feedback.message && (
            <p className={`mt-4 font-mono text-sm ${feedback.type === 'error' ? 'text-red-500' : 'text-[#FF5500]'}`}>
              &gt; {feedback.message}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (currentStageData?.isComplete) {
    return <VictoryScreen profile={profile} networkName="Stacks" />;
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {showOnboarding && <OnboardingOverlay onComplete={handleOnboardingComplete} networkName="Stacks" />}
      {/* Top HUD */}
      <div data-tracking="track-17152a" className="w-full border-b border-[#FF5500]/30 bg-black/60 backdrop-blur-md sticky top-0 z-50 p-4 flex justify-between items-center font-mono shadow-[0_4px_20px_rgba(255,85,0,0.1)]">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-white/60 hover:text-[#FF5500] transition-colors flex items-center gap-2 text-sm">
             <span data-theme-role="primary-surface" className="hidden md:inline">HOME</span>
          </Link>
          <div className="flex items-center gap-4 border-l border-white/10 pl-6">
            <span data-theme-role="primary-surface" className="text-[#FF5500] font-bold tracking-widest uppercase">
              {profile?.nickname || "UNKNOWN"}
            </span>
          </div>
        </div>
        
        <div data-cy="cy-e270f0" className="flex items-center gap-6">
          <Link href="/leaderboard" className="text-white/60 hover:text-[#FF5500] transition-colors flex items-center gap-2 text-sm">
             <Trophy className="w-4 h-4" /> <span className="hidden md:inline">RANKS</span>
          </Link>
          <Link href="/profile" className="text-white/60 hover:text-[#FF5500] transition-colors flex items-center gap-2 text-sm">
             <span data-testid="container-51e2ec" className="hidden md:inline">PROFILE</span>
          </Link>
          <div className="text-right border-l border-white/10 pl-6">
            <div className="text-xs text-neutral-500">STAGE {profile?.currentStage}</div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8 mt-4">
        
        {/* Main Image View (2x2 Grid) */}
        <div className="w-full aspect-square md:aspect-video grid grid-cols-2 gap-4 mb-8">
          {[0, 1, 2, 3].map((index) => {
             const filters = ["", "hue-rotate-90 saturate-200", "invert sepia", "grayscale contrast-200"];
             return (
               <TiltCard key={index} className="w-full h-full">
                 <div 
                      className="border border-[#FF5500]/30 relative group overflow-hidden backdrop-blur-md bg-black/40 flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(255,85,0,0.1)] hover:shadow-[0_0_30px_rgba(255,85,0,0.3)] hover:border-[#FF5500] transition-all duration-300 w-full h-full"
                      onClick={() => revealImage(index)}>
                    {revealedImages[index] ? (
                      <img 
                        src={currentStageData?.imageUrl} 
                        alt={`Cipher Anomaly ${index+1}`} 
                        className={`w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 ${filters[index]}`}
                      />
                    ) : (
                      <div data-cy="cy-2a6ca8" className="flex flex-col items-center justify-center text-[#FF5500]/40 group-hover:text-[#FF5500] transition-colors">
                        <Lock className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                        <span data-cy="cy-14ce00" className="font-mono text-xs tracking-widest text-center transition-transform group-hover:animate-glitch-skew">DATA<br/>ENCRYPTED</span>
                      </div>
                    )}
                    {/* Scanline Overlay */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-40 mix-blend-overlay"></div>
                 </div>
               </TiltCard>
             )
          })}
        </div>

        {/* Micro-transaction HUD */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button 
            onClick={handleBuyHint}
            className="flex items-center justify-center gap-2 px-3 py-4 neo-btn text-yellow-500 font-mono text-xs md:text-sm"
          >
            <AlertCircle className="w-4 h-4" /> 0.01 STX HINT
          </button>
          <button 
            onClick={handleBypass}
            className="flex items-center justify-center gap-2 px-3 py-4 neo-btn text-red-500 font-mono text-xs md:text-sm"
          >
            <FastForward className="w-4 h-4" /> 0.05 STX BYPASS
          </button>
        </div>

        {/* Hint Display */}
        {showHint && (
          <div data-component-id="03d99c06" className="w-full p-4 border-l-4 border-yellow-500 bg-yellow-500/10 text-yellow-200 font-mono mb-8 animate-in fade-in slide-in-from-top-4">
            &gt; DECRYPTED DATA: {currentStageData?.hint}
          </div>
        )}

        {/* Input Area */}
        <div className="w-full p-6 border border-[#FF5500]/40 backdrop-blur-lg bg-black/60 relative shadow-[0_0_30px_rgba(255,85,0,0.1)]">
          <div className="absolute -top-3 left-4 bg-black px-2 text-xs text-[#FF5500] font-mono border border-[#FF5500]/50">
            TERMINAL_INPUT.exe
          </div>
          
          <div data-testid="container-44ea65" className="flex flex-col items-center">
            <button
              onClick={toggleListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center mb-8 transition-all duration-300 ${
                isListening 
                  ? "bg-red-500/20 border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-pulse" 
                  : "bg-[#FF5500]/10 border border-[#FF5500]/50 hover:border-[#FF5500] hover:shadow-[0_0_20px_rgba(255,85,0,0.4)]"
              }`}
            >
              {isListening ? <Mic className="w-8 h-8 text-red-500" /> : <MicOff className="w-8 h-8 text-[#FF5500]" />}
            </button>

            <div className="w-full flex justify-center mb-6">
                 <div className="flex items-center text-[#FF5500] font-mono text-2xl w-full max-w-sm border-b border-[#FF5500]/50 focus-within:border-[#FF5500] focus-within:shadow-[0_4px_15px_-3px_rgba(255,85,0,0.3)] pb-2 transition-all">
                   <input 
                      type="text" 
                      value={transcript}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase().slice(0, 50);
                        playKeystroke();
                        setTranscript(val);
                      }}
                      placeholder="_" 
                      className="w-full bg-transparent outline-none text-[#FF5500] placeholder:text-[#FF5500]/30"
                    />
                 </div>
            </div>

            {transcript && !isListening && (
              <button 
                onClick={() => checkAnswer(transcript)}
                className="px-8 py-3 bg-[#FF5500] text-black font-black tracking-widest uppercase hover:bg-white transition-colors flex items-center gap-2"
              >
                SUBMIT <CheckCircle2 className="w-5 h-5" />
              </button>
            )}

            {feedback.message && (
              <p className={`mt-6 font-mono text-sm text-center ${
                feedback.type === 'error' ? 'text-red-500' : 
                feedback.type === 'success' ? 'text-[#FF5500]' : 
                'text-yellow-500'
              }`}>
                &gt; {feedback.message}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
