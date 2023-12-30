import stringHash from 'string-hash';
import chroma from 'chroma-js';

export function generateColor(seed: string = 'SomeColor') {
  let colorHex = generateValidColor(seed);

  const isDarkColor = chroma(colorHex).luminance() < 0.2;

  return isDarkColor ? chroma(colorHex).brighten(2).hex() : colorHex;
}

function generateValidColor(seed: string) {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    try {
      const hashValue = (stringHash(seed) + attempts) & 0x00ffffff;
      const colorHex = `#${hashValue.toString(16).toUpperCase()}`;

      if (/^#[0-9A-F]{6}$/i.test(colorHex)) {
        return colorHex;
      }
    } catch (error) {}

    attempts++;
  }

  return '#CCCCCC';
}
