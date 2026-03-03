export const FPS = 30;
export const DURATION_FRAMES = 360;
export const DURATION_SECONDS = DURATION_FRAMES / FPS; // 12s

export const STAGES = {
  atomicAssets: { start: 0, end: 89, label: "Atomic Assets" },
  interaction: { start: 90, end: 149, label: "Interaction" },
  synthesis: { start: 150, end: 209, label: "Synthesis" },
  badgeFormation: { start: 210, end: 299, label: "Badge Formation" },
  boomerangLoop: { start: 300, end: 359, label: "Boomerang Loop" },
} as const;

export type StageName = keyof typeof STAGES;

export const KEY_FRAMES = {
  singleEmber: 0,
  emberExplode: 5,
  tigerAVisible: 40,
  bothTigers: 75,
  spiralFlash: 150,
  glowRingPulse: 255,
  finalBadge: 285,
  backToEmber: 359,
} as const;

// Fire particle density per stage (0-1)
export const FIRE_DENSITY: Record<StageName, [number, number]> = {
  atomicAssets: [0.0, 1.0],   // ramp up from ember to full burst
  interaction: [0.5, 0.5],    // medium ambient
  synthesis: [0.2, 0.9],      // low then spike at flash
  badgeFormation: [0.8, 0.8], // high glow pulse
  boomerangLoop: [1.0, 0.0],  // high then dissolve to single ember
};
