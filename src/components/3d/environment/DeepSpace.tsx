"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { starVertexShader, starFragmentShader } from "../shaders/starfield";
import { nebulaVertexShader, nebulaFragmentShader } from "../shaders/nebula";

export default function DeepSpace() {
  const coreStarsRef = useRef<THREE.ShaderMaterial>(null);
  const dustStarsRef = useRef<THREE.ShaderMaterial>(null);
  const nebulaRef = useRef<THREE.ShaderMaterial>(null);

  // Load Milky Way texture
  const milkyWayTexture = useTexture("/textures/milkyway.jpg");
  milkyWayTexture.colorSpace = THREE.SRGBColorSpace;

  // Generate Core Stars (Dense, static, far away)
  const [corePositions, coreColors, coreSizes] = useMemo(() => {
    const count = 30000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const colorClasses = [
      new THREE.Color("#9db4ff"), // O, B class (Blue)
      new THREE.Color("#ffffff"), // A class (White)
      new THREE.Color("#fff4e8"), // F, G class (Yellow-white)
      new THREE.Color("#ffddb4"), // K class (Orange)
      new THREE.Color("#ffbd6f"), // M class (Red)
    ];

    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const r = 400 + Math.random() * 600; 
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Realistic color distribution (more cool stars than hot stars)
      const colorThreshold = Math.random();
      let colorClass;
      if (colorThreshold > 0.95) colorClass = colorClasses[0]; // 5% Blue
      else if (colorThreshold > 0.8) colorClass = colorClasses[1]; // 15% White
      else if (colorThreshold > 0.5) colorClass = colorClasses[2]; // 30% Yellow-white
      else if (colorThreshold > 0.2) colorClass = colorClasses[3]; // 30% Orange
      else colorClass = colorClasses[4]; // 20% Red

      colors[i * 3] = colorClass.r;
      colors[i * 3 + 1] = colorClass.g;
      colors[i * 3 + 2] = colorClass.b;

      // Size based on mass/brightness
      sizes[i] = Math.random() * 2.0 + 0.5;
    }

    return [positions, colors, sizes];
  }, []);

  // Generate Dust/Twinkling Stars (Sparse, close, dynamic)
  const [dustPositions, dustColors, dustSizes, dustSpeeds, dustOffsets] = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute closer to camera
      const r = 50 + Math.random() * 350; 
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Mostly white/blue for dust and near stars
      colors[i * 3] = 0.8 + Math.random() * 0.2; 
      colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
      colors[i * 3 + 2] = 1.0;

      sizes[i] = Math.random() * 3.0 + 1.0;
      speeds[i] = Math.random() * 0.5 + 0.1; // Twinkle speed
      offsets[i] = Math.random() * Math.PI * 2; // Twinkle offset
    }

    return [positions, colors, sizes, speeds, offsets];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (dustStarsRef.current) {
      dustStarsRef.current.uniforms.uTime.value = time;
    }
    if (nebulaRef.current) {
      nebulaRef.current.uniforms.uTime.value = time;
    }
  });

  return (
    <group>
      {/* Layer 0: Milky Way / Background Stars */}
      <mesh frustumCulled={false}>
        <sphereGeometry args={[1000, 64, 64]} />
        <meshBasicMaterial 
          map={milkyWayTexture} 
          side={THREE.BackSide} 
          depthWrite={false}
          transparent={true}
          opacity={0.8}
        />
      </mesh>

      {/* Layer 1: Nebula / Deep Space Void */}
      <mesh frustumCulled={false}>
        <sphereGeometry args={[900, 32, 32]} />
        <shaderMaterial
          ref={nebulaRef}
          vertexShader={nebulaVertexShader}
          fragmentShader={nebulaFragmentShader}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
          uniforms={{
            uTime: { value: 0 },
            uColor1: { value: new THREE.Color("#050510") }, // Deep void purple/black
            uColor2: { value: new THREE.Color("#0a1526") }, // Subtle dark blue
          }}
        />
      </mesh>

      {/* Layer 2: Core Starfield */}
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[corePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[coreColors, 3]} />
          <bufferAttribute attach="attributes-size" args={[coreSizes, 1]} />
          {/* Default values for twinkle attributes so shader doesn't crash, but speed is 0 so it's static */}
          <bufferAttribute attach="attributes-twinkleSpeed" args={[new Float32Array(30000).fill(0), 1]} />
          <bufferAttribute attach="attributes-twinkleOffset" args={[new Float32Array(30000).fill(0), 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={coreStarsRef}
          vertexShader={starVertexShader}
          fragmentShader={starFragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uTime: { value: 0 },
          }}
        />
      </points>

      {/* Layer 3: Dynamic Cosmic Dust & Twinkling Stars */}
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[dustColors, 3]} />
          <bufferAttribute attach="attributes-size" args={[dustSizes, 1]} />
          <bufferAttribute attach="attributes-twinkleSpeed" args={[dustSpeeds, 1]} />
          <bufferAttribute attach="attributes-twinkleOffset" args={[dustOffsets, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={dustStarsRef}
          vertexShader={starVertexShader}
          fragmentShader={starFragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uTime: { value: 0 },
          }}
        />
      </points>
    </group>
  );
}
