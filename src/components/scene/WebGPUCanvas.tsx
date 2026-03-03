import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useVideoConfig } from "remotion";
import * as THREE from "three";

interface WebGPUCanvasProps {
  children: React.ReactNode;
}

export const WebGPUCanvas: React.FC<WebGPUCanvasProps> = ({ children }) => {
  const { width, height } = useVideoConfig();

  return (
    <ThreeCanvas
      width={width}
      height={height}
      orthographic={false}
      gl={async (props: any) => {
        try {
          // Dynamic import to avoid bundling issues when WebGPU not available
          const { WebGPURenderer } = await import("three/webgpu");
          const renderer = new WebGPURenderer({
            ...props,
            antialias: true,
          });
          await renderer.init();
          return renderer;
        } catch {
          return new THREE.WebGLRenderer({
            ...props,
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
            powerPreference: "high-performance",
          });
        }
      }}
      style={{ width: "100%", height: "100%" }}
    >
      {children}
    </ThreeCanvas>
  );
};
