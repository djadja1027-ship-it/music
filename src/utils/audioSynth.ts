// Web Audio API Synthesizer for Classical Motifs

let audioCtx: AudioContext | null = null;
let currentOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
let melodyTimeoutId: number | null = null;

// Frequencies map for notes in octaves 4 and 5
export const NOTE_FREQS: Record<string, number> = {
  'C4': 261.63, 'C#4': 277.18, 'Db4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'Eb4': 311.13,
  'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'Gb4': 369.99, 'G4': 392.00, 'G#4': 415.30,
  'Ab4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'Bb4': 466.16, 'B4': 493.88,
  
  'C5': 523.25, 'C#5': 554.37, 'Db5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'Eb5': 622.25,
  'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'Gb5': 739.99, 'G5': 783.99, 'G#5': 830.61,
  'Ab5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'Bb5': 932.33, 'B5': 987.77,
  
  'C6': 1046.50
};

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a single note immediately
 * @param noteName Note key like 'C4', 'E4', 'G#4'
 * @param type Oscillator type: 'sine' | 'square' | 'sawtooth' | 'triangle'
 * @param duration Duration in seconds
 */
export function playNote(noteName: string, type: OscillatorType = 'sine', duration: number = 0.5): void {
  try {
    const ctx = getAudioContext();
    const freq = NOTE_FREQS[noteName];
    if (!freq) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Warm envelope
    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05); // quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration); // decay

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (error) {
    console.error('Error playing note:', error);
  }
}

export function stopAllSounds(): void {
  if (melodyTimeoutId !== null) {
    clearTimeout(melodyTimeoutId);
    melodyTimeoutId = null;
  }
  currentOscillators.forEach(({ osc, gain }) => {
    try {
      osc.stop();
      osc.disconnect();
      gain.disconnect();
    } catch (e) {
      // already stopped
    }
  });
  currentOscillators = [];
}

/**
 * Play a sequence of notes
 * @param notes Array of MelodyNote
 * @param bpm Beats Per Minute
 * @param onNoteActive Callback triggered when a new note starts playing, passes current note index
 * @param onFinished Callback triggered when melody completes
 */
export function playMelody(
  notes: { note: string; duration: number }[],
  bpm: number,
  onNoteActive: (index: number) => void,
  onFinished: () => void
): void {
  stopAllSounds();
  
  const ctx = getAudioContext();
  const secondsPerBeat = 60 / bpm;
  let currentIndex = 0;

  function playNext() {
    if (currentIndex >= notes.length) {
      onFinished();
      return;
    }

    const item = notes[currentIndex];
    const duration = item.duration * secondsPerBeat;

    onNoteActive(currentIndex);

    const freq = NOTE_FREQS[item.note];
    if (freq) {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // We'll use a blend of sine and triangle for a pleasant warm flute/bell tone
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Sweet organ/woodwind style envelope
      gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration - 0.02);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);

      const oscRef = { osc, gain: gainNode };
      currentOscillators.push(oscRef);
      
      // Clean up reference after finish
      setTimeout(() => {
        const idx = currentOscillators.indexOf(oscRef);
        if (idx > -1) currentOscillators.splice(idx, 1);
      }, duration * 1000);
    }

    currentIndex++;
    melodyTimeoutId = window.setTimeout(playNext, duration * 1000);
  }

  playNext();
}

/**
 * Play a standard positive success sound effect
 */
export function playSuccessSound(): void {
  const notes = ['C5', 'E5', 'G5', 'C6'];
  notes.forEach((note, idx) => {
    setTimeout(() => {
      playNote(note, 'sine', 0.4);
    }, idx * 100);
  });
}

/**
 * Play a standard failure sound effect
 */
export function playFailureSound(): void {
  const notes = ['Eb4', 'D4', 'C#4'];
  notes.forEach((note, idx) => {
    setTimeout(() => {
      playNote(note, 'triangle', 0.5);
    }, idx * 150);
  });
}

/**
 * Play a cheerful bell notification chime
 */
export function playChimeSound(): void {
  const notes = ['G5', 'C6'];
  notes.forEach((note, idx) => {
    setTimeout(() => {
      playNote(note, 'sine', 0.3);
    }, idx * 120);
  });
}
