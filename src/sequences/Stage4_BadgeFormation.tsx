import React from "react";
import { useStageProgress } from "../hooks/useStageProgress";
import { CircularBadge } from "../components/brand/CircularBadge";
import { GlowRing } from "../components/effects/GlowRing";
import { FireParticles } from "../components/effects/FireParticles";
import { SteamWisps } from "../components/effects/SteamWisps";
import { easeOutExpo, spring, easeInOutCubic } from "../utils/easing";
import { smoothstep, remap } from "../utils/math";

/**
 * Stage 4: Badge Formation (frames 210-299, 7-10s)
 * Circle draws, red ink-bleed fill, glow ring pulse, badge PNG reveal
 *
 * Key frames:
 * - Frame 255: Glow ring pulse (the payoff)
 * - Frame 285: Final badge with chopsticks
 */
export const Stage4_BadgeFormation: React.FC = () => {
  const progress = useStageProgress("badgeFormation");
  if (progress < 0 || progress > 1.5) return null;

  const p = Math.min(progress, 1);

  // Circle draws (0-0.3)
  const circleDrawPhase = smoothstep(0, 0.3, p);
  // Ink bleed fill (0.2-0.5)
  const inkFillPhase = smoothstep(0.2, 0.5, p);
  // Glow ring pulse (0.45-0.65) - the payoff moment
  const glowPulsePhase = smoothstep(0.45, 0.55, p) * (1 - smoothstep(0.55, 0.7, p));
  // Badge reveal (0.5-0.85)
  const badgeRevealPhase = smoothstep(0.5, 0.85, p);

  // Badge scale with spring overshoot
  const badgeScale = spring(badgeRevealPhase, 0.5, 3.5);

  // Fade out for transition
  const fadeOut = progress > 1 ? Math.max(0, 1 - (progress - 1) * 2) : 1;

  return (
    <group>
      {/* Background fire during badge formation */}
      <FireParticles
        count={200}
        density={0.6 + glowPulsePhase * 0.4}
        spread={3.5}
        origin={[0, -1, -1]}
        intensity={0.8 + glowPulsePhase}
      />

      {/* Rising steam */}
      <SteamWisps
        count={25}
        opacity={0.1 * fadeOut}
        origin={[0, -3, 0]}
      />

      {/* Circle drawing outline */}
      {circleDrawPhase > 0 && (
        <mesh position={[0, 0, 0.5]}>
          <ringGeometry
            args={[2.4, 2.55, 64, 1, 0, circleDrawPhase * Math.PI * 2]}
          />
          <meshBasicMaterial
            color="#E83636"
            transparent
            opacity={0.8 * fadeOut * (1 - badgeRevealPhase * 0.5)}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Ink bleed fill inside circle */}
      {inkFillPhase > 0 && (
        <mesh position={[0, 0, 0.4]}>
          <circleGeometry args={[2.4 * inkFillPhase, 64]} />
          <meshBasicMaterial
            color="#E83636"
            transparent
            opacity={0.3 * fadeOut * (1 - badgeRevealPhase * 0.8)}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Glow ring pulse - THE PAYOFF */}
      {glowPulsePhase > 0 && (
        <GlowRing
          progress={glowPulsePhase}
          opacity={0.9}
          color="#E83636"
          maxRadius={5}
          position={[0, 0, 0.3]}
        />
      )}

      {/* Badge reveal */}
      {badgeRevealPhase > 0 && (
        <CircularBadge
          position={[0, 0, 1]}
          scale={badgeScale * 0.9}
          opacity={easeInOutCubic(badgeRevealPhase) * fadeOut}
        />
      )}
    </group>
  );
};
