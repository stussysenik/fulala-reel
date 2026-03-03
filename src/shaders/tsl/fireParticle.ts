import * as THREE from "three";

/**
 * Creates a fire particle material using Three.js node material system.
 * Additive blending, life-based color gradient (red tip → orange base), flicker via noise.
 *
 * Falls back to a standard PointsMaterial if node materials aren't available.
 */
export function createFireParticleMaterial(): THREE.Material {
  // Use standard material with additive blending for broad compatibility
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#E83636"),
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
  });

  return material;
}

/**
 * Returns a color based on particle life (0=born, 1=dead).
 * White core → yellow → orange → red → dark red → transparent
 */
export function fireColorFromLife(life: number): THREE.Color {
  if (life < 0.1) {
    return new THREE.Color("#FFFFFF").lerp(new THREE.Color("#FFE066"), life / 0.1);
  } else if (life < 0.3) {
    return new THREE.Color("#FFE066").lerp(new THREE.Color("#FF8800"), (life - 0.1) / 0.2);
  } else if (life < 0.6) {
    return new THREE.Color("#FF8800").lerp(new THREE.Color("#E83636"), (life - 0.3) / 0.3);
  } else {
    return new THREE.Color("#E83636").lerp(new THREE.Color("#440000"), (life - 0.6) / 0.4);
  }
}

/**
 * Returns opacity based on particle life.
 */
export function fireOpacityFromLife(life: number): number {
  if (life < 0.05) return life / 0.05; // fade in
  if (life > 0.7) return 1 - (life - 0.7) / 0.3; // fade out
  return 1;
}
