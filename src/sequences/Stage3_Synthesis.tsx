import React from "react";
import { useStageProgress } from "../hooks/useStageProgress";
import { FireParticles } from "../components/effects/FireParticles";
import { GlowRing } from "../components/effects/GlowRing";
import { spring } from "../utils/easing";
import { smoothstep, remap } from "../utils/math";
import * as THREE from "three";

/**
 * Stage 3: Synthesis (frames 150-209, 5-7s)
 * Spiral collapse → flash → FULALA wordmark extrudes, bowl draws
 *
 * Key frame: 150 = spiral collapse flash
 */
export const Stage3_Synthesis: React.FC = () => {
  const progress = useStageProgress("synthesis");
  if (progress < 0 || progress > 1.5) return null;

  const p = Math.min(progress, 1);

  // Spiral collapse (0-0.4)
  const collapsePhase = smoothstep(0, 0.4, p);
  // Flash (0.35-0.5)
  const flashPhase = p >= 0.35 && p <= 0.55 ? smoothstep(0.35, 0.45, p) * (1 - smoothstep(0.45, 0.55, p)) : 0;
  // Wordmark reveal (0.5-0.8)
  const wordmarkPhase = smoothstep(0.5, 0.8, p);
  // Bowl draw (0.6-0.95)
  const bowlPhase = smoothstep(0.6, 0.95, p);

  // Fire ramps down then spikes at flash
  const fireDensity = p < 0.35
    ? remap(p, 0, 0.35, 0.5, 0.1)
    : p < 0.5
    ? remap(p, 0.35, 0.5, 0.1, 0.9)
    : remap(p, 0.5, 1, 0.9, 0.3);

  // Collapse rotation
  const spiralRotation = collapsePhase * Math.PI * 4;
  const collapseScale = 1 - collapsePhase * 0.7;

  // Fade for transition
  const fadeOut = progress > 1 ? Math.max(0, 1 - (progress - 1) * 2) : 1;

  return (
    <group>
      {/* Collapsing fire particles */}
      <group rotation={[0, 0, spiralRotation]} scale={collapseScale}>
        <FireParticles
          count={200}
          density={fireDensity * fadeOut}
          spread={2 * collapseScale}
          origin={[0, 0, 0]}
          intensity={1 + flashPhase * 2}
        />
      </group>

      {/* Flash glow ring */}
      {flashPhase > 0 && (
        <GlowRing
          progress={flashPhase}
          opacity={flashPhase * 0.8}
          color="#FFFFFF"
          maxRadius={6}
        />
      )}

      {/* FULALA wordmark */}
      {wordmarkPhase > 0 && (
        <FulalaWordmark
          progress={spring(wordmarkPhase, 0.6, 3)}
          opacity={fadeOut}
        />
      )}

      {/* Bowl outline */}
      {bowlPhase > 0 && (
        <BowlOutline
          progress={bowlPhase}
          opacity={fadeOut}
        />
      )}
    </group>
  );
};

// FULALA text as a simple mesh (no 3D font dependency)
const FulalaWordmark: React.FC<{ progress: number; opacity: number }> = ({
  progress,
  opacity,
}) => {
  const scaleY = progress;
  const scaleX = Math.min(progress * 1.2, 1);

  return (
    <group position={[0, 1.5, 1]} scale={[scaleX, scaleY, 1]}>
      {/* Simulated text using rectangles for "FULALA" */}
      {["F", "U", "L", "A", "L", "A"].map((_, i) => (
        <mesh key={i} position={[(i - 2.5) * 0.55, 0, 0]}>
          <boxGeometry args={[0.4, 0.6, 0.08]} />
          <meshStandardMaterial
            color="#E83636"
            emissive="#E83636"
            emissiveIntensity={0.3 * progress}
            transparent
            opacity={opacity * progress}
            metalness={0.2}
            roughness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
};

// Simple bowl arc outline
const BowlOutline: React.FC<{ progress: number; opacity: number }> = ({
  progress,
  opacity,
}) => {
  const thetaLength = progress * Math.PI;

  return (
    <mesh position={[0, -0.5, 1]} rotation={[0, 0, Math.PI]}>
      <ringGeometry args={[1.2, 1.3, 32, 1, 0, thetaLength]} />
      <meshBasicMaterial
        color="#FCEBDC"
        transparent
        opacity={opacity * 0.8}
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
};
