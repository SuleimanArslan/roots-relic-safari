class GameAudio {
  private ctx: AudioContext | null = null
  private enabled = true
  private initialized = false

  private getContext(): AudioContext | null {
    if (!this.enabled) return null
    if (!this.ctx) {
      try {
        this.ctx = new AudioContext()
      } catch {
        this.enabled = false
        return null
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  init() {
    if (this.initialized) return
    this.initialized = true
    this.getContext()
  }

  setEnabled(value: boolean) {
    this.enabled = value
    if (!value && this.ctx) {
      this.ctx.suspend()
    } else if (value) {
      this.getContext()
    }
  }

  getEnabled() { return this.enabled }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15, delay = 0) {
    const ctx = this.getContext()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay)
    gain.gain.setValueAtTime(volume, ctx.currentTime + delay)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime + delay)
    osc.stop(ctx.currentTime + delay + duration)
  }

  private playNoise(duration: number, volume = 0.08) {
    const ctx = this.getContext()
    if (!ctx) return
    const bufferSize = ctx.sampleRate * duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2)
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    source.connect(gain)
    gain.connect(ctx.destination)
    source.start()
  }

  playSwap() {
    this.playTone(440, 0.08, 'sine', 0.1)
    this.playTone(520, 0.08, 'sine', 0.08, 0.04)
  }

  playMatch(length: number) {
    const baseFreq = 400 + length * 50
    this.playTone(baseFreq, 0.15, 'triangle', 0.12)
    this.playTone(baseFreq * 1.25, 0.1, 'triangle', 0.08, 0.05)
    this.playTone(baseFreq * 1.5, 0.08, 'triangle', 0.06, 0.1)
  }

  playSpecial() {
    this.playTone(600, 0.2, 'sawtooth', 0.1)
    this.playTone(800, 0.15, 'sawtooth', 0.08, 0.08)
    this.playTone(1000, 0.1, 'sawtooth', 0.06, 0.15)
    this.playNoise(0.15, 0.06)
  }

  playCascade(count: number) {
    const base = 500 + count * 30
    this.playTone(base, 0.12, 'sine', 0.1)
    this.playTone(base * 1.3, 0.1, 'sine', 0.08, 0.06)
    this.playTone(base * 1.6, 0.08, 'sine', 0.06, 0.12)
  }

  playWin() {
    const notes = [523, 659, 784, 1047]
    notes.forEach((freq, i) => {
      this.playTone(freq, 0.3, 'sine', 0.12, i * 0.15)
    })
  }

  playLose() {
    const notes = [400, 350, 300, 250]
    notes.forEach((freq, i) => {
      this.playTone(freq, 0.25, 'sine', 0.1, i * 0.15)
    })
  }

  playClick() {
    this.playTone(800, 0.05, 'square', 0.06)
  }

  playStar() {
    this.playTone(880, 0.2, 'sine', 0.1)
    this.playTone(1100, 0.15, 'sine', 0.08, 0.1)
    this.playTone(1320, 0.1, 'sine', 0.06, 0.2)
  }

  playHeritage() {
    const notes = [392, 523, 659, 784, 1047]
    notes.forEach((freq, i) => {
      this.playTone(freq, 0.2, 'triangle', 0.1, i * 0.12)
    })
  }
}

export const gameAudio = new GameAudio()