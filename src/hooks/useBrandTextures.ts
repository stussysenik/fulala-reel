import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { staticFile } from "remotion";

// UV crop regions for extracting tigers from banner (4096x1223)
// Tiger A (left): sits at ~0-18% of width
// Tiger B (right): sits at ~82-100% of width
export const TIGER_A_UV = { x: 0.0, y: 0.1, w: 0.18, h: 0.8 };
export const TIGER_B_UV = { x: 0.82, y: 0.1, w: 0.18, h: 0.8 };

export function useBrandTextures() {
  const bannerPath = staticFile("assets/fulala-banner.png");
  const badgePath = staticFile("assets/fulala-badge.png");

  const bannerTexture = useTexture(bannerPath);
  const badgeTexture = useTexture(badgePath);

  useMemo(() => {
    bannerTexture.colorSpace = THREE.SRGBColorSpace;
    badgeTexture.colorSpace = THREE.SRGBColorSpace;
    badgeTexture.minFilter = THREE.LinearFilter;
    badgeTexture.magFilter = THREE.LinearFilter;
  }, [bannerTexture, badgeTexture]);

  return { bannerTexture, badgeTexture };
}

export function useTigerTexture(side: "A" | "B") {
  const bannerPath = staticFile("assets/fulala-banner.png");
  const texture = useTexture(bannerPath);

  return useMemo(() => {
    const cloned = texture.clone();
    cloned.colorSpace = THREE.SRGBColorSpace;
    const uv = side === "A" ? TIGER_A_UV : TIGER_B_UV;
    cloned.offset.set(uv.x, uv.y);
    cloned.repeat.set(uv.w, uv.h);
    cloned.wrapS = THREE.ClampToEdgeWrapping;
    cloned.wrapT = THREE.ClampToEdgeWrapping;
    return cloned;
  }, [texture, side]);
}
