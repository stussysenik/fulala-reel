export const INSTAGRAM = {
  width: 1080,
  height: 1920,
  aspectRatio: "9:16" as const,
  fps: 30,
  codec: "h264" as const,
  crf: 18,
  pixelFormat: "yuv420p" as const,
  maxFileSizeMB: 100,
  maxDurationSeconds: 90,
  recommendedBitrateMbps: 8,
} as const;
