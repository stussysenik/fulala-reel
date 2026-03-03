import React, { useMemo } from "react";
import * as THREE from "three";
import { useTigerTexture } from "../../hooks/useBrandTextures";
import { COLOR3 } from "../../config/brand";

interface TigerMascotProps {
  side: "A" | "B";
  position?: [number, number, number];
  scale?: number;
  opacity?: number;
  rotation?: number;
}

export const TigerMascot: React.FC<TigerMascotProps> = ({
  side,
  position = [0, 0, 0],
  scale = 1,
  opacity = 1,
  rotation = 0,
}) => {
  const texture = useTigerTexture(side);

  const radius = 1.4 * scale;

  return (
    <group position={position} rotation={[0, 0, rotation]}>
      {/* Warm background disc to blend white banner background */}
      <mesh position={[0, 0, -0.01]}>
        <circleGeometry args={[radius * 1.05, 48]} />
        <meshBasicMaterial
          color={COLOR3.tigerOrange}
          transparent
          opacity={opacity * 0.9}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {/* Tiger texture on circular geometry */}
      <mesh>
        <circleGeometry args={[radius, 48]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
      {/* Subtle glow ring around the medallion */}
      <mesh position={[0, 0, -0.02]}>
        <ringGeometry args={[radius, radius * 1.15, 48]} />
        <meshBasicMaterial
          color={COLOR3.fulalaRed}
          transparent
          opacity={opacity * 0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};
