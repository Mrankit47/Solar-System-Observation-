"use client";

import { useSpaceStore } from "@/store/useSpaceStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Thermometer, Globe, Orbit, Moon, Wind, Clock, Zap } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.2 },
  },
  exit: { opacity: 0, transition: { staggerChildren: 0.03, staggerDirection: -1 as const } },
};

const itemVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { type: "spring" as const, damping: 20, stiffness: 120 } },
  exit: { opacity: 0, x: 30 },
};

export default function PlanetInfoPanel() {
  const focusedPlanet = useSpaceStore((state) => state.focusedPlanet);
  const focusType = useSpaceStore((state) => state.focusType);
  const clearFocus = useSpaceStore((state) => state.clearFocus);

  const isActive = focusType === "planet" && focusedPlanet !== null;

  return (
    <AnimatePresence>
      {isActive && focusedPlanet && (
        <motion.div
          key={focusedPlanet.id}
          initial={{ opacity: 0, x: 120, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 120, scale: 0.95 }}
          transition={{ type: "spring", damping: 22, stiffness: 90 }}
          className="absolute right-4 md:right-8 top-20 md:top-16 bottom-4 md:bottom-16 w-[calc(100%-2rem)] md:w-[340px] z-50 pointer-events-auto flex flex-col"
        >
          {/* Main Panel */}
          <div className="flex-1 flex flex-col rounded-2xl overflow-hidden border border-white/[0.08] bg-black/50 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)]">
            
            {/* ═══════ HEADER ═══════ */}
            <div className="relative p-5 pb-4">
              {/* Close Button */}
              <button 
                onClick={clearFocus}
                aria-label={`Close ${focusedPlanet.name} details`}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all cursor-pointer group"
              >
                <X size={14} className="text-white/50 group-hover:text-white transition-colors" />
              </button>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 mb-3">
                <div className="relative">
                  <span className="block w-2 h-2 rounded-full" style={{ backgroundColor: focusedPlanet.color, boxShadow: `0 0 12px ${focusedPlanet.color}` }}></span>
                  <span className="absolute inset-0 w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: focusedPlanet.color, opacity: 0.4 }}></span>
                </div>
                <span className="text-[10px] tracking-[0.25em] text-cyan-400 uppercase font-mono">Target Acquired</span>
              </div>

              {/* Planet Name */}
              <h2 className="text-3xl font-extralight tracking-[0.15em] uppercase text-white mb-1">
                {focusedPlanet.name}
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-[11px] tracking-[0.15em] text-white/30 font-mono uppercase">{focusedPlanet.type}</span>
                <span className="text-white/10">|</span>
                <span className="text-[11px] tracking-[0.15em] text-white/30 font-mono">{focusedPlanet.moons} Moon{focusedPlanet.moons !== 1 ? "s" : ""}</span>
              </div>

              {/* Thin separator */}
              <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </div>

            {/* ═══════ DATA SECTION (SCROLLABLE) ═══════ */}
            <motion.div 
              className="flex-1 overflow-y-auto px-5 pb-4 space-y-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] will-change-transform will-change-opacity"
              style={{ WebkitOverflowScrolling: "touch" }}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Key Metrics Grid */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2 mb-4">
                <MetricCard icon={<Thermometer size={13} />} label="Surface Temp" value={`${focusedPlanet.tempCelsius}°C`} accent={focusedPlanet.tempCelsius > 100 ? "text-orange-400" : focusedPlanet.tempCelsius < -100 ? "text-blue-400" : "text-cyan-400"} />
                <MetricCard icon={<Globe size={13} />} label="Mass" value={`${focusedPlanet.massEarths}x`} accent="text-cyan-400" />
                <MetricCard icon={<Clock size={13} />} label="Day Length" value={focusedPlanet.dayLength} accent="text-cyan-400" />
                <MetricCard icon={<Orbit size={13} />} label="Year Length" value={focusedPlanet.yearLength} accent="text-cyan-400" />
              </motion.div>

              {/* Comparison Bars */}
              <motion.div variants={itemVariants}>
                <SectionLabel text="Comparative Analysis" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <ComparisonBar label="Mass (vs Earth)" value={Math.min(focusedPlanet.massEarths / 3.5, 1)} rawValue={`${focusedPlanet.massEarths}x`} color={focusedPlanet.color} />
              </motion.div>
              <motion.div variants={itemVariants}>
                <ComparisonBar label="Surface Gravity" value={Math.min(focusedPlanet.gravityEarths, 1)} rawValue={`${focusedPlanet.gravityEarths}x`} color={focusedPlanet.color} />
              </motion.div>
              <motion.div variants={itemVariants}>
                <ComparisonBar label="Orbit Speed" value={Math.min(focusedPlanet.orbitSpeed / 4.5, 1)} rawValue={`${(focusedPlanet.orbitSpeed * 29.78).toFixed(1)} km/s`} color={focusedPlanet.color} />
              </motion.div>
              <motion.div variants={itemVariants}>
                <ComparisonBar label="Eccentricity" value={focusedPlanet.eccentricity / 0.25} rawValue={focusedPlanet.eccentricity.toFixed(3)} color={focusedPlanet.color} />
              </motion.div>

              {/* Atmosphere Composition */}
              <motion.div variants={itemVariants} className="pt-2">
                <SectionLabel text="Atmosphere" />
              </motion.div>
              <motion.div variants={itemVariants} className="flex flex-wrap gap-1.5">
                {focusedPlanet.atmosphere.map((gas) => (
                  <span key={gas} className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03] text-white/50">
                    {gas}
                  </span>
                ))}
              </motion.div>

              {/* Orbital Parameters */}
              <motion.div variants={itemVariants} className="pt-2">
                <SectionLabel text="Orbital Parameters" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <DataRow label="Semi-Major Axis" value={`${focusedPlanet.distance} AU`} />
              </motion.div>
              <motion.div variants={itemVariants}>
                <DataRow label="Eccentricity" value={focusedPlanet.eccentricity.toString()} />
              </motion.div>
              <motion.div variants={itemVariants}>
                <DataRow label="Known Moons" value={focusedPlanet.moons.toString()} />
              </motion.div>

              {/* Description */}
              <motion.div variants={itemVariants} className="pt-2">
                <SectionLabel text="Mission Brief" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <p className="text-[11px] leading-relaxed text-white/40 font-light">
                  {focusedPlanet.description}
                </p>
              </motion.div>
            </motion.div>

            {/* ═══════ FOOTER ═══════ */}
            <div className="p-4 pt-0">
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4"></div>
              <motion.button 
                onClick={clearFocus}
                aria-label="Return to Overview"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 rounded-xl text-[11px] tracking-[0.2em] uppercase font-mono cursor-pointer transition-all border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-white/60 hover:text-white hover:border-white/15 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              >
                ← Return to Overview
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════ SUB-COMPONENTS ═══════ */

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

function ComparisonBar({ label, value, rawValue, color }: { label: string; value: number; rawValue: string; color: string }) {
  const clampedValue = Math.max(0, Math.min(1, value));
  return (
    <div className="py-1.5">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] tracking-[0.1em] text-white/35 uppercase font-mono">{label}</span>
        <span className="text-[10px] text-white/60 font-mono">{rawValue}</span>
      </div>
      <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}40` }}
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue * 100}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        />
      </div>
    </div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 pt-1 pb-2">
      <Zap size={10} className="text-cyan-500/60" />
      <span className="text-[9px] tracking-[0.25em] text-cyan-500/60 uppercase font-mono font-medium">{text}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/10 to-transparent"></div>
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
