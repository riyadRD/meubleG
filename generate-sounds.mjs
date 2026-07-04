// generate-sounds.mjs
// Run: node generate-sounds.mjs
// Creates /public/sounds/order.wav and /public/sounds/message.wav

import { writeFileSync, mkdirSync } from 'fs'

function createWav(sampleRate, durationSecs, generateSample) {
  const numSamples = Math.floor(sampleRate * durationSecs)
  const dataBytes  = numSamples * 2          // 16-bit = 2 bytes per sample
  const buffer     = Buffer.alloc(44 + dataBytes)

  // ── RIFF header ──────────────────────────────────────────────────────────
  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(36 + dataBytes, 4)    // total file size - 8
  buffer.write('WAVE', 8)

  // ── fmt chunk ────────────────────────────────────────────────────────────
  buffer.write('fmt ', 12)
  buffer.writeUInt32LE(16,             16)   // chunk size
  buffer.writeUInt16LE(1,              20)   // PCM
  buffer.writeUInt16LE(1,              22)   // mono
  buffer.writeUInt32LE(sampleRate,     24)
  buffer.writeUInt32LE(sampleRate * 2, 28)   // byteRate = sampleRate * channels * bps/8
  buffer.writeUInt16LE(2,              32)   // blockAlign
  buffer.writeUInt16LE(16,             34)   // bitsPerSample

  // ── data chunk ───────────────────────────────────────────────────────────
  buffer.write('data', 36)
  buffer.writeUInt32LE(dataBytes, 40)

  for (let i = 0; i < numSamples; i++) {
    const t      = i / sampleRate
    const sample = generateSample(t)
    const clamped = Math.max(-1, Math.min(1, sample))
    buffer.writeInt16LE(Math.floor(clamped * 32767), 44 + i * 2)
  }

  return buffer
}

mkdirSync('./public/sounds', { recursive: true })

// ── Order chime: two ascending notes (880 Hz → 1100 Hz) ──────────────────
const orderWav = createWav(44100, 1.0, (t) => {
  if (t < 0.45) {
    const env = Math.exp(-t * 5)
    return 0.5 * Math.sin(2 * Math.PI * 880 * t) * env
  } else {
    const t2  = t - 0.45
    const env = Math.exp(-t2 * 6)
    return 0.45 * Math.sin(2 * Math.PI * 1100 * t2) * env
  }
})
writeFileSync('./public/sounds/order.wav', orderWav)
console.log('✅ Created public/sounds/order.wav')

// ── Message bell: single warm bell (660 Hz with harmonic) ────────────────
const messageWav = createWav(44100, 1.2, (t) => {
  const env = Math.exp(-t * 3.5)
  const fundamental = Math.sin(2 * Math.PI * 660 * t)
  const harmonic    = 0.3 * Math.sin(2 * Math.PI * 1320 * t)
  return 0.45 * (fundamental + harmonic) * env
})
writeFileSync('./public/sounds/message.wav', messageWav)
console.log('✅ Created public/sounds/message.wav')

console.log('\nDone. Sound files ready in public/sounds/')
