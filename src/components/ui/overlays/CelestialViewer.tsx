"use client";

import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { X, Thermometer, Globe, Clock, Orbit, Zap, Moon, Wind } from "lucide-react";
import { PlanetData } from "@/lib/constants/planets";
import { MoonData } from "@/lib/constants/moons";
import { generatePlanetTexture } from "@/lib/utils/textureGenerator";
import { atmosphereVertexShader, atmosphereFragmentShader } from "@/components/3d/shaders/atmosphere";

// ═══════ 3D Planet Mesh (used inside Canvas) ═══════
function PlanetSphere({ data, proceduralMaps }: { data: PlanetData; proceduralMaps: { bumpMap: THREE.CanvasTexture | null; roughnessMap: THREE.CanvasTexture | null } }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textureMap = useTexture(data.textureMap);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.3;
  });

  const viewRadius = 2.5;

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[viewRadius, 128, 128]} />
      <meshPhysicalMaterial
        map={textureMap}
        color="#ffffff"
        roughness={data.type === "Terrestrial" ? 0.8 : 0.4}
        metalness={0.05}
        bumpMap={proceduralMaps.bumpMap}
        bumpScale={0.03}
        roughnessMap={proceduralMaps.roughnessMap}
        emissive={new THREE.Color(data.color)}
        emissiveIntensity={0.15}
        clearcoat={data.id === "earth" ? 0.3 : 0}
        clearcoatRoughness={0.2}
      />
    </mesh>
  );
}

function CloudLayer({ cloudsMap, id }: { cloudsMap: string; id: string }) {
  const map = useTexture(cloudsMap);
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.35; });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[2.5 * 1.01, 128, 128]} />
      <meshStandardMaterial map={map} transparent opacity={id === "venus" ? 1.0 : 0.5} depthWrite={false} />
    </mesh>
  );
}

function NightLayer({ nightMap }: { nightMap: string }) {
  useTexture(nightMap); // preload
  return null;
}

function RingLayer({ ringAlpha }: { ringAlpha: string }) {
  const map = useTexture(ringAlpha);
  return (
    <mesh rotation={[-Math.PI / 2 + 0.3, 0, 0]}>
      <ringGeometry args={[2.5 * 1.3, 2.5 * 2.2, 128]} />
      <meshPhysicalMaterial map={map} side={THREE.DoubleSide} transparent opacity={0.85} roughness={0.5} />
    </mesh>
  );
}

function PlanetMesh({ data }: { data: PlanetData }) {
  const [proceduralMaps, setProceduralMaps] = useState<{
    bumpMap: THREE.CanvasTexture | null;
    roughnessMap: THREE.CanvasTexture | null;
  }>({ bumpMap: null, roughnessMap: null });

  useEffect(() => {
    const maps = generatePlanetTexture(data.type as any, data.color, 1024);
    setProceduralMaps({ bumpMap: maps.bumpMap, roughnessMap: maps.roughnessMap });
  }, [data.type, data.color]);

  const atmosphereUniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(data.color) },
    uIntensity: { value: 1.8 },
    uExponent: { value: 3.5 }
  }), [data.color]);

  const viewRadius = 2.5;

  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={0.5} color="#ffffff" />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[5, 3, 5]} intensity={2.0} color="#ffedd6" />
      <directionalLight position={[-3, -1, -3]} intensity={0.5} color="#1a2a4a" />

      {/* Planet */}
      <PlanetSphere data={data} proceduralMaps={proceduralMaps} />

      {/* Clouds */}
      {data.cloudsMap && <CloudLayer cloudsMap={data.cloudsMap} id={data.id} />}

      {/* Rings */}
      {data.hasRings && data.ringAlpha && (
        <RingLayer ringAlpha={data.ringAlpha} />
      )}

      {/* Atmosphere */}
      <mesh>
        <sphereGeometry args={[viewRadius * 1.06, 64, 64]} />
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
    </group>
  );
}

