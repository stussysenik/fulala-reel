import { useCurrentFrame } from "remotion";
import { STAGES, StageName } from "../config/timeline";
import { clamp } from "../utils/math";

/**
 * Returns 0-1 progress within a given stage.
 * Returns -1 if before stage, 2 if after stage (for convenience checks).
 */
export function useStageProgress(stage: StageName): number {
  const frame = useCurrentFrame();
  const { start, end } = STAGES[stage];

  if (frame < start) return -1;
  if (frame > end) return 2;

  return clamp((frame - start) / (end - start), 0, 1);
}

/**
 * Returns true if the current frame is within the given stage.
 */
export function useIsInStage(stage: StageName): boolean {
  const frame = useCurrentFrame();
  const { start, end } = STAGES[stage];
  return frame >= start && frame <= end;
}
