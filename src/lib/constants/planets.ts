export interface PlanetData {
  id: string;
  name: string;
  radius: number;
  distance: number;
  eccentricity: number;
  inclination: number;      // Orbital inclination in degrees
  orbitSpeed: number;
  rotationSpeed: number;
  color: string;
  hasRings?: boolean;
  ringColor?: string;
  ringInnerRadius?: number;
  ringOuterRadius?: number;
  // Scientific metadata for HUD
  type: string;
  massEarths: number;       // Mass relative to Earth
  gravityEarths: number;    // Surface gravity relative to Earth
  tempCelsius: number;      // Mean surface temperature
  moons: number;
  dayLength: string;        // Human-readable day length
  yearLength: string;       // Human-readable year length
  atmosphere: string[];     // Primary atmospheric components
  description: string;      // Brief scientific description
  textureMap: string;       // Main color map
  nightMap?: string;        // Night/city lights map (for Earth)
  cloudsMap?: string;       // Clouds map
  bumpMap?: string;         // Height/bump map
  ringAlpha?: string;       // Ring transparency map
}

export const PLANETS: PlanetData[] = [
  {
    id: "mercury",
    name: "Mercury",
    radius: 0.38,
    distance: 15,
    eccentricity: 0.205,
    inclination: 7.0,
    orbitSpeed: 4.15,
    rotationSpeed: 0.05,
    color: "#8c8c8c",
    type: "Terrestrial",
    massEarths: 0.055,
    gravityEarths: 0.38,
    tempCelsius: 167,
    moons: 0,
    dayLength: "58.6 days",
    yearLength: "88 days",
    atmosphere: ["Oxygen", "Sodium", "Hydrogen"],
    description: "The smallest and innermost planet. Its heavily cratered surface resembles Earth's Moon. Extreme temperature swings between day and night.",
    textureMap: "/textures/mercury.jpg",
  },
  {
    id: "venus",
    name: "Venus",
    radius: 0.95,
    distance: 25,
    eccentricity: 0.007,
    inclination: 3.4,
    orbitSpeed: 1.62,
    rotationSpeed: -0.02,
    color: "#e3bb76",
    type: "Terrestrial",
    massEarths: 0.815,
    gravityEarths: 0.904,
    tempCelsius: 464,
    moons: 0,
    dayLength: "243 days",
    yearLength: "225 days",
    atmosphere: ["CO₂", "Nitrogen", "Sulfuric Acid"],
    description: "Earth's toxic twin with a runaway greenhouse atmosphere. Surface pressure is 92x Earth's. Rotates retrograde, meaning the Sun rises in the west.",
    textureMap: "/textures/venus.jpg",
    cloudsMap: "/textures/venus.jpg",
  },
  {
    id: "earth",
    name: "Earth",
    radius: 1,
    distance: 35,
    eccentricity: 0.016,
    inclination: 0.0,
    orbitSpeed: 1.0,
    rotationSpeed: 1.0,
    color: "#2b82c9",
    type: "Terrestrial",
    massEarths: 1.0,
    gravityEarths: 1.0,
    tempCelsius: 15,
    moons: 1,
    dayLength: "24 hrs",
    yearLength: "365.25 days",
    atmosphere: ["Nitrogen", "Oxygen", "Argon"],
    description: "The only known planet with liquid surface water and confirmed life. Protected by a powerful magnetosphere and a nitrogen-oxygen atmosphere.",
    textureMap: "/textures/earth_day.jpg",
    nightMap: "/textures/earth_night.jpg",
    cloudsMap: "/textures/earth_clouds.png",
  },
  {
    id: "mars",
    name: "Mars",
    radius: 0.53,
    distance: 50,
    eccentricity: 0.093,
    inclination: 1.85,
    orbitSpeed: 0.53,
    rotationSpeed: 0.98,
    color: "#c1440e",
    type: "Terrestrial",
    massEarths: 0.107,
    gravityEarths: 0.376,
    tempCelsius: -65,
    moons: 2,
    dayLength: "24.6 hrs",
    yearLength: "687 days",
    atmosphere: ["CO₂", "Nitrogen", "Argon"],
    description: "The Red Planet hosts Olympus Mons, the tallest volcano in the solar system. Evidence of ancient river valleys and polar ice caps suggest past water flows.",
    textureMap: "/textures/mars.jpg",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    radius: 3.5,
    distance: 100,
    eccentricity: 0.048,
    inclination: 1.3,
    orbitSpeed: 0.084,
    rotationSpeed: 2.4,
    color: "#d39c7e",
    type: "Gas Giant",
    massEarths: 317.8,
    gravityEarths: 2.528,
    tempCelsius: -110,
    moons: 95,
    dayLength: "9.9 hrs",
    yearLength: "11.86 yrs",
    atmosphere: ["Hydrogen", "Helium", "Methane"],
    description: "The largest planet in our system with a mass 2.5x all other planets combined. The Great Red Spot is a storm larger than Earth, raging for over 350 years.",
    textureMap: "/textures/jupiter.jpg",
  },
  {
    id: "saturn",
    name: "Saturn",
    radius: 2.9,
    distance: 160,
    eccentricity: 0.054,
    inclination: 2.49,
    orbitSpeed: 0.034,
    rotationSpeed: 2.2,
    color: "#ead6b8",
    hasRings: true,
    ringColor: "#d3c2a6",
    ringInnerRadius: 3.5,
    ringOuterRadius: 6.0,
    type: "Gas Giant",
    massEarths: 95.16,
    gravityEarths: 1.065,
    tempCelsius: -140,
    moons: 146,
    dayLength: "10.7 hrs",
    yearLength: "29.46 yrs",
    atmosphere: ["Hydrogen", "Helium", "Ammonia"],
    description: "Famous for its extensive ring system composed of ice and rock particles. Its density is so low that it would theoretically float in water.",
    textureMap: "/textures/saturn.jpg",
    ringAlpha: "/textures/saturn_ring.png",
  },
  {
    id: "uranus",
    name: "Uranus",
    radius: 1.8,
    distance: 230,
    eccentricity: 0.047,
    inclination: 0.77,
    orbitSpeed: 0.012,
    rotationSpeed: -1.4,
    color: "#4b70dd",
    type: "Ice Giant",
    massEarths: 14.54,
    gravityEarths: 0.886,
    tempCelsius: -195,
    moons: 28,
    dayLength: "17.2 hrs",
    yearLength: "84 yrs",
    atmosphere: ["Hydrogen", "Helium", "Methane"],
    description: "Rotates on its side with an axial tilt of 97.8°, likely from an ancient collision. Its blue-green color comes from methane absorbing red light.",
    textureMap: "/textures/uranus.jpg",
  },
  {
    id: "neptune",
    name: "Neptune",
    radius: 1.75,
    distance: 320,
    eccentricity: 0.008,
    inclination: 1.77,
    orbitSpeed: 0.006,
    rotationSpeed: 1.5,
    color: "#274687",
    type: "Ice Giant",
    massEarths: 17.15,
    gravityEarths: 1.137,
    tempCelsius: -200,
    moons: 16,
    dayLength: "16.1 hrs",
    yearLength: "164.8 yrs",
    atmosphere: ["Hydrogen", "Helium", "Methane"],
    description: "The windiest planet with speeds reaching 2,100 km/h. Discovered mathematically before being observed. Its vivid blue comes from atmospheric methane.",
    textureMap: "/textures/neptune.jpg",
  },
];
