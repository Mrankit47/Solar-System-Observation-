export const starVertexShader = `
  uniform float uTime;
  attribute float size;
  attribute vec3 color;
  attribute float twinkleSpeed;
  attribute float twinkleOffset;
  
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = color;
    
    // Twinkle effect: vary alpha based on time, speed, and offset
    float twinkle = (sin(uTime * twinkleSpeed + twinkleOffset) + 1.0) * 0.5;
    vAlpha = 0.3 + (twinkle * 0.7); // Keep minimum brightness at 30%

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    
    // Size attenuation (distant stars appear smaller)
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const starFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Create a soft circle
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float alpha = 1.0 - (distanceToCenter * 2.0);
    
    // Smooth out the edges
    alpha = smoothstep(0.0, 1.0, alpha);
    
    // Core is brighter, edges fade out
    float core = pow(alpha, 3.0);
    
    // Mix the base color with white for the core to make it look hot/bright
    vec3 finalColor = mix(vColor, vec3(1.0), core * 0.5);

    gl_FragColor = vec4(finalColor, alpha * vAlpha);
  }
`;
