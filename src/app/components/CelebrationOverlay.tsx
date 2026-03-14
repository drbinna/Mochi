import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  scale: number;
}

interface CelebrationOverlayProps {
  visible: boolean;
  xp?: number;
  onComplete?: () => void;
}

export function CelebrationOverlay({ visible, xp = 24, onComplete }: CelebrationOverlayProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (visible) {
      const emojis = ["⭐", "✨", "💖", "🌟", "💫"];
      const newParticles: Particle[] = [];
      for (let i = 0; i < 40; i++) {
        const angle = (Math.PI * 2 * i) / 40 + (Math.random() - 0.5) * 0.5;
        const speed = 3 + Math.random() * 5;
        newParticles.push({
          id: i,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          x: 0,
          y: 0,
          vx: Math.cos(angle) * speed * 40,
          vy: Math.sin(angle) * speed * 40 - 60,
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 1,
        });
      }
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
          {/* Particles */}
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute text-[20px]"
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 0,
                rotate: 0,
              }}
              animate={{
                x: p.vx,
                y: p.vy + 120,
                opacity: [1, 1, 0],
                scale: [0, p.scale, p.scale * 0.5],
                rotate: p.rotation,
              }}
              transition={{
                duration: 1.8,
                ease: "easeOut",
              }}
              style={{ fontSize: 16 + p.scale * 10 }}
            >
              {p.emoji}
            </motion.span>
          ))}

          {/* XP Popup */}
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.5 }}
            animate={{ y: -80, opacity: [0, 1, 1, 0], scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute"
            style={{
              background: "linear-gradient(135deg, #FFE566, #FF8B6A)",
              borderRadius: 50,
              padding: "8px 20px",
              boxShadow: "0 0 30px rgba(255,229,102,0.5)",
            }}
          >
            <span
              className="text-white text-[20px]"
              style={{ fontFamily: "'Fredoka One', cursive" }}
            >
              +{xp} XP 🌟
            </span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface CompletionScreenProps {
  visible: boolean;
  totalXp: number;
  cardsCollected: number;
  onKeepExploring: () => void;
  onBye: () => void;
}

export function CompletionScreen({
  visible,
  totalXp,
  cardsCollected,
  onKeepExploring,
  onBye,
}: CompletionScreenProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(10, 5, 25, 0.85)",
              backdropFilter: "blur(20px)",
            }}
          />

          <motion.div
            className="relative z-10 flex flex-col items-center gap-5 p-8"
            style={{
              background: "linear-gradient(145deg, #ffffff, #f0eaff)",
              borderRadius: 28,
              boxShadow: "0 24px 64px rgba(196,168,255,0.45), 0 2px 8px rgba(0,0,0,0.08)",
              maxWidth: 380,
              width: "90%",
            }}
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.35 }}
          >
            <span className="text-[48px]">🎉</span>
            <h2
              className="text-[32px]"
              style={{ fontFamily: "'Fredoka One', cursive", color: "#2D1B6B" }}
            >
              Amazing!
            </h2>

            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <span
                  className="text-[28px]"
                  style={{ fontFamily: "'Fredoka One', cursive", color: "#FF8B6A" }}
                >
                  {totalXp}
                </span>
                <span className="text-[12px] text-[#4a3a7a]" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
                  XP Earned
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span
                  className="text-[28px]"
                  style={{ fontFamily: "'Fredoka One', cursive", color: "#a855f7" }}
                >
                  {cardsCollected}
                </span>
                <span className="text-[12px] text-[#4a3a7a]" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
                  Cards
                </span>
              </div>
            </div>

            {/* Fan of cards */}
            <div className="relative h-16 w-40 flex items-center justify-center">
              {[...Array(Math.min(cardsCollected, 5))].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-10 h-14 rounded-lg"
                  style={{
                    background: "linear-gradient(135deg, #C4A8FF, #FF7EB3)",
                    border: "2px solid rgba(255,255,255,0.5)",
                    transform: `rotate(${(i - 2) * 12}deg)`,
                    zIndex: i,
                  }}
                />
              ))}
            </div>

            <div className="flex flex-col gap-3 w-full mt-2">
              <motion.button
                onClick={onKeepExploring}
                className="w-full py-3 text-white text-[16px] cursor-pointer"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #FF7EB3, #C4A8FF)",
                  borderRadius: 14,
                  border: "none",
                  minHeight: 48,
                }}
                whileTap={{ scale: 0.95 }}
              >
                Keep Exploring! 🚀
              </motion.button>
              <motion.button
                onClick={onBye}
                className="w-full py-3 text-[#4a3a7a] text-[14px] cursor-pointer"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  background: "transparent",
                  border: "2px solid rgba(45,27,107,0.2)",
                  borderRadius: 14,
                  minHeight: 48,
                }}
                whileTap={{ scale: 0.95 }}
              >
                Bye for now! 👋
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
