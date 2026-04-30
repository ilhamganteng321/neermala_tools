import { useState, useEffect, useRef, useCallback } from "react";
import useSound from "use-sound";
import hidupJokowi from "../assets/mp3/hidup-jokowi.mp3";

// Di dalam komponen SlotMachineRandomPicker, sebelum state declarations
// Audio URLs (free to use sound effects)
// ─── Types ───────────────────────────────────────────────────────────────────
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  shape: "rect" | "circle" | "star";
  rotation: number;
  rotationSpeed: number;
}

// ─── Confetti Canvas ──────────────────────────────────────────────────────────
const ConfettiCanvas = ({ active }: { active: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const idRef = useRef(0);

  const COLORS = [
    "#FFD700",
    "#FF4444",
    "#FF69B4",
    "#00FFFF",
    "#FF8C00",
    "#7FFF00",
    "#FF1493",
    "#FFF44F",
  ];

  const spawnParticles = useCallback(() => {
    const count = 180;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI + Math.PI; // upward arc
      const speed = 6 + Math.random() * 10;
      particlesRef.current.push({
        id: idRef.current++,
        x: w / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 10,
        life: 1,
        shape: (["rect", "circle", "star"] as const)[
          Math.floor(Math.random() * 3)
        ],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
      });
    }
  }, []);

  const drawStar = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number,
  ) => {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const fn = i === 0 ? ctx.moveTo.bind(ctx) : ctx.lineTo.bind(ctx);
      fn(x + r * Math.cos(angle), y + r * Math.sin(angle));
    }
    ctx.closePath();
    ctx.fill();
  };

  useEffect(() => {
    if (!active) return;
    spawnParticles();

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0.01);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.vx *= 0.99;
        p.life -= 0.012;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          drawStar(ctx, 0, 0, p.size / 2);
        }
        ctx.restore();
      }

      if (particlesRef.current.length > 0) {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [active, spawnParticles]);

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 w-full h-full"
    />
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const STORAGE_KEY = "slotParticipants";

