import { clamp } from "./math";

export function easeInOutCubic(t: number): number {
  t = clamp(t, 0, 1);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutExpo(t: number): number {
  t = clamp(t, 0, 1);
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function easeInExpo(t: number): number {
  t = clamp(t, 0, 1);
  return t === 0 ? 0 : Math.pow(2, 10 * t - 10);
}

export function easeOutBack(t: number): number {
  t = clamp(t, 0, 1);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export function spring(
  t: number,
  damping: number = 0.5,
  frequency: number = 3.5
): number {
  t = clamp(t, 0, 1);
  return (
    1 - Math.exp(-damping * t * 10) * Math.cos(frequency * t * Math.PI * 2)
  );
}

export function bounce(t: number): number {
  t = clamp(t, 0, 1);
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
}

export function overshoot(t: number, amount: number = 1.5): number {
  t = clamp(t, 0, 1);
  return 1 + (amount + 1) * Math.pow(t - 1, 3) + amount * Math.pow(t - 1, 2);
}
