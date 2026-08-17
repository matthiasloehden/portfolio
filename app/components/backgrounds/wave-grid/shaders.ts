/**
 * Provides the GLSL programs used by the Wave Grid renderer. The vertex
 * shader is generated because the trail texture capacity is a compile-time
 * WebGL constant; all visual behaviour otherwise remains runtime-configured.
 */

export function createWaveGridVertexShader(maxTrailPoints: number): string {
  return /* glsl */ `
    #define TRAIL_LENGTH ${maxTrailPoints}

    uniform sampler2D uTrail;
    uniform float uTrailCount;
    uniform float uTime;
    uniform float uIdleMotion;
    uniform float uInteractionMotion;
    uniform vec2 uGridSize;

    attribute float aLineStrength;

    varying float vLineStrength;
    varying float vWave;
    varying float vIdle;
    varying float vDepth;

    void main() {
      vec3 displaced = position;
      float wave = 0.0;

      for (int index = 0; index < TRAIL_LENGTH; index++) {
        if (float(index) >= uTrailCount) break;

        vec4 point = texture2D(
          uTrail,
          vec2(
            (float(index) + 0.5) /
            float(TRAIL_LENGTH),
            0.5
          )
        );

        vec2 origin =
          (point.rg - 0.5) *
          uGridSize;

        float age = point.b;
        float velocity = point.a;

        float distanceToPoint =
          distance(
            position.xz,
            origin
          );

        float radius =
          0.18 +
          age * 5.2;

        float width =
          0.12 +
          age * 0.18;

        float ring =
          exp(
            -pow(
              (distanceToPoint - radius) /
              width,
              2.0
            )
          );

        float wake =
          exp(
            -distanceToPoint * 1.8
          ) *
          exp(
            -age * 5.0
          );

        wave +=
          (
            ring * 0.3 +
            wake * 0.1
          ) *
          (
            0.28 +
            velocity * 0.72
          ) *
          (1.0 - age);
      }

      // Subtle ambient motion keeps the grid alive when idle.
      vec2 idleCenter = vec2(
        sin(uTime * 0.22) * 6.0,
        cos(uTime * 0.18) * 5.0 - 3.0
      );

      float idleDistance =
        distance(
          position.xz,
          idleCenter
        );

      float ambientField =
        sin(
          position.x * 0.36 +
          uTime * 0.72
        ) *
        cos(
          position.z * 0.3 -
          uTime * 0.58
        ) *
        0.095;

      float ambientRing =
        sin(
          idleDistance * 0.92 -
          uTime * 1.1
        ) *
        exp(
          -idleDistance * 0.035
        ) *
        0.05;

      float idleSweep =
        pow(
          0.5 +
          0.5 *
          sin(
            position.z * 0.62 -
            uTime * 0.95
          ),
          14.0
        );

      float ambient =
        ambientField +
        ambientRing +
        idleSweep * 0.045;

      displaced.y +=
        min(wave, 1.15) * 0.38 * uInteractionMotion +
        ambient * uIdleMotion;

      vLineStrength = aLineStrength;
      vWave = min(wave, 1.0) * uInteractionMotion;

      vIdle =
        max(
          smoothstep(
            0.025,
            0.13,
            abs(ambient)
          ),
          idleSweep * 0.9
        ) *
        uIdleMotion;

      vDepth =
        smoothstep(
          -16.0,
          10.0,
          position.z
        );

      gl_Position =
        projectionMatrix *
        modelViewMatrix *
        vec4(displaced, 1.0);
    }
  `;
}

export const waveGridFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uWaveColor;
  uniform float uOpacity;

  varying float vLineStrength;
  varying float vWave;
  varying float vIdle;
  varying float vDepth;

  void main() {
    float highlight =
      max(
        smoothstep(0.02, 0.52, vWave),
        vIdle * 0.48
      );

    vec3 color =
      mix(
        uColor,
        uWaveColor,
        highlight
      );

    float waveGlow =
      smoothstep(
        0.0,
        0.58,
        vWave
      ) *
      0.42;

    float idleGlow =
      vIdle * 0.23;

    float alpha =
      (
        0.2 +
        vLineStrength * 0.3 +
        idleGlow +
        waveGlow
      ) *
      uOpacity *
      vDepth;

    gl_FragColor =
      vec4(color, alpha);
  }
`;
