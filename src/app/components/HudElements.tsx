import { motion } from "motion/react";
import { Home, VolumeX, Volume2, Settings, Lock } from "lucide-react";

const hudChip = {
  background: "rgba(0,0,0,0.42)",
  backdropFilter: "blur(12px) saturate(180%)",
  border: "1.5px solid rgba(255,255,255,0.18)",
  borderRadius: 50,
  padding: "8px 16px",
  fontFamily: "'Nunito', sans-serif",
  fontWeight: 800 as const,
};

interface HudProps {
  childName: string;
  level: number;
  streak: number;
  muted: boolean;
  onMuteToggle: () => void;
  onHome: () => void;
  showSettings?: boolean;
  onSettings?: () => void;
  cardsCollected?: number;
  statBars?: { label: string; color: string; value: number }[];
}

export function HudElements({
  childName,
  level,
  streak,
  muted,
  onMuteToggle,
  onHome,
  showSettings,
  onSettings,
  cardsCollected = 0,
  statBars,
}: HudProps) {
  return (
    <>
      {/* Top-left: Avatar chip */}
      <div className="absolute top-5 left-5 z-20 flex flex-col gap-3">
        <div className="flex items-center gap-2" style={hudChip}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[14px]"
            style={{ background: "linear-gradient(135deg, #FF7EB3, #C4A8FF)" }}
          >
            🧒
          </div>
          <span className="text-white text-[14px]">{childName}</span>
          <span
            className="text-[11px] px-2 py-0.5 rounded-full text-white"
            style={{ background: "linear-gradient(135deg, #FFE566, #FF8B6A)" }}
          >
            Lv.{level}
          </span>
        </div>

        {/* Stat bars */}
        {statBars && (
          <div className="flex flex-col gap-2 ml-1">
            {statBars.map((bar) => (
              <div key={bar.label} className="flex items-center gap-2">
                <span className="text-[11px] text-white/60 w-4" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
                  {bar.label}
                </span>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{
                    width: 80,
                    background: "rgba(255,255,255,0.1)",
                  }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: bar.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${bar.value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top-right: Streak + settings + cards */}
      <div className="absolute top-5 right-5 z-20 flex flex-col items-end gap-3">
        <div className="flex items-center gap-2">
          {showSettings && (
            <button
              onClick={onSettings}
              className="flex items-center justify-center cursor-pointer"
              style={{ ...hudChip, padding: "8px" }}
            >
              <Settings size={18} color="white" />
            </button>
          )}
          <div className="flex items-center gap-1.5" style={hudChip}>
            <span className="text-[16px]">🔥</span>
            <span className="text-white text-[14px]">{streak} days</span>
          </div>
        </div>

        {cardsCollected > 0 && (
          <motion.div
            className="flex items-center gap-1.5"
            style={hudChip}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3 }}
            key={cardsCollected}
          >
            <span className="text-[14px]">🃏</span>
            <span className="text-white text-[13px]">{cardsCollected}</span>
          </motion.div>
        )}
      </div>

      {/* Bottom-left: Mute */}
      <div className="absolute bottom-5 left-5 z-20">
        <button
          onClick={onMuteToggle}
          className="cursor-pointer flex items-center justify-center"
          style={{ ...hudChip, padding: "10px" }}
        >
          {muted ? (
            <VolumeX size={20} color="white" />
          ) : (
            <Volume2 size={20} color="white" />
          )}
        </button>
      </div>

      {/* Bottom-right: Home */}
      <div className="absolute bottom-5 right-5 z-20">
        <button
          onClick={onHome}
          className="cursor-pointer flex items-center justify-center"
          style={{ ...hudChip, padding: "10px" }}
        >
          <Home size={20} color="white" />
        </button>
      </div>
    </>
  );
}

export function StartHud({ onSettings }: { onSettings?: () => void }) {
  return (
    <>
      <div className="absolute top-5 right-5 z-20">
        <button
          onClick={onSettings}
          className="cursor-pointer flex items-center justify-center"
          style={{ ...hudChip, padding: "10px" }}
        >
          <Settings size={18} color="white" />
        </button>
      </div>
      <div className="absolute top-5 left-5 z-20">
        <button
          className="cursor-pointer flex items-center justify-center opacity-50"
          style={{ ...hudChip, padding: "10px" }}
        >
          <Lock size={16} color="white" />
        </button>
      </div>
    </>
  );
}
