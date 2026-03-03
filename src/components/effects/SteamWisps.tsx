import React, { useCallback, useRef } from "react";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import { seededRandom, noise2D } from "../../utils/math";

interface SteamWispsProps {
  count?: number;
  opacity?: number;
  origin?: [number, number, number];
}

interface Wisp {
  seed: number;
  offsetX: number;
  speed: number;
  size: number;
  phaseOffset: number;
}

function makeWisps(count: number): Wisp[] {
  return Array.from({ length: count }, (_, i) => ({
    seed: i * 13.37,
    offsetX: (seededRandom(i * 13.37) - 0.5) * 2,
    speed: seededRandom(i * 13.37 + 1) * 0.3 + 0.2,
    size: seededRandom(i * 13.37 + 2) * 0.3 + 0.15,
    phaseOffset: seededRandom(i * 13.37 + 3),
  }));
}

const _dummy = new THREE.Object3D();

function updateWispInstances(
  mesh: THREE.InstancedMesh,
  wisps: Wisp[],
  frame: number,
  count: number,
  origin: [number, number, number]
) {
  const time = frame / 30;

  for (let i = 0; i < count; i++) {
    const w = wisps[i];
    const life = (time * w.speed + w.phaseOffset) % 1;

    const x = origin[0] + w.offsetX + noise2D(time + w.seed, w.seed) * 0.5;
    const y = origin[1] + life * 4;
    const z = origin[2] + noise2D(w.seed, time + w.seed) * 0.3;

    const fadeIn = Math.min(life / 0.1, 1);
    const fadeOut = Math.max(1 - (life - 0.6) / 0.4, 0);
    const alpha = fadeIn * fadeOut;
    const scale = w.size * (1 + life * 2) * alpha;

    _dummy.position.set(x, y, z);
    _dummy.scale.set(scale, scale * 1.5, scale);
    _dummy.updateMatrix();
    mesh.setMatrixAt(i, _dummy.matrix);
  }

  mesh.instanceMatrix.needsUpdate = true;
}

export const SteamWisps: React.FC<SteamWispsProps> = ({
  count = 40,
  opacity = 0.15,
  origin = [0, -1, 0],
}) => {
  const frame = useCurrentFrame();
  const wispsRef = useRef<Wisp[] | null>(null);

  if (!wispsRef.current || wispsRef.current.length !== count) {
    wispsRef.current = makeWisps(count);
  }

  const wisps = wispsRef.current;

  const meshCallback = useCallback(
    (mesh: THREE.InstancedMesh | null) => {
      if (!mesh || !wisps) return;
      updateWispInstances(mesh, wisps, frame, count, origin);
    },
    [frame, wisps, count, origin]
  );

  return (
    <instancedMesh ref={meshCallback} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color="#FFFFFF"
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </instancedMesh>
  );
};