export default function SlotMachineRandomPicker() {
  const [participants, setParticipants] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [inputValue, setInputValue] = useState("");
  const [displayName, setDisplayName] = useState("???");
  const [winner, setWinner] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [winnerScale, setWinnerScale] = useState(false);

  const [play] = useSound(hidupJokowi);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tambahkan refs
  const audioContextRef = useRef<AudioContext | null>(null);

  // Fungsi untuk membuat suara beep
  const playBeep = (
    frequency: number,
    duration: number,
    volume: number = 0.3,
  ) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume;

    oscillator.type = "sine";

    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(
      0.00001,
      ctx.currentTime + duration,
    );
    oscillator.stop(ctx.currentTime + duration);
  };

  // Spin start sound (descending tone)
  const playSpinStartSound = () => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;

    [800, 600, 400].forEach((freq, i) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.value = 0.2;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.2);
        osc.stop(ctx.currentTime + 0.2);
      }, i * 80);
    });
  };

  // Tick sound
  const playTickSound = () => {
    playBeep(1200, 0.05, 0.15);
  };
  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
  }, [participants]);

  const addParticipant = () => {
    const name = inputValue.trim();
    if (!name) return;
    setParticipants((prev) => [...prev, name]);
    setInputValue("");
    setWinner(null);
    setShowConfetti(false);
  };

  const removeParticipant = (index: number) => {
    setParticipants((prev) => prev.filter((_, i) => i !== index));
    setWinner(null);
    setShowConfetti(false);
  };

  const resetAll = () => {
    if (!window.confirm("Hapus semua peserta? Aksi ini tidak bisa dibatalkan."))
      return;
    setParticipants([]);
    setWinner(null);
    setDisplayName("???");
    setShowConfetti(false);
  };

  const spin = () => {
    if (participants.length === 0 || isSpinning) return;

    // Play spin start sound
    // playSpinStart();
    playSpinStartSound();

    setIsSpinning(true);
    setWinner(null);
    setShowConfetti(false);
    setWinnerScale(false);
    setIsShaking(true);

    const pickedIndex = Math.floor(Math.random() * participants.length);
    const picked = participants[pickedIndex];
    let elapsed = 0;
    const DURATION = 2200;
    let speed = 60;
    let lastTickSound = 0;

    const tick = () => {
      const idx = Math.floor(Math.random() * participants.length);
      setDisplayName(participants[idx]);
      elapsed += speed;

      // Mainkan suara tick setiap 3-4 kali pergantian (tidak setiap kali biar tidak terlalu bising)
      if (elapsed - lastTickSound > 150) {
        // playSpinTick();
        playTickSound();
        lastTickSound = elapsed;
      }

      // Slow down near end
      if (elapsed > DURATION * 0.6) speed = 100;
      if (elapsed > DURATION * 0.8) speed = 160;

      if (elapsed >= DURATION) {
        clearInterval(intervalRef.current!);
        setDisplayName(picked);
        setWinner(picked);
        setIsSpinning(false);
        setIsShaking(false);

        // Play win sound
        play();
        setTimeout(() => {
          setShowConfetti(true);
          setWinnerScale(true);
        }, 100);
        setTimeout(() => setShowConfetti(false), 4000);
        removeParticipant(pickedIndex);
        return;
      }

      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(tick, speed);
    };

    intervalRef.current = setInterval(tick, speed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addParticipant();
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-start py-8 px-4"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, #1a0000 0%, #0d0000 40%, #050010 100%)",
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,180,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,0,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Decorative corner reels */}
      {[
        "top-4 left-4",
        "top-4 right-4",
        "bottom-4 left-4",
        "bottom-4 right-4",
      ].map((pos, i) => (
        <div
          key={i}
          className={`absolute ${pos} w-16 h-16 rounded-full opacity-20 pointer-events-none`}
          style={{
            border: "3px solid #FFD700",
            boxShadow: "0 0 20px #FFD700",
          }}
        />
      ))}

      {/* Title */}
      <div className="relative z-10 mb-6 text-center">
        <div
          className="text-xs tracking-[0.5em] text-yellow-400 mb-1"
          style={{ textShadow: "0 0 10px #FFD700" }}
        >
          ★ ★ ★
        </div>
        <h1
          className="text-4xl md:text-5xl font-black tracking-widest"
          style={{
            background:
              "linear-gradient(180deg, #FFD700 0%, #FF8C00 50%, #FFD700 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "none",
            filter: "drop-shadow(0 0 20px rgba(255,180,0,0.8))",
          }}
        >
          SLOT PICKER
        </h1>
        <div
          className="text-xs tracking-[0.5em] text-yellow-400 mt-1"
          style={{ textShadow: "0 0 10px #FFD700" }}
        >
          ★ ★ ★
        </div>
      </div>

      {/* Slot Machine Window */}
      <div className="relative z-10 mb-8 w-full max-w-sm">
        <ConfettiCanvas active={showConfetti} />

        {/* Outer casing */}
        <div
          className="rounded-2xl p-1"
          style={{
            background:
              "linear-gradient(180deg, #8B6914 0%, #FFD700 40%, #8B6914 100%)",
            boxShadow:
              "0 0 40px rgba(255,180,0,0.5), 0 0 80px rgba(255,180,0,0.2)",
          }}
        >
          {/* Inner slot window */}
          <div
            className={`relative rounded-xl overflow-hidden flex items-center justify-center
              ${isShaking ? "animate-[shake_0.1s_infinite]" : ""}`}
            style={{
              background: "#000",
              minHeight: 140,
              boxShadow:
                "inset 0 0 40px rgba(0,0,0,0.8), inset 0 0 2px #FFD700",
            }}
          >
            {/* Scanline overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
              }}
            />

            {/* Neon glow sides */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1"
              style={{
                background:
                  "linear-gradient(180deg, #FF4400, #FFD700, #FF4400)",
                boxShadow: "0 0 10px #FFD700",
              }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-1"
              style={{
                background:
                  "linear-gradient(180deg, #FF4400, #FFD700, #FF4400)",
                boxShadow: "0 0 10px #FFD700",
              }}
            />

            <div className="relative z-10 px-8 py-6 text-center w-full">
              <div
                className={`text-2xl md:text-3xl font-black tracking-wider transition-all duration-300
                  ${winnerScale ? "scale-110" : "scale-100"}`}
                style={{
                  color: winner ? "#FFD700" : "#fff",
                  textShadow: winner
                    ? "0 0 20px #FFD700, 0 0 40px #FF8C00"
                    : "0 0 10px rgba(255,255,255,0.5)",
                  wordBreak: "break-all",
                  transition:
                    "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), color 0.3s",
                }}
              >
                {displayName}
              </div>
              {winner && (
                <div
                  className="text-xs mt-2 tracking-widest"
                  style={{ color: "#FF8C00", textShadow: "0 0 8px #FF8C00" }}
                >
                  🏆 PEMENANG!
                </div>
              )}
              {!isSpinning && !winner && participants.length > 0 && (
                <div className="text-xs mt-2 tracking-wider text-gray-500">
                  SIAP BERPUTAR
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lever decoration */}
        <div className="flex justify-center mt-3">
          <div
            className="w-1 h-6 rounded-full"
            style={{ background: "linear-gradient(180deg, #FFD700, #8B6914)" }}
          />
        </div>
      </div>

      {/* SPIN Button */}
      <div className="relative z-10 mb-8">
        <button
          onClick={spin}
          disabled={participants.length === 0 || isSpinning}
          className="relative overflow-hidden font-black tracking-widest text-xl px-12 py-4 rounded-full
            transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
            active:scale-95"
          style={{
            background:
              participants.length === 0 || isSpinning
                ? "#555"
                : "linear-gradient(180deg, #FF2222 0%, #CC0000 50%, #FF2222 100%)",
            color: "#fff",
            boxShadow:
              participants.length > 0 && !isSpinning
                ? "0 0 30px rgba(255,0,0,0.6), 0 4px 15px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)"
                : "none",
            border: "2px solid rgba(255,180,0,0.3)",
            textShadow: "0 1px 3px rgba(0,0,0,0.5)",
            minWidth: 200,
          }}
        >
          {/* Shine sweep */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)",
            }}
          />
          {isSpinning ? "BERPUTAR..." : "🎰 SPIN!"}
        </button>

        {participants.length === 0 && (
          <p className="text-center text-xs mt-3 text-yellow-600 tracking-wider">
            Tambahkan peserta terlebih dahulu
          </p>
        )}
      </div>

      {/* Input & Participant List */}
      <div className="relative z-10 w-full max-w-sm space-y-4">
        {/* Input row */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nama peserta..."
            maxLength={30}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-bold tracking-wide outline-none
              placeholder:text-gray-600 focus:ring-2"
            style={{
              background: "#0d0d0d",
              border: "1px solid rgba(255,180,0,0.3)",
              color: "#FFD700",
              fontFamily: "inherit",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#FFD700")}
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "rgba(255,180,0,0.3)")
            }
          />
          <button
            onClick={addParticipant}
            disabled={!inputValue.trim()}
            className="px-4 py-2 rounded-lg font-black text-sm tracking-wider
              disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
            style={{
              background: "linear-gradient(180deg, #FFD700, #FF8C00)",
              color: "#000",
              boxShadow: "0 0 15px rgba(255,180,0,0.4)",
            }}
          >
            ADD
          </button>
        </div>

        {/* Stats bar */}
        {participants.length > 0 && (
          <div className="flex items-center justify-between px-1">
            <span
              className="text-xs tracking-widest"
              style={{ color: "#FF8C00" }}
            >
              {participants.length} PESERTA
            </span>
            <button
              onClick={resetAll}
              className="text-xs tracking-wider transition-all hover:text-red-400"
              style={{ color: "#555" }}
            >
              RESET ALL ✕
            </button>
          </div>
        )}

        {/* Participant list */}
        {participants.length > 0 && (
          <div
            className="rounded-xl overflow-hidden"
            style={{
              border: "1px solid rgba(255,180,0,0.15)",
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              className="max-h-56 overflow-y-auto"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#FFD700 #000" }}
            >
              {participants.map((name, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-2.5 group
                    transition-all duration-150 hover:bg-yellow-900/10"
                  style={{
                    borderBottom:
                      i < participants.length - 1
                        ? "1px solid rgba(255,180,0,0.08)"
                        : "none",
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="text-xs font-bold w-6 text-right shrink-0"
                      style={{ color: "#FF4400" }}
                    >
                      {i + 1}
                    </span>
                    <span
                      className="text-sm font-bold tracking-wide truncate"
                      style={{ color: winner === name ? "#FFD700" : "#ccc" }}
                    >
                      {winner === name && "🏆 "}
                      {name}
                    </span>
                  </div>
                  <button
                    onClick={() => removeParticipant(i)}
                    className="shrink-0 ml-2 text-gray-700 hover:text-red-500
                      opacity-0 group-hover:opacity-100 transition-all text-lg leading-none"
                    style={{ lineHeight: 1 }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="relative z-10 mt-10 text-center text-xs tracking-widest"
        style={{ color: "#333" }}
      >
        ♠ ♥ SLOT PICKER ♦ ♣
      </div>

      {/* Shake keyframe injected via style tag */}
      <style>{`
        @keyframes shake {
          0%   { transform: translateX(0); }
          25%  { transform: translateX(-3px) rotate(-0.5deg); }
          75%  { transform: translateX(3px) rotate(0.5deg); }
          100% { transform: translateX(0); }
        }
        .animate-\\[shake_0\\.1s_infinite\\] {
          animation: shake 0.1s infinite;
        }
      `}</style>
    </div>
  );
}
