import stringHash from 'string-hash';
import chroma from 'chroma-js';

export function generateColor(seed: string) {
  const colorHex = `#${(stringHash(seed) & 0x00ffffff)
    .toString(16)
    .toUpperCase()}`;

  const isDarkColor = chroma(colorHex).luminance() < 0.2;

  return isDarkColor ? chroma(colorHex).brighten(2).hex() : colorHex;
}
