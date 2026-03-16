import { motion, AnimatePresence } from "motion/react";

interface SideGlowProps {
  state: "default" | "listening" | "speaking";
}

const colors = {
  default: "rgba(255, 126, 179, 0.4)", // Soft Mochi Pink
  listening: "rgba(127, 255, 207, 0.6)", // Teal/Green Pulse
  speaking: "rgba(255, 229, 102, 0.6)", // Warm Yellow/Orange
};

export function SideGlow({ state }: SideGlowProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Left Glow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`left-${state}`}
          className="absolute left-0 top-0 bottom-0 w-[15vw]"
          initial={{ opacity: 0, x: -50 }}
          animate={{ 
            opacity: 1, 
            x: 0,
            boxShadow: `inset 40px 0 120px -20px ${colors[state]}`,
          }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            background: `linear-gradient(to right, ${colors[state]}, transparent)`,
          }}
        />
      </AnimatePresence>

      {/* Right Glow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`right-${state}`}
          className="absolute right-0 top-0 bottom-0 w-[15vw]"
          initial={{ opacity: 0, x: 50 }}
          animate={{ 
            opacity: 1, 
            x: 0,
            boxShadow: `inset -40px 0 120px -20px ${colors[state]}`,
          }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            background: `linear-gradient(to left, ${colors[state]}, transparent)`,
          }}
        />
      </AnimatePresence>

      {/* Subtle pulse animation for listening state */}
      {state === "listening" && (
        <motion.div
          className="absolute inset-0 border-[4px] border-transparent"
          animate={{
            boxShadow: [
              "inset 0 0 0px rgba(127, 255, 207, 0)",
              "inset 0 0 100px rgba(127, 255, 207, 0.2)",
              "inset 0 0 0px rgba(127, 255, 207, 0)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
}
