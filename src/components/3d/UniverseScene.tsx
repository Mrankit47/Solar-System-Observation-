"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, lazy, useMemo } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import CinematicCamera from "./camera/CinematicCamera";

// Lazy-load heavy 3D components to reduce initial bundle and parse time
const DeepSpace = lazy(() => import("./environment/DeepSpace"));
const Sun = lazy(() => import("./bodies/Sun"));
const SolarSystem = lazy(() => import("./SolarSystem"));

export default function UniverseScene() {
  // Memoize GL config to prevent re-creation
  const glConfig = useMemo(() => ({
    antialias: false, // Postprocessing handles AA via Bloom blur
    powerPreference: "high-performance" as const,
    stencil: false,
    depth: true,
  }), []);

  return (
    <div 
      className="absolute inset-0 w-full h-full bg-black z-0"
      role="application"
      aria-label="3D Solar System Exploration"
    >
      <Canvas
        shadows="soft"
        dpr={[1, 1.5]}
        gl={glConfig}
        frameloop="always"
        camera={undefined}
      >
        {/* Automatically downgrades DPR when framerate drops */}
        <AdaptiveDpr pixelated />
        <PerformanceMonitor />

        <Suspense fallback={null}>
          <CinematicCamera />
          {/* Cinematic Space Ambient Lighting */}
          <ambientLight color="#ffffff" intensity={0.03} />
          <hemisphereLight color="#ffffff" groundColor="#050510" intensity={0.04} />
          {/* Background */}
          <DeepSpace />
          
          <Sun />

          {/* Planets + Moons */}
          <SolarSystem />

          {/* Post-Processing: constrain Bloom levels for mobile GPU */}
          <EffectComposer>
            <Bloom 
              luminanceThreshold={0.4} 
              mipmapBlur 
              intensity={1.5} 
              levels={4}
            />
          </EffectComposer>
          
        </Suspense>
      </Canvas>
    </div>
  );
}

