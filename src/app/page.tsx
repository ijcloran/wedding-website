"use client";

import { useEffect, useMemo, useState } from "react";

const targetDate = new Date("2026-06-12T00:00:00-04:00");

const Home = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-5xl font-serif leading-tight text-[color:var(--deco-ink)] sm:text-7xl">
        Isaac Cloran
        <span className="mx-3 inline-block align-middle text-3xl text-gray-400">&</span>
        Lily House
      </h1>
      <p className="mt-2 tracking-[0.25em] text-xs uppercase text-[color:rgba(15,17,19,0.6)]">
        June 12, 2026 · Indianapolis, IN
      </p>
      <Countdown />
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
    <div className="countdown mt-10 grid w-full max-w-3xl grid-cols-4 gap-4 rounded-3xl px-5 py-6 text-center">
      <TimeCell label="Days" value={remaining.days} pending={!now} />
      <TimeCell label="Hours" value={remaining.hours} pending={!now} />
      <TimeCell label="Minutes" value={remaining.minutes} pending={!now} />
      <TimeCell label="Seconds" value={remaining.seconds} pending={!now} />
    </div>
  );
};

type TimeCellProps = { label: string; value: number; pending?: boolean };
const TimeCell = ({ label, value, pending = false }: TimeCellProps) => {
  const padded = value.toString().padStart(2, "0");
  return (
    <div className="rounded-2xl border border-[color:var(--deco-gold)] bg-[color:rgba(212,175,55,0.08)] px-6 py-7">
      <div className="countdown-number tick text-5xl font-semibold tracking-wide text-[color:var(--deco-ink)] sm:text-7xl">
        {pending ? "--" : padded}
      </div>
      <div className="mt-3 text-xs uppercase tracking-[0.25em] text-[color:rgba(15,17,19,0.6)]">{label}</div>
    </div>
  );
};
