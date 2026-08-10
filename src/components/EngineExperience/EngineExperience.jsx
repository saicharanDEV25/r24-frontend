import { useEffect, useRef, useState } from "react";
import { FaPowerOff, FaVolumeMute } from "react-icons/fa";
import { EngineSynth } from "../../utils/engineSynth";
import { EnginePlayer } from "../../utils/enginePlayer";
import ScrollReveal from "../common/ScrollReveal/ScrollReveal";
import "./EngineExperience.css";

const CYLINDER_OPTIONS = [
  { value: "single", label: "Single Cylinder" },
  { value: "z900", label: "Z900" },
];

const EXHAUST_OPTIONS = [
  { value: "stock", label: "Stock Exhaust" },
  { value: "akrapovic", label: "Akrapovič Slip-on" },
  { value: "race", label: "Full Race Exhaust" },
  { value: "z900exhaust", label: "Z900 Exhaust" },
];

const BAR_COUNT = 24;

// Two combinations play a real recording instead of the synthesized
// engine: Akrapovič (any cylinder) and the Single Cylinder's actual
// stock-exhaust recording. Everything else is synthesized.
function getRealPlayer(cylinder, exhaust, akrapovicPlayer, stockPlayer) {
  if (exhaust === "akrapovic") return akrapovicPlayer;
  if (cylinder === "single" && exhaust === "stock") return stockPlayer;
  return null;
}

function EngineExperience() {
  const [running, setRunning] = useState(false);
  const [cylinder, setCylinder] = useState("single");
  const [exhaust, setExhaust] = useState("stock");
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [levels, setLevels] = useState(new Array(BAR_COUNT).fill(4));

  const synthRef = useRef(null);
  const akrapovicPlayerRef = useRef(null);
  const stockPlayerRef = useRef(null);
  const cylinderRef = useRef(cylinder);
  const exhaustRef = useRef(exhaust);
  const rafRef = useRef(null);

  useEffect(() => {
    synthRef.current = new EngineSynth();
    akrapovicPlayerRef.current = new EnginePlayer("/audio/engine-sound.mp3");
    stockPlayerRef.current = new EnginePlayer("/audio/stock-exhaust.mp3");
    return () => {
      cancelAnimationFrame(rafRef.current);
      synthRef.current?.stop();
      akrapovicPlayerRef.current?.stop();
      stockPlayerRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    cylinderRef.current = cylinder;
    exhaustRef.current = exhaust;
  }, [cylinder, exhaust]);

  const startCombo = async (cyl, exh) => {
    synthRef.current.stop();
    akrapovicPlayerRef.current.stop();
    stockPlayerRef.current.stop();

    const realPlayer = getRealPlayer(
      cyl,
      exh,
      akrapovicPlayerRef.current,
      stockPlayerRef.current
    );

    if (realPlayer) {
      await realPlayer.start();
    } else {
      synthRef.current.start(cyl, exh);
    }
  };

  useEffect(() => {
    if (!running) return;
    startCombo(cylinder, exhaust).catch(() => setAudioBlocked(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exhaust]);

  useEffect(() => {
    if (!running) return;
    startCombo(cylinder, exhaust).catch(() => setAudioBlocked(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cylinder]);

  const animate = () => {
    const realPlayer = getRealPlayer(
      cylinderRef.current,
      exhaustRef.current,
      akrapovicPlayerRef.current,
      stockPlayerRef.current
    );
    const engine = realPlayer || synthRef.current;
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
        // Unlock every engine's AudioContext here, inside the click — a
        // later switch to whichever combo isn't playing yet happens from
        // a useEffect, which browsers won't treat as a user gesture.
        synthRef.current.unlock();
        akrapovicPlayerRef.current.unlock();
        stockPlayerRef.current.unlock();

        await startCombo(cylinder, exhaust);
        setAudioBlocked(false);
        setRunning(true);
        rafRef.current = requestAnimationFrame(animate);
      } catch {
        setAudioBlocked(true);
      }
    } else {
      synthRef.current.stop();
      akrapovicPlayerRef.current.stop();
      stockPlayerRef.current.stop();
      setRunning(false);
      cancelAnimationFrame(rafRef.current);
      setLevels(new Array(BAR_COUNT).fill(4));
    }
  };

  return (
    <section className="engine-exp">
      <div className="container engine-exp-inner">
        <ScrollReveal>
          <div className="engine-exp-heading">
            <span className="engine-exp-tag">Feel It Before You Ride It</span>
            <h2>
              Start the <span>Engine</span>
            </h2>
            <p>Pick your setup, hit start, and hear it come alive.</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
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
        </ScrollReveal>
      </div>
    </section>
  );
}

export default EngineExperience;
