"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const targetDate = new Date("2026-06-12T00:00:00-04:00");

const Home = () => {
  return (
    <main className="grid min-h-screen grid-cols-1 content-center justify-items-center gap-6 px-6 py-16 text-center">
      <h1 className="text-4xl font-serif leading-tight text-[color:var(--deco-ink)] sm:text-5xl md:text-6xl lg:text-7xl">
        Isaac Cloran
        <span className="mx-3 inline-block align-middle text-xl text-gray-400 sm:text-2xl md:text-3xl">&</span>
        Lily House
      </h1>
      <p className="mt-2 uppercase tracking-[0.18em] text-[11px] text-[color:rgba(15,17,19,0.6)] sm:tracking-[0.25em] sm:text-xs md:text-sm">
        June 12, 2026 · Indianapolis, IN
      </p>
      <Countdown />
      <ShootingStars />
    </main>
  );
};

export default Home;

const Countdown = () => {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = useMemo(() => {
    if (!now) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const diffMs = Math.max(0, targetDate.getTime() - now.getTime());
    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds };
  }, [now]);

  return (
    <div className="countdown mt-10 grid w-full max-w-3xl grid-cols-1 gap-4 rounded-3xl px-4 py-5 text-center sm:grid-cols-2 sm:px-5 sm:py-6 md:grid-cols-4">
      <TimeCell label="Days" value={remaining.days} pending={!now} />
      <TimeCell label="Hours" value={remaining.hours} pending={!now} />
      <TimeCell label="Minutes" value={remaining.minutes} pending={!now} />
      <TimeCell label="Seconds" value={remaining.seconds} pending={!now} />
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
    const handleClick = () => {
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
        const containerStyle: React.CSSProperties & Record<string, string> = {
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

type TimeCellProps = { label: string; value: number; pending?: boolean };
const TimeCell = ({ label, value, pending = false }: TimeCellProps) => {
  const padded = value.toString().padStart(2, "0");
  return (
    <div className="rounded-2xl border border-[color:var(--deco-gold)] bg-[color:rgba(212,175,55,0.08)] px-4 py-5 sm:px-6 sm:py-7">
      <div className="countdown-number tick text-4xl font-semibold tracking-wide text-[color:var(--deco-ink)] sm:text-5xl md:text-7xl">
        {pending ? "--" : padded}
      </div>
      <div className="mt-3 text-xs uppercase tracking-[0.25em] text-[color:rgba(15,17,19,0.6)]">{label}</div>
    </div>
  );
};
