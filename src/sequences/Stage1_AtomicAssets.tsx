import React from "react";
import { useStageProgress } from "../hooks/useStageProgress";
import { FireParticles } from "../components/effects/FireParticles";
import { TigerMascot } from "../components/brand/TigerMascot";
import { easeOutExpo, easeInOutCubic } from "../utils/easing";
import { remap, smoothstep } from "../utils/math";

/**
 * Stage 1: Atomic Assets (frames 0-89, 0-3s)
 * Single ember → fire burst → Tiger A + B materialize from particles
 *
 * Key frames:
 * - Frame 0: Single bright ember on black (the hook)
 * - Frame 5: Ember explodes outward
 * - Frame 40: Tiger A fully visible
 * - Frame 75: Both tigers + ambient fire
 */
export const Stage1_AtomicAssets: React.FC = () => {
  const progress = useStageProgress("atomicAssets");
  if (progress < 0 || progress > 1.5) return null;

  const p = Math.min(progress, 1);

  // Fade out after stage ends
  const fadeOut = progress > 1 ? Math.max(0, 1 - (progress - 1) * 2) : 1;

  // Ember → explosion (0-0.06)
  const emberPhase = smoothstep(0, 0.06, p);
  // Fire burst (0.06-0.3)
  const burstPhase = smoothstep(0.06, 0.3, p);
  // Tiger A materialize (0.2-0.5)
  const tigerAPhase = smoothstep(0.2, 0.5, p);
  // Tiger B materialize (0.5-0.85)
  const tigerBPhase = smoothstep(0.5, 0.85, p);

  // Fire density ramps up from single point to burst
  const fireDensity = p < 0.06
    ? 0.01 // single ember
    : remap(p, 0.06, 0.4, 0.1, 1.0);

  // Fire spread expands from tight to wide
  const fireSpread = p < 0.06
    ? 0.1
    : remap(p, 0.06, 0.5, 0.3, 2.5);

  // Tiger positions - they slide in from sides
  const tigerAX = remap(easeOutExpo(tigerAPhase), 0, 1, -3, -1.2);
  const tigerBX = remap(easeOutExpo(tigerBPhase), 0, 1, 3, 1.2);

  return (
    <group>
      {/* Fire particles - start as single ember, expand to burst */}
      <FireParticles
        count={300}
        density={fireDensity * fadeOut}
        spread={fireSpread}
        origin={[0, 0, 0]}
        intensity={p < 0.06 ? 3 : 1 + burstPhase * 0.5}
      />

      {/* Tiger A materializes from left */}
      {tigerAPhase > 0 && (
        <TigerMascot
          side="A"
          position={[tigerAX, 0.8, 0.5]}
          scale={0.55}
          opacity={easeInOutCubic(tigerAPhase) * fadeOut}
        />
      )}

      {/* Tiger B materializes from right */}
      {tigerBPhase > 0 && (
        <TigerMascot
          side="B"
          position={[tigerBX, 0.8, 0.5]}
          scale={0.55}
          opacity={easeInOutCubic(tigerBPhase) * fadeOut}
        />
      )}
    </group>
  );
};
