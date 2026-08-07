import { useEffect, useRef, useState } from "react";
import { FaPowerOff, FaVolumeMute } from "react-icons/fa";
import { EngineSynth } from "../../utils/engineSynth";
import { EnginePlayer } from "../../utils/enginePlayer";
import "./EngineExperience.css";

const CYLINDER_OPTIONS = [
  { value: "single", label: "Single Cylinder" },
  { value: "twin", label: "Twin Cylinder (LC8c)" },
];

const EXHAUST_OPTIONS = [
  { value: "stock", label: "Stock Exhaust" },
  { value: "akrapovic", label: "Akrapovič Slip-on" },
  { value: "race", label: "Full Race Exhaust" },
];

const BAR_COUNT = 24;

function EngineExperience() {
  const [running, setRunning] = useState(false);
  const [cylinder, setCylinder] = useState("single");
  const [exhaust, setExhaust] = useState("stock");
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [levels, setLevels] = useState(new Array(BAR_COUNT).fill(4));

  const synthRef = useRef(null);
  const playerRef = useRef(null);
  const exhaustRef = useRef(exhaust);
  const rafRef = useRef(null);

  useEffect(() => {
    synthRef.current = new EngineSynth();
    playerRef.current = new EnginePlayer("/audio/engine-sound.mp3");
    return () => {
      cancelAnimationFrame(rafRef.current);
      synthRef.current?.stop();
      playerRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    exhaustRef.current = exhaust;
  }, [exhaust]);

  useEffect(() => {
    if (!running) return;

    synthRef.current.stop();
    playerRef.current.stop();

    if (exhaust === "akrapovic") {
      playerRef.current.start().catch(() => setAudioBlocked(true));
    } else {
      synthRef.current.start(cylinder, exhaust);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exhaust]);

  useEffect(() => {
    // Cylinder only affects the synthesized engine — switching it while
    // Akrapovič (real audio) is playing shouldn't restart that recording.
    if (!running || exhaust === "akrapovic") return;

    synthRef.current.start(cylinder, exhaust);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cylinder]);

  const animate = () => {
    const engine =
      exhaustRef.current === "akrapovic" ? playerRef.current : synthRef.current;
    const data = engine?.getLevels();
    if (data) {
      const step = Math.floor(data.length / BAR_COUNT) || 1;
      const bars = new Array(BAR_COUNT)
        .fill(0)
        .map((_, i) => Math.max(4, data[i * step] || 0));
      setLevels(bars);
    }
    rafRef.current = requestAnimationFrame(animate);
  };

  const toggleEngine = async () => {
    if (!running) {
      try {
        // Unlock both engines' AudioContexts here, inside the click — a
        // later switch to whichever exhaust isn't playing yet happens from
        // a useEffect, which browsers won't treat as a user gesture.
        synthRef.current.unlock();
        playerRef.current.unlock();

        if (exhaust === "akrapovic") {
          await playerRef.current.start();
        } else {
          synthRef.current.start(cylinder, exhaust);
        }
        setAudioBlocked(false);
        setRunning(true);
        rafRef.current = requestAnimationFrame(animate);
      } catch {
        setAudioBlocked(true);
      }
    } else {
      synthRef.current.stop();
      playerRef.current.stop();
      setRunning(false);
      cancelAnimationFrame(rafRef.current);
      setLevels(new Array(BAR_COUNT).fill(4));
    }
  };

  return (
    <section className="engine-exp">
      <div className="container engine-exp-inner">
        <div className="engine-exp-heading">
          <span className="engine-exp-tag">Feel It Before You Ride It</span>
          <h2>
            Start the <span>Engine</span>
          </h2>
          <p>Pick your setup, hit start, and hear it come alive.</p>
        </div>

        <div className="engine-exp-stage">
          <div className="engine-exp-visual">
            <div className="engine-bars">
              {levels.map((v, i) => (
                <div
                  key={i}
                  className="engine-bar"
                  style={{ height: `${Math.min(100, (v / 255) * 100 + 6)}%` }}
                />
              ))}
            </div>

            <button
              className={running ? "engine-btn running" : "engine-btn"}
              onClick={toggleEngine}
              aria-pressed={running}
            >
              <FaPowerOff />
              <span>{running ? "Engine Stop" : "Engine Start"}</span>
            </button>

            {audioBlocked && (
              <p className="engine-audio-warning">
                <FaVolumeMute /> Couldn't start audio — try tapping the button again.
              </p>
            )}
          </div>

          <div className="engine-exp-config">
            <div className="engine-config-group">
              <h4>Cylinder Type</h4>
              <div className="engine-pill-row">
                {CYLINDER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    className={cylinder === opt.value ? "engine-pill active" : "engine-pill"}
                    onClick={() => setCylinder(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="engine-config-group">
              <h4>Exhaust Type</h4>
              <div className="engine-pill-row">
                {EXHAUST_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    className={exhaust === opt.value ? "engine-pill active" : "engine-pill"}
                    onClick={() => setExhaust(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EngineExperience;
