import { midiToFrequency } from "../core/music.js";

export function createTargetTonePlayer(AudioContextClass = window.AudioContext || window.webkitAudioContext) {
  let audioContext = null;

  return {
    play(target) {
      if (!target || target.midi === null) {
        return;
      }

      audioContext ??= new AudioContextClass();

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const now = audioContext.currentTime;

      oscillator.type = "sine";
      oscillator.frequency.value = midiToFrequency(target.midi);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.75);
    },
  };
}
