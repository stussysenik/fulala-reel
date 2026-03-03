import React from "react";
import { useCurrentFrame } from "remotion";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { DURATION_FRAMES } from "../../config/timeline";
import { remap, clamp } from "../../utils/math";

export const CameraRig: React.FC = () => {
  const frame = useCurrentFrame();

  const progress = frame / DURATION_FRAMES;

  // FOV animation: 30 → 50 → 40 → 30 over 12s
  let fov: number;
  if (progress < 0.25) {
    fov = remap(progress, 0, 0.25, 30, 50);
  } else if (progress < 0.58) {
    fov = remap(progress, 0.25, 0.58, 50, 40);
  } else {
    fov = remap(progress, 0.58, 1, 40, 30);
  }
  fov = clamp(fov, 30, 50);

  useFrame(({ camera }) => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.position.set(0, 0, 8);
      camera.fov = fov;
      camera.near = 0.1;
      camera.far = 100;
      camera.updateProjectionMatrix();
    }
  });

  return null;
};
