"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html, useTexture } from "@react-three/drei";
import { MoonData } from "@/lib/constants/moons";
import { useSpaceStore } from "@/store/useSpaceStore";
import { generatePlanetTexture } from "@/lib/utils/textureGenerator";

interface MoonBodyProps {
  data: MoonData;
  isParentFocused?: boolean;
}

// Moon with real texture (Luna)
function TexturedMoon({ data, isParentFocused }: MoonBodyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const setMoonFocus = useSpaceStore((state) => state.setMoonFocus);
  const focusedMoon = useSpaceStore((state) => state.focusedMoon);
  const isFocused = focusedMoon?.id === data.id;

  const texture = useTexture(data.textureMap!);
  const startAngle = useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    if (!groupRef.current || !meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const angle = startAngle.current + time * data.orbitSpeed * 0.5;
    groupRef.current.position.set(data.orbitRadius * Math.cos(angle), 0, data.orbitRadius * Math.sin(angle));
    meshRef.current.rotation.y += delta * data.rotationSpeed * 0.3;
  });

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => { document.body.style.cursor = "auto"; };
  }, [hovered]);

  return (
    <group>
      {/* Moon Orbital Path (hidden for realistic view) */}
      {/* <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[data.orbitRadius - 0.01, data.orbitRadius + 0.01, 64]} />
        <meshBasicMaterial color={data.color} transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh> */}

      <group ref={groupRef}>
        {/* Local light to ensure the moon is never fully black */}
        <pointLight intensity={0.05} distance={data.radius * 4} color={data.color} decay={2} />
        
        <mesh ref={meshRef} castShadow receiveShadow
          onClick={(e) => { e.stopPropagation(); if (groupRef.current) setMoonFocus(data, groupRef.current); }}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
        >
          <sphereGeometry args={[data.radius, 48, 48]} />
          <meshStandardMaterial 
            map={texture} 
            color="#ffffff"
            roughness={0.8} 
            metalness={0.1} 
            emissive={hovered ? new THREE.Color(data.color) : new THREE.Color("#000000")} 
            emissiveIntensity={hovered ? 0.2 : 0.0} 
          />
        </mesh>
        <Html 
          position={[0, data.radius + 0.4, 0]} 
          center 
          style={{ 
            transition: "all 0.3s", 
            opacity: isFocused ? 0 : (hovered || isParentFocused ? 1 : 0), 
            pointerEvents: "none" 
          }}
        >
          <div className="text-white/80 font-mono text-[10px] tracking-widest uppercase bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 whitespace-nowrap">
            {data.name}
          </div>
        </Html>
      </group>
    </group>
  );
}

// Moon with procedural texture (all others)
function ProceduralMoon({ data, isParentFocused }: MoonBodyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const setMoonFocus = useSpaceStore((state) => state.setMoonFocus);
  const focusedMoon = useSpaceStore((state) => state.focusedMoon);
  const isFocused = focusedMoon?.id === data.id;

  const [maps, setMaps] = useState<{ colorMap: THREE.CanvasTexture | null; roughnessMap: THREE.CanvasTexture | null; bumpMap: THREE.CanvasTexture | null; }>({ colorMap: null, roughnessMap: null, bumpMap: null });

  useEffect(() => {
    const generated = generatePlanetTexture("Moon", data.color, 512, data.surfaceType);
    setMaps(generated);
  }, [data.color, data.surfaceType]);

  const startAngle = useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    if (!groupRef.current || !meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const angle = startAngle.current + time * data.orbitSpeed * 0.5;
    groupRef.current.position.set(data.orbitRadius * Math.cos(angle), 0, data.orbitRadius * Math.sin(angle));
    meshRef.current.rotation.y += delta * data.rotationSpeed * 0.3;
  });

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => { document.body.style.cursor = "auto"; };
  }, [hovered]);

  return (
    <group>
      {/* Moon Orbital Path (hidden for realistic view) */}
      {/* <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[data.orbitRadius - 0.005, data.orbitRadius + 0.005, 64]} />
        <meshBasicMaterial color={data.color} transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh> */}

      <group ref={groupRef}>
        {/* Local light for visibility */}
        <pointLight intensity={0.05} distance={data.radius * 5} color={data.color} decay={2} />

        <mesh ref={meshRef} castShadow receiveShadow
          onClick={(e) => { e.stopPropagation(); if (groupRef.current) setMoonFocus(data, groupRef.current); }}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
        >
          <sphereGeometry args={[data.radius, 32, 32]} />
          <meshStandardMaterial
            map={maps.colorMap || undefined}
            color={maps.colorMap ? "#ffffff" : data.color}
            roughness={0.8}
            metalness={0.1}
            bumpMap={maps.bumpMap || undefined}
            bumpScale={0.02}
            emissive={hovered ? new THREE.Color(data.color) : new THREE.Color("#000000")} 
            emissiveIntensity={hovered ? 0.2 : 0.0} 
          />
        </mesh>
        <Html 
          position={[0, data.radius + 0.4, 0]} 
          center 
          style={{ 
            transition: "all 0.3s", 
            opacity: isFocused ? 0 : (hovered || isParentFocused ? 1 : 0), 
            pointerEvents: "none" 
          }}
        >
          <div className="text-white/80 font-mono text-[10px] tracking-widest uppercase bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 whitespace-nowrap">
            {data.name}
          </div>
        </Html>
      </group>
    </group>
  );
}

// Main export — routes to the correct implementation
export default function MoonBody({ data, isParentFocused }: MoonBodyProps) {
  if (data.textureMap) {
    return <TexturedMoon data={data} isParentFocused={isParentFocused} />;
  }
  return <ProceduralMoon data={data} isParentFocused={isParentFocused} />;
}