// ═══════ 3D Moon Mesh (used inside Canvas) ═══════
function TexturedMoonMesh({ data }: { data: MoonData }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(data.textureMap!);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.15;
  });

  return (
    <mesh ref={meshRef} castShadow>
      <sphereGeometry args={[2.5, 128, 128]} />
      <meshStandardMaterial map={texture} color="#ffffff" roughness={0.8} metalness={0.0} emissive={data.color} emissiveIntensity={0.2} />
    </mesh>
  );
}

function ProceduralMoonMesh({ data }: { data: MoonData }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [maps, setMaps] = useState<{
    colorMap: THREE.CanvasTexture | null;
    bumpMap: THREE.CanvasTexture | null;
  }>({ colorMap: null, bumpMap: null });

  useEffect(() => {
    const generated = generatePlanetTexture("Moon", data.color, 1024, data.surfaceType);
    setMaps(generated);
  }, [data.color, data.surfaceType]);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.15;
  });

  return (
    <mesh ref={meshRef} castShadow>
      <sphereGeometry args={[2.5, 128, 128]} />
      <meshStandardMaterial
        map={maps.colorMap || undefined}
        color={maps.colorMap ? "#ffffff" : data.color}
        roughness={0.8}
        metalness={0.0}
        bumpMap={maps.bumpMap || undefined}
        bumpScale={0.05}
        emissive={data.color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

function MoonMesh({ data }: { data: MoonData }) {
  return (
    <group>
      <ambientLight intensity={0.4} color="#ffffff" />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[5, 3, 5]} intensity={2.0} color="#ffedd6" />
      <directionalLight position={[-3, -1, -3]} intensity={0.5} color="#1a2a4a" />
      {data.textureMap ? <TexturedMoonMesh data={data} /> : <ProceduralMoonMesh data={data} />}
    </group>
  );
}

// ═══════ Main Modal Component ═══════

interface CelestialViewerProps {
  planet: PlanetData | null;
  moon: MoonData | null;
  parentPlanet: PlanetData | null; // parent planet if viewing a moon
  onClose: () => void;
}

export default function CelestialViewer({ planet, moon, parentPlanet, onClose }: CelestialViewerProps) {
  const isOpen = planet !== null || moon !== null;
  const isPlanet = planet !== null && moon === null;
  const isMoon = moon !== null;

  const name = isPlanet ? planet!.name : isMoon ? moon!.name : "";
  const color = isPlanet ? planet!.color : isMoon ? moon!.color : "#fff";
  const description = isPlanet ? planet!.description : isMoon ? moon!.description : "";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-10 w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all cursor-pointer"
          >
            <X size={18} className="text-white/60" />
          </button>

          {/* Left: 3D Viewer */}
          <div className="flex-1 relative">
            <Canvas
              camera={{ position: [0, 0, 7], fov: 45 }}
              dpr={[1, 2]}
              gl={{ antialias: true, powerPreference: "high-performance" }}
            >
              <Suspense fallback={null}>
                {isPlanet && <PlanetMesh data={planet!} />}
                {isMoon && <MoonMesh data={moon!} />}
                <OrbitControls
                  enablePan={false}
                  enableZoom={true}
                  minDistance={4}
                  maxDistance={12}
                  autoRotate={false}
                  dampingFactor={0.05}
                />
                <EffectComposer>
                  <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.2} levels={3} />
                </EffectComposer>
              </Suspense>
            </Canvas>

            {/* Name overlay */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-8 left-8"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 14px ${color}` }} />
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/40">
                  {isPlanet ? planet!.type : `Satellite of ${parentPlanet?.name || moon!.parentId}`}
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extralight tracking-[0.2em] uppercase text-white">
                {name}
              </h1>
            </motion.div>
          </div>

          {/* Right: Info Panel */}
          <motion.div
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.15, type: "spring", damping: 24, stiffness: 120 }}
            className="w-[380px] max-w-[40vw] hidden md:flex flex-col border-l border-white/[0.06] bg-black/40 backdrop-blur-xl overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {isPlanet && planet && <PlanetDetails planet={planet} />}
            {isMoon && moon && <MoonDetails moon={moon} parentPlanet={parentPlanet} />}
          </motion.div>

          {/* Mobile: Bottom Sheet Info */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="md:hidden absolute bottom-0 left-0 right-0 max-h-[45vh] overflow-y-auto bg-black/80 backdrop-blur-xl border-t border-white/[0.08] rounded-t-2xl p-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {isPlanet && planet && <PlanetDetails planet={planet} />}
            {isMoon && moon && <MoonDetails moon={moon} parentPlanet={parentPlanet} />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ═══════ Planet Detail Panel ═══════
function PlanetDetails({ planet }: { planet: PlanetData }) {
  return (
    <div className="p-6 space-y-5">
      {/* Quick Stats */}
      <div>
        <SectionLabel text="Key Metrics" />
        <div className="grid grid-cols-2 gap-2 mt-2">
          <MetricCard icon={<Thermometer size={12} />} label="Surface Temp" value={`${planet.tempCelsius}°C`} accent={planet.tempCelsius > 100 ? "text-orange-400" : planet.tempCelsius < -100 ? "text-blue-400" : "text-cyan-400"} />
          <MetricCard icon={<Globe size={12} />} label="Mass" value={`${planet.massEarths}x Earth`} accent="text-cyan-400" />
          <MetricCard icon={<Clock size={12} />} label="Day Length" value={planet.dayLength} accent="text-cyan-400" />
          <MetricCard icon={<Orbit size={12} />} label="Year Length" value={planet.yearLength} accent="text-cyan-400" />
        </div>
      </div>

      {/* Gravity & Orbit */}
      <div>
        <SectionLabel text="Physical Properties" />
        <DataRow label="Surface Gravity" value={`${planet.gravityEarths}x Earth`} />
        <DataRow label="Eccentricity" value={planet.eccentricity.toString()} />
        <DataRow label="Inclination" value={`${planet.inclination}°`} />
        <DataRow label="Known Moons" value={planet.moons.toString()} />
      </div>

      {/* Atmosphere */}
      <div>
        <SectionLabel text="Atmosphere" />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {planet.atmosphere.map((gas) => (
            <span key={gas} className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03] text-white/50">
              {gas}
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <SectionLabel text="Mission Brief" />
        <p className="text-[11px] leading-relaxed text-white/40 font-light mt-2">
          {planet.description}
        </p>
      </div>
    </div>
  );
}

// ═══════ Moon Detail Panel ═══════
function MoonDetails({ moon, parentPlanet }: { moon: MoonData; parentPlanet: PlanetData | null }) {
  return (
    <div className="p-6 space-y-5">
      <div>
        <SectionLabel text="Telemetry" />
        <DataRow label="Parent Body" value={parentPlanet?.name || moon.parentId} />
        <DataRow label="Radius" value={`${moon.radius.toFixed(2)} R⊕`} />
        <DataRow label="Orbit Radius" value={`${moon.orbitRadius} units`} />
        <DataRow label="Orbit Speed" value={`${Math.abs(moon.orbitSpeed).toFixed(1)}${moon.orbitSpeed < 0 ? " (retrograde)" : ""}`} />
        <DataRow label="Rotation Speed" value={moon.rotationSpeed.toFixed(1)} />
      </div>

      <div>
        <SectionLabel text="Mission Brief" />
        <p className="text-[11px] leading-relaxed text-white/40 font-light mt-2">
          {moon.description}
        </p>
      </div>
    </div>
  );
}

// ═══════ Shared Sub-components ═══════
function MetricCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-white/30">{icon}</span>
        <span className="text-[9px] tracking-[0.15em] text-white/30 uppercase font-mono">{label}</span>
      </div>
      <span className={`text-sm font-mono font-medium ${accent}`}>{value}</span>
    </div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 pb-2">
      <Zap size={10} className="text-cyan-500/60" />
      <span className="text-[9px] tracking-[0.25em] text-cyan-500/60 uppercase font-mono font-medium">{text}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/10 to-transparent" />
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-[10px] text-white/30 uppercase tracking-[0.1em] font-mono">{label}</span>
      <span className="text-[11px] text-white/70 font-mono">{value}</span>
    </div>
  );
}
