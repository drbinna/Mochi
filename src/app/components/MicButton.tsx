import { motion } from "motion/react";
import { Mic } from "lucide-react";

interface MicButtonProps {
  state: "default" | "listening" | "speaking";
  onClick: () => void;
}

const stateStyles = {
  default: {
    bg: "linear-gradient(135deg, #FF7EB3, #C4A8FF)",
    glow: "0 0 0 8px rgba(255,126,179,0.25), 0 0 0 16px rgba(255,126,179,0.1)",
  },
  listening: {
    bg: "linear-gradient(135deg, #7FFFCF, #00BBF9)",
    glow: "0 0 0 8px rgba(127,255,207,0.3), 0 0 0 16px rgba(127,255,207,0.15)",
  },
  speaking: {
    bg: "linear-gradient(135deg, #FFE566, #FF8B6A)",
    glow: "0 0 0 8px rgba(255,229,102,0.3), 0 0 0 16px rgba(255,229,102,0.15)",
  },
};

export function MicButton({ state, onClick }: MicButtonProps) {
  const style = stateStyles[state];
  const size = state === "listening" ? 96 : 80;

  return (
    <div className="relative flex flex-col items-center gap-3">
      {/* Pulse rings */}
      <div className="absolute" style={{ width: size * 2.5, height: size * 2.5, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full"
            style={{
              border: `2px solid ${state === "listening" ? "rgba(127,255,207,0.3)" : state === "speaking" ? "rgba(255,229,102,0.3)" : "rgba(255,126,179,0.3)"}`,
            }}
            animate={{
              scale: [1, 2],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: state === "listening" ? 1.2 : 1.8,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Main button */}
      <motion.button
        onClick={onClick}
        className="relative z-10 rounded-full flex items-center justify-center"
        style={{
          width: size,
          height: size,
          background: style.bg,
          boxShadow: style.glow,
          minHeight: 56,
        }}
        animate={{ scale: state === "listening" ? [1, 1.05, 1] : 1 }}
        transition={{ duration: 1, repeat: state === "listening" ? Infinity : 0, ease: "easeInOut" }}
        whileTap={{ scale: 0.92 }}
      >
        <Mic size={32} color="white" />
      </motion.button>

      {/* Audio visualizer for listening state */}
      {state === "listening" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end gap-1 px-4 py-2"
          style={{
            background: "rgba(0,0,0,0.42)",
            backdropFilter: "blur(12px)",
            border: "1.5px solid rgba(255,255,255,0.18)",
            borderRadius: 50,
          }}
        >
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{
                width: 6,
                backgroundColor: "#7FFFCF",
                borderRadius: 3,
              }}
              animate={{
                height: [8, 16 + Math.random() * 20, 8],
              }}
              transition={{
                duration: 0.4 + Math.random() * 0.3,
                repeat: Infinity,
                delay: i * 0.08,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Speaking waveform */}
      {state === "speaking" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-[3px]"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                width: 4,
                backgroundColor: "#FFE566",
                borderRadius: 2,
              }}
              animate={{
                height: [4, 12 + Math.random() * 10, 4],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Listening label */}
      {state === "listening" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white text-[14px]"
          style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontStyle: "italic" }}
        >
          I'm listening... 👂
        </motion.p>
      )}
    </div>
  );
}
