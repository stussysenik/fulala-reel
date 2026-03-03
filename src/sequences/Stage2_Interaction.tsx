import React from "react";
import * as THREE from "three";
import { useStageProgress } from "../hooks/useStageProgress";
import { FireParticles } from "../components/effects/FireParticles";
import { TigerMascot } from "../components/brand/TigerMascot";
import { ColorBleed } from "../components/effects/ColorBleed";
import { SteamWisps } from "../components/effects/SteamWisps";
import { easeInOutCubic } from "../utils/easing";

/**
 * Stage 2: Interaction (frames 90-149, 3-5s)
 * Tigers orbit center, luminous noodle-strand connections, color bleed
 */
export const Stage2_Interaction: React.FC = () => {
  const progress = useStageProgress("interaction");
  if (progress < 0 || progress > 1.5) return null;

  const p = Math.min(progress, 1);

  // Tigers orbit around center
  const orbitAngle = p * Math.PI * 0.6; // partial orbit
  const orbitRadius = 1.5;
  const tigerAX = Math.cos(orbitAngle + Math.PI) * orbitRadius;
  const tigerAY = Math.sin(orbitAngle + Math.PI) * orbitRadius * 0.3 + 0.8;
  const tigerBX = Math.cos(orbitAngle) * orbitRadius;
  const tigerBY = Math.sin(orbitAngle) * orbitRadius * 0.3 + 0.8;

  // Color bleed spreads during this stage
  const bleedProgress = easeInOutCubic(p);

  // Fade out tigers and effects at end of stage
  const fadeOut = progress > 1 ? Math.max(0, 1 - (progress - 1) * 2) : 1;

  return (
    <group>
      {/* Ambient fire */}
      <FireParticles
        count={200}
        density={0.5 * fadeOut}
        spread={3}
        origin={[0, -0.5, 0]}
        intensity={0.7}
      />

      {/* Color bleed effect */}
      <ColorBleed
        progress={bleedProgress}
        opacity={0.25 * fadeOut}
      />

      {/* Steam wisps rising */}
      <SteamWisps
        count={30}
        opacity={0.12 * fadeOut}
        origin={[0, -2, 0]}
      />

      {/* Orbiting Tiger A */}
      <TigerMascot
        side="A"
        position={[tigerAX, tigerAY, 0.5]}
        scale={0.5}
        opacity={fadeOut}
        rotation={Math.sin(orbitAngle) * 0.1}
      />

      {/* Orbiting Tiger B */}
      <TigerMascot
        side="B"
        position={[tigerBX, tigerBY, 0.5]}
        scale={0.5}
        opacity={fadeOut}
        rotation={-Math.sin(orbitAngle) * 0.1}
      />

      {/* Luminous noodle-strand connections between tigers */}
      <NoodleStrands
        from={[tigerAX, tigerAY, 0.5]}
        to={[tigerBX, tigerBY, 0.5]}
        progress={p}
        opacity={0.4 * fadeOut}
      />
    </group>
  );
};

// Simple glowing lines connecting the tigers
const NoodleStrands: React.FC<{
  from: [number, number, number];
  to: [number, number, number];
  progress: number;
  opacity: number;
}> = ({ from, to, progress, opacity }) => {
  if (progress <= 0 || opacity <= 0) return null;

  const strands = 5;
  return (
    <group>
      {Array.from({ length: strands }, (_, i) => {
        const t = i / (strands - 1);
        const yOffset = (t - 0.5) * 0.8;
        const midX = (from[0] + to[0]) / 2;
        const midY = (from[1] + to[1]) / 2 + yOffset + Math.sin(progress * Math.PI * 2 + i) * 0.2;

        // Simple line as thin stretched mesh
        const dx = to[0] - from[0];
        const dy = to[1] - from[1];
        const length = Math.sqrt(dx * dx + dy * dy) * progress;
        const angle = Math.atan2(dy + yOffset * 0.5, dx);

        return (
          <mesh
            key={i}
            position={[midX, midY, 0.3]}
            rotation={[0, 0, angle]}
          >
            <planeGeometry args={[length, 0.02]} />
            <meshBasicMaterial
              color="#FCEBDC"
              transparent
              opacity={opacity * (0.5 + t * 0.5)}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
};
