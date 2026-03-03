import React from "react";
import { useStageProgress } from "../hooks/useStageProgress";
import { CircularBadge } from "../components/brand/CircularBadge";
import { Chopsticks } from "../components/brand/Chopsticks";
import { FireParticles } from "../components/effects/FireParticles";
import { easeInExpo, easeOutExpo } from "../utils/easing";
import { smoothstep, remap } from "../utils/math";

/**
 * Stage 5: Boomerang Loop (frames 300-359, 10-12s)
 * Chopstick lift → noodles become fire → dissolve → single ember
 * Frame 359 must match frame 0 for seamless loop
 */
export const Stage5_BoomerangLoop: React.FC = () => {
  const progress = useStageProgress("boomerangLoop");
  if (progress < 0) return null;

  const p = Math.min(progress, 1);

  // Chopstick lift (0-0.3)
  const chopstickPhase = smoothstep(0, 0.3, p);
  // Badge still visible, fading (0-0.4)
  const badgeFade = 1 - smoothstep(0, 0.4, p);
  // Noodles → fire transition (0.2-0.5)
  const fireTransition = smoothstep(0.2, 0.5, p);
  // Everything dissolves (0.5-0.85)
  const dissolvePhase = smoothstep(0.5, 0.85, p);
  // Back to single ember (0.85-1.0)
  const emberPhase = smoothstep(0.85, 1.0, p);

  // Fire density: high → dissolve to single point
  const fireDensity = p < 0.5
    ? remap(p, 0, 0.5, 0.8, 1.0)
    : remap(p, 0.5, 1, 1.0, 0.01);

  // Fire spread collapses to center
  const fireSpread = p < 0.5
    ? 3
    : remap(p, 0.5, 1, 3, 0.1);

  // Chopstick Y position - lifts up
  const chopstickY = remap(easeOutExpo(chopstickPhase), 0, 1, 0, 2);
  const chopstickOpacity = 1 - smoothstep(0.4, 0.7, p);

  return (
    <group>
      {/* Fire particles - dissolving back to ember */}
      <FireParticles
        count={300}
        density={fireDensity}
        spread={fireSpread}
        origin={[0, 0, 0]}
        intensity={p < 0.85 ? 1 : 3 * (1 - emberPhase) + 3 * emberPhase}
      />

      {/* Fading badge */}
      {badgeFade > 0 && (
        <CircularBadge
          position={[0, 0, 1]}
          scale={0.9 * (1 - dissolvePhase * 0.3)}
          opacity={badgeFade}
        />
      )}

      {/* Chopsticks lifting */}
      {chopstickOpacity > 0 && (
        <Chopsticks
          position={[0.3, chopstickY, 1.5]}
          scale={0.8}
          opacity={chopstickOpacity}
          spread={0.3 + chopstickPhase * 0.4}
          rotation={-0.3}
        />
      )}
    </group>
  );
};
