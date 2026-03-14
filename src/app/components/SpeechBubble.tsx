import { motion, AnimatePresence } from "motion/react";

interface SpeechBubbleProps {
  text: string;
  visible: boolean;
}

export function SpeechBubble({ text, visible }: SpeechBubbleProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.05, 1], opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative max-w-[420px] px-6 py-4"
          style={{
            background: "rgba(10, 8, 32, 0.72)",
            backdropFilter: "blur(16px) saturate(200%)",
            border: "1.5px solid rgba(255, 255, 255, 0.22)",
            borderRadius: "20px",
            fontFamily: "'Nunito', sans-serif",
            fontStyle: "italic",
          }}
        >
          <p className="text-white text-[16px]" style={{ fontWeight: 700, lineHeight: 1.5 }}>
            {text}
          </p>
          {/* Tail */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-0 h-0"
            style={{
              borderLeft: "12px solid transparent",
              borderRight: "12px solid transparent",
              borderTop: "14px solid rgba(10, 8, 32, 0.72)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
