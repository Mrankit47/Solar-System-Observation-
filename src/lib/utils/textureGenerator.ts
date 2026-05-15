import * as THREE from "three";

// Custom fract function since Math.fract doesn't exist natively in JS
function fract(x: number) {
  return x - Math.floor(x);
}

// Simple fast pseudo-random noise
function random(x: number, y: number) {
  return fract(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
}

function noise(x: number, y: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = fract(x);
  const fy = fract(y);

  const a = random(ix, iy);
  const b = random(ix + 1, iy);
  const c = random(ix, iy + 1);
  const d = random(ix + 1, iy + 1);

  const ux = fx * fx * (3.0 - 2.0 * fx);
  const uy = fy * fy * (3.0 - 2.0 * fy);

  return a + (b - a) * ux + (c - a) * uy * (1.0 - ux) + (d - b) * ux * uy;
}

function fbm(x: number, y: number, octaves: number) {
  let v = 0.0;
  let a = 0.5;
  let shift = 100.0;
  for (let i = 0; i < octaves; i++) {
    v += a * noise(x, y);
    x = x * 2.0 + shift;
    y = y * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

// Generate an offscreen texture and return it as a CanvasTexture
export function generatePlanetTexture(
  type: "Terrestrial" | "Gas Giant" | "Ice Giant" | "Moon", 
  baseColorHex: string,
  resolution = 512,
  surfaceType?: "Rocky" | "Volcanic" | "Icy" | "Atmospheric"
): { colorMap: THREE.CanvasTexture; roughnessMap: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  
  if (typeof document === 'undefined') {
    const emptyTexture = new THREE.Texture();
    return { colorMap: emptyTexture as any, roughnessMap: emptyTexture as any, bumpMap: emptyTexture as any };
  }

  const canvas = document.createElement("canvas");
  canvas.width = resolution;
  canvas.height = resolution / 2;
  const ctx = canvas.getContext("2d");
  
  const rCanvas = document.createElement("canvas");
  rCanvas.width = resolution;
  rCanvas.height = resolution / 2;
  const rCtx = rCanvas.getContext("2d");

  const bCanvas = document.createElement("canvas");
  bCanvas.width = resolution;
  bCanvas.height = resolution / 2;
  const bCtx = bCanvas.getContext("2d");

  if (!ctx || !rCtx || !bCtx) {
    const emptyCanvas = new THREE.CanvasTexture(canvas);
    return { colorMap: emptyCanvas, roughnessMap: emptyCanvas, bumpMap: emptyCanvas };
  }

  const imgData = ctx.createImageData(resolution, resolution / 2);
  const rImgData = rCtx.createImageData(resolution, resolution / 2);
  const bImgData = bCtx.createImageData(resolution, resolution / 2);

  const baseColor = new THREE.Color(baseColorHex);
  const hsl = { h: 0, s: 0, l: 0 };
  baseColor.getHSL(hsl);

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const idx = (y * canvas.width + x) * 4;
      
      const u = x / canvas.width;
      const v = y / canvas.height;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const nx = Math.sin(phi) * Math.cos(theta);
      const ny = Math.sin(phi) * Math.sin(theta);
      const nz = Math.cos(phi);

      let n = 0;
      let roughness = 0.8;
      let bump = 0;
      
      if (type === "Gas Giant" || type === "Ice Giant") {
        const scale = 5.0;
        const turbulence = fbm(nx * scale, ny * scale, 4);
        n = Math.sin(ny * 20.0 + turbulence * 5.0) * 0.5 + 0.5;
        const storm = Math.max(0, 1.0 - Math.sqrt(Math.pow(nx - 0.5, 2) + Math.pow(ny - 0.2, 2)) * 10.0);
        n = n + storm * 0.5;
        roughness = 0.6 + n * 0.2;
        bump = n * 0.1;
      } else if (type === "Moon") {
        if (surfaceType === "Volcanic") {
          // Io: Lava flows and sulfur deposits
          const flowNoise = fbm(nx * 4.0, ny * 4.0, 5);
          const spotNoise = noise(nx * 15.0, ny * 15.0);
          n = 0.4 + flowNoise * 0.4 + (spotNoise > 0.7 ? 0.2 : 0);
          roughness = 0.7;
          bump = flowNoise * 0.3;
        } else if (surfaceType === "Icy") {
          // Europa/Enceladus: Ice cracks and ridges
          const baseIce = fbm(nx * 3.0, ny * 3.0, 4);
          const cracks = Math.max(0, 1.0 - Math.abs(noise(nx * 20.0, ny * 20.0) - 0.5) * 10.0);
          n = 0.7 + baseIce * 0.3 - cracks * 0.2;
          roughness = 0.3 + cracks * 0.4;
          bump = baseIce * 0.1 + cracks * 0.4;
        } else if (surfaceType === "Atmospheric") {
          // Titan: Hazy atmosphere
          const haze = fbm(nx * 1.5, ny * 1.5, 3);
          n = 0.5 + haze * 0.5;
          roughness = 1.0;
          bump = 0;
        } else {
          // Rocky (Default Moon)
          const mariaNoise = fbm(nx * 2.5, ny * 2.5 + nz * 2.5, 3);
          const craterNoise = fbm(nx * 15.0, ny * 15.0 + nz * 15.0, 5);
          const isMaria = mariaNoise < 0.45;
          n = isMaria ? (mariaNoise * 0.6) : (0.7 + craterNoise * 0.3);
          roughness = isMaria ? 0.9 : 0.8;
          bump = craterNoise * 0.8;
          n += noise(nx * 50, ny * 50) * 0.05;
        }
      } else {
        // Terrestrial
        const scale = 5.0;
        n = fbm(nx * scale, ny * scale + nz * scale, 6);
        if (n < 0.4) {
          roughness = 0.2;
          bump = 0.1;
          n = n * 0.8;
        } else {
          roughness = 0.8 + (n - 0.4);
          bump = (n - 0.4) * 2.0;
        }
      }

      const color = new THREE.Color();
      let lValue = hsl.l;
      
      if (type === "Moon") {
        if (surfaceType === "Volcanic") {
          // Add some red/orange variation for sulfur
          const sulfurMix = noise(nx * 5, ny * 5);
          color.setHSL(hsl.h + (sulfurMix - 0.5) * 0.1, hsl.s, hsl.l * (0.8 + n * 0.4));
        } else if (surfaceType === "Icy") {
          color.setHSL(hsl.h, hsl.s * 0.5, hsl.l * (0.9 + n * 0.2));
        } else if (surfaceType === "Atmospheric") {
          color.setHSL(hsl.h, hsl.s, hsl.l * (0.9 + n * 0.1));
        } else {
          lValue = Math.max(0.05, Math.min(0.9, hsl.l * (0.3 + n)));
          color.setHSL(hsl.h, hsl.s, lValue);
        }
      } else {
        lValue = Math.max(0.1, Math.min(1.0, hsl.l * (0.5 + n)));
        color.setHSL(hsl.h, hsl.s, lValue);
      }

      imgData.data[idx] = color.r * 255;
      imgData.data[idx + 1] = color.g * 255;
      imgData.data[idx + 2] = color.b * 255;
      imgData.data[idx + 3] = 255;

      const rVal = roughness * 255;
      rImgData.data[idx] = rVal;
      rImgData.data[idx + 1] = rVal;
      rImgData.data[idx + 2] = rVal;
      rImgData.data[idx + 3] = 255;

      const bVal = Math.min(255, bump * 255);
      bImgData.data[idx] = bVal;
      bImgData.data[idx + 1] = bVal;
      bImgData.data[idx + 2] = bVal;
      bImgData.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  rCtx.putImageData(rImgData, 0, 0);
  bCtx.putImageData(bImgData, 0, 0);

  const cTex = new THREE.CanvasTexture(canvas);
  const rTex = new THREE.CanvasTexture(rCanvas);
  const bTex = new THREE.CanvasTexture(bCanvas);
  
  cTex.colorSpace = THREE.SRGBColorSpace;
  cTex.generateMipmaps = true;
  
  return { colorMap: cTex, roughnessMap: rTex, bumpMap: bTex };
}
