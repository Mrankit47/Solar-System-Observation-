"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { PLANETS, PlanetData } from "@/lib/constants/planets";
import { getMoonsByPlanet, MoonData } from "@/lib/constants/moons";

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlanet: (planet: PlanetData) => void;
  onSelectMoon: (moon: MoonData, parentPlanet: PlanetData) => void;
}

export default function NavigationDrawer({ isOpen, onClose, onSelectPlanet, onSelectMoon }: NavigationDrawerProps) {
  const [expandedPlanet, setExpandedPlanet] = useState<string | null>(null);

  const toggleExpand = (planetId: string) => {
    setExpandedPlanet(expandedPlanet === planetId ? null : planetId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-[320px] max-w-[85vw] z-[101] flex flex-col"
          >
            <div className="flex-1 flex flex-col overflow-hidden border-l border-white/[0.08] bg-black/80 backdrop-blur-2xl">
              
              {/* Header */}
              <div className="flex items-center justify-between p-5 pb-3">
                <div>
                  <h2 className="text-xs font-mono tracking-[0.3em] uppercase text-white/80">Navigation</h2>
                  <span className="text-[9px] font-mono tracking-[0.15em] text-white/25 uppercase">Solar System Bodies</span>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all cursor-pointer"
                >
                  <X size={14} className="text-white/50" />
                </button>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Planet List */}
              <div className="flex-1 overflow-y-auto py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {PLANETS.map((planet) => {
                  const moons = getMoonsByPlanet(planet.id);
                  const hasMoons = moons.length > 0;
                  const isExpanded = expandedPlanet === planet.id;

                  return (
                    <div key={planet.id}>
                      {/* Planet Row */}
                      <div className="flex items-center px-5 group">
                        {/* Expand toggle */}
                        {hasMoons ? (
                          <button
                            onClick={() => toggleExpand(planet.id)}
                            className="w-6 h-6 flex items-center justify-center mr-1 cursor-pointer text-white/30 hover:text-white/60 transition-colors"
                          >
                            <motion.div
                              animate={{ rotate: isExpanded ? 90 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronRight size={12} />
                            </motion.div>
                          </button>
                        ) : (
                          <div className="w-6 h-6 flex items-center justify-center mr-1">
                            <div className="w-1 h-1 rounded-full bg-white/15" />
                          </div>
                        )}

                        {/* Planet Button */}
                        <button
                          onClick={() => { onSelectPlanet(planet); onClose(); }}
                          className="flex-1 flex items-center gap-3 py-3 cursor-pointer group/btn hover:bg-white/[0.03] rounded-lg px-2 transition-colors"
                        >
                          <span
                            className="w-3 h-3 rounded-full shrink-0 ring-2 ring-transparent group-hover/btn:ring-white/20 transition-all"
                            style={{ backgroundColor: planet.color, boxShadow: `0 0 8px ${planet.color}50` }}
                          />
                          <div className="flex-1 text-left">
                            <span className="text-[13px] font-mono tracking-[0.12em] uppercase text-white/70 group-hover/btn:text-white transition-colors">
                              {planet.name}
                            </span>
                            <span className="block text-[9px] font-mono tracking-wider text-white/25 mt-0.5">
                              {planet.type} · {planet.moons} moon{planet.moons !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </button>
                      </div>

                      {/* Moon Dropdown */}
                      <AnimatePresence>
                        {isExpanded && hasMoons && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-12 pr-5 pb-1">
                              {moons.map((moon) => (
                                <button
                                  key={moon.id}
                                  onClick={() => { onSelectMoon(moon, planet); onClose(); }}
                                  className="w-full flex items-center gap-2.5 py-2 px-2 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer group/moon"
                                >
                                  <span
                                    className="w-2 h-2 rounded-full shrink-0"
                                    style={{ backgroundColor: moon.color, boxShadow: `0 0 6px ${moon.color}40` }}
                                  />
                                  <span className="text-[11px] font-mono tracking-[0.1em] uppercase text-white/40 group-hover/moon:text-white/80 transition-colors">
                                    {moon.name}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-4 pt-2">
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-3" />
                <span className="text-[9px] font-mono tracking-wider text-white/20 block text-center">
                  {PLANETS.length} PLANETS · CLICK TO EXPLORE
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
