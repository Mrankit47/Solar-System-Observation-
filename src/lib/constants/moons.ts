export interface MoonData {
  id: string;
  name: string;
  parentId: string;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  color: string;
  description: string;
  textureMap?: string;
  surfaceType?: "Rocky" | "Volcanic" | "Icy" | "Atmospheric";
}

export const MOONS: MoonData[] = [
  // ═══════ EARTH ═══════
  {
    id: "luna",
    name: "Luna",
    parentId: "earth",
    radius: 0.27,
    orbitRadius: 2.5,
    orbitSpeed: 1.2,
    rotationSpeed: 0.5,
    color: "#b0b0b0",
    surfaceType: "Rocky",
    description: "Earth's only natural satellite. Its gravitational pull drives ocean tides and stabilizes Earth's axial tilt. Formed ~4.5 billion years ago from a giant impact event.",
    textureMap: "/textures/moon.jpg",
  },

  // ═══════ MARS ═══════
  {
    id: "phobos",
    name: "Phobos",
    parentId: "mars",
    radius: 0.08,
    orbitRadius: 1.4,
    orbitSpeed: 3.5,
    rotationSpeed: 0.3,
    color: "#8a7e6b",
    surfaceType: "Rocky",
    description: "Mars's larger, irregularly shaped moon. Orbits so close that it will eventually break apart into a ring system in ~50 million years.",
  },
  {
    id: "deimos",
    name: "Deimos",
    parentId: "mars",
    radius: 0.05,
    orbitRadius: 2.0,
    orbitSpeed: 1.8,
    rotationSpeed: 0.2,
    color: "#9e9585",
    surfaceType: "Rocky",
    description: "Mars's smaller, outer moon. Slowly spiraling outward and may eventually escape Mars's gravity entirely.",
  },

  // ═══════ JUPITER (Galilean Moons) ═══════
  {
    id: "io",
    name: "Io",
    parentId: "jupiter",
    radius: 0.28,
    orbitRadius: 5.5,
    orbitSpeed: 2.8,
    rotationSpeed: 0.6,
    color: "#f5e050",
    surfaceType: "Volcanic",
    description: "The most volcanically active body in the solar system. Over 400 active volcanoes driven by extreme tidal heating from Jupiter's gravity.",
  },
  {
    id: "europa",
    name: "Europa",
    parentId: "jupiter",
    radius: 0.24,
    orbitRadius: 7.0,
    orbitSpeed: 1.9,
    rotationSpeed: 0.5,
    color: "#e6eaf5",
    surfaceType: "Icy",
    description: "Possesses a subsurface ocean beneath its icy crust. One of the strongest candidates for extraterrestrial life in our solar system.",
  },
  {
    id: "ganymede",
    name: "Ganymede",
    parentId: "jupiter",
    radius: 0.41,
    orbitRadius: 9.0,
    orbitSpeed: 1.2,
    rotationSpeed: 0.4,
    color: "#a09b95",
    surfaceType: "Rocky",
    description: "The largest moon in the solar system — bigger than Mercury. The only moon known to possess its own magnetic field.",
  },
  {
    id: "callisto",
    name: "Callisto",
    parentId: "jupiter",
    radius: 0.37,
    orbitRadius: 11.5,
    orbitSpeed: 0.7,
    rotationSpeed: 0.3,
    color: "#6b6762",
    surfaceType: "Rocky",
    description: "The most heavily cratered object in the solar system. Its ancient surface has remained geologically dead for over 4 billion years.",
  },

  // ═══════ SATURN ═══════
  {
    id: "titan",
    name: "Titan",
    parentId: "saturn",
    radius: 0.40,
    orbitRadius: 8.5,
    orbitSpeed: 1.0,
    rotationSpeed: 0.4,
    color: "#ffc233",
    surfaceType: "Atmospheric",
    description: "The only moon with a dense atmosphere and stable surface liquid (methane/ethane lakes). Larger than Mercury with a nitrogen-rich atmosphere.",
  },
  {
    id: "enceladus",
    name: "Enceladus",
    parentId: "saturn",
    radius: 0.12,
    orbitRadius: 5.5,
    orbitSpeed: 2.5,
    rotationSpeed: 0.6,
    color: "#ffffff",
    surfaceType: "Icy",
    description: "Shoots geysers of water ice from its south pole. Confirmed subsurface ocean with hydrothermal activity — a prime astrobiology target.",
  },
  {
    id: "mimas",
    name: "Mimas",
    parentId: "saturn",
    radius: 0.08,
    orbitRadius: 4.2,
    orbitSpeed: 3.2,
    rotationSpeed: 0.5,
    color: "#d1d1d1",
    surfaceType: "Rocky",
    description: "Known as the 'Death Star' moon due to the massive Herschel crater covering nearly a third of its diameter.",
  },
  {
    id: "rhea",
    name: "Rhea",
    parentId: "saturn",
    radius: 0.15,
    orbitRadius: 10.0,
    orbitSpeed: 0.8,
    rotationSpeed: 0.3,
    color: "#c7bfb5",
    surfaceType: "Rocky",
    description: "Saturn's second-largest moon. May possess a tenuous ring system of its own — the first rings ever detected around a moon.",
  },
  {
    id: "dione",
    name: "Dione",
    parentId: "saturn",
    radius: 0.11,
    orbitRadius: 7.0,
    orbitSpeed: 1.3,
    rotationSpeed: 0.4,
    color: "#e1dfda",
    surfaceType: "Icy",
    description: "An icy moon with bright, wispy cliffs of ice on its trailing hemisphere. Evidence suggests a subsurface ocean exists.",
  },

  // ═══════ URANUS ═══════
  {
    id: "titania",
    name: "Titania",
    parentId: "uranus",
    radius: 0.18,
    orbitRadius: 4.5,
    orbitSpeed: 1.0,
    rotationSpeed: 0.4,
    color: "#bfb8b8",
    surfaceType: "Rocky",
    description: "The largest moon of Uranus. Features enormous fault canyons up to 1,500 km long, indicating past tectonic activity.",
  },
  {
    id: "oberon",
    name: "Oberon",
    parentId: "uranus",
    radius: 0.17,
    orbitRadius: 6.0,
    orbitSpeed: 0.7,
    rotationSpeed: 0.3,
    color: "#999494",
    surfaceType: "Rocky",
    description: "Uranus's outermost major moon. Its dark surface is covered with impact craters, some with bright ray systems.",
  },
  {
    id: "miranda",
    name: "Miranda",
    parentId: "uranus",
    radius: 0.07,
    orbitRadius: 3.0,
    orbitSpeed: 2.0,
    rotationSpeed: 0.5,
    color: "#d1c9bf",
    surfaceType: "Rocky",
    description: "Has one of the most extreme and varied landscapes in the solar system, including Verona Rupes — the tallest known cliff at 20 km high.",
  },

  // ═══════ NEPTUNE ═══════
  {
    id: "triton",
    name: "Triton",
    parentId: "neptune",
    radius: 0.21,
    orbitRadius: 4.5,
    orbitSpeed: -1.2,
    rotationSpeed: 0.4,
    color: "#cce0ff",
    surfaceType: "Icy",
    description: "The only large moon with a retrograde orbit, suggesting it was captured from the Kuiper Belt. Has active nitrogen geysers.",
  },
  {
    id: "nereid",
    name: "Nereid",
    parentId: "neptune",
    radius: 0.05,
    orbitRadius: 7.0,
    orbitSpeed: 0.3,
    rotationSpeed: 0.2,
    color: "#a3a3a3",
    surfaceType: "Rocky",
    description: "Has one of the most eccentric orbits of any known moon. Its orbit suggests it may be a captured asteroid or Kuiper Belt object.",
  },
];

/** Helper to get moons for a specific planet */
export function getMoonsByPlanet(planetId: string): MoonData[] {
  return MOONS.filter((moon) => moon.parentId === planetId);
}
