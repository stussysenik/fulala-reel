import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import { STAGES, DURATION_FRAMES } from "../../config/timeline";
import { COLOR3 } from "../../config/brand";
import { smoothstep } from "../../utils/math";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = frame / DURATION_FRAMES;

  // Black → warm gradient (stage 2-4) → black
  const warmth = useMemo(() => {
    if (progress < 0.08) return smoothstep(0, 0.08, progress);
    if (progress > 0.83) return 1 - smoothstep(0.83, 1, progress);
    return 1;
  }, [progress]);

  const color = useMemo(() => {
    const c = new THREE.Color(0x000000);
    c.lerp(new THREE.Color(0x1a0800), warmth * 0.4);
    return c;
  }, [warmth]);

  return (
    <mesh position={[0, 0, -10]} scale={[30, 50, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
};
