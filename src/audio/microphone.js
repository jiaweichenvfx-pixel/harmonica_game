import { detectPitchAutocorrelation } from "./pitch-detector.js";

export async function createMicrophonePitchSource(onPitch) {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
    },
  });

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContextClass();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 4096;
  source.connect(analyser);

  const buffer = new Float32Array(analyser.fftSize);
  let animationFrame = null;
  let running = true;

  const tick = () => {
    if (!running) {
      return;
    }

    analyser.getFloatTimeDomainData(buffer);
    onPitch(detectPitchAutocorrelation(buffer, audioContext.sampleRate));
    animationFrame = requestAnimationFrame(tick);
  };

  tick();

  return {
    stop() {
      running = false;
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
      stream.getTracks().forEach((track) => track.stop());
      void audioContext.close();
    },
  };
}
