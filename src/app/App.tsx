import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { StarfieldCanvas } from "./components/StarfieldCanvas";
import { MochiCharacter } from "./components/MochiCharacter";
import { SpeechBubble } from "./components/SpeechBubble";
import { MicButton } from "./components/MicButton";
import { KnowledgeCard } from "./components/KnowledgeCard";
import { HudElements, StartHud } from "./components/HudElements";
import { TopicPicker, type Zone } from "./components/TopicPicker";
import { CelebrationOverlay, CompletionScreen } from "./components/CelebrationOverlay";
import { useVapi } from "./components/useVapi";

type Screen = "start" | "session" | "completion";
type MicState = "default" | "listening" | "speaking";
type MochiState = "idle" | "listening" | "speaking" | "happy" | "sleeping";

const speechLines = [
  "Hey there! Ready to learn something awesome today? 🌟",
  "Did you know that AI can learn from pictures, just like you!",
  "When you talk to me, I try to understand your words — that's called Natural Language!",
  "Let's explore how computers can be creative! What do you think?",
  "Great answer! You're really getting the hang of this! 💖",
];

const knowledgeCards = [
  {
    zone: { name: "Crystal Cave", emoji: "🔮", color: "#a855f7" },
    title: "AI Learns Like You!",
    fact: "Just like you learn from books and teachers, AI learns from lots and lots of examples. The more it sees, the smarter it gets!",
    wowFact: "Some AIs have learned from more books than you could read in 1000 lifetimes!",
    conceptEmoji: "🧠",
  },
  {
    zone: { name: "Ancient Forest", emoji: "🌲", color: "#22c55e" },
    title: "Words Are Magic!",
    fact: "When you talk to AI, it turns your words into numbers! Each word becomes a special code that helps AI understand what you mean.",
    wowFact: "AI can understand over 100 different languages — even ones with emojis! 🌍",
    conceptEmoji: "✨",
  },
];

const statBars = [
  { label: "🔮", color: "#a855f7", value: 65 },
  { label: "🌲", color: "#22c55e", value: 30 },
  { label: "🏔️", color: "#ef4444", value: 0 },
  { label: "💧", color: "#3b82f6", value: 0 },
];

