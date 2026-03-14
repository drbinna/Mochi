import { useEffect, useRef, useState, useCallback } from "react";
import Vapi from "@vapi-ai/web";

// ============================================================
// 🔧 CONFIGURATION — Set these in your .env file
// VITE_VAPI_PUBLIC_KEY=your-key-here
// VITE_VAPI_ASSISTANT_ID=your-assistant-id-here
// ============================================================
const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY || "YOUR_VAPI_PUBLIC_KEY_HERE";
const VAPI_ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID || "YOUR_ASSISTANT_ID_HERE";

// Optional: Instead of an assistant ID, you can pass an inline assistant config:
// const ASSISTANT_CONFIG = {
//   model: { provider: "openai", model: "gpt-4o-mini" },
//   voice: { provider: "11labs", voiceId: "your-voice-id" },
//   firstMessage: "Hey there! I'm Mochi! Ready to learn something awesome?",
//   instructions: "You are Mochi, a friendly AI learning companion for kids ages 4-8...",
// };

export type VapiStatus = "idle" | "connecting" | "active" | "speaking" | "listening" | "error";

interface VapiHook {
  status: VapiStatus;
  transcript: string;
  assistantMessage: string;
  isMuted: boolean;
  volumeLevel: number;
  start: () => Promise<void>;
  stop: () => void;
  toggleMute: () => void;
  error: string | null;
  micBlocked: boolean;
}

// Check if microphone access is available (not blocked by iframe permissions policy)
async function checkMicPermission(): Promise<boolean> {
  try {
    // If running inside an iframe, check if the permissions policy allows microphone
    if (window.self !== window.top) {
      // We're in an iframe — check if the allow attribute grants microphone
      try {
        const permResult = await navigator.permissions.query({ name: "microphone" as PermissionName });
        if (permResult.state === "denied") return false;
      } catch {
        // Permissions API not supported or blocked — try getUserMedia directly
      }
    }
    // Try to actually get a mic stream to verify access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
    return true;
  } catch {
    return false;
  }
}

export function useVapi(): VapiHook {
  const vapiRef = useRef<Vapi | null>(null);
  const [status, setStatus] = useState<VapiStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const [assistantMessage, setAssistantMessage] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [micBlocked, setMicBlocked] = useState(false);

  useEffect(() => {
    // Initialize VAPI client
    if (VAPI_PUBLIC_KEY === "YOUR_VAPI_PUBLIC_KEY_HERE") {
      console.warn(
        "⚠️ VAPI not configured. Replace YOUR_VAPI_PUBLIC_KEY_HERE in useVapi.tsx with your real key from https://dashboard.vapi.ai"
      );
      return;
    }

    // Check mic access before even creating the VAPI instance
    checkMicPermission().then((allowed) => {
      if (!allowed) {
        // Silently fall back to demo mode — mic blocked (likely iframe permissions policy)
        setMicBlocked(true);
        return;
      }

      const vapi = new Vapi(VAPI_PUBLIC_KEY);
      vapiRef.current = vapi;

      // ---- Event listeners ----

      // Call started successfully
      vapi.on("call-start", () => {
        setStatus("active");
        setError(null);
      });

      // Call ended
      vapi.on("call-end", () => {
        setStatus("idle");
        setTranscript("");
      });

      // Assistant starts speaking
      vapi.on("speech-start", () => {
        setStatus("speaking");
      });

      // Assistant stops speaking
      vapi.on("speech-end", () => {
        setStatus("listening");
      });

      // Real-time transcription of what the user is saying
      vapi.on("message", (msg: any) => {
        // User transcript (partial or final)
        if (msg.type === "transcript" && msg.role === "user") {
          setTranscript(msg.transcript);
          setStatus("listening");
        }

        // Assistant's response text
        if (msg.type === "transcript" && msg.role === "assistant") {
          setAssistantMessage(msg.transcript);
          setStatus("speaking");
        }

        // Conversation update (contains full messages)
        if (msg.type === "conversation-update") {
          const lastAssistant = [...(msg.conversation || [])]
            .reverse()
            .find((m: any) => m.role === "assistant");
          if (lastAssistant) {
            setAssistantMessage(lastAssistant.content);
          }
        }
      });

      // Volume level for visualizer
      vapi.on("volume-level", (level: number) => {
        setVolumeLevel(level);
      });

      // Error handling
      vapi.on("error", (err: any) => {
        const msg = err?.message || String(err) || "Voice connection error";
        // Detect permission errors and flag mic as blocked
        if (
          msg.toLowerCase().includes("permission") ||
          msg.toLowerCase().includes("not allowed") ||
          msg.toLowerCase().includes("notallowederror")
        ) {
          setMicBlocked(true);
        } else {
          setError(msg);
        }
        setStatus("error");
      });

      return () => {
        vapi.stop();
      };
    });
  }, []);

  const start = useCallback(async () => {
    // If mic is blocked, immediately signal error so caller can use demo mode
    if (micBlocked) {
      setError("microphone-blocked");
      setStatus("error");
      return;
    }

    const vapi = vapiRef.current;
    if (!vapi) {
      setError("VAPI not initialized. Check your public key.");
      setStatus("error");
      return;
    }

    try {
      setStatus("connecting");
      setError(null);

      if (VAPI_ASSISTANT_ID !== "YOUR_ASSISTANT_ID_HERE") {
        // Start with your pre-configured assistant
        await vapi.start(VAPI_ASSISTANT_ID);
      } else {
        // Start with inline config (fallback example)
        await vapi.start({
          model: {
            provider: "openai",
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are Mochi, a warm and playful AI companion for children ages 4-8. " +
                  "You teach kids about AI and technology through simple, fun conversations. " +
                  "Keep sentences short (under 15 words). Use lots of enthusiasm and encouragement. " +
                  "Never use complex vocabulary. Always be patient and kind.",
              },
            ],
          },
          voice: {
            provider: "11labs",
            voiceId: "21m00Tcm4TlvDq8ikWAM", // "Rachel" - friendly female voice
          },
          firstMessage: "Hey there! I'm Mochi! What do you want to learn about today?",
          name: "Mochi",
        } as any);
      }
    } catch (err: any) {
      setError(err?.message || "Could not start voice session");
      setStatus("error");
    }
  }, []);

  const stop = useCallback(() => {
    vapiRef.current?.stop();
    setStatus("idle");
  }, []);

  const toggleMute = useCallback(() => {
    const vapi = vapiRef.current;
    if (vapi) {
      const newMuted = !isMuted;
      vapi.setMuted(newMuted);
      setIsMuted(newMuted);
    }
  }, [isMuted]);

  return {
    status,
    transcript,
    assistantMessage,
    isMuted,
    volumeLevel,
    start,
    stop,
    toggleMute,
    error,
    micBlocked,
  };
}