import React from "react";

interface LightingRigProps {
  intensity?: number;
}

export const LightingRig: React.FC<LightingRigProps> = ({
  intensity = 1,
}) => {
  return (
    <>
      <ambientLight intensity={0.3 * intensity} color="#FCEBDC" />
      <pointLight
        position={[0, 3, 5]}
        intensity={2 * intensity}
        color="#E83636"
        distance={15}
        decay={2}
      />
      <pointLight
        position={[-3, -2, 3]}
        intensity={1 * intensity}
        color="#FCEBDC"
        distance={12}
        decay={2}
      />
      <pointLight
        position={[3, -2, 3]}
        intensity={1 * intensity}
        color="#FCEBDC"
        distance={12}
        decay={2}
      />
    </>
  );
};
