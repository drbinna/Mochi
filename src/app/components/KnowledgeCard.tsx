import { motion, AnimatePresence } from "motion/react";

interface KnowledgeCardProps {
  visible: boolean;
  zone: {
    name: string;
    emoji: string;
    color: string;
  };
  title: string;
  fact: string;
  wowFact: string;
  conceptEmoji: string;
  onCollect: () => void;
}

export function KnowledgeCard({
  visible,
  zone,
  title,
  fact,
  wowFact,
  conceptEmoji,
  onCollect,
}: KnowledgeCardProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: "110%", rotateY: 15 }}
          animate={{ x: 0, rotateY: 0 }}
          exit={{ scale: 0.2, x: "80%", y: "-60%", opacity: 0 }}
          transition={{
            type: "spring",
            duration: 0.5,
            bounce: 0.35,
          }}
          className="w-[320px] flex flex-col overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #ffffff, #f0eaff)",
            borderRadius: 28,
            boxShadow: `0 24px 64px ${zone.color}73, 0 4px 16px rgba(0,0,0,0.15)`,
          }}
        >
          {/* Top accent stripe */}
          <div style={{ height: 6, background: zone.color }} />

          <div className="p-5 flex flex-col gap-3">
            {/* Zone badge */}
            <span
              className="self-start text-white text-[11px] px-3 py-1"
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 800,
                background: zone.color,
                borderRadius: 20,
              }}
            >
              {zone.emoji} {zone.name}
            </span>

            {/* Hero illustration */}
            <div
              className="flex items-center justify-center rounded-2xl"
              style={{
                height: 140,
                background: `radial-gradient(circle, ${zone.color}26 0%, transparent 70%)`,
              }}
            >
              <motion.span
                className="text-[72px]"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                {conceptEmoji}
              </motion.span>
            </div>

            {/* Title */}
            <h3
              className="text-[24px]"
              style={{
                fontFamily: "'Fredoka One', cursive",
                color: "#2D1B6B",
                lineHeight: 1.2,
              }}
            >
              {title}
            </h3>

            {/* Fact */}
            <p
              className="text-[14px]"
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                color: "#4a3a7a",
                lineHeight: 1.6,
              }}
            >
              {fact}
            </p>

            {/* Wow fact box */}
            <div
              className="p-3"
              style={{
                background: `${zone.color}1A`,
                border: `1.5px solid ${zone.color}66`,
                borderRadius: 14,
              }}
            >
              <p
                className="text-[12px]"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 800,
                  color: zone.color,
                }}
              >
                🤯 {wowFact}
              </p>
            </div>

            {/* Collect button */}
            <motion.button
              onClick={onCollect}
              className="w-full text-white text-[16px] py-3 cursor-pointer"
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 800,
                background: `linear-gradient(135deg, ${zone.color}, ${zone.color}BB)`,
                borderRadius: 14,
                border: "none",
                minHeight: 48,
              }}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
            >
              ✨ Collect Card!
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
