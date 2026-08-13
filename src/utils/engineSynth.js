const CYLINDER_PARAMS = {
  duke: { carrierFreq: 70, subFreq: 35, pulseHz: 9, jitter: 6 },
  // RC: same single-cylinder engine as the Duke, tuned sportier and higher-revving
  rc: { carrierFreq: 80, subFreq: 40, pulseHz: 12, jitter: 5 },
  // Z900 inline-four: higher-pitched, faster-firing, tighter jitter for a smoother character
  z900: { carrierFreq: 105, subFreq: 52, pulseHz: 24, jitter: 2 },
};

const EXHAUST_PARAMS = {
  stock: { cutoff: 900, drive: 6, noiseLevel: 0.025, crackle: 0.03, gain: 0.32 },
  akrapovic: { cutoff: 2600, drive: 22, noiseLevel: 0.06, crackle: 0.12, gain: 0.42 },
  z900exhaust: { cutoff: 3400, drive: 30, noiseLevel: 0.08, crackle: 0.18, gain: 0.46 },
};

// One full ride cycle through all 6 gears: idle -> 1st..6th, each revving up and
// holding before the shift cut, then decel back to idle. mult scales pitch (RPM),
// gain dips at each shift for the clutch-cut snap.
const GEAR_CYCLE = [
  { t: 0, mult: 1, gain: 0.85 },
  { t: 1.5, mult: 1, gain: 0.85 },
  { t: 3.2, mult: 2.3, gain: 1.05 },
  { t: 5.2, mult: 2.3, gain: 1.05 },
  { t: 5.45, mult: 1.5, gain: 0.5 },
  { t: 5.65, mult: 1.5, gain: 1 },
  { t: 7.35, mult: 2.8, gain: 1.1 },
  { t: 9.35, mult: 2.8, gain: 1.1 },
  { t: 9.6, mult: 2, gain: 0.5 },
  { t: 9.8, mult: 2, gain: 1 },
  { t: 11.5, mult: 3.3, gain: 1.15 },
  { t: 13.5, mult: 3.3, gain: 1.15 },
  { t: 13.75, mult: 2.5, gain: 0.5 },
  { t: 13.95, mult: 2.5, gain: 1 },
  { t: 15.65, mult: 3.8, gain: 1.2 },
  { t: 17.65, mult: 3.8, gain: 1.2 },
  { t: 17.9, mult: 3, gain: 0.5 },
  { t: 18.1, mult: 3, gain: 1 },
  { t: 19.8, mult: 4.3, gain: 1.25 },
  { t: 21.8, mult: 4.3, gain: 1.25 },
  { t: 22.05, mult: 3.5, gain: 0.5 },
  { t: 22.25, mult: 3.5, gain: 1 },
  { t: 24.25, mult: 4.8, gain: 1.3 },
  { t: 26.25, mult: 4.8, gain: 1.3 },
  { t: 29.05, mult: 1, gain: 0.85 },
  { t: 29.85, mult: 1, gain: 0.85 },
];
const GEAR_CYCLE_DURATION = 29.85;

