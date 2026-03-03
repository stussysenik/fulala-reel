import * as THREE from "three";

/**
 * Creates an expanding glow ring material.
 * Used in Stage 4 badge reveal.
 */
export function createGlowPulseMaterial(
  color: THREE.Color = new THREE.Color("#E83636"),
  opacity: number = 0.6
): THREE.Material {
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
  });

  return material;
}
