"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { track } from "@vercel/analytics";
import Link from "next/link";

const targetDate = new Date("2026-06-12T15:30:00-04:00");

const Home = () => {
  const backgroundData = useQuery(api.photos.getBackgroundImage);
  
  return (
    <main 
      className="home-root deco-bg relative min-h-[100svh] flex flex-col items-center justify-between px-4 py-4 text-center bg-gradient-to-br from-[color:var(--pure-white)] via-[color:var(--light-blue)] to-[color:var(--pure-white)] overflow-hidden"
      style={{
        backgroundImage: backgroundData?.url 
          ? `url(${backgroundData.url}), linear-gradient(135deg, var(--pure-white) 0%, var(--light-blue) 50%, var(--pure-white) 100%)`
          : undefined,
        backgroundSize: backgroundData?.url ? 'cover, cover' : undefined,
        backgroundPosition: backgroundData?.url ? 'center, center' : undefined,
        backgroundRepeat: backgroundData?.url ? 'no-repeat, no-repeat' : undefined,
      }}
    >
      {/* Classic decorative pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {/* Elegant geometric pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[color:var(--accent-blue)]/10 to-transparent transform -skew-y-6"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[color:var(--button-blue)]/10 to-transparent transform skew-y-6"></div>
        
        {/* Classic corner flourishes */}
        <div className="absolute top-0 left-0 w-96 h-96">
          <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-[color:var(--accent-blue)]/20"></div>
          <div className="absolute top-8 left-8 w-24 h-24 border-t border-l border-[color:var(--button-blue)]/30"></div>
        </div>
        <div className="absolute bottom-0 right-0 w-96 h-96">
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-[color:var(--accent-blue)]/20"></div>
          <div className="absolute bottom-8 right-8 w-24 h-24 border-b border-r border-[color:var(--button-blue)]/30"></div>
        </div>
      </div>
      
      <div className="flex-1"></div>
      
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col justify-center space-y-1.5 sm:space-y-8">
        {/* Main heading with elegant styling */}
        <div className="home-heading space-y-1.5 sm:space-y-4 bg-white/5 backdrop-blur-xs rounded-2xl px-4 py-3 sm:px-6 sm:py-4 inline-block mx-auto border border-white/10">
          <h1 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-serif leading-tight text-[color:var(--primary-navy)] font-light drop-shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6">
              <span className="whitespace-nowrap">Lily House</span>
              <span className="text-lg sm:text-3xl md:text-4xl lg:text-5xl text-[color:var(--accent-blue)] font-normal">
                &
              </span>
              <span className="whitespace-nowrap">Isaac Cloran</span>
            </div>
          </h1>
          
          <div className="flex items-center justify-center space-x-3 my-1.5 sm:my-6">
            <div className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-[color:var(--accent-blue)]"></div>
            <div className="w-1 h-1 sm:w-2 sm:h-2 bg-[color:var(--primary-blue)] rounded-full shadow-sm"></div>
            <div className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-[color:var(--accent-blue)]"></div>
          </div>
          
          <p className="home-subtitle text-[11px] sm:text-sm md:text-base uppercase tracking-[0.1em] sm:tracking-[0.3em] text-[color:var(--primary-navy)] font-semibold drop-shadow-sm">
            June 12, 2026 · Indianapolis, IN
          </p>
        </div>

        {/* Countdown component */}
        <Countdown />
      </div>

      <div className="flex-1"></div>

      {/* Navigation links at bottom */}
      <div className="relative z-10 w-full px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] sm:px-0 sm:pb-8">
        <div className="home-actions flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center items-center w-full max-w-md sm:max-w-none mx-auto">
          <Link 
            href="/gallery"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 py-2 sm:px-8 sm:py-4 text-xs sm:text-sm uppercase tracking-[0.1em] sm:tracking-[0.15em] font-medium text-[color:var(--pure-white)] bg-gradient-to-r from-[color:var(--button-blue)] to-[color:var(--accent-blue)] hover:from-[color:var(--accent-blue)] hover:to-[color:var(--button-blue)] transition-all duration-300 rounded-full shadow-lg hover:shadow-xl hover:shadow-[color:var(--button-blue)]/25 hover:-translate-y-1"
          >
            Our Gallery
          </Link>
          
          <Link 
            href="/game"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 py-2 sm:px-8 sm:py-4 text-xs sm:text-sm uppercase tracking-[0.1em] sm:tracking-[0.15em] font-medium text-[color:var(--primary-navy)] bg-white/10 backdrop-blur-xs border border-white/20 hover:bg-white/20 hover:border-white/30 hover:text-[color:var(--button-blue)] transition-all duration-300 rounded-full shadow-lg hover:shadow-xl hover:shadow-[color:var(--accent-blue)]/10 hover:-translate-y-1"
          >
            Wedding Trivia
          </Link>
        </div>
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
    <div className="mb-8 flex flex-wrap justify-center gap-3">
      {viewModes.map((mode) => (
        <button
          key={mode.key}
          onClick={() => onModeChange(mode.key)}
          className={`px-4 py-2.5 text-xs font-medium uppercase tracking-[0.1em] rounded-full border transition-all duration-300 ${
            currentMode === mode.key
              ? "border-[color:var(--button-blue)] bg-[color:var(--button-blue)] text-[color:var(--pure-white)] shadow-lg shadow-[color:var(--button-blue)]/25"
              : "border-white/20 bg-white/10 backdrop-blur-xs text-[color:var(--text-gray)] hover:border-white/30 hover:bg-white/20 hover:text-[color:var(--button-blue)]"
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
    <div className="w-full max-w-5xl">
      {/* View Mode Toggle - Hidden on mobile */}
      <div className="hidden sm:block">
        <ViewModeToggle currentMode={viewMode} onModeChange={setViewMode} />
      </div>
      
      {/* Countdown Display */}
      <div 
        className={`countdown grid w-full gap-3 rounded-2xl px-4 py-6 text-center transition-all duration-500 ease-in-out sm:gap-6 sm:px-8 sm:py-10 ${
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
                className="block h-[2px] sm:h-[2.5px] md:h-[3px] w-[26vw] sm:w-[20vw] md:w-[16vw] rounded-full bg-gradient-to-r from-[rgba(255,255,255,0)] via-[rgba(255,255,255,0.9)] to-[color:var(--accent-blue)] shadow-[0_0_18px_rgba(255,255,255,0.8),0_0_36px_rgba(107,163,208,0.6),0_0_60px_rgba(255,255,255,0.5)] mix-blend-plus-lighter"
                style={{
                  animation: "star-flicker 600ms ease-in-out infinite",
                }}
              />
              {/* Core head */}
              <span
                className="absolute right-0 top-1/2 block h-2 w-2 -translate-y-1/2 rounded-full shadow-[0_0_16px_rgba(255,255,255,0.9),0_0_28px_rgba(107,163,208,0.7),0_0_70px_rgba(255,255,255,0.6)] mix-blend-plus-lighter"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 40%, rgba(107,163,208,0.6) 60%, rgba(107,163,208,0) 75%)",
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
      className={`transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="countdown-number tick text-3xl font-bold tracking-wide text-[color:var(--primary-navy)] sm:text-5xl md:text-6xl lg:text-7xl">
        {displayValue}
      </div>
      <div className="mt-2 text-xs uppercase tracking-[0.25em] text-[color:var(--text-gray)] font-medium">
        {label}
      </div>
    </div>
  );
};
