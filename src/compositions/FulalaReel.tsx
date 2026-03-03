import React, { Suspense } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { WebGPUCanvas } from "../components/scene/WebGPUCanvas";
import { LightingRig } from "../components/scene/LightingRig";
import { CameraRig } from "../components/scene/CameraRig";
import { Background } from "../components/scene/Background";
import { Stage1_AtomicAssets } from "../sequences/Stage1_AtomicAssets";
import { Stage2_Interaction } from "../sequences/Stage2_Interaction";
import { Stage3_Synthesis } from "../sequences/Stage3_Synthesis";
import { Stage4_BadgeFormation } from "../sequences/Stage4_BadgeFormation";
import { Stage5_BoomerangLoop } from "../sequences/Stage5_BoomerangLoop";
import { DURATION_FRAMES } from "../config/timeline";
import { smoothstep } from "../utils/math";

/**
 * Main Fulala Reel composition.
 * 1080x1920, 30fps, 360 frames (12s), seamless loop.
 *
 * Orchestrates all 5 stages with cross-fading transitions.
 */
export const FulalaReel: React.FC = () => {
  const frame = useCurrentFrame();

  // Global lighting intensity varies with animation
  const lightIntensity =
    frame < 15 ? smoothstep(0, 15, frame) * 0.5 + 0.5 : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <Suspense
        fallback={
          <AbsoluteFill
            style={{
              backgroundColor: "#000000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#E83636",
              fontSize: 24,
              fontFamily: "monospace",
            }}
          >
            Loading...
          </AbsoluteFill>
        }
      >
        <WebGPUCanvas>
          <CameraRig />
          <LightingRig intensity={lightIntensity} />
          <Background />

          {/* All stages render simultaneously - each handles own visibility */}
          <Stage1_AtomicAssets />
          <Stage2_Interaction />
          <Stage3_Synthesis />
          <Stage4_BadgeFormation />
          <Stage5_BoomerangLoop />
        </WebGPUCanvas>
      </Suspense>
    </AbsoluteFill>
  );
};
