import { useEffect, useRef, useState } from "react";
import "./LoadingScreen.css";

const STEPS = [
  [0, "Engine Check"],
  [30, "Oil & Filters"],
  [58, "Tyres & Brakes"],
  [82, "Final Polish"],
  [100, "Ready To Ride"],
];

const RING_CIRCUMFERENCE = 578;

function labelFor(value) {
  let label = STEPS[0][1];
  for (const [threshold, text] of STEPS) {
    if (value >= threshold) label = text;
  }
  return label;
}

export default function LoadingScreen() {
  const [alreadyShown] = useState(
    () => sessionStorage.getItem("splashShown") === "1"
  );

  const [progress, setProgress] = useState(alreadyShown ? 100 : 0);
  const [finished, setFinished] = useState(alreadyShown);
  const [coreFading, setCoreFading] = useState(alreadyShown);
  const [overlayFading, setOverlayFading] = useState(alreadyShown);
  const [hidden, setHidden] = useState(alreadyShown);

  const intervalRef = useRef(null);

  const finish = () => {
    setFinished(true);
    setTimeout(() => setCoreFading(true), 450);
    setTimeout(() => setOverlayFading(true), 700);
    setTimeout(() => setHidden(true), 1400);
  };

  useEffect(() => {
    if (alreadyShown) return;

    sessionStorage.setItem("splashShown", "1");

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 7 + 2;

        if (next >= 100) {
          clearInterval(intervalRef.current);
          finish();
          return 100;
        }

        return next;
      });
    }, 260);

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSkip = () => {
    clearInterval(intervalRef.current);
    setProgress(100);
    finish();
  };

  if (hidden) return null;

  const offset = RING_CIRCUMFERENCE * (1 - progress / 100);

  return (
    <div className={`r24-loading-overlay${overlayFading ? " is-fading" : ""}`}>
      <button className="r24-loading-skip" onClick={handleSkip}>
        Skip
      </button>

      <div className={`r24-loading-core${coreFading ? " is-fading" : ""}`}>
        <svg width="180" height="180" viewBox="0 0 200 200" role="img">
          <title>Loading</title>

          <circle cx="100" cy="100" r="92" fill="none" stroke="#262626" strokeWidth="6" />

          <circle
            cx="100"
            cy="100"
            r="92"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={offset}
            transform="rotate(-90 100 100)"
          />

          <circle cx="100" cy="100" r="72" fill="none" stroke="#232323" strokeWidth="16" />

          <g className={finished ? "" : "r24-loading-spin"}>
            <circle cx="100" cy="100" r="60" fill="none" stroke="var(--primary)" strokeWidth="3" />
            <g stroke="#5a5148" strokeWidth="4">
              <line x1="100" y1="44" x2="100" y2="156" />
              <line x1="44" y1="100" x2="156" y2="100" />
              <line x1="60" y1="60" x2="140" y2="140" />
              <line x1="140" y1="60" x2="60" y2="140" />
            </g>
            <circle cx="100" cy="100" r="13" fill="var(--primary)" />
          </g>
        </svg>

        <span className="r24-loading-percent">{Math.round(progress)}%</span>
        <span className={`r24-loading-label${finished ? " is-done" : ""}`}>
          {labelFor(progress)}
        </span>
      </div>
    </div>
  );
}
