import * as THREE from "three";

/**
 * Creates a watercolor bleed material.
 * Procedural noise-based edge bleed between Fulala Red and Tiger Orange.
 */
export function createColorBleedMaterial(
  progress: number = 0,
  opacity: number = 0.4
): THREE.Material {
  const color = new THREE.Color("#E83636").lerp(
    new THREE.Color("#FCEBDC"),
    progress
  );

  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.NormalBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
  });

  return material;
}
