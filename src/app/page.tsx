"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import Link from "next/link";

const targetDate = new Date("2026-06-12T15:30:00-04:00");

const Home = () => {
  return (
    <main className="grid min-h-screen grid-cols-1 content-center justify-items-center gap-6 px-6 py-16 text-center">
      <h1 className="text-4xl font-serif leading-tight text-[color:var(--deco-ink)] sm:text-5xl md:text-6xl lg:text-7xl">
        Lily House
        <span className="mx-3 inline-block align-middle text-xl text-gray-400 sm:text-2xl md:text-3xl">&</span>
        Isaac Cloran
      </h1>
      <p className="mt-2 uppercase tracking-[0.18em] text-[11px] text-[color:rgba(15,17,19,0.6)] sm:tracking-[0.25em] sm:text-xs md:text-sm">
        June 12, 2026 · Indianapolis, IN
      </p>
      <Countdown />
      <div className="mt-8">
        <Link 
          href="/game"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-[0.15em] text-[color:rgba(15,17,19,0.6)] hover:text-[color:var(--deco-gold)] transition-colors border border-[color:rgba(212,175,55,0.3)] rounded-xl hover:border-[color:var(--deco-gold)] hover:bg-[color:rgba(212,175,55,0.05)]"
        >
          <span>🎯</span>
          Wedding Trivia
        </Link>
      </div>
      <ShootingStars />
    </main>
  );
};

export default Home;

interface ViewModeToggleProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