function getTimeGradient(): string {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 8)
    return "linear-gradient(180deg, #1a1040 0%, #FF8B6A 50%, #FFE566 100%)";
  if (hour >= 8 && hour < 17)
    return "linear-gradient(180deg, #1a1040 0%, #2d4fa0 50%, #7ec8e3 100%)";
  if (hour >= 17 && hour < 20)
    return "linear-gradient(180deg, #1a1040 0%, #c97030 50%, #FFE566 100%)";
  return "linear-gradient(180deg, #0B0E2D 0%, #1B2A6B 50%, #2D5A8E 100%)";
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [micState, setMicState] = useState<MicState>("default");
  const [mochiState, setMochiState] = useState<MochiState>("sleeping");
  const [speechText, setSpeechText] = useState("");
  const [showSpeech, setShowSpeech] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showTopicPicker, setShowTopicPicker] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cardsCollected, setCardsCollected] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [speechIndex, setSpeechIndex] = useState(0);
  const [currentTopic, setCurrentTopic] = useState("🤖 How AI Thinks");
  const [waking, setWaking] = useState(false);
  const [currentBars, setCurrentBars] = useState(statBars);
  const [interactionCount, setInteractionCount] = useState(0);

  // VAPI voice integration
  const vapi = useVapi();
  const vapiConnected = vapi.status !== "idle" && vapi.status !== "error";

  // Sync VAPI status → Mochi UI states
  useEffect(() => {
    if (screen !== "session") return;

    switch (vapi.status) {
      case "connecting":
        setMicState("default");
        setMochiState("idle");
        setSpeechText("Hmm, let me wake up my voice... 🎤");
        setShowSpeech(true);
        break;
      case "listening":
        setMicState("listening");
        setMochiState("listening");
        setShowSpeech(false);
        break;
      case "speaking":
        setMicState("speaking");
        setMochiState("speaking");
        if (vapi.assistantMessage) {
          setSpeechText(vapi.assistantMessage);
          setShowSpeech(true);
        }
        break;
      case "active":
        setMicState("listening");
        setMochiState("listening");
        break;
      case "error":
        // Fall back to demo mode on error — no visible error to child
        setMicState("default");
        setMochiState("idle");
        break;
      case "idle":
        if (vapiConnected) {
          setMicState("default");
          setMochiState("idle");
        }
        break;
    }
  }, [vapi.status, vapi.assistantMessage, screen]);

  // Track interactions for knowledge cards / celebrations
  useEffect(() => {
    if (vapi.assistantMessage && screen === "session") {
      setInteractionCount((prev) => {
        const next = prev + 1;
        // Every 3rd response, show a knowledge card
        if (next % 3 === 0 && currentCardIndex < knowledgeCards.length) {
          setTimeout(() => setShowCard(true), 1000);
        }
        // Every 5th response, celebrate
        if (next % 5 === 0) {
          setTimeout(() => {
            setShowCelebration(true);
            setMochiState("happy");
            setTotalXp((p) => p + 24);
            setCurrentBars((prev) =>
              prev.map((b, i) =>
                i === 0 ? { ...b, value: Math.min(b.value + 10, 100) } : b
              )
            );
          }, 1500);
        }
        return next;
      });
    }
  }, [vapi.assistantMessage]);

  // Sync mute state with VAPI
  useEffect(() => {
    if (vapiConnected && muted !== vapi.isMuted) {
      vapi.toggleMute();
    }
  }, [muted]);

  // Start sequence
  const handleWakeUp = useCallback(() => {
    setWaking(true);
    setMochiState("idle");
    setTimeout(() => {
      setScreen("session");
      setWaking(false);
      setMochiState("idle");
      // Mochi stays quiet — waits for the child to press the mic button
    }, 800);
  }, []);

  // Demo mode fallback — only runs one exchange per mic press
  const runDemoMode = useCallback(() => {
    // Already in a demo cycle, ignore
    if (micState === "listening" || micState === "speaking") return;

    setMicState("listening");
    setMochiState("listening");
    setShowSpeech(false);

    // Simulate "listening" for 3 seconds, then Mochi responds once
    setTimeout(() => {
      setMicState("speaking");
      setMochiState("speaking");
      const nextIndex = (speechIndex + 1) % speechLines.length;
      setSpeechIndex(nextIndex);
      setSpeechText(speechLines[nextIndex]);
      setShowSpeech(true);

      // After speaking, return to idle — wait for next mic press
      setTimeout(() => {
        setMicState("default");
        setMochiState("idle");

        if (nextIndex % 2 === 1 && currentCardIndex < knowledgeCards.length) {
          setTimeout(() => setShowCard(true), 500);
        }

        if (nextIndex === 4) {
          setTimeout(() => {
            setShowCelebration(true);
            setMochiState("happy");
            setTotalXp((prev) => prev + 24);
            setCurrentBars((prev) =>
              prev.map((b, i) =>
                i === 0 ? { ...b, value: Math.min(b.value + 15, 100) } : b
              )
            );
          }, 800);
        }
      }, 3000);
    }, 3000);
  }, [speechIndex, currentCardIndex, micState]);

  // Mic button — uses VAPI if configured, otherwise falls back to demo
  const handleMicPress = useCallback(() => {
    // If mic is blocked (iframe policy / permission denied), go straight to demo
    if (vapi.micBlocked) {
      if (micState === "listening") {
        setMicState("default");
        setMochiState("idle");
      } else {
        runDemoMode();
      }
      return;
    }

    // If VAPI is active, toggle the call on/off
    if (vapiConnected) {
      vapi.stop();
      setMicState("default");
      setMochiState("idle");
      return;
    }

    // Try starting VAPI
    if (vapi.status === "idle" && micState === "default") {
      vapi.start().then(() => {
        // VAPI will drive state via the useEffect above
      }).catch(() => {
        // VAPI failed — fall back to demo mode silently
        runDemoMode();
      });
      return;
    }

    // Demo fallback (no VAPI key configured or previous error)
    if (vapi.status === "error" || vapi.error) {
      if (micState === "listening") {
        setMicState("default");
        setMochiState("idle");
      } else {
        runDemoMode();
      }
      return;
    }

    // If already listening in demo, stop
    if (micState === "listening") {
      setMicState("default");
      setMochiState("idle");
    }
  }, [micState, vapi, vapiConnected, runDemoMode]);

  const handleCollectCard = useCallback(() => {
    setShowCard(false);
    setCardsCollected((prev) => prev + 1);
    setCurrentCardIndex((prev) => prev + 1);
    setShowCelebration(true);
    setMochiState("happy");
    setTotalXp((prev) => prev + 24);
  }, []);

  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false);
    setMochiState("idle");
  }, []);

  const handleTopicSelect = useCallback((zone: Zone) => {
    setCurrentTopic(`${zone.icon} ${zone.name}`);
    setShowTopicPicker(false);
    setSpeechText(`Ooh, let's explore ${zone.name}! This is gonna be fun! 🎉`);
    setShowSpeech(true);
    setMochiState("speaking");
    setTimeout(() => setMochiState("idle"), 3000);
  }, []);

  const handleGoHome = useCallback(() => {
    if (totalXp > 0) {
      setShowCompletion(true);
    } else {
      setScreen("start");
      setMochiState("sleeping");
      setShowSpeech(false);
      setMicState("default");
    }
  }, [totalXp]);

  const handleBye = useCallback(() => {
    // Stop VAPI call if active
    if (vapiConnected) {
      vapi.stop();
    }
    setShowCompletion(false);
    setScreen("start");
    setMochiState("sleeping");
    setShowSpeech(false);
    setMicState("default");
    setTotalXp(0);
    setCardsCollected(0);
    setSpeechIndex(0);
    setCurrentCardIndex(0);
    setInteractionCount(0);
  }, [vapiConnected, vapi]);

  // Dim overlay for listening
  const showDim = micState === "listening";

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      style={{
        background: getTimeGradient(),
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* Starfield */}
      <StarfieldCanvas />

      {/* Floating island landscape elements */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        {/* Distant mountains */}
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1024 200" preserveAspectRatio="none" style={{ height: "30%" }}>
          <defs>
            <linearGradient id="mountain1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2D5A8E" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#1B2A6B" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="mountain2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1B2A6B" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0B0E2D" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          <path d="M0 200 L0 120 Q100 40 200 100 Q350 20 450 80 Q550 30 650 90 Q750 50 850 70 Q950 30 1024 80 L1024 200Z" fill="url(#mountain2)" />
          <path d="M0 200 L0 140 Q150 80 300 130 Q450 70 550 110 Q700 60 800 100 Q900 80 1024 120 L1024 200Z" fill="url(#mountain1)" />
        </svg>

        {/* Floating island */}
        <svg className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[600px]" viewBox="0 0 600 120">
          <defs>
            <linearGradient id="islandTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3a7c4f" />
              <stop offset="100%" stopColor="#2a5a3a" />
            </linearGradient>
            <linearGradient id="islandBottom" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5a4530" />
              <stop offset="100%" stopColor="#3a2820" />
            </linearGradient>
          </defs>
          <ellipse cx="300" cy="40" rx="280" ry="30" fill="url(#islandTop)" />
          <path d="M50 40 Q100 120 200 100 Q300 140 400 100 Q500 120 550 40" fill="url(#islandBottom)" />
          {/* Trees */}
          <circle cx="150" cy="22" r="18" fill="#2d6b3a" opacity="0.7" />
          <circle cx="180" cy="18" r="14" fill="#3a8c4f" opacity="0.6" />
          <circle cx="420" cy="20" r="16" fill="#2d6b3a" opacity="0.7" />
          <circle cx="450" cy="24" r="12" fill="#3a8c4f" opacity="0.6" />
        </svg>

        {/* Soft clouds */}
        <motion.div
          className="absolute top-[15%] left-[5%] w-40 h-12 rounded-full"
          style={{ background: "rgba(255,255,255,0.08)", filter: "blur(8px)" }}
          animate={{ x: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-[25%] right-[10%] w-56 h-16 rounded-full"
          style={{ background: "rgba(255,255,255,0.06)", filter: "blur(12px)" }}
          animate={{ x: [0, -40, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-[35%] left-[30%] w-32 h-10 rounded-full"
          style={{ background: "rgba(255,255,255,0.05)", filter: "blur(10px)" }}
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Listening dim overlay */}
      <AnimatePresence>
        {showDim && (
          <motion.div
            className="absolute inset-0 z-[5]"
            style={{ background: "rgba(0,0,0,0.2)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* SCREENS */}
      <AnimatePresence mode="wait">
        {screen === "start" && (
          <motion.div
            key="start"
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.3 }}
          >
            <StartHud />

            {/* Mochi character - large */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: waking ? 1.3 : 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <MochiCharacter size={340} state={mochiState} />
            </motion.div>

            {/* Wake Up button */}
            {!waking && (
              <motion.button
                onClick={handleWakeUp}
                className="relative z-20 cursor-pointer text-white"
                style={{
                  width: 280,
                  height: 72,
                  background: "linear-gradient(135deg, #FF7EB3, #C4A8FF)",
                  borderRadius: 999,
                  border: "none",
                  boxShadow:
                    "0 0 40px rgba(255,126,179,0.7), 0 8px 32px rgba(196,168,255,0.5)",
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: 22,
                }}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileTap={{ scale: 0.92 }}
              >
                Wake Up Mochi! 🌟
              </motion.button>
            )}
          </motion.div>
        )}

        {screen === "session" && (
          <motion.div
            key="session"
            className="absolute inset-0 z-10 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* HUD */}
            <HudElements
              childName="Luna"
              level={3}
              streak={5}
              muted={muted}
              onMuteToggle={() => setMuted(!muted)}
              onHome={() => {
                // Stop VAPI before going home
                if (vapiConnected) vapi.stop();
                handleGoHome();
              }}
              cardsCollected={cardsCollected}
              topicBadge={currentTopic}
              statBars={currentBars}
            />

            {/* Center stage */}
            <div className="flex-1 flex flex-col items-center justify-center gap-2 relative w-full">
              {/* Speech Bubble */}
              <div className="mb-2">
                <SpeechBubble text={speechText} visible={showSpeech} />
              </div>

              {/* Mochi */}
              <MochiCharacter
                size={260}
                state={mochiState}
                onClick={() => {
                  setMochiState("happy");
                  setTimeout(() => setMochiState("idle"), 1500);
                }}
              />
            </div>

            {/* Mic button area */}
            <div className="pb-8 relative z-20">
              <MicButton state={micState} onClick={handleMicPress} />
            </div>

            {/* Knowledge Card - right side */}
            <div className="absolute right-5 top-1/2 -translate-y-1/2 z-30">
              {currentCardIndex < knowledgeCards.length && (
                <KnowledgeCard
                  visible={showCard}
                  {...knowledgeCards[currentCardIndex]}
                  onCollect={handleCollectCard}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration overlay */}
      <CelebrationOverlay
        visible={showCelebration}
        xp={24}
        onComplete={handleCelebrationComplete}
      />

      {/* Completion screen */}
      <CompletionScreen
        visible={showCompletion}
        totalXp={totalXp}
        cardsCollected={cardsCollected}
        onKeepExploring={() => {
          setShowCompletion(false);
          setShowTopicPicker(true);
        }}
        onBye={handleBye}
      />

      {/* Topic picker */}
      <TopicPicker
        visible={showTopicPicker}
        onSelect={handleTopicSelect}
        onClose={() => setShowTopicPicker(false)}
      />
    </div>
  );
}