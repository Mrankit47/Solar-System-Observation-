import { create } from "zustand";
import * as THREE from "three";
import { PlanetData } from "@/lib/constants/planets";
import { MoonData } from "@/lib/constants/moons";

type FocusType = "planet" | "moon" | null;

interface SpaceState {
  focusType: FocusType;
  focusedPlanet: PlanetData | null;
  focusedMoon: MoonData | null;
  focusedMesh: THREE.Object3D | null;
  setFocus: (planet: PlanetData, mesh: THREE.Object3D) => void;
  setMoonFocus: (moon: MoonData, mesh: THREE.Object3D) => void;
  clearFocus: () => void;
}

export const useSpaceStore = create<SpaceState>((set) => ({
  focusType: null,
  focusedPlanet: null,
  focusedMoon: null,
  focusedMesh: null,
  setFocus: (planet, mesh) =>
    set({ focusType: "planet", focusedPlanet: planet, focusedMoon: null, focusedMesh: mesh }),
  setMoonFocus: (moon, mesh) =>
    set({ focusType: "moon", focusedPlanet: null, focusedMoon: moon, focusedMesh: mesh }),
  clearFocus: () =>
    set({ focusType: null, focusedPlanet: null, focusedMoon: null, focusedMesh: null }),
}));

