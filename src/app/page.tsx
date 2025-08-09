"use client";

import { useEffect, useMemo, useState } from "react";

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
  angleDeg: number;
  durationMs: number;
  travelVw: number;
};

const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

const ShootingStars = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const idRef = useState(() => ({ value: 0 }))[0];
  const timeoutRef = useState<{ id: ReturnType<typeof setTimeout> | null }>(() => ({ id: null }))[0];

  useEffect(() => {
    const scheduleNext = () => {
      const nextDelayMs = Math.round(randomInRange(2000, 10000));
      timeoutRef.id = setTimeout(() => {
        // Create a star with random position, angle, duration, and travel
        const id = ++idRef.value;
        const leftToRight = Math.random() < 0.5;
        const star: Star = {
          id,
          leftVw: leftToRight ? randomInRange(-10, 30) : randomInRange(70, 110),
          topVh: randomInRange(0, 100),
          angleDeg: leftToRight ? randomInRange(-30, 10) : randomInRange(-10, 30),
          durationMs: Math.round(randomInRange(900, 1800)),
          travelVw: Math.round((leftToRight ? 1 : -1) * randomInRange(120, 160)),
        };
        setStars((prev) => [...prev, star]);

        // Remove it after it finishes
        setTimeout(() => {
          setStars((prev) => prev.filter((s) => s.id !== id));
        }, star.durationMs + 100);

        scheduleNext();
      }, nextDelayMs);
    };

    scheduleNext();
    return () => {
      if (timeoutRef.id) clearTimeout(timeoutRef.id);
    };
  }, [idRef, timeoutRef]);

  if (stars.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
      role="presentation"
      aria-hidden="true"
    >
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.leftVw}vw`,
            top: `${star.topVh}vh`,
            transform: `rotate(${star.angleDeg}deg)`
          }}
        >
          <span
            className="block h-[2px] w-[14vw] rounded-full bg-gradient-to-r from-white/0 via-white/80 to-white shadow-[0_0_12px_rgba(255,255,255,0.7)] will-change-transform"
            style={{
              ["--travel" as any]: `${star.travelVw}vw`,
              ["--dur" as any]: `${star.durationMs}ms`,
              animation: "star-shoot var(--dur) linear forwards"
            }}
          />
        </div>
      ))}
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
