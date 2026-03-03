import * as THREE from "three";

export const COLORS = {
  fulalaRed: "#E83636",
  tigerOrange: "#FCEBDC",
  doughWhite: "#FFFFFF",
  soyBrown: "#6B3900",
  inkBlack: "#000000",
} as const;

export const COLOR3 = {
  fulalaRed: new THREE.Color(COLORS.fulalaRed),
  tigerOrange: new THREE.Color(COLORS.tigerOrange),
  doughWhite: new THREE.Color(COLORS.doughWhite),
  soyBrown: new THREE.Color(COLORS.soyBrown),
  inkBlack: new THREE.Color(COLORS.inkBlack),
} as const;

export const BRAND = {
  name: "Fulala",
  tagline: "Fresh Noodles & Dumplings & Snacks",
} as const;
