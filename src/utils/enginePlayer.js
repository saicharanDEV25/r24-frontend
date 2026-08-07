// Plays a real engine-sound recording on loop, routed through an analyser
// so the equalizer bars in EngineExperience can react to it the same way
// they did with the synthesized engine.
export class EnginePlayer {
  constructor(src) {
    this.src = src;
    this.ctx = null;
    this.audioEl = null;
    this.analyser = null;
  }

  ensureGraph() {
    if (this.ctx) return;
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextCtor();

    this.audioEl = new Audio(this.src);
    this.audioEl.loop = true;

    const source = this.ctx.createMediaElementSource(this.audioEl);
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;

    source.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  // See EngineSynth.unlock() — primes this engine's AudioContext inside a
  // direct user gesture even when it isn't the one about to play, so a
  // later exhaust-pill switch (which runs from a useEffect, not a click)
  // can still start it.
  unlock() {
    this.ensureGraph();
    if (this.ctx.state === "suspended") this.ctx.resume();
  }

  async start() {
    this.ensureGraph();
    if (this.ctx.state === "suspended") await this.ctx.resume();
    this.audioEl.currentTime = 0;
    await this.audioEl.play();
  }

  stop() {
    if (!this.audioEl) return;
    this.audioEl.pause();
  }

  getLevels() {
    if (!this.analyser) return null;
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }
}
