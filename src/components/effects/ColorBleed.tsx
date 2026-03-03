import React, { useMemo } from "react";
import * as THREE from "three";
import { seededRandom } from "../../utils/math";

interface ColorBleedProps {
  progress?: number; // 0-1 how far the bleed has spread
  opacity?: number;
  position?: [number, number, number];
}

export const ColorBleed: React.FC<ColorBleedProps> = ({
  progress = 0,
  opacity = 0.3,
  position = [0, 0, -0.5],
}) => {
  // Generate irregular bleed blobs
  const blobs = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      x: (seededRandom(i * 5.5) - 0.5) * 3,
      y: (seededRandom(i * 5.5 + 1) - 0.5) * 4,
      size: seededRandom(i * 5.5 + 2) * 1.5 + 0.5,
      delay: seededRandom(i * 5.5 + 3) * 0.4, // stagger
      color: new THREE.Color("#E83636").lerp(
        new THREE.Color("#FCEBDC"),
        seededRandom(i * 5.5 + 4)
      ),
    }));
  }, []);

  if (progress <= 0) return null;

  return (
    <group position={position}>
      {blobs.map((blob, i) => {
        const blobProgress = Math.max(0, (progress - blob.delay) / (1 - blob.delay));
        if (blobProgress <= 0) return null;

        const scale = blob.size * blobProgress;
        const blobOpacity = opacity * Math.min(blobProgress * 2, 1) * (1 - blobProgress * 0.3);

        return (
          <mesh key={i} position={[blob.x, blob.y, 0]}>
            <circleGeometry args={[scale, 32]} />
            <meshBasicMaterial
              color={blob.color}
              transparent
              opacity={blobOpacity}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
};
