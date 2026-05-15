"use client";

import { useState, useEffect } from "react";
import UniverseScene from "@/components/3d/UniverseScene";
import PlanetInfoPanel from "@/components/ui/overlays/PlanetInfoPanel";
import MoonInfoPanel from "@/components/ui/overlays/MoonInfoPanel";
import NavigationDrawer from "@/components/ui/overlays/NavigationDrawer";
import CelestialViewer from "@/components/ui/overlays/CelestialViewer";
import Preloader from "@/components/ui/overlays/Preloader";
import { Crosshair, Menu, Radio, Activity } from "lucide-react";
import { useSpaceStore } from "@/store/useSpaceStore";
import { motion, AnimatePresence } from "framer-motion";
import { PlanetData } from "@/lib/constants/planets";
import { MoonData } from "@/lib/constants/moons";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const focusedPlanet = useSpaceStore((state) => state.focusedPlanet);
  const focusedMoon = useSpaceStore((state) => state.focusedMoon);
  const focusType = useSpaceStore((state) => state.focusType);

  // Navigation drawer state
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Celestial viewer modal state
  const [viewerPlanet, setViewerPlanet] = useState<PlanetData | null>(null);
  const [viewerMoon, setViewerMoon] = useState<MoonData | null>(null);
  const [viewerParentPlanet, setViewerParentPlanet] = useState<PlanetData | null>(null);

  const trackingName = focusType === "planet" ? focusedPlanet?.name : focusType === "moon" ? focusedMoon?.name : null;
  const isTracking = trackingName !== null;

  const handleSelectPlanet = (planet: PlanetData) => {
    setViewerMoon(null);
    setViewerParentPlanet(null);
    setViewerPlanet(planet);
  };

  const handleSelectMoon = (moon: MoonData, parentPlanet: PlanetData) => {
    setViewerPlanet(null);
    setViewerParentPlanet(parentPlanet);
    setViewerMoon(moon);
  };

  const handleCloseViewer = () => {
    setViewerPlanet(null);
    setViewerMoon(null);
    setViewerParentPlanet(null);
  };

  return (
    <main className="relative w-full h-full overflow-hidden bg-black">
      {/* 3D Canvas Layer — Always mounted so it pre-loads behind the preloader */}
      <UniverseScene />

      {/* UI Layer — Fades in after loading completes */}
      <AnimatePresence>
        {!isLoading && (
          <motion.div 
            key="ui-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-4 md:p-6"
          >
            
            {/* ═══════ TOP BAR ═══════ */}
            <header className="flex justify-between items-start text-white">
              {/* Mission Control Badge */}
              <div className="glass-panel px-4 py-2.5 rounded-xl pointer-events-auto flex items-center gap-3">
                <div className="relative">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-30"></div>
                </div>
                <div>
                  <h1 className="font-mono text-xs tracking-[0.25em] uppercase text-white font-semibold">
                    Galaxium
                  </h1>
                  <span className="text-[9px] text-white/25 tracking-[0.15em] font-mono">DEEP SPACE OBSERVATORY</span>
                </div>
              </div>
              
              {/* System Metrics + Menu */}
              <div className="flex items-center gap-2">
                <div className="glass-panel px-3 py-2 rounded-lg hidden md:flex items-center gap-2">
                  <Activity size={12} className="text-emerald-400" />
                  <span className="text-[10px] font-mono text-emerald-400 tracking-wider">NOMINAL</span>
                </div>
                <button 
                  aria-label="Toggle Menu" 
                  onClick={() => setIsNavOpen(true)}
                  className="glass-panel p-2.5 rounded-lg pointer-events-auto hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Menu className="w-4 h-4 text-white/50" />
                </button>
              </div>
            </header>

            {/* ═══════ CENTER ═══════ */}
            <div className="flex-1 flex items-center justify-center pointer-events-none">
              <AnimatePresence mode="wait">
                {isTracking ? (
                  <motion.div 
                    key="scanning"
                    initial={{ opacity: 0, scale: 1.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-24 h-24"
                    aria-live="polite"
                  >
                    <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-cyan-400/60"></div>
                    <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-cyan-400/60"></div>
                    <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-cyan-400/60"></div>
                    <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-cyan-400/60"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
                    </div>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="text-[9px] font-mono tracking-[0.3em] text-cyan-400/60 uppercase">
                        Tracking {trackingName}
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="crosshair"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    exit={{ opacity: 0 }}
                    className="relative"
                  >
                    <Crosshair className="w-14 h-14 text-white/40" strokeWidth={0.5} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ═══════ BOTTOM BAR ═══════ */}
            <footer className="flex justify-between items-end text-white">
              <div className="glass-panel px-4 py-2.5 rounded-xl hidden md:block">
                <div className="flex items-center gap-2 mb-1">
                  <Radio size={10} className="text-cyan-500/50" />
                  <span className="text-[9px] font-mono tracking-[0.2em] text-white/25 uppercase">Telemetry</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-white/40">
                    SYS <span className="text-emerald-400">ONLINE</span>
                  </span>
                  <span className="text-[10px] font-mono text-white/40">
                    FPS <span className="text-cyan-400">60</span>
                  </span>
                  <span className="text-[10px] font-mono text-white/40">
                    BODIES <span className="text-cyan-400">8</span>
                  </span>
                </div>
              </div>

              <AnimatePresence>
                {isTracking && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="glass-panel px-4 py-2.5 rounded-xl"
                  >
                    <span className="text-[9px] font-mono tracking-[0.2em] text-white/25 uppercase block mb-1">
                      {focusType === "moon" ? "Moon Lock" : "Active Lock"}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: focusedPlanet?.color || focusedMoon?.color || "#fff", boxShadow: `0 0 6px ${focusedPlanet?.color || focusedMoon?.color || "#fff"}` }}></span>
                      <span className="text-xs font-mono tracking-[0.15em] text-white/70 uppercase">{trackingName}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </footer>

            {/* ═══════ INFO PANELS ═══════ */}
            <PlanetInfoPanel />
            <MoonInfoPanel />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ PRELOADER OVERLAY ═══════ */}
      <AnimatePresence>
        {isLoading && (
          <Preloader key="loader" onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* ═══════ NAVIGATION DRAWER ═══════ */}
      <NavigationDrawer
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        onSelectPlanet={handleSelectPlanet}
        onSelectMoon={handleSelectMoon}
      />

      {/* ═══════ CELESTIAL 3D VIEWER MODAL ═══════ */}
      <CelestialViewer
        planet={viewerPlanet}
        moon={viewerMoon}
        parentPlanet={viewerParentPlanet}
        onClose={handleCloseViewer}
      />
    </main>
  );
}
