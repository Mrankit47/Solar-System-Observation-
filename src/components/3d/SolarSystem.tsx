"use client";

import { PLANETS } from "@/lib/constants/planets";
import Planet from "./bodies/Planet";
import OrbitPath from "./base/OrbitPath";

export default function SolarSystem() {
  return (
    <group>
      {PLANETS.map((planet) => (
        <group key={planet.id} rotation={[planet.inclination * (Math.PI / 180), 0, 0]}>
          {/* Draw the faint orbital ring (hidden for realistic view) */}
          {/* <OrbitPath 
            distance={planet.distance} 
            eccentricity={planet.eccentricity} 
            color={planet.color} 
          /> */}
          
          {/* Render the moving planet */}
          <Planet data={planet} />
        </group>
      ))}
    </group>
  );
}
