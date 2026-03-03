import React, { useCallback, useRef } from "react";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import { fireColorFromLife, fireOpacityFromLife } from "../../shaders/tsl/fireParticle";
import { seededRandom, noise2D } from "../../utils/math";

interface FireParticlesProps {
  count?: number;
  density?: number;
  origin?: [number, number, number];
  spread?: number;
  intensity?: number;
}

interface Particle {
  seed: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  velocityX: number;
  velocityY: number;
  lifeOffset: number;
  lifeSpeed: number;
  size: number;
}

function makeParticles(count: number, spread: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const seed = i * 7.31;
    return {
      seed,
      baseX: (seededRandom(seed) - 0.5) * spread,
      baseY: (seededRandom(seed + 1) - 0.5) * spread * 0.5,
      baseZ: (seededRandom(seed + 2) - 0.5) * spread * 0.3,
      velocityX: (seededRandom(seed + 3) - 0.5) * 0.02,
      velocityY: seededRandom(seed + 4) * 0.04 + 0.01,
      lifeOffset: seededRandom(seed + 5),
      lifeSpeed: seededRandom(seed + 6) * 0.5 + 0.5,
      size: seededRandom(seed + 7) * 0.08 + 0.02,
    };
  });
}

const _dummy = new THREE.Object3D();

function updateInstances(
  mesh: THREE.InstancedMesh,
  particles: Particle[],
  frame: number,
  count: number,
  activeCount: number,
  origin: [number, number, number],
  intensity: number
) {
  const time = frame / 30;

  for (let i = 0; i < count; i++) {
    const p = particles[i];

    if (i >= activeCount) {
      _dummy.position.set(0, -100, 0);
      _dummy.scale.set(0, 0, 0);
      _dummy.updateMatrix();
      mesh.setMatrixAt(i, _dummy.matrix);
      continue;
    }

    const life = (time * p.lifeSpeed + p.lifeOffset) % 1;
    const turbX = noise2D(time * 2 + p.seed, p.seed) * 0.3;
    const turbY = noise2D(p.seed, time * 2 + p.seed) * 0.2;

    const x = origin[0] + p.baseX + p.velocityX * life * 60 + turbX;
    const y = origin[1] + p.baseY + p.velocityY * life * 60 + turbY;
    const z = origin[2] + p.baseZ;

    const opacity = fireOpacityFromLife(life);
    const scale = p.size * intensity * (1 - life * 0.5) * opacity;

    _dummy.position.set(x, y, z);
    _dummy.scale.set(scale, scale, scale);
    _dummy.updateMatrix();
    mesh.setMatrixAt(i, _dummy.matrix);

    mesh.setColorAt(i, fireColorFromLife(life));
  }

  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
}

export const FireParticles: React.FC<FireParticlesProps> = ({
  count = 300,
  density = 1.0,
  origin = [0, 0, 0],
  spread = 2,
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const particlesRef = useRef<Particle[] | null>(null);

  if (!particlesRef.current || particlesRef.current.length !== count) {
    particlesRef.current = makeParticles(count, spread);
  }

  const activeCount = Math.floor(count * density);
  const particles = particlesRef.current;

  // Callback ref: fires immediately when the mesh mounts, and on every re-render
  const meshCallback = useCallback(
    (mesh: THREE.InstancedMesh | null) => {
      if (!mesh || !particles) return;
      updateInstances(mesh, particles, frame, count, activeCount, origin, intensity);
    },
    [frame, particles, count, activeCount, origin, intensity]
  );

  return (
    <instancedMesh ref={meshCallback} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </instancedMesh>
  );
};
