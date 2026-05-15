import * as THREE from "three";

export const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPositionNormal;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const atmosphereFragmentShader = `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uExponent;

  varying vec3 vNormal;
  varying vec3 vPositionNormal;

  void main() {
    // Calculate the dot product between the view vector and the normal
    float intensity = pow(0.65 - dot(vNormal, vPositionNormal), uExponent);
    
    // Scale intensity
    intensity = clamp(intensity * uIntensity, 0.0, 1.0);
    
    // Output final color with calculated alpha
    gl_FragColor = vec4(uColor, intensity);
  }
`;
