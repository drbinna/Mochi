import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface Sparkle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  drift: number;
  color: string;
}

export function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const stars: Star[] = [];
    const sparkles: Sparkle[] = [];
    const sparkleColors = ["#FFE566", "#FF7EB3", "#C4A8FF", "#7FFFCF"];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener("resize", resize);

    // Initialize stars
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight * 0.6,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.02 + 0.005,
        twinkleSpeed: Math.random() * 2 + 1,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }

    // Initialize sparkles
    for (let i = 0; i < 40; i++) {
      sparkles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5,
        speed: Math.random() * 0.3 + 0.1,
        drift: Math.random() * 0.5 - 0.25,
        color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
      });
    }

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    const animate = (time: number) => {
      ctx.clearRect(0, 0, w(), h());

      // Draw stars
      for (const star of stars) {
        const twinkle = Math.sin(time * 0.001 * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
        ctx.fill();

        // Star glow
        if (star.size > 1.5) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          const grad = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
          grad.addColorStop(0, `rgba(255, 255, 255, ${0.15 * twinkle})`);
          grad.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }

      // Draw sparkles
      for (const sp of sparkles) {
        sp.y -= sp.speed;
        sp.x += sp.drift + Math.sin(time * 0.001 + sp.x) * 0.2;
        sp.opacity = Math.sin(time * 0.002 + sp.x) * 0.3 + 0.3;

        if (sp.y < -10) {
          sp.y = h() + 10;
          sp.x = Math.random() * w();
        }

        ctx.globalAlpha = sp.opacity;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fillStyle = sp.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}