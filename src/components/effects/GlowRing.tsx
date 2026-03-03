import React from "react";
import * as THREE from "three";

interface GlowRingProps {
  progress?: number; // 0 = tight, 1 = fully expanded
  opacity?: number;
  color?: string;
  position?: [number, number, number];
  maxRadius?: number;
}

export const GlowRing: React.FC<GlowRingProps> = ({
  progress = 0,
  opacity = 0.6,
  color = "#E83636",
  position = [0, 0, 0],
  maxRadius = 4,
}) => {
  const innerRadius = progress * maxRadius * 0.8;
  const outerRadius = progress * maxRadius;
  const ringOpacity = opacity * (1 - progress * 0.5);

  if (progress <= 0) return null;

  return (
    <group position={position}>
      {/* Main glow ring */}
      <mesh>
        <ringGeometry args={[innerRadius, outerRadius, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={ringOpacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      {/* Soft outer halo */}
      <mesh>
        <ringGeometry args={[outerRadius, outerRadius * 1.3, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={ringOpacity * 0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};
