"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_STEPS = [
  "INITIALIZING QUANTUM CORE...",
  "CALIBRATING ORBITAL SENSORS...",
  "MAPPING CELESTIAL BODIES...",
  "ESTABLISHING NEURAL LINK...",
  "SYNCING SOLAR TELEMETRY...",
  "SYSTEMS NOMINAL."
];

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < LOADING_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 600);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) return prev + 1;
        return 100;
      });
    }, 30);

    const timeout = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(20px)" }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.05)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center max-w-xs w-full px-6">
        {/* Brand Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-12 text-center"
        >
          <h1 className="text-2xl font-light tracking-[0.6em] text-white uppercase mb-2">
            GALAXIUM
          </h1>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <span className="text-[9px] font-mono tracking-[0.4em] text-cyan-400/40 uppercase block mt-2">
            Universal Observatory
          </span>
        </motion.div>

        {/* Telemetry Text (The Suspense) */}
        <div className="w-full mb-6 min-h-[40px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="w-1.5 h-1.5 bg-cyan-400 animate-pulse rounded-full" />
              <span className="text-[10px] font-mono tracking-widest text-white/60 uppercase">
                {LOADING_STEPS[stepIndex]}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[9px] font-mono text-cyan-400/40 uppercase">Calibration</span>
            <span className="text-[10px] font-mono text-cyan-400">{progress}%</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]"
            />
          </div>
        </div>

        {/* Binary/Data Noise Decals */}
        <div className="absolute -bottom-32 left-0 right-0 opacity-[0.03] font-mono text-[8px] text-white leading-tight select-none pointer-events-none">
          <div className="whitespace-nowrap">0xa4f7e3b901c8d25f6a0e94b7c3d18f260xa4f7e3b901c8d25f6a0e94b7c3d18f26</div>
          <div className="whitespace-nowrap">0x3c9a7f1e08b4d62c5a1f73e9b0d84c260x3c9a7f1e08b4d62c5a1f73e9b0d84c26</div>
          <div className="whitespace-nowrap">0xf1e8a3b7c09d4f2e6b5a81c3d7f09e240xf1e8a3b7c09d4f2e6b5a81c3d7f09e24</div>
          <div className="whitespace-nowrap">0x7d2c4e9a1b8f35d06c7a2e4b9f1d83c50x7d2c4e9a1b8f35d06c7a2e4b9f1d83c5</div>
          <div className="whitespace-nowrap">0xe5b1f8c3a07d29e4b6c1f5a8d3e07b920xe5b1f8c3a07d29e4b6c1f5a8d3e07b92</div>
        </div>
      </div>

      {/* Scanning Line Effect */}
      <motion.div
        animate={{ y: ["0%", "100%", "0%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none"
      />
    </motion.div>
  );
}
