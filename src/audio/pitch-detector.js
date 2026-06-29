export function detectPitchAutocorrelation(buffer, sampleRate, options = {}) {
  const minFrequency = options.minFrequency ?? 70;
  const maxFrequency = options.maxFrequency ?? 1000;
  const rmsThreshold = options.rmsThreshold ?? 0.004;
  const minLag = Math.floor(sampleRate / maxFrequency);
  const maxLag = Math.floor(sampleRate / minFrequency);

  let rms = 0;
  let peak = 0;
  for (let i = 0; i < buffer.length; i += 1) {
    rms += buffer[i] * buffer[i];
    peak = Math.max(peak, Math.abs(buffer[i]));
  }
  rms = Math.sqrt(rms / buffer.length);

  if (rms < rmsThreshold) {
    return {
      frequency: null,
      confidence: 0,
      peak,
      rms,
    };
  }

  const correlations = [];

  for (let lag = minLag; lag <= maxLag; lag += 1) {
    let correlation = 0;
    for (let i = 0; i < buffer.length - lag; i += 1) {
      correlation += buffer[i] * buffer[i + lag];
    }
    correlation /= buffer.length - lag;
    correlations[lag] = correlation / Math.max(rms * rms, 0.000001);
  }

  let bestLag = -1;
  let bestCorrelation = 0;

  for (let lag = minLag + 1; lag < maxLag - 1; lag += 1) {
    const previous = correlations[lag - 1] ?? 0;
    const current = correlations[lag] ?? 0;
    const next = correlations[lag + 1] ?? 0;
    const isPeak = current >= previous && current >= next;

    if (isPeak && current >= 0.75) {
      bestLag = lag;
      bestCorrelation = current;
      break;
    }

    if (current > bestCorrelation) {
      bestLag = lag;
      bestCorrelation = current;
    }
  }

  if (bestLag <= 0 || bestCorrelation < 0.35) {
    return {
      frequency: null,
      confidence: 0,
      peak,
      rms,
    };
  }

  return {
    frequency: sampleRate / bestLag,
    confidence: Math.min(1, bestCorrelation),
    peak,
    rms,
  };
}
