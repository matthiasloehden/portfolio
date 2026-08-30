export const velocityShader = /* glsl */ `
  uniform float uTime;
  uniform float uDelta;
  uniform float uAmbientStrength;
  uniform float uNoiseScale;
  uniform float uNoiseSpeed;
  uniform float uDamping;
  uniform float uInteractionDamping;
  uniform float uInteractionMomentum;
  uniform float uInteractionMaxVelocity;
  uniform float uPointerRadius;
  uniform float uPointerRepulsion;
  uniform float uClickAttraction;
  uniform float uClickInfluence;
  uniform float uPointerVelocityTransfer;
  uniform float uPointerVortexStrength;
  uniform float uPointerInfluence;
  uniform float uIdleRingRadius;
  uniform float uIdleRingThickness;
  uniform float uIdleAttraction;
  uniform float uIdleOrbitStrength;
  uniform float uScrollVelocity;
  uniform float uScrollStrength;
  uniform float uMaxVelocity;
  uniform float uAspect;
  uniform bool uBoundaryCollisions;
  uniform float uBoundaryRestitution;
  uniform vec2 uPointer;
  uniform vec2 uPointerVelocity;

  // Each layer is the exact curl of a scalar potential. Keeping the field
  // divergence-free prevents particles from settling into artificial sinks.
  vec2 curlLayer(
    vec2 point,
    vec2 axisA,
    vec2 axisB,
    float frequencyA,
    float frequencyB,
    float phaseA,
    float phaseB
  ) {
    float waveA = dot(point, axisA) * frequencyA + phaseA;
    float waveB = dot(point, axisB) * frequencyB + phaseB;
    vec2 gradient = axisA * frequencyA * cos(waveA) * sin(waveB)
      + axisB * frequencyB * sin(waveA) * cos(waveB);

    return vec2(gradient.y, -gradient.x);
  }

  vec2 curlFlow(vec2 point, float seed) {
    vec2 p = point * uNoiseScale;
    float t = uTime * uNoiseSpeed;
    vec2 first = curlLayer(
      p,
      normalize(vec2(1.0, 0.37)),
      normalize(vec2(-0.28, 1.0)),
      1.17,
      1.61,
      t + seed * 4.1,
      -t * 0.83 - seed * 2.7
    );
    vec2 second = curlLayer(
      p,
      normalize(vec2(0.62, 1.0)),
      normalize(vec2(-1.0, 0.48)),
      2.03,
      1.31,
      -t * 0.61 - seed * 3.3,
      t * 0.74 + seed * 5.2
    );

    return (first + second * 0.38) * 0.34;
  }

  vec2 scrollVortex(vec2 point, float seed) {
    float fieldRadius = max(1.0, uAspect) * 0.92;
    vec2 center = vec2(
      sin(uTime * 0.29) * uAspect * 0.14,
      cos(uTime * 0.23) * 0.12
    );
    vec2 fromCenter = point - center;
    float distanceFromCenter = length(fromCenter);
    float falloff = exp(-pow(distanceFromCenter / fieldRadius, 2.0));
    vec2 tangent = vec2(-fromCenter.y, fromCenter.x) / max(distanceFromCenter, 0.08);
    float variation = 0.82 + 0.18 * sin(seed * 12.7 + distanceFromCenter * 4.2);

    return tangent * falloff * variation;
  }

  vec2 idleRingFlow(vec2 point, float seed) {
    float distanceFromCenter = length(point);
    vec2 radial = distanceFromCenter > 0.001
      ? point / distanceFromCenter
      : vec2(cos(seed * 6.283), sin(seed * 6.283));
    vec2 tangent = vec2(-radial.y, radial.x);
    float radiusOffset = (fract(seed * 17.31) - 0.5) * uIdleRingThickness;
    float flutter = sin(uTime * 0.37 + seed * 31.7) * uIdleRingThickness * 0.08;
    float targetRadius = uIdleRingRadius + radiusOffset + flutter;
    float radialPull = (targetRadius - distanceFromCenter) * uIdleAttraction;
    float orbitVariation = 0.78 + fract(seed * 23.17) * 0.44;

    return radial * radialPull + tangent * uIdleOrbitStrength * orbitVariation;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 positionData = texture2D(texturePosition, uv);
    vec4 velocityData = texture2D(textureVelocity, uv);
    vec2 position = positionData.xy;
    vec2 velocity = velocityData.xy;
    float seed = positionData.w;
    float dt = min(uDelta, 0.033);

    float pointerActivity = clamp(max(uPointerInfluence, uClickInfluence), 0.0, 1.0);
    float scrollActivity = smoothstep(0.03, 0.55, abs(uScrollVelocity));
    float idleInfluence = 1.0 - max(pointerActivity, scrollActivity);
    float ambientMix = mix(1.0, 0.38, idleInfluence);
    vec2 acceleration = curlFlow(position, seed) * uAmbientStrength * ambientMix;
    acceleration += idleRingFlow(position, seed) * idleInfluence;

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
      * (1.0 - uClickInfluence * 0.85)
      * (0.16 + min(pointerSpeed, 2.5) * 0.2);

    // Clicks pull nearby particles toward the pointer independently from the
    // repelling cursor-movement channel.
    acceleration -= radialDirection
      * radialFalloff
      * uClickAttraction
      * uClickInfluence;

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

    // A scroll impulse rotates the field around a slowly drifting center. A
    // small opposing vertical bias preserves the physical sense of scrolling.
    vec2 scrollFlow = scrollVortex(position, seed) * uScrollVelocity;
    scrollFlow.y -= uScrollVelocity * 0.16;
    acceleration += scrollFlow * uScrollStrength;

    velocity += acceleration * dt;
    float momentum = clamp(uInteractionMomentum, 0.0, 1.0);
    float activeDamping = mix(uDamping, uInteractionDamping, momentum);
    velocity *= pow(activeDamping, dt * 60.0);

    float speed = length(velocity);
    float maxVelocity = mix(uMaxVelocity, uInteractionMaxVelocity, momentum);
    if (speed > maxVelocity) velocity *= maxVelocity / speed;

    if (uBoundaryCollisions) {
      vec2 limit = vec2(uAspect, 1.0);

      if ((position.x <= -limit.x && velocity.x < 0.0) || (position.x >= limit.x && velocity.x > 0.0)) {
        velocity.x *= -uBoundaryRestitution;
      }
      if ((position.y <= -limit.y && velocity.y < 0.0) || (position.y >= limit.y && velocity.y > 0.0)) {
        velocity.y *= -uBoundaryRestitution;
      }
    }

    float zVelocity = sin(uTime * 0.13 + seed * 12.0 + position.x) * 0.006;
    gl_FragColor = vec4(velocity, zVelocity, velocityData.w);
  }
`;

export const positionShader = /* glsl */ `
  uniform float uDelta;
  uniform float uAspect;
  uniform float uSimulationMargin;
  uniform bool uBoundaryCollisions;

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 positionData = texture2D(texturePosition, uv);
    vec3 velocity = texture2D(textureVelocity, uv).xyz;
    vec3 position = positionData.xyz + velocity * min(uDelta, 0.033);

    float limitX = uAspect * uSimulationMargin;
    float limitY = uSimulationMargin;

    if (uBoundaryCollisions) {
      position.xy = clamp(position.xy, vec2(-uAspect, -1.0), vec2(uAspect, 1.0));
    } else {
      // Soft wrapping in a domain larger than the viewport avoids visible walls.
      position.x = mod(position.x + limitX, limitX * 2.0) - limitX;
      position.y = mod(position.y + limitY, limitY * 2.0) - limitY;
    }
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
