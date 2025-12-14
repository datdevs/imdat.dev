'use client';

import { useEffect, useState } from 'react';

import CountdownItem from './countdown-item';

interface CountdownSectionProps {
  readonly backgroundImage: null | string;
  readonly labels: {
    readonly days: string;
    readonly hours: string;
    readonly minutes: string;
    readonly reachedMessage: string;
    readonly seconds: string;
    readonly subReachedMessage: string;
  };
  readonly targetDate: Date;
  readonly title: string;
}

const calculateTimeLeft = (target: Date) => {
  const now = Date.now();
  const targetTime = target.getTime();
  const difference = targetTime - now;

  if (difference <= 0) {
    return { days: '00', hasReached: true, hours: '00', minutes: '00', seconds: '00' };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return {
    days: String(days).padStart(2, '0'),
    hasReached: false,
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
};

export default function CountdownSection({ backgroundImage, labels, targetDate, title }: CountdownSectionProps) {
  const initialTime = calculateTimeLeft(targetDate);
  const [timeLeft, setTimeLeft] = useState({
    days: initialTime.days,
    hours: initialTime.hours,
    minutes: initialTime.minutes,
    seconds: initialTime.seconds,
  });
  const [hasReached, setHasReached] = useState(initialTime.hasReached);

  useEffect(() => {
    // Update every second
    const interval = setInterval(() => {
      const result = calculateTimeLeft(targetDate);
      setTimeLeft({
        days: result.days,
        hours: result.hours,
        minutes: result.minutes,
        seconds: result.seconds,
      });
      setHasReached(result.hasReached);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <section
      className="relative bg-cover bg-fixed"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      <div className="bg-primary/20 pointer-events-none py-32 text-shadow-[1px_1px_5px_rgba(0,0,0,0.2)]">
        <div className="container mx-auto space-y-12 text-center text-white">
          {hasReached ? (
            <>
              <p className="font-handwriting text-6xl text-white">{labels.reachedMessage}</p>
              {labels.subReachedMessage && (
                <p className="font-handwriting text-3xl text-white">{labels.subReachedMessage}</p>
              )}
            </>
          ) : (
            <>
              <h2 className="font-handwriting text-6xl text-white">{title}</h2>

              <ul className="flex items-center justify-center gap-4 font-serif text-2xl tracking-[5px] text-white uppercase">
                <CountdownItem id="days" label={labels.days} value={timeLeft.days} />
                <CountdownItem id="hours" label={labels.hours} value={timeLeft.hours} />
                <CountdownItem id="minutes" label={labels.minutes} value={timeLeft.minutes} />
                <CountdownItem id="seconds" label={labels.seconds} value={timeLeft.seconds} />
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