function makeDistortionCurve(amount) {
  const samples = 256;
  const curve = new Float32Array(samples);
  const deg = Math.PI / 180;
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1;
    curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

export class EngineSynth {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.analyser = null;
    this.noiseBuffer = null;
    this.nodes = null;
    this.running = false;
    this.gearLoopTimer = null;
    this.stopTimer = null;
    this.baseFreqs = null;
  }

  ensureContext() {
    if (this.ctx) return;
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextCtor();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;
    this.master.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  // Call synchronously from the click handler even if this engine isn't playing yet —
  // AudioContext only unlocks inside a direct user-gesture call stack, and a later
  // exhaust-pill switch runs from a useEffect, not a click.
  unlock() {
    this.ensureContext();
    if (this.ctx.state === "suspended") this.ctx.resume();
  }

  getNoiseBuffer() {
    if (this.noiseBuffer) return this.noiseBuffer;
    const length = this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  buildGraph(cylinder, exhaust) {
    const ctx = this.ctx;
    const { carrierFreq, subFreq, pulseHz, jitter } = CYLINDER_PARAMS[cylinder];
    const { cutoff, drive, noiseLevel, crackle } = EXHAUST_PARAMS[exhaust];

    // Main body tone
    const carrier = ctx.createOscillator();
    carrier.type = "sawtooth";
    carrier.frequency.value = carrierFreq;

    // Sub-octave layer for low-end rumble
    const sub = ctx.createOscillator();
    sub.type = "sawtooth";
    sub.frequency.value = subFreq;
    const subGain = ctx.createGain();
    subGain.gain.value = 0.35;
    sub.connect(subGain);

    // Slow random-ish detune so it doesn't sound perfectly mechanical
    const jitterLfo = ctx.createOscillator();
    jitterLfo.type = "sine";
    jitterLfo.frequency.value = 0.7;
    const jitterGain = ctx.createGain();
    jitterGain.gain.value = jitter;
    jitterLfo.connect(jitterGain);
    jitterGain.connect(carrier.detune);
    jitterGain.connect(sub.detune);

    // Firing pulse — sawtooth (sharper stroke) instead of a smooth sine
    const pulse = ctx.createOscillator();
    pulse.type = "sawtooth";
    pulse.frequency.value = pulseHz;

    const pulseGain = ctx.createGain();
    pulseGain.gain.value = 0.5;

    const carrierGain = ctx.createGain();
    carrierGain.gain.value = 0.5;

    pulse.connect(pulseGain);
    pulseGain.connect(carrierGain.gain);
    carrier.connect(carrierGain);
    subGain.connect(carrierGain);

    // Background exhaust hiss
    const noise = ctx.createBufferSource();
    noise.buffer = this.getNoiseBuffer();
    noise.loop = true;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = noiseLevel;
    noise.connect(noiseGain);

    // Exhaust crackle/pop — noise gated by the firing pulse, filtered brighter to read as a "bark"
    const crackleSource = ctx.createBufferSource();
    crackleSource.buffer = this.getNoiseBuffer();
    crackleSource.loop = true;

    const crackleFilter = ctx.createBiquadFilter();
    crackleFilter.type = "highpass";
    crackleFilter.frequency.value = 1800;

    const crackleGain = ctx.createGain();
    crackleGain.gain.value = 0;

    const crackleAmount = ctx.createGain();
    crackleAmount.gain.value = crackle;
    pulseGain.connect(crackleAmount);
    crackleAmount.connect(crackleGain.gain);

    crackleSource.connect(crackleFilter);
    crackleFilter.connect(crackleGain);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = cutoff;

    const shaper = ctx.createWaveShaper();
    shaper.curve = makeDistortionCurve(drive);

    // RPM-linked loudness, separate from the master fade so the gear cycle can swell/dip on its own
    const revGain = ctx.createGain();
    revGain.gain.value = 0.85;

    carrierGain.connect(filter);
    noiseGain.connect(filter);
    filter.connect(shaper);
    shaper.connect(revGain);
    crackleGain.connect(revGain);
    revGain.connect(this.master);

    carrier.start();
    sub.start();
    pulse.start();
    jitterLfo.start();
    noise.start();
    crackleSource.start();

    this.nodes = { carrier, sub, pulse, jitterLfo, noise, crackleSource, revGain };
    this.baseFreqs = { carrierFreq, subFreq, pulseHz };

    // Only Z900 Exhaust still uses the synth (Stock/Akrapovič play real recordings), so
    // give it the full rev/gear-shift cycle instead of a louder idle.
    if (exhaust === "z900exhaust") {
      this.scheduleGearLoop();
    }
  }

  scheduleGearLoop() {
    if (!this.nodes || !this.baseFreqs) return;

    const { carrier, sub, pulse, revGain } = this.nodes;
    const { carrierFreq, subFreq, pulseHz } = this.baseFreqs;
    const now = this.ctx.currentTime;

    pulse.frequency.cancelScheduledValues(now);
    carrier.frequency.cancelScheduledValues(now);
    sub.frequency.cancelScheduledValues(now);
    revGain.gain.cancelScheduledValues(now);

    GEAR_CYCLE.forEach(({ t, mult, gain }) => {
      const revFactor = 1 + (mult - 1) * 0.5;
      pulse.frequency.linearRampToValueAtTime(pulseHz * mult, now + t);
      carrier.frequency.linearRampToValueAtTime(carrierFreq * revFactor, now + t);
      sub.frequency.linearRampToValueAtTime(subFreq * revFactor, now + t);
      revGain.gain.linearRampToValueAtTime(gain, now + t);
    });

    this.gearLoopTimer = setTimeout(() => {
      this.scheduleGearLoop();
    }, GEAR_CYCLE_DURATION * 1000);
  }

  teardownGraph() {
    if (this.gearLoopTimer) {
      clearTimeout(this.gearLoopTimer);
      this.gearLoopTimer = null;
    }

    if (!this.nodes) return;
    Object.values(this.nodes).forEach((node) => {
      try {
        if (typeof node.stop === "function") node.stop();
      } catch {
        // already stopped
      }
      try {
        node.disconnect();
      } catch {
        // already disconnected
      }
    });
    this.nodes = null;
    this.baseFreqs = null;
  }

  start(cylinder, exhaust) {
    this.ensureContext();
    if (this.ctx.state === "suspended") this.ctx.resume();

    // cancel any pending teardown from a prior stop() — it can kill this new graph ~400ms in
    if (this.stopTimer) {
      clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }

    this.teardownGraph();
    this.buildGraph(cylinder, exhaust);
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.setTargetAtTime(
      EXHAUST_PARAMS[exhaust].gain,
      this.ctx.currentTime,
      0.15
    );
    this.running = true;
  }

  updateParams(cylinder, exhaust) {
    if (!this.running) return;
    this.start(cylinder, exhaust);
  }

  stop() {
    if (!this.ctx) return;
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.12);
    this.running = false;

    if (this.stopTimer) clearTimeout(this.stopTimer);
    this.stopTimer = setTimeout(() => {
      this.teardownGraph();
      this.stopTimer = null;
    }, 400);
  }

  getLevels() {
    if (!this.analyser) return null;
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }
}
