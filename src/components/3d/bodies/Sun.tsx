"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { 
  plasmaVertexShader, 
  plasmaFragmentShader,
  coronaVertexShader,
  coronaFragmentShader
} from "../shaders/sun";

export default function Sun() {
  const plasmaMaterialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Radius of the sun
  const radius = 5;

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color("#4a0000") }, // Deep Red
    uColor2: { value: new THREE.Color("#cc2a00") }, // Orange/Red
    uColor3: { value: new THREE.Color("#ffaa00") }, // Bright Yellow
    uColor4: { value: new THREE.Color("#ffffff") }, // White
  }), []);

  const coronaUniforms = useMemo(() => ({
    uColor: { value: new THREE.Color("#ffaa00") },
    uIntensity: { value: 1.5 },
  }), []);

  useFrame((state, delta) => {
    if (plasmaMaterialRef.current) {
      plasmaMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group>
      {/* Dynamic Point Light to illuminate the solar system */}
      <pointLight 
        position={[0, 0, 0]} 
        intensity={20} // High intensity for a cinematic, bright sun
        color="#ffedd6" 
        distance={2000} // Increased distance to cover the whole system
        decay={0} // Disable physical decay for constant visibility across scales
        castShadow
        shadow-bias={-0.0001}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Core Plasma Surface */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <shaderMaterial
          ref={plasmaMaterialRef}
          vertexShader={plasmaVertexShader}
          fragmentShader={plasmaFragmentShader}
          uniforms={uniforms}
        />
      </mesh>

      {/* Solar Corona / Volumetric Glow */}
      <mesh>
        {/* Slightly larger than the sun */}
        <sphereGeometry args={[radius * 1.3, 32, 32]} />
        <shaderMaterial
          vertexShader={coronaVertexShader}
          fragmentShader={coronaFragmentShader}
          uniforms={coronaUniforms}
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide} // Render on the back side so we see it through the front
        />
      </mesh>
      
      {/* Front Side Corona for full volumetric coverage */}
      <mesh>
        <sphereGeometry args={[radius * 1.3, 32, 32]} />
        <shaderMaterial
          vertexShader={coronaVertexShader}
          fragmentShader={coronaFragmentShader}
          uniforms={coronaUniforms}
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </mesh>
    </group>
  );
}
