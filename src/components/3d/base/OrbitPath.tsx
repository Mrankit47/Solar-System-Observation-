"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";

interface OrbitPathProps {
  distance: number;
  eccentricity: number;
  color?: string;
}

export default function OrbitPath({ distance, eccentricity, color = "#444444" }: OrbitPathProps) {
  const points = useMemo(() => {
    const a = distance;
    const e = eccentricity;
    const b = a * Math.sqrt(1 - e * e);
    const focusOffset = a * e;

    const curve = new THREE.EllipseCurve(
      -focusOffset, 0, // ax, aY (center of ellipse)
      a, b,            // xRadius, yRadius
      0, 2 * Math.PI,  // aStartAngle, aEndAngle
      false,           // aClockwise
      0                // aRotation
    );

    // Get points along the curve (returns Vector2)
    const curvePoints = curve.getPoints(128);
    
    // Map Vector2 (x, y) to Vector3 (x, 0, z) for 3D space
    return curvePoints.map((p) => new THREE.Vector3(p.x, 0, p.y));
  }, [distance, eccentricity]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={1}
      transparent
      opacity={0.3}
      depthWrite={false}
    />
  );
}
