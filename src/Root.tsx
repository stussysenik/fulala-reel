import React from "react";
import { Composition } from "remotion";
import { FulalaReel } from "./compositions/FulalaReel";
import { INSTAGRAM } from "./config/instagram";
import { DURATION_FRAMES, FPS } from "./config/timeline";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="FulalaReel"
        component={FulalaReel}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={INSTAGRAM.width}
        height={INSTAGRAM.height}
      />
    </>
  );
};
