import { motion, AnimatePresence } from "motion/react";

export interface Zone {
  id: string;
  name: string;
  emoji: string;
  icon: string;
  color: string;
  status: "locked" | "unlocked" | "completed";
  progress: number;
}

const zones: Zone[] = [
  { id: "crystal", name: "Crystal Cave", emoji: "🔮", icon: "🤖", color: "#a855f7", status: "unlocked", progress: 65 },
  { id: "forest", name: "Ancient Forest", emoji: "🌲", icon: "✍️", color: "#22c55e", status: "unlocked", progress: 30 },
  { id: "mountain", name: "Mountain", emoji: "🏔️", icon: "🎨", color: "#ef4444", status: "locked", progress: 0 },
  { id: "river", name: "River Valley", emoji: "💧", icon: "🌍", color: "#3b82f6", status: "locked", progress: 0 },
];

const subtitles: Record<string, string> = {
  crystal: "How AI Thinks",
  forest: "Talking to AI",
  mountain: "AI & Creativity",
  river: "AI & Our World",
};

interface TopicPickerProps {
  visible: boolean;
  onSelect: (zone: Zone) => void;
  onClose: () => void;
}

export function TopicPicker({ visible, onSelect, onClose }: TopicPickerProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(10, 5, 25, 0.90)",
              backdropFilter: "blur(24px)",
            }}
            onClick={onClose}
          />

          <div className="relative z-10 flex flex-col items-center gap-8 px-6">
            <h2
              className="text-white text-[32px]"
              style={{ fontFamily: "'Fredoka One', cursive" }}
            >
              Where to next?
            </h2>

            <div className="grid grid-cols-2 gap-5">
              {zones.map((zone, i) => (
                <motion.button
                  key={zone.id}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1, type: "spring", bounce: 0.3 }}
                  onClick={() => zone.status !== "locked" && onSelect(zone)}
                  className="relative flex flex-col items-center justify-center gap-2 cursor-pointer"
                  style={{
                    width: 220,
                    height: 180,
                    borderRadius: 24,
                    background: `${zone.color}2E`,
                    border: `2px solid ${zone.color}73`,
                    opacity: zone.status === "locked" ? 0.5 : 1,
                    fontFamily: "'Nunito', sans-serif",
                  }}
                  whileHover={zone.status !== "locked" ? { scale: 1.05 } : {}}
                  whileTap={zone.status !== "locked" ? { scale: 0.95 } : {}}
                >
                  {/* Progress ring */}
                  {zone.status === "unlocked" && (
                    <svg width="60" height="60" className="absolute top-3 right-3" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15" fill="none" stroke={`${zone.color}33`} strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="15" fill="none" stroke={zone.color} strokeWidth="3"
                        strokeDasharray={`${zone.progress * 0.94} 94`}
                        strokeLinecap="round"
                        transform="rotate(-90 18 18)"
                      />
                    </svg>
                  )}

                  {zone.status === "completed" && (
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-[14px]">
                      ✓
                    </div>
                  )}

                  {zone.status === "locked" && (
                    <motion.span
                      className="text-[28px]"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🔒
                    </motion.span>
                  )}

                  <span className="text-[40px]">{zone.icon}</span>
                  <span className="text-white text-[14px]" style={{ fontWeight: 800 }}>
                    {zone.emoji} {zone.name}
                  </span>
                  <span className="text-white/60 text-[12px]" style={{ fontWeight: 700 }}>
                    {subtitles[zone.id]}
                  </span>

                  {/* Shimmer for unlocked */}
                  {zone.status === "unlocked" && (
                    <motion.div
                      className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none"
                      style={{
                        background: `linear-gradient(135deg, transparent 30%, ${zone.color}33 50%, transparent 70%)`,
                        backgroundSize: "200% 200%",
                      }}
                      animate={{
                        backgroundPosition: ["0% 0%", "200% 200%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
