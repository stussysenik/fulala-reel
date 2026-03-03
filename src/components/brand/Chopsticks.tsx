import React from "react";
import * as THREE from "three";
import { COLOR3 } from "../../config/brand";

interface ChopsticksProps {
  position?: [number, number, number];
  scale?: number;
  opacity?: number;
  spread?: number; // 0 = closed, 1 = open
  rotation?: number;
}

export const Chopsticks: React.FC<ChopsticksProps> = ({
  position = [0, 0, 0],
  scale = 1,
  opacity = 1,
  spread = 0.3,
  rotation = 0,
}) => {
  const length = 4 * scale;
  const thickness = 0.06 * scale;
  const angle = spread * 0.15; // radians

  return (
    <group position={position} rotation={[0, 0, rotation]}>
      {/* Left chopstick */}
      <mesh
        position={[-spread * 0.3, 0, 0.01]}
        rotation={[0, 0, angle]}
      >
        <boxGeometry args={[thickness, length, thickness]} />
        <meshStandardMaterial
          color={COLOR3.soyBrown}
          transparent
          opacity={opacity}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      {/* Right chopstick */}
      <mesh
        position={[spread * 0.3, 0, -0.01]}
        rotation={[0, 0, -angle]}
      >
        <boxGeometry args={[thickness, length, thickness]} />
        <meshStandardMaterial
          color={COLOR3.soyBrown}
          transparent
          opacity={opacity}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
};
