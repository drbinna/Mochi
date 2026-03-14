import { useEffect, useRef, useState, useCallback } from "react";

// Set to Pixie as specified in your setup
const INWORLD_VOICE = "Pixie"; 

export type InworldStatus = "idle" | "connecting" | "active" | "speaking" | "listening" | "error";

interface InworldHook {
  status: InworldStatus;
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

export function useInworld(): InworldHook {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [status, setStatus] = useState<InworldStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const [assistantMessage, setAssistantMessage] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [micBlocked, setMicBlocked] = useState(false);

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.remove();
      audioRef.current = null;
    }
    dcRef.current = null;
    setStatus("idle");
    setTranscript("");
  }, []);

  const start = useCallback(async () => {
    try {
      setStatus("connecting");
      setError(null);

      // 1. Fetch config from our Vite proxy
      const cfgResponse = await fetch('/api/inworld/config');
      if (!cfgResponse.ok) throw new Error("Could not fetch Inworld configuration");
      const cfg = await cfgResponse.json();

      // 2. Get microphone access
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true }
        });
        streamRef.current = stream;
      } catch (e) {
        setMicBlocked(true);
        throw new Error("Microphone access denied");
      }

      // 3. Create WebRTC Connection
      const pc = new RTCPeerConnection({ iceServers: cfg.ice_servers });
      pcRef.current = pc;

      // Create data channel for events
      const dc = pc.createDataChannel('oai-events', { ordered: true });
      dcRef.current = dc;

      // Add mic track to peer connection
      stream.getAudioTracks().forEach(t => pc.addTrack(t, stream));

      // Handle incoming audio track from AI
      pc.ontrack = (e) => {
        if (!audioRef.current) {
          const audio = document.createElement('audio');
          audio.autoplay = true;
          audio.srcObject = new MediaStream([e.track]);
          document.body.appendChild(audio);
          audioRef.current = audio;
        }
      };

      // 4. Data Channel Event Handlers
      dc.onopen = () => {
        setStatus("active");
        
        // Send initial session update
        dc.send(JSON.stringify({
          type: 'session.update',
          session: {
            type: 'realtime',
            model: 'google-ai-studio/gemini-2.0-flash',
            instructions: `
              You are Mochi, a warm, playful, and friendly AI companion for children ages 4-8. 
              You teach kids about AI and technology through simple, fun conversations. 
              Keep sentences very short (under 15 words). 
              Use lots of enthusiasm, emojis, and encouragement. 
              Never use complex vocabulary. Be patient and kind.
            `,
            output_modalities: ['audio', 'text'],
            audio: {
              input: {
                turn_detection: {
                  type: 'semantic_vad',
                  eagerness: 'high',
                  create_response: true,
                  interrupt_response: true
                }
              },
              output: {
                model: 'inworld-tts-1.5-mini',
                voice: INWORLD_VOICE,
                speed: 1.1
              }
            }
          }
        }));

        // Send a greeting to start the conversation automatically
        dc.send(JSON.stringify({
          type: 'conversation.item.create',
          item: {
            type: 'message',
            role: 'user',
            content: [{ type: 'input_text', text: 'Hi Mochi! Introduce yourself in one short sentence.' }]
          }
        }));
        dc.send(JSON.stringify({ type: 'response.create' }));
      };

      dc.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          
          if (msg.type === 'response.output_text.delta') {
            setAssistantMessage(prev => prev + (msg.delta || ""));
            setStatus("speaking");
          }

          if (msg.type === 'response.output_text.done') {
            setStatus("listening");
          }

          if (msg.type === 'input_transcript.done') {
            setTranscript(msg.transcript);
            setStatus("listening");
          }

          if (msg.type === 'input_transcript.delta') {
            setTranscript(prev => prev + (msg.delta || ""));
            setStatus("listening");
          }

          if (msg.type === 'error') {
            console.error("Inworld DataChannel Error:", msg.error);
            setError(msg.error?.message || "Inworld event error");
            setStatus("error");
          }
        } catch (err) {
          console.error("Failed to parse Inworld event", err);
        }
      };

      dc.onclose = () => {
        if (status !== "idle") setStatus("idle");
      };

      // 5. Establish connection (SDP Exchange)
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Wait for ICE gathering to complete (or timeout)
      await new Promise(r => {
        if (pc.iceGatheringState === 'complete') {
          r(null);
          return;
        }
        const done = () => {
          pc.onicecandidate = null;
          pc.onicegatheringstatechange = null;
          r(null);
        };
        pc.onicecandidate = (e) => { if (!e.candidate) done(); };
        pc.onicegatheringstatechange = () => { if (pc.iceGatheringState === 'complete') done(); };
        setTimeout(done, 5000); // Max 5s wait
      });

      const res = await fetch(cfg.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sdp',
          Authorization: `Bearer ${cfg.api_key}`
        },
        body: pc.localDescription?.sdp,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Inworld connection failed: ${errText}`);
      }

      await pc.setRemoteDescription({
        type: 'answer',
        sdp: await res.text()
      });

    } catch (err: any) {
      console.error("Inworld Start Error:", err);
      setError(err?.message || "Could not start Inworld session");
      setStatus("error");
      stop();
    }
  }, [status, stop]);

  const toggleMute = useCallback(() => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, [isMuted]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

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
