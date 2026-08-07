export const velocityShader = /* glsl */ `
  uniform float uTime;
  uniform float uDelta;
  uniform float uAmbientStrength;
  uniform float uNoiseScale;
  uniform float uNoiseSpeed;
  uniform float uDamping;
  uniform float uPointerRadius;
  uniform float uPointerRepulsion;
  uniform float uPointerVelocityTransfer;
  uniform float uPointerVortexStrength;
  uniform float uPointerInfluence;
  uniform float uScrollVelocity;
  uniform float uScrollStrength;
  uniform float uMaxVelocity;
  uniform vec2 uPointer;
  uniform vec2 uPointerVelocity;

  // The field is the curl of two smooth scalar potentials. It stays coherent
  // over time and, unlike per-frame randomness, produces fluid-like paths.
  vec2 curlFlow(vec2 point, float seed) {
    vec2 p = point * uNoiseScale;
    float t = uTime * uNoiseSpeed;

    float phaseA = p.x * 1.31 + t + seed * 4.1;
    float phaseB = p.y * 1.73 - t * 0.83 - seed * 2.7;
    float phaseC = p.x * 2.17 - t * 0.61 - seed * 3.3;
    float phaseD = p.y * 1.19 + t * 0.74 + seed * 5.2;

    float dPotentialDy = -1.73 * sin(phaseA) * sin(phaseB)
      + 0.52 * 1.19 * cos(phaseC) * cos(phaseD);
    float dPotentialDx = 1.31 * cos(phaseA) * cos(phaseB)
      - 0.52 * 2.17 * sin(phaseC) * sin(phaseD);

    return vec2(dPotentialDy, -dPotentialDx) * 0.42;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 positionData = texture2D(texturePosition, uv);
    vec4 velocityData = texture2D(textureVelocity, uv);
    vec2 position = positionData.xy;
    vec2 velocity = velocityData.xy;
    float seed = positionData.w;
    float dt = min(uDelta, 0.033);

    vec2 acceleration = curlFlow(position, seed) * uAmbientStrength;

    vec2 pointerDelta = position - uPointer;
    float pointerDistance = length(pointerDelta);
    float radius = max(uPointerRadius, 0.001);
    float radialFalloff = exp(-pow(pointerDistance / radius, 2.0));
    vec2 radialDirection = pointerDelta / max(pointerDistance, 0.001);
    float pointerSpeed = length(uPointerVelocity);

    acceleration += radialDirection
      * radialFalloff
      * uPointerRepulsion
      * uPointerInfluence
      * (0.16 + min(pointerSpeed, 2.5) * 0.2);

    if (pointerSpeed > 0.001) {
      vec2 pointerDirection = uPointerVelocity / pointerSpeed;
      vec2 wakeCenter = uPointer - pointerDirection * radius * 0.75;
      vec2 wakeDelta = position - wakeCenter;
      float wakeFalloff = exp(-dot(wakeDelta, wakeDelta) / (radius * radius * 2.1));
      vec2 tangent = vec2(-radialDirection.y, radialDirection.x);
      float vortexDirection = sign(dot(tangent, pointerDirection) + 0.001);

      acceleration += uPointerVelocity
        * wakeFalloff
        * uPointerVelocityTransfer
        * uPointerInfluence;
      acceleration += tangent
        * vortexDirection
        * wakeFalloff
        * uPointerVortexStrength
        * uPointerInfluence
        * min(pointerSpeed, 2.0);
    }

    // Scroll adds a restrained global bias, while the sinusoidal x component
    // prevents a fast flick from looking like a uniform screen translation.
    acceleration += vec2(
      sin(position.y * 2.7 + seed * 6.283) * abs(uScrollVelocity) * 0.16,
      -uScrollVelocity
    ) * uScrollStrength;

    velocity += acceleration * dt;
    velocity *= pow(uDamping, dt * 60.0);

    float speed = length(velocity);
    if (speed > uMaxVelocity) velocity *= uMaxVelocity / speed;

    float zVelocity = sin(uTime * 0.13 + seed * 12.0 + position.x) * 0.006;
    gl_FragColor = vec4(velocity, zVelocity, velocityData.w);
  }
`;

export const positionShader = /* glsl */ `
  uniform float uDelta;
  uniform float uAspect;
  uniform float uSimulationMargin;

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 positionData = texture2D(texturePosition, uv);
    vec3 velocity = texture2D(textureVelocity, uv).xyz;
    vec3 position = positionData.xyz + velocity * min(uDelta, 0.033);

    float limitX = uAspect * uSimulationMargin;
    float limitY = uSimulationMargin;

    // Soft wrapping in a domain larger than the viewport avoids visible walls.
    position.x = mod(position.x + limitX, limitX * 2.0) - limitX;
    position.y = mod(position.y + limitY, limitY * 2.0) - limitY;
    position.z = clamp(position.z, -0.18, 0.18);

    gl_FragColor = vec4(position, positionData.w);
  }
`;

export const particleVertexShader = /* glsl */ `
  uniform sampler2D uPositionTexture;
  uniform sampler2D uVelocityTexture;
  uniform float uPointSize;
  uniform float uDpr;
  attribute vec2 aReference;
  varying float vOpacity;

  void main() {
    vec4 positionData = texture2D(uPositionTexture, aReference);
    vec2 velocity = texture2D(uVelocityTexture, aReference).xy;
    float randomSize = 0.72 + fract(positionData.w * 91.7) * 0.72;
    float speedLift = min(length(velocity) * 0.32, 0.2);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(positionData.xyz, 1.0);
    gl_PointSize = uPointSize * uDpr * randomSize;
    vOpacity = 0.48 + fract(positionData.w * 37.1) * 0.52 + speedLift;
  }
`;

export const particleFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vOpacity;

  void main() {
    float distanceToCenter = length(gl_PointCoord - 0.5);
    float circle = 1.0 - smoothstep(0.2, 0.5, distanceToCenter);
    float alpha = circle * vOpacity * uOpacity;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`;
