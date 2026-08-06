const CYLINDER_PARAMS = {
  single: { carrierFreq: 75, pulseHz: 9 },
  twin: { carrierFreq: 95, pulseHz: 16 },
};

const EXHAUST_PARAMS = {
  stock: { cutoff: 900, drive: 6, noiseLevel: 0.03, gain: 0.32 },
  akrapovic: { cutoff: 2600, drive: 22, noiseLevel: 0.08, gain: 0.42 },
  race: { cutoff: 5200, drive: 45, noiseLevel: 0.15, gain: 0.5 },
};

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
    const { carrierFreq, pulseHz } = CYLINDER_PARAMS[cylinder];
    const { cutoff, drive, noiseLevel } = EXHAUST_PARAMS[exhaust];

    const carrier = ctx.createOscillator();
    carrier.type = "sawtooth";
    carrier.frequency.value = carrierFreq;

    const pulse = ctx.createOscillator();
    pulse.type = "sine";
    pulse.frequency.value = pulseHz;

    const pulseGain = ctx.createGain();
    pulseGain.gain.value = 0.5;

    const carrierGain = ctx.createGain();
    carrierGain.gain.value = 0.5;

    pulse.connect(pulseGain);
    pulseGain.connect(carrierGain.gain);
    carrier.connect(carrierGain);

    const noise = ctx.createBufferSource();
    noise.buffer = this.getNoiseBuffer();
    noise.loop = true;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = noiseLevel;
    noise.connect(noiseGain);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = cutoff;

    const shaper = ctx.createWaveShaper();
    shaper.curve = makeDistortionCurve(drive);

    carrierGain.connect(filter);
    noiseGain.connect(filter);
    filter.connect(shaper);
    shaper.connect(this.master);

    carrier.start();
    pulse.start();
    noise.start();

    this.nodes = { carrier, pulse, noise };
  }

  teardownGraph() {
    if (!this.nodes) return;
    Object.values(this.nodes).forEach((node) => {
      try {
        node.stop();
        node.disconnect();
      } catch {
        // already stopped
      }
    });
    this.nodes = null;
  }

  start(cylinder, exhaust) {
    this.ensureContext();
    if (this.ctx.state === "suspended") this.ctx.resume();
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
    setTimeout(() => this.teardownGraph(), 400);
  }

  getLevels() {
    if (!this.analyser) return null;
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }
}
