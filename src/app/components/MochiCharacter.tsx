import { motion } from "motion/react";

interface MochiCharacterProps {
  size?: number;
  state?: "idle" | "listening" | "speaking" | "happy" | "sleeping";
  volume?: number; // 0-100 real-time volume level
  onClick?: () => void;
}

export function MochiCharacter({ size = 260, state = "idle", volume = 0, onClick }: MochiCharacterProps) {
  const eyeState = () => {
    switch (state) {
      case "sleeping": return { scaleY: 0.1, y: 2 };
      case "listening": return { scaleY: 1.2, y: -2 };
      case "happy": return { scaleY: 0.3, y: 2 };
      default: return { scaleY: 1, y: 0 };
    }
  };

  const mouthState = () => {
    switch (state) {
      case "speaking": 
        // Base pulse + dynamic volume scaling
        // If volume is > 0, we use it to scale the mouth. 
        // 0-100 normalized volume
        const vScale = 0.9 + (volume / 100) * 2.0;
        return { 
          scaleY: vScale, 
          scaleX: 0.8 + (volume / 100) * 0.5,
        };
      case "happy": return { scaleY: 1.5, scaleX: 1.2 };
      case "listening": return { scaleY: 0.5, scaleX: 0.6 };
      default: return { scaleY: 1, scaleX: 1 };
    }
  };

  return (
    <div className="relative cursor-pointer" onClick={onClick} style={{ width: size, height: size }}>
      {/* Glow halo */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,126,179,0.35) 0%, transparent 65%)",
          filter: "blur(20px)",
        }}
        animate={{
          scale: [1, 1.12, 1],
          opacity: state === "happy" ? [0.5, 0.9, 0.5] : [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Mochi body */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 200 200" width={size * 0.85} height={size * 0.85}>
          {/* Body - soft mochi blob */}
          <defs>
            <radialGradient id="mochiBody" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#FFD4E8" />
              <stop offset="60%" stopColor="#FFB0D0" />
              <stop offset="100%" stopColor="#FF8ABF" />
            </radialGradient>
            <radialGradient id="cheekL" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,126,179,0.5)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <filter id="softShadow">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#FF7EB3" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Main body shape */}
          <ellipse cx="100" cy="108" rx="72" ry="65" fill="url(#mochiBody)" filter="url(#softShadow)" />

          {/* Highlight */}
          <ellipse cx="80" cy="80" rx="30" ry="20" fill="rgba(255,255,255,0.35)" transform="rotate(-15 80 80)" />

          {/* Ears */}
          <ellipse cx="52" cy="58" rx="18" ry="24" fill="#FFB0D0" transform="rotate(-20 52 58)" />
          <ellipse cx="52" cy="58" rx="12" ry="16" fill="#FF8ABF" transform="rotate(-20 52 58)" />
          <ellipse cx="148" cy="58" rx="18" ry="24" fill="#FFB0D0" transform="rotate(20 148 58)" />
          <ellipse cx="148" cy="58" rx="12" ry="16" fill="#FF8ABF" transform="rotate(20 148 58)" />

          {/* Eyes */}
          <motion.g animate={eyeState()} transition={{ duration: 0.3 }}>
            <ellipse cx="75" cy="100" rx="8" ry="10" fill="#2D1B6B" />
            <ellipse cx="125" cy="100" rx="8" ry="10" fill="#2D1B6B" />
            {/* Eye shine */}
            <circle cx="79" cy="96" r="3.5" fill="white" />
            <circle cx="129" cy="96" r="3.5" fill="white" />
            <circle cx="73" cy="103" r="2" fill="rgba(255,255,255,0.5)" />
            <circle cx="123" cy="103" r="2" fill="rgba(255,255,255,0.5)" />
          </motion.g>

          {/* Cheeks */}
          <ellipse cx="55" cy="115" rx="14" ry="10" fill="rgba(255,126,179,0.45)" />
          <ellipse cx="145" cy="115" rx="14" ry="10" fill="rgba(255,126,179,0.45)" />

          {/* Mouth */}
          <motion.g animate={mouthState()} transition={{ duration: 0.1 }}>
            {state === "happy" ? (
              <path d="M 88 120 Q 100 138 112 120" stroke="#2D1B6B" strokeWidth="3" fill="none" strokeLinecap="round" />
            ) : state === "speaking" ? (
              <ellipse 
                cx="100" cy="122" rx="10" ry="12" 
                fill="#2D1B6B"
              />
            ) : (
              <path d="M 90 120 Q 100 130 110 120" stroke="#2D1B6B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            )}
          </motion.g>

          {/* Little arms/paws */}
          <ellipse cx="42" cy="130" rx="12" ry="8" fill="#FFB0D0" transform="rotate(-10 42 130)" />
          <ellipse cx="158" cy="130" rx="12" ry="8" fill="#FFB0D0" transform="rotate(10 158 130)" />
        </svg>
      </motion.div>
    </div>
  );
}
