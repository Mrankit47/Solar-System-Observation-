"use client";

import { useSpaceStore } from "@/store/useSpaceStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap } from "lucide-react";

export default function MoonInfoPanel() {
  const focusedMoon = useSpaceStore((state) => state.focusedMoon);
  const focusType = useSpaceStore((state) => state.focusType);
  const clearFocus = useSpaceStore((state) => state.clearFocus);

  const isActive = focusType === "moon" && focusedMoon !== null;

  return (
    <AnimatePresence>
      {isActive && focusedMoon && (
        <motion.div
          key={focusedMoon.id}
          initial={{ opacity: 0, x: 120, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 120, scale: 0.95 }}
          transition={{ type: "spring" as const, damping: 22, stiffness: 90 }}
          className="absolute right-4 md:right-8 top-20 md:top-24 w-[calc(100%-2rem)] md:w-[300px] z-50 pointer-events-auto will-change-transform will-change-opacity"
        >
          <div className="flex flex-col rounded-2xl overflow-hidden border border-white/[0.08] bg-black/50 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)]">
            
            {/* Header */}
            <div className="relative p-4 pb-3">
              <button 
                onClick={clearFocus}
                aria-label={`Close ${focusedMoon.name} details`}
                className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all cursor-pointer group"
              >
                <X size={12} className="text-white/50 group-hover:text-white transition-colors" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <div className="relative">
                  <span className="block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: focusedMoon.color, boxShadow: `0 0 8px ${focusedMoon.color}` }}></span>
                  <span className="absolute inset-0 w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: focusedMoon.color, opacity: 0.4 }}></span>
                </div>
                <span className="text-[9px] tracking-[0.25em] text-amber-400/80 uppercase font-mono">Moon Lock</span>
              </div>

              <h2 className="text-2xl font-extralight tracking-[0.15em] uppercase text-white mb-0.5">
                {focusedMoon.name}
              </h2>
              <span className="text-[10px] tracking-[0.12em] text-white/25 font-mono uppercase">
                Satellite of {focusedMoon.parentId}
              </span>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {/* Data */}
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2 pb-1">
                <Zap size={9} className="text-amber-400/60" />
                <span className="text-[8px] tracking-[0.25em] text-amber-400/60 uppercase font-mono font-medium">Telemetry</span>
                <div className="flex-1 h-px bg-gradient-to-r from-amber-400/10 to-transparent"></div>
              </div>

              <DataRow label="Radius" value={`${focusedMoon.radius.toFixed(2)} R⊕`} />
              <DataRow label="Orbit Radius" value={`${focusedMoon.orbitRadius} units`} />
              <DataRow label="Orbit Speed" value={`${Math.abs(focusedMoon.orbitSpeed).toFixed(1)}${focusedMoon.orbitSpeed < 0 ? " (retro)" : ""}`} />
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {/* Description */}
            <div className="p-4">
              <p className="text-[11px] leading-relaxed text-white/40 font-light mb-4">
                {focusedMoon.description}
              </p>

              <motion.button 
                onClick={clearFocus}
                aria-label="Release Moon Lock"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 px-4 rounded-xl text-[10px] tracking-[0.2em] uppercase font-mono cursor-pointer transition-all border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-white/60 hover:text-white"
              >
                ← Release Lock
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-[10px] text-white/30 uppercase tracking-[0.1em] font-mono">{label}</span>
      <span className="text-[11px] text-white/70 font-mono">{value}</span>
    </div>
  );
}
