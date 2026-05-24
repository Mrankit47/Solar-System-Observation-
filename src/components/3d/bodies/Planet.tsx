"use client";

import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html, useTexture } from "@react-three/drei";
import { PlanetData } from "@/lib/constants/planets";
import { getMoonsByPlanet } from "@/lib/constants/moons";
import MoonBody from "./MoonBody";
import { useSpaceStore } from "@/store/useSpaceStore";
import { generatePlanetTexture } from "@/lib/utils/textureGenerator";
import { atmosphereVertexShader, atmosphereFragmentShader } from "../shaders/atmosphere";

interface PlanetProps {
  data: PlanetData;
}

export default function Planet({ data }: PlanetProps) {
  const meshRef = useRef<THREE.Group>(null);
  const planetMeshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const setFocus = useSpaceStore((state) => state.setFocus);
  const focusedPlanet = useSpaceStore((state) => state.focusedPlanet);
  const isFocused = focusedPlanet?.id === data.id;

  // Load local textures (from public/textures/)
  const textureMap = useTexture(data.textureMap);

  // Conditional texture loading for special maps
  const nightMap = data.nightMap ? useTexture(data.nightMap) : null;
  const cloudsMap = data.cloudsMap ? useTexture(data.cloudsMap) : null;
  const ringAlphaMap = data.ringAlpha ? useTexture(data.ringAlpha) : null;

  // Procedural detail enhancement
  const [proceduralMaps, setProceduralMaps] = useState<{
    roughnessMap: THREE.CanvasTexture | null;
    bumpMap: THREE.CanvasTexture | null;
  }>({ roughnessMap: null, bumpMap: null });

  useEffect(() => {
    const maps = generatePlanetTexture(data.type as any, data.color, 1024);
    setProceduralMaps({ roughnessMap: maps.roughnessMap, bumpMap: maps.bumpMap });
  }, [data.type, data.color]);

  // Get this planet's moons (memoized)
  const moons = useMemo(() => getMoonsByPlanet(data.id), [data.id]);

  // Shader uniforms for atmosphere
  const atmosphereUniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(data.color) },
    uIntensity: { value: 1.5 },
    uExponent: { value: 3.0 }
  }), [data.color]);

  // Orbit calculations
  const a = data.distance;
  const e = data.eccentricity;
  const b = a * Math.sqrt(1 - e * e);
  const focusOffset = a * e;

  const startingAngle = useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    if (!meshRef.current || !planetMeshRef.current) return;

    const time = state.clock.getElapsedTime();

    // 1. Orbital Motion
    const orbitAngle = startingAngle.current + (time * data.orbitSpeed * 0.2); 
    const x = a * Math.cos(orbitAngle) - focusOffset;
    const z = b * Math.sin(orbitAngle);
    
    meshRef.current.position.set(x, 0, z);

    // 2. Self Rotation
    planetMeshRef.current.rotation.y += delta * data.rotationSpeed * 0.5;

    // 3. Clouds rotation
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * data.rotationSpeed * 0.6;
    }
  });

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => { document.body.style.cursor = "auto"; };
  }, [hovered]);

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHovered(false);
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (meshRef.current) {
      setFocus(data, meshRef.current);
    }
  };

  return (
    <group ref={meshRef}>
      {/* Planetshine: Light reflected from the planet to illuminate moons */}
      <pointLight 
        intensity={data.id === "earth" ? 1.5 : 1.0} 
        distance={data.radius * 20} 
        color={data.color} 
        decay={2}
      />
      
      {/* Main Planet Body */}
      <mesh 
        ref={planetMeshRef} 
        castShadow 
        receiveShadow
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[data.radius, 64, 64]} />
        <meshPhysicalMaterial 
          map={textureMap}
          roughness={data.type === "Terrestrial" ? 0.7 : 0.3}
          metalness={0.02}
          bumpMap={proceduralMaps.bumpMap}
          bumpScale={data.type === "Terrestrial" ? 0.05 : 0.01}
          roughnessMap={proceduralMaps.roughnessMap}
          emissive={nightMap ? new THREE.Color("#ffffff") : (hovered ? new THREE.Color(data.color) : new THREE.Color("#000000"))}
          emissiveMap={nightMap}
          emissiveIntensity={nightMap ? 1.2 : (hovered ? 0.15 : 0.0)}
          clearcoat={data.id === "earth" ? 0.3 : 0}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* Clouds Layer (Earth & Venus) */}
      {cloudsMap && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[data.radius * 1.01, 64, 64]} />
          <meshStandardMaterial 
            map={cloudsMap}
            transparent={true}
            opacity={data.id === "venus" ? 1.0 : 0.6}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Saturn's Rings */}
      {data.hasRings && data.ringInnerRadius && data.ringOuterRadius && (
        <mesh rotation={[-Math.PI / 2 + 0.3, 0, 0]} castShadow receiveShadow>
          <ringGeometry args={[data.ringInnerRadius, data.ringOuterRadius, 64]} />
          <meshPhysicalMaterial 
            map={ringAlphaMap}
            side={THREE.DoubleSide} 
            transparent={true}
            opacity={0.85}
            roughness={0.5}
            metalness={0.1}
          />
        </mesh>
      )}
      
      {/* Subtle glowing atmosphere */}
      <mesh>
        <sphereGeometry args={[data.radius * 1.05, 48, 48]} />
        <shaderMaterial
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
          uniforms={atmosphereUniforms}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* 2D Label floating above the planet */}
      <Html 
        position={[0, data.radius + 1, 0]} 
        center 
        style={{
          transition: 'all 0.3s',
          opacity: isFocused ? 0 : (hovered ? 1 : 0.6),
          transform: `scale(${hovered ? 1.1 : 1})`,
          pointerEvents: 'none'
        }}
      >
        <div className="text-white font-mono text-sm tracking-widest uppercase bg-black/40 backdrop-blur-md px-2 py-1 rounded border border-white/10 whitespace-nowrap">
          {data.name}
        </div>
      </Html>

      {/* Child Moons */}
      {moons.map((moon) => (
        <Suspense key={moon.id} fallback={null}>
          <MoonBody data={moon} isParentFocused={isFocused} />
        </Suspense>
      ))}
    </group>
  );
}