const ViewModeToggle = ({ currentMode, onModeChange }: ViewModeToggleProps) => {
  const viewModes: { key: ViewMode; label: string; description: string }[] = [
    { key: "classic", label: "Classic", description: "Days, Hours, Minutes, Seconds" },
    { key: "week-focus", label: "Weekly", description: "Weeks, Days, Hours, Minutes" },
    { key: "month-focus", label: "Monthly", description: "Months, Days, Hours, Minutes" },
    { key: "minimal", label: "Simple", description: "Days, Hours" },
    { key: "precise", label: "Precise", description: "Total Hours, Minutes, Seconds" }
  ];

  return (
    <div className="mb-6 flex flex-wrap justify-center gap-2">
      {viewModes.map((mode) => (
        <button
          key={mode.key}
          onClick={() => onModeChange(mode.key)}
          className={`px-3 py-2 text-xs font-medium uppercase tracking-[0.1em] rounded-xl border transition-all duration-300 ${
            currentMode === mode.key
              ? "border-[color:var(--deco-gold)] bg-[color:rgba(212,175,55,0.15)] text-[color:var(--deco-ink)] shadow-sm"
              : "border-[color:rgba(212,175,55,0.3)] bg-[color:rgba(212,175,55,0.05)] text-[color:rgba(15,17,19,0.7)] hover:border-[color:var(--deco-gold)] hover:bg-[color:rgba(212,175,55,0.1)]"
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
};

type ViewMode = 
  | "classic"        // Days, Hours, Minutes, Seconds
  | "week-focus"     // Weeks, Days, Hours, Minutes
  | "month-focus"    // Months, Days, Hours, Minutes
  | "minimal"        // Days, Hours
  | "precise";       // Total Hours, Minutes, Seconds

interface TimeRemaining {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
}

const Countdown = () => {
  const [now, setNow] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("classic");

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem("countdown-view-mode");
    if (saved && ["classic", "week-focus", "month-focus", "minimal", "precise"].includes(saved)) {
      setViewMode(saved as ViewMode);
    }
  }, []);

  // Save preference
  useEffect(() => {
    localStorage.setItem("countdown-view-mode", viewMode);
  }, [viewMode]);

  const remaining = useMemo((): TimeRemaining => {
    if (!now) {
      return {
        years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0,
        totalDays: 0, totalHours: 0, totalMinutes: 0, totalSeconds: 0
      };
    }

    const diffMs = Math.max(0, targetDate.getTime() - now.getTime());
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalSeconds / 3600);
    const totalDays = Math.floor(totalSeconds / 86400);

    // Calculate years and remaining time
    const currentYear = now.getFullYear();
    const targetYear = targetDate.getFullYear();
    const years = Math.max(0, targetYear - currentYear);
    
    // Calculate months more accurately
    let months = 0;
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();
    const weddingYear = targetDate.getFullYear();
    const weddingMonth = targetDate.getMonth();
    
    months = (weddingYear - nowYear) * 12 + (weddingMonth - nowMonth);
    
    // Adjust if we haven't reached the target day yet in the target month
    if (now.getDate() > targetDate.getDate()) {
      months--;
    }

    // Calculate weeks from total remaining days
    const weeks = Math.floor(totalDays / 7);

    // Standard breakdown
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds
    };
  }, [now]);

  const getDisplayUnits = () => {
    switch (viewMode) {
      case "classic":
        return [
          { label: "Days", value: remaining.days },
          { label: "Hours", value: remaining.hours },
          { label: "Minutes", value: remaining.minutes },
          { label: "Seconds", value: remaining.seconds }
        ];
      
      case "week-focus":
        return [
          { label: "Weeks", value: Math.floor(remaining.days / 7) },
          { label: "Days", value: remaining.days % 7 },
          { label: "Hours", value: remaining.hours },
          { label: "Minutes", value: remaining.minutes }
        ];
      
      case "month-focus":
        return [
          { label: "Months", value: remaining.months },
          { label: "Days", value: remaining.days % 30 },
          { label: "Hours", value: remaining.hours },
          { label: "Minutes", value: remaining.minutes }
        ];
      
      case "minimal":
        return [
          { label: "Days", value: remaining.days },
          { label: "Hours", value: remaining.hours }
        ];
      
      case "precise":
        return [
          { label: "Hours", value: remaining.totalHours },
          { label: "Minutes", value: remaining.totalMinutes % 60 },
          { label: "Seconds", value: remaining.seconds }
        ];
      
      default:
        return [
          { label: "Days", value: remaining.days },
          { label: "Hours", value: remaining.hours },
          { label: "Minutes", value: remaining.minutes },
          { label: "Seconds", value: remaining.seconds }
        ];
    }
  };

  const displayUnits = getDisplayUnits();
  const gridCols = displayUnits.length;

  return (
    <div className="mt-10 w-full max-w-4xl">
      {/* View Mode Toggle */}
      <ViewModeToggle currentMode={viewMode} onModeChange={setViewMode} />
      
      {/* Countdown Display */}
      <div 
        className={`countdown mt-6 grid w-full gap-3 rounded-3xl px-4 py-5 text-center transition-all duration-500 ease-in-out sm:gap-4 sm:px-5 sm:py-6 ${
          gridCols === 1 ? "grid-cols-1" :
          gridCols === 2 ? "grid-cols-1 sm:grid-cols-2" :
          gridCols === 3 ? "grid-cols-1 sm:grid-cols-3" :
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {displayUnits.map((unit, index) => (
          <TimeCell
            key={`${viewMode}-${unit.label}`}
            label={unit.label}
            value={unit.value}
            pending={!now}
            delay={index * 100}
          />
        ))}
      </div>
    </div>
  );
};

// Shooting stars overlay
type Star = {
  id: number;
  leftVw: number;
  topVh: number;
  durationMs: number;
  travelXvw: number;
  travelYvh: number;
};

const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

const ShootingStars = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const idRef = useState(() => ({ value: 0 }))[0];
  const timeoutRef = useState<{ id: ReturnType<typeof setTimeout> | null }>(() => ({ id: null }))[0];
  const lastTrackRef = useRef(0);

  const spawnStar = useCallback(() => {
    const id = ++idRef.value;

    const randomOffscreenPoint = () => {
      const side = Math.floor(Math.random() * 4); // 0:left,1:top,2:right,3:bottom
      if (side === 0) return { x: randomInRange(-20, -5), y: randomInRange(0, 100) };
      if (side === 1) return { x: randomInRange(0, 100), y: randomInRange(-20, -5) };
      if (side === 2) return { x: randomInRange(105, 120), y: randomInRange(0, 100) };
      return { x: randomInRange(0, 100), y: randomInRange(105, 120) };
    };

    const start = randomOffscreenPoint();
    let end = randomOffscreenPoint();
    // Ensure end is not too close to start direction to better cross the screen
    let guard = 0;
    while (Math.hypot(end.x - start.x, end.y - start.y) < 60 && guard < 5) {
      end = randomOffscreenPoint();
      guard++;
    }

    const star: Star = {
      id,
      leftVw: start.x,
      topVh: start.y,
      durationMs: Math.round(randomInRange(1100, 2000)),
      travelXvw: end.x - start.x,
      travelYvh: end.y - start.y,
    };
    setStars((prev) => [...prev, star]);
    setTimeout(() => {
      setStars((prev) => prev.filter((s) => s.id !== id));
    }, star.durationMs + 160);
  }, [idRef, setStars]);

  useEffect(() => {
    const scheduleNext = () => {
      const nextDelayMs = Math.round(randomInRange(2000, 10000));
      timeoutRef.id = setTimeout(() => {
        spawnStar();
        scheduleNext();
      }, nextDelayMs);
    };

    scheduleNext();
    const handleClick = (event: MouseEvent) => {
      const now = Date.now();
      if (now - lastTrackRef.current > 600) {
        const xvw = (event.clientX / window.innerWidth) * 100;
        const yvh = (event.clientY / window.innerHeight) * 100;
        track("star_click", { x: event.clientX, y: event.clientY, vw: xvw, vh: yvh });
        lastTrackRef.current = now;
      }
      spawnStar();
    };

    window.addEventListener("click", handleClick);
    return () => {
      if (timeoutRef.id) clearTimeout(timeoutRef.id);
      window.removeEventListener("click", handleClick);
    };
  }, [spawnStar, timeoutRef]);

  if (stars.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
      role="presentation"
      aria-hidden="true"
    >
      {stars.map((star) => {
        const angleDeg = Math.atan2(star.travelYvh, star.travelXvw) * (180 / Math.PI);
        // Allow CSS custom properties without using `any`.
        type CSSVarProperties = { [key: `--${string}`]: string | number };
        const containerStyle: React.CSSProperties & CSSVarProperties = {
          left: `${star.leftVw}vw`,
          top: `${star.topVh}vh`,
          "--travel-x": `${star.travelXvw}vw`,
          "--travel-y": `${star.travelYvh}vh`,
          "--dur": `${star.durationMs}ms`,
          animation: "star-shoot var(--dur) linear forwards",
        };
        return (
          <div
            key={star.id}
            className="absolute"
            style={containerStyle}
          >
            <div className="relative" style={{ transform: `rotate(${angleDeg}deg)` }}>
              {/* Tail */}
              <span
                className="block h-[2px] sm:h-[2.5px] md:h-[3px] w-[26vw] sm:w-[20vw] md:w-[16vw] rounded-full bg-gradient-to-r from-[rgba(255,255,255,0)] via-[rgba(255,255,255,0.95)] to-[color:var(--deco-gold)] shadow-[0_0_18px_rgba(255,255,255,0.95),0_0_36px_rgba(212,175,55,0.75),0_0_60px_rgba(255,255,255,0.65)] mix-blend-plus-lighter"
                style={{
                  animation: "star-flicker 600ms ease-in-out infinite",
                }}
              />
              {/* Core head */}
              <span
                className="absolute right-0 top-1/2 block h-2 w-2 -translate-y-1/2 rounded-full shadow-[0_0_16px_rgba(255,255,255,0.95),0_0_28px_rgba(212,175,55,0.8),0_0_70px_rgba(255,255,255,0.75)] mix-blend-plus-lighter"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 40%, rgba(255,255,255,0.6) 60%, rgba(255,255,255,0) 75%)",
                  animation: "star-flicker 500ms ease-in-out infinite",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

type TimeCellProps = { 
  label: string; 
  value: number; 
  pending?: boolean; 
  delay?: number;
};

const TimeCell = ({ label, value, pending = false, delay = 0 }: TimeCellProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const formatValue = (val: number) => {
    if (val >= 1000) {
      return val.toLocaleString();
    }
    return val.toString().padStart(2, "0");
  };

  const displayValue = pending ? "--" : formatValue(value);

  return (
    <div 
      className={`rounded-2xl border border-[color:var(--deco-gold)] bg-[color:rgba(212,175,55,0.08)] px-4 py-5 transition-all duration-500 ease-out sm:px-6 sm:py-7 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="countdown-number tick text-4xl font-semibold tracking-wide text-[color:var(--deco-ink)] sm:text-5xl md:text-6xl lg:text-7xl">
        {displayValue}
      </div>
      <div className="mt-3 text-xs uppercase tracking-[0.25em] text-[color:rgba(15,17,19,0.6)]">
        {label}
      </div>
    </div>
  );
};
