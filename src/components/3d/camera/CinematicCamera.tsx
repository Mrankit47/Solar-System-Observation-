"use client";

import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useSpaceStore } from "@/store/useSpaceStore";

export default function CinematicCamera() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  
  const focusType = useSpaceStore((state) => state.focusType);
  const focusedPlanet = useSpaceStore((state) => state.focusedPlanet);
  const focusedMoon = useSpaceStore((state) => state.focusedMoon);
  const focusedMesh = useSpaceStore((state) => state.focusedMesh);

  // Default overview position
  const defaultPosition = new THREE.Vector3(0, 200, 400);
  const defaultTarget = new THREE.Vector3(0, 0, 0);

  // Temporary vectors to avoid garbage collection in useFrame
  const targetPos = new THREE.Vector3();
  const cameraTargetPos = new THREE.Vector3();

  // Track if we need to animate back to default position
  const isResetting = useRef(false);
  const previousFocusType = useRef(focusType);

  if (focusType !== previousFocusType.current) {
    if (focusType === null) {
      isResetting.current = true;
    }
    previousFocusType.current = focusType;
  }

  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    if (focusType && focusedMesh) {
      isResetting.current = false;
      // 1. Get exact current world position of the focused object
      focusedMesh.getWorldPosition(targetPos);
      
      // 2. Calculate offset based on whether it's a planet or moon
      let offsetDistance: number;
      if (focusType === "moon" && focusedMoon) {
        offsetDistance = Math.max(focusedMoon.radius * 12, 1.5);
      } else if (focusType === "planet" && focusedPlanet) {
        offsetDistance = focusedPlanet.radius * 6;
      } else {
        offsetDistance = 5;
      }
      
      cameraTargetPos.copy(targetPos).add(new THREE.Vector3(offsetDistance, offsetDistance * 0.5, offsetDistance));

      // 3. Smoothly damp camera position towards the target position
      state.camera.position.lerp(cameraTargetPos, 2.5 * delta);

      // 4. Smoothly damp the OrbitControls target to look at the focused object
      controlsRef.current.target.lerp(targetPos, 3.5 * delta);
    } else if (isResetting.current) {
      // Smoothly return to overview position
      state.camera.position.lerp(defaultPosition, 1.5 * delta);
      controlsRef.current.target.lerp(defaultTarget, 2.0 * delta);

      // Stop resetting once we are close enough, handing full control back to the user
      if (state.camera.position.distanceToSquared(defaultPosition) < 0.5 && controlsRef.current.target.distanceToSquared(defaultTarget) < 0.5) {
        isResetting.current = false;
      }
    }

    controlsRef.current.update();
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 200, 400]} fov={45} />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        enableDamping
        dampingFactor={0.05}
        maxDistance={1000}
        minDistance={2}
      />
    </>
  );
}
