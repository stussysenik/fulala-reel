import React from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { staticFile } from "remotion";

interface CircularBadgeProps {
  position?: [number, number, number];
  scale?: number;
  opacity?: number;
  rotation?: number;
}

export const CircularBadge: React.FC<CircularBadgeProps> = ({
  position = [0, 0, 0],
  scale = 1,
  opacity = 1,
  rotation = 0,
}) => {
  const texture = useTexture(staticFile("assets/fulala-badge.png"));
  texture.colorSpace = THREE.SRGBColorSpace;

  const radius = 2.5 * scale;

  return (
    <mesh position={position} rotation={[0, 0, rotation]}>
      <circleGeometry args={[radius, 64]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  );
};
