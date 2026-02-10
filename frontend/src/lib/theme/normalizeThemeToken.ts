export function normalizeThemeToken(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;

  if (trimmed.startsWith('#')) {
    const hex = trimmed.replace('#', '');
    const normalized = hex.length === 3
      ? hex
          .split('')
          .map((char) => char + char)
          .join('')
      : hex;

    if (normalized.length !== 6) return trimmed;

    const r = parseInt(normalized.slice(0, 2), 16) / 255;
    const g = parseInt(normalized.slice(2, 4), 16) / 255;
    const b = parseInt(normalized.slice(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    if (delta !== 0) {
      if (max === r) h = ((g - b) / delta) % 6;
      else if (max === g) h = (b - r) / delta + 2;
      else h = (r - g) / delta + 4;
      h *= 60;
      if (h < 0) h += 360;
    }

    const l = (max + min) / 2;
    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    const hRounded = Math.round(h);
    const sRounded = Math.round(s * 100);
    const lRounded = Math.round(l * 100);

    return `${hRounded} ${sRounded}% ${lRounded}%`;
  }

  if (trimmed.startsWith('hsl(') && trimmed.endsWith(')')) {
    return trimmed.slice(4, -1);
  }

  return trimmed;
}
