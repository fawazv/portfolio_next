export const vertexShader = `
  uniform float uTime;
  uniform float uSize;
  uniform float uScale;
  
  attribute float size;
  
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = color;
    vAlpha = 1.0;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * uSize * uScale * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uTime;
  
  void main() {
    float r = distance(gl_PointCoord, vec2(0.5));
    if (r > 0.5) discard;
    
    // Soft edge bloom effect
    float glow = 1.0 - (r * 2.0);
    glow = pow(glow, 1.5);
    
    // Twinkle effect
    float twinkle = 0.8 + 0.2 * sin(uTime * 3.0 + vColor.r * 10.0);
    
    gl_FragColor = vec4(vColor, vAlpha * glow * twinkle);
  }
`;
